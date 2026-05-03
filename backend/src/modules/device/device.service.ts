import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceStatus } from './entities/device.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async register(registerDeviceDto: RegisterDeviceDto): Promise<Device> {
    const existingDevice = await this.deviceRepository.findOne({
      where: { code: registerDeviceDto.code },
    });
    if (existingDevice) {
      throw new ConflictException('设备编码已存在');
    }

    const device = this.deviceRepository.create(registerDeviceDto);
    return this.deviceRepository.save(device);
  }

  async findAll(greenhouseId?: string): Promise<Device[]> {
    const where: any = {};
    if (greenhouseId) {
      where.greenhouseId = greenhouseId;
    }
    return this.deviceRepository.find({
      where,
      relations: ['greenhouse'],
    });
  }

  async findById(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['greenhouse'],
    });
    if (!device) {
      throw new NotFoundException('设备不存在');
    }
    return device;
  }

  async findOne(id: string): Promise<Device> {
    return this.findById(id);
  }

  async findByCode(code: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { code },
    });
    if (!device) {
      throw new NotFoundException('设备不存在');
    }
    return device;
  }

  async updateStatus(id: string, status: DeviceStatus): Promise<Device> {
    const device = await this.findById(id);
    device.status = status;
    if (status === DeviceStatus.ONLINE) {
      device.lastOnlineAt = new Date();
    }
    return this.deviceRepository.save(device);
  }

  async updateLastSeen(id: string): Promise<Device> {
    const device = await this.findById(id);
    device.lastOnlineAt = new Date();
    return this.deviceRepository.save(device);
  }

  async updateConfig(id: string, config: Record<string, any>): Promise<Device> {
    const device = await this.findById(id);
    device.config = { ...device.config, ...config };
    return this.deviceRepository.save(device);
  }

  async remove(id: string): Promise<void> {
    const device = await this.findById(id);
    await this.deviceRepository.remove(device);
  }

  async getDeviceStats(greenhouseId: string) {
    const devices = await this.findAll(greenhouseId);
    return {
      total: devices.length,
      online: devices.filter((d) => d.status === DeviceStatus.ONLINE).length,
      offline: devices.filter((d) => d.status === DeviceStatus.OFFLINE).length,
      error: devices.filter((d) => d.status === DeviceStatus.ERROR).length,
    };
  }
}
