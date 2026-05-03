import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CreateGreenhouseDto } from './dto/create-greenhouse.dto';
import { UpdateGreenhouseDto } from './dto/update-greenhouse.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('farms')
@UseGuards(JwtAuthGuard)
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  async createFarm(@Body() createFarmDto: CreateFarmDto, @CurrentUser('id') userId: string) {
    return this.farmService.createFarm(createFarmDto, userId);
  }

  @Get()
  async findAllFarms(@CurrentUser('id') userId: string) {
    return this.farmService.findAllFarms(userId);
  }

  @Get(':id')
  async findFarmById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.farmService.findFarmById(id, userId);
  }

  @Put(':id')
  async updateFarm(
    @Param('id') id: string,
    @Body() updateData: UpdateFarmDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.farmService.updateFarm(id, updateData, userId);
  }

  @Delete(':id')
  async deleteFarm(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.farmService.deleteFarm(id, userId);
  }

  @Post('greenhouses')
  async createGreenhouse(
    @Body() createGreenhouseDto: CreateGreenhouseDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.farmService.createGreenhouse(createGreenhouseDto, userId);
  }

  @Get(':farmId/greenhouses')
  async findAllGreenhouses(
    @Param('farmId') farmId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.farmService.findAllGreenhouses(farmId, userId);
  }

  @Get('greenhouses/:id')
  async findGreenhouseById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.farmService.findGreenhouseById(id, userId);
  }

  @Put('greenhouses/:id')
  async updateGreenhouse(
    @Param('id') id: string,
    @Body() updateData: UpdateGreenhouseDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.farmService.updateGreenhouse(id, updateData, userId);
  }

  @Delete('greenhouses/:id')
  async deleteGreenhouse(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.farmService.deleteGreenhouse(id, userId);
  }
}
