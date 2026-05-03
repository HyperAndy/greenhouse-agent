import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlRule, RuleStatus, ActionType } from '../entities/control-rule.entity';
import { ConditionEvaluator } from './condition-evaluator';
import { MqttService } from '../../../common/mqtt/mqtt.service';
import { RedisService } from '../../../common/redis/redis.service';

@Injectable()
export class RuleEngine {
  private readonly logger = new Logger(RuleEngine.name);

  constructor(
    @InjectRepository(ControlRule)
    private readonly ruleRepository: Repository<ControlRule>,
    private readonly conditionEvaluator: ConditionEvaluator,
    private readonly mqttService: MqttService,
    private readonly redisService: RedisService,
  ) {}

  async evaluateRules(greenhouseId: string, sensorData: Map<string, number>) {
    const rules = await this.ruleRepository.find({
      where: {
        greenhouseId,
        status: RuleStatus.ACTIVE,
        isActive: true,
      },
      order: { priority: 'DESC' },
    });

    this.logger.log(`评估大棚 ${greenhouseId} 的 ${rules.length} 条规则`);

    for (const rule of rules) {
      try {
        const shouldTrigger = this.conditionEvaluator.evaluateAll(
          rule.conditions,
          sensorData,
        );

        if (shouldTrigger) {
          await this.executeActions(rule);
          rule.lastTriggeredAt = new Date();
          rule.triggerCount += 1;
          await this.ruleRepository.save(rule);
          this.logger.log(`规则触发: ${rule.name}`);
        }
      } catch (error) {
        this.logger.error(`规则执行失败: ${rule.name}`, error.stack);
      }
    }
  }

  private async executeActions(rule: ControlRule) {
    for (const action of rule.actions) {
      switch (action.type) {
        case ActionType.SEND_ALERT:
          await this.sendAlert(rule, action.config);
          break;
        case ActionType.CONTROL_DEVICE:
          await this.controlDevice(action.config);
          break;
        case ActionType.SEND_NOTIFICATION:
          await this.sendNotification(rule, action.config);
          break;
        default:
          this.logger.warn(`未知的动作类型: ${action.type}`);
      }
    }
  }

  private async sendAlert(rule: ControlRule, config: Record<string, any>) {
    const alertPayload = {
      type: 'rule_triggered',
      ruleId: rule.id,
      ruleName: rule.name,
      greenhouseId: rule.greenhouseId,
      message: config.message || `规则"${rule.name}"被触发`,
      severity: config.severity || 'warning',
      timestamp: new Date().toISOString(),
    };

    this.mqttService.publish(
      `greenhouse/${rule.greenhouseId}/alert`,
      alertPayload,
    );

    await this.redisService.publish('alert', JSON.stringify(alertPayload));
  }

  private async controlDevice(config: Record<string, any>) {
    const { deviceId, command, params } = config;
    if (!deviceId || !command) {
      this.logger.warn('设备控制配置不完整');
      return;
    }

    const topic = `greenhouse/device/${deviceId}/command`;
    this.mqttService.publish(topic, {
      command,
      params: params || {},
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`设备控制指令已发送: ${deviceId} -> ${command}`);
  }

  private async sendNotification(rule: ControlRule, config: Record<string, any>) {
    const notification = {
      type: 'notification',
      ruleId: rule.id,
      ruleName: rule.name,
      greenhouseId: rule.greenhouseId,
      title: config.title || '规则触发通知',
      content: config.content || `规则"${rule.name}"已被触发`,
      timestamp: new Date().toISOString(),
    };

    await this.redisService.publish('notification', JSON.stringify(notification));
  }
}
