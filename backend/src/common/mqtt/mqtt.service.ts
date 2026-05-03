import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { MQTT_CLIENT } from './mqtt.constants';

@Injectable()
export class MqttService implements OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;
  private subscriptions: Map<string, Set<(topic: string, message: Buffer) => void>> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  private connect() {
    const url = this.configService.get<string>('mqtt.url');
    this.logger.log(`连接MQTT服务器: ${url}`);

    this.client = mqtt.connect(url || 'mqtt://localhost:1883', {
      clientId: `greenhouse-backend-${Date.now()}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    this.client.on('connect', () => {
      this.logger.log('MQTT连接成功');
      this.subscriptions.forEach((_, topic) => {
        this.client.subscribe(topic);
      });
    });

    this.client.on('error', (err) => {
      this.logger.error('MQTT连接错误', err);
    });

    this.client.on('offline', () => {
      this.logger.warn('MQTT连接断开');
    });

    this.client.on('message', (topic: string, message: Buffer) => {
      this.subscriptions.forEach((handlers, pattern) => {
        if (this.matchTopic(pattern, topic)) {
          handlers.forEach((handler) => handler(topic, message));
        }
      });
    });
  }

  private matchTopic(pattern: string, topic: string): boolean {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') return true;
      if (patternParts[i] === '+') continue;
      if (patternParts[i] !== topicParts[i]) return false;
    }
    return patternParts.length === topicParts.length;
  }

  publish(topic: string, message: string | object): void {
    const payload = typeof message === 'object' ? JSON.stringify(message) : message;
    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        this.logger.error(`发布消息失败: ${topic}`, err);
      } else {
        this.logger.debug(`发布消息成功: ${topic}`);
      }
    });
  }

  subscribe(topic: string, handler: (topic: string, message: Buffer) => void): void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
      if (this.client.connected) {
        this.client.subscribe(topic);
      }
    }
    this.subscriptions.get(topic)?.add(handler);
  }

  unsubscribe(topic: string, handler?: (topic: string, message: Buffer) => void): void {
    if (handler) {
      const handlers = this.subscriptions.get(topic);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(topic);
          this.client.unsubscribe(topic);
        }
      }
    } else {
      this.subscriptions.delete(topic);
      this.client.unsubscribe(topic);
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end(true);
      this.logger.log('MQTT连接已关闭');
    }
  }
}
