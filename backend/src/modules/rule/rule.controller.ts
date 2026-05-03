import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { ControlRule } from './entities/control-rule.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('rules')
@UseGuards(JwtAuthGuard)
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(@Body() data: Partial<ControlRule>) {
    return this.ruleService.create(data);
  }

  @Get()
  async findAll(@Query('greenhouseId') greenhouseId?: string) {
    return this.ruleService.findAll(greenhouseId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ruleService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<ControlRule>) {
    return this.ruleService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ruleService.remove(id);
  }

  @Put(':id/toggle')
  async toggleStatus(@Param('id') id: string) {
    return this.ruleService.toggleStatus(id);
  }
}
