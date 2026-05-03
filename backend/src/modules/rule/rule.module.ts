import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { RuleEngine } from './engine/rule-engine';
import { ConditionEvaluator } from './engine/condition-evaluator';
import { ControlRule } from './entities/control-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlRule])],
  controllers: [RuleController],
  providers: [RuleService, RuleEngine, ConditionEvaluator],
  exports: [RuleService, RuleEngine],
})
export class RuleModule {}
