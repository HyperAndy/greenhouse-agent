import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ControlService, ControlCommand } from './control.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('control')
@UseGuards(JwtAuthGuard)
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Post()
  async sendCommand(
    @Body() body: { device_id: string; channel: string; state: boolean; source: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.controlService.sendCommand({
      deviceId: body.device_id,
      channel: body.channel,
      state: body.state,
      source: body.source,
      userId,
    });
  }

  @Get('log/:id')
  async getControlLog(@Param('id') id: string) {
    return this.controlService.getControlLog(id);
  }

  @Get('history/:deviceId')
  async getDeviceControlHistory(@Param('deviceId') deviceId: string) {
    return this.controlService.getDeviceControlHistory(deviceId);
  }

  @Post('emergency-stop/:greenhouseId')
  async emergencyStop(@Param('greenhouseId') greenhouseId: string) {
    return this.controlService.emergencyStop(greenhouseId);
  }
}
