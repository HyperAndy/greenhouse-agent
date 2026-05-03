import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertStatus, AlertSeverity } from './entities/alert.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  async findAll(
    @Query('greenhouseId') greenhouseId?: string,
    @Query('status') status?: AlertStatus,
    @Query('severity') severity?: AlertSeverity,
  ) {
    return this.alertService.findAll(greenhouseId, status, severity);
  }

  @Get('stats')
  async getStats(@Query('greenhouseId') greenhouseId?: string) {
    return this.alertService.getStats(greenhouseId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.alertService.findById(id);
  }

  @Put(':id/acknowledge')
  async acknowledge(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.alertService.acknowledge(id, userId);
  }

  @Put(':id/resolve')
  async resolve(@Param('id') id: string) {
    return this.alertService.resolve(id);
  }
}
