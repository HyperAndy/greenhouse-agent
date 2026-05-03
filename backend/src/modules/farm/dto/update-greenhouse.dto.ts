import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateGreenhouseDto } from './create-greenhouse.dto';

export class UpdateGreenhouseDto extends PartialType(
  OmitType(CreateGreenhouseDto, ['farmId'] as const),
) {}
