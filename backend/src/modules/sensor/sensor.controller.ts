import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('sensor')
@UseGuards(JwtAuthGuard)
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get(':greenhouseId/latest')
  async getLatestData(@Param('greenhouseId') greenhouseId: string) {
    return this.sensorService.getLatestData(greenhouseId);
  }

  @Get(':greenhouseId/history')
  async getHistoryData(
    @Param('greenhouseId') greenhouseId: string,
    @Query('start') startTime: string,
    @Query('end') endTime: string,
  ) {
    return this.sensorService.getHistoryData(
      greenhouseId,
      new Date(startTime),
      new Date(endTime),
    );
  }

  @Get(':greenhouseId/statistics')
  async getStatistics(
    @Param('greenhouseId') greenhouseId: string,
    @Query('start') startTime: string,
    @Query('end') endTime: string,
  ) {
    return this.sensorService.getStatistics(
      greenhouseId,
      new Date(startTime),
      new Date(endTime),
    );
  }
}
