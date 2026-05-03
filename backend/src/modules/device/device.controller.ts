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
import { DeviceService } from './device.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { DeviceStatus } from './entities/device.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async register(@Body() registerDeviceDto: RegisterDeviceDto) {
    return this.deviceService.register(registerDeviceDto);
  }

  @Get()
  async findAll(@Query('greenhouseId') greenhouseId?: string) {
    return this.deviceService.findAll(greenhouseId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.deviceService.findById(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: DeviceStatus) {
    return this.deviceService.updateStatus(id, status);
  }

  @Put(':id/config')
  async updateConfig(
    @Param('id') id: string,
    @Body('config') config: Record<string, any>,
  ) {
    return this.deviceService.updateConfig(id, config);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deviceService.remove(id);
  }

  @Get('stats/:greenhouseId')
  async getDeviceStats(@Param('greenhouseId') greenhouseId: string) {
    return this.deviceService.getDeviceStats(greenhouseId);
  }
}
