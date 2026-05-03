import { Injectable, Logger } from '@nestjs/common';
import { RuleCondition, ConditionOperator } from '../entities/control-rule.entity';

@Injectable()
export class ConditionEvaluator {
  private readonly logger = new Logger(ConditionEvaluator.name);

  evaluate(condition: RuleCondition, currentValue: number): boolean {
    switch (condition.operator) {
      case ConditionOperator.GT:
        return currentValue > condition.value;
      case ConditionOperator.LT:
        return currentValue < condition.value;
      case ConditionOperator.GTE:
        return currentValue >= condition.value;
      case ConditionOperator.LTE:
        return currentValue <= condition.value;
      case ConditionOperator.EQ:
        return currentValue === condition.value;
      case ConditionOperator.BETWEEN:
        return (
          currentValue >= condition.value &&
          currentValue <= (condition.value2 || condition.value)
        );
      default:
        this.logger.warn(`未知的操作符: ${condition.operator}`);
        return false;
    }
  }

  evaluateAll(conditions: RuleCondition[], sensorData: Map<string, number>): boolean {
    return conditions.every((condition) => {
      const currentValue = sensorData.get(condition.sensorType);
      if (currentValue === undefined) {
        this.logger.warn(`传感器数据缺失: ${condition.sensorType}`);
        return false;
      }
      return this.evaluate(condition, currentValue);
    });
  }
}
