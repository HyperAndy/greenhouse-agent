import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlRule } from './entities/control-rule.entity';
import { RuleEngine } from './engine/rule-engine';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(ControlRule)
    private readonly ruleRepository: Repository<ControlRule>,
    private readonly ruleEngine: RuleEngine,
  ) {}

  async create(data: Partial<ControlRule>): Promise<ControlRule> {
    const rule = this.ruleRepository.create(data);
    return this.ruleRepository.save(rule);
  }

  async findAll(greenhouseId?: string): Promise<ControlRule[]> {
    const where: any = {};
    if (greenhouseId) {
      where.greenhouseId = greenhouseId;
    }
    return this.ruleRepository.find({ where });
  }

  async findById(id: string): Promise<ControlRule> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('规则不存在');
    }
    return rule;
  }

  async update(id: string, data: Partial<ControlRule>): Promise<ControlRule> {
    const rule = await this.findById(id);
    Object.assign(rule, data);
    return this.ruleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findById(id);
    await this.ruleRepository.remove(rule);
  }

  async toggleStatus(id: string): Promise<ControlRule> {
    const rule = await this.findById(id);
    rule.isActive = !rule.isActive;
    return this.ruleRepository.save(rule);
  }

  async evaluateAndExecute(greenhouseId: string, sensorData: Map<string, number>): Promise<void> {
    await this.ruleEngine.evaluateRules(greenhouseId, sensorData);
  }
}
