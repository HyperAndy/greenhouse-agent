import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { DeviceType } from '../entities/device.entity';

export class RegisterDeviceDto {
  @IsString({ message: '设备名称必须是字符串' })
  @IsNotEmpty({ message: '设备名称不能为空' })
  name: string;

  @IsString({ message: '设备编码必须是字符串' })
  @IsNotEmpty({ message: '设备编码不能为空' })
  code: string;

  @IsEnum(DeviceType, { message: '设备类型不合法' })
  type: DeviceType;

  @IsOptional()
  @IsString({ message: '设备型号必须是字符串' })
  model?: string;

  @IsOptional()
  @IsString({ message: '设备厂商必须是字符串' })
  manufacturer?: string;

  @IsString({ message: '大棚ID必须是字符串' })
  @IsNotEmpty({ message: '大棚ID不能为空' })
  greenhouseId: string;

  @IsOptional()
  @IsObject({ message: '设备配置必须是对象' })
  config?: Record<string, any>;
}
