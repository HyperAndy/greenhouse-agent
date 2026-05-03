import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { Greenhouse } from './entities/greenhouse.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CreateGreenhouseDto } from './dto/create-greenhouse.dto';
import { UpdateGreenhouseDto } from './dto/update-greenhouse.dto';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Greenhouse)
    private readonly greenhouseRepository: Repository<Greenhouse>,
  ) {}

  async createFarm(createFarmDto: CreateFarmDto, ownerId: string): Promise<Farm> {
    const farm = this.farmRepository.create({ ...createFarmDto, ownerId });
    return this.farmRepository.save(farm);
  }

  async findAllFarms(ownerId: string): Promise<Farm[]> {
    return this.farmRepository.find({
      where: { ownerId },
      relations: ['greenhouses'],
    });
  }

  async findFarmById(id: string, ownerId: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id, ownerId },
      relations: ['greenhouses'],
    });
    if (!farm) {
      throw new NotFoundException('农场不存在');
    }
    return farm;
  }

  async updateFarm(id: string, updateData: UpdateFarmDto, ownerId: string): Promise<Farm> {
    const farm = await this.findFarmById(id, ownerId);
    Object.assign(farm, updateData);
    return this.farmRepository.save(farm);
  }

  async deleteFarm(id: string, ownerId: string): Promise<void> {
    const farm = await this.findFarmById(id, ownerId);
    await this.farmRepository.remove(farm);
  }

  async createGreenhouse(createGreenhouseDto: CreateGreenhouseDto, ownerId: string): Promise<Greenhouse> {
    await this.findFarmById(createGreenhouseDto.farmId, ownerId);
    const greenhouse = this.greenhouseRepository.create(createGreenhouseDto);
    return this.greenhouseRepository.save(greenhouse);
  }

  async findAllGreenhouses(farmId: string, ownerId: string): Promise<Greenhouse[]> {
    await this.findFarmById(farmId, ownerId);
    return this.greenhouseRepository.find({
      where: { farmId },
      relations: ['devices'],
    });
  }

  async findGreenhouseById(id: string, ownerId: string): Promise<Greenhouse> {
    const greenhouse = await this.greenhouseRepository.findOne({
      where: { id },
      relations: ['farm', 'devices'],
    });
    if (!greenhouse || greenhouse.farm.ownerId !== ownerId) {
      throw new NotFoundException('大棚不存在');
    }
    return greenhouse;
  }

  async updateGreenhouse(id: string, updateData: UpdateGreenhouseDto, ownerId: string): Promise<Greenhouse> {
    const greenhouse = await this.findGreenhouseById(id, ownerId);
    Object.assign(greenhouse, updateData);
    return this.greenhouseRepository.save(greenhouse);
  }

  async deleteGreenhouse(id: string, ownerId: string): Promise<void> {
    const greenhouse = await this.findGreenhouseById(id, ownerId);
    await this.greenhouseRepository.remove(greenhouse);
  }
}
