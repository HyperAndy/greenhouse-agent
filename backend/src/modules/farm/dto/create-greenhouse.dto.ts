import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateGreenhouseDto {
  @IsString({ message: '大棚名称必须是字符串' })
  @IsNotEmpty({ message: '大棚名称不能为空' })
  @MaxLength(100, { message: '大棚名称长度不能超过100个字符' })
  name: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(500, { message: '描述长度不能超过500个字符' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: '面积必须是数字' })
  area?: number;

  @IsOptional()
  @IsString({ message: '作物必须是字符串' })
  crop?: string;

  @IsOptional()
  @IsString({ message: '作物类型必须是字符串' })
  @MaxLength(50, { message: '作物类型长度不能超过50个字符' })
  cropType?: string;

  @IsOptional()
  @IsString({ message: '生长阶段必须是字符串' })
  @MaxLength(50, { message: '生长阶段长度不能超过50个字符' })
  growthStage?: string;

  @IsString({ message: '农场ID必须是字符串' })
  @IsNotEmpty({ message: '农场ID不能为空' })
  farmId: string;
}
