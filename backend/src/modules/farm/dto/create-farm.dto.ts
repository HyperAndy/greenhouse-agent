import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateFarmDto {
  @IsString({ message: '农场名称必须是字符串' })
  @IsNotEmpty({ message: '农场名称不能为空' })
  @MaxLength(100, { message: '农场名称长度不能超过100个字符' })
  name: string;

  @IsOptional()
  @IsString({ message: '地址必须是字符串' })
  @MaxLength(255, { message: '地址长度不能超过255个字符' })
  address?: string;

  @IsOptional()
  @IsString({ message: '联系电话必须是字符串' })
  @MaxLength(20, { message: '联系电话长度不能超过20个字符' })
  contactPhone?: string;

  @IsOptional()
  @IsNumber({}, { message: '经度必须是数字' })
  longitude?: number;

  @IsOptional()
  @IsNumber({}, { message: '纬度必须是数字' })
  latitude?: number;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(500, { message: '描述长度不能超过500个字符' })
  description?: string;
}
