import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertStatus, AlertSeverity } from './entities/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async create(data: Partial<Alert>): Promise<Alert> {
    const alert = this.alertRepository.create(data);
    return this.alertRepository.save(alert);
  }

  async findAll(
    greenhouseId?: string,
    status?: AlertStatus,
    severity?: AlertSeverity,
  ): Promise<Alert[]> {
    const where: any = {};
    if (greenhouseId) where.greenhouseId = greenhouseId;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return this.alertRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('告警不存在');
    }
    return alert;
  }

  async acknowledge(id: string, userId: string): Promise<Alert> {
    const alert = await this.findById(id);
    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
    return this.alertRepository.save(alert);
  }

  async resolve(id: string): Promise<Alert> {
    const alert = await this.findById(id);
    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();
    return this.alertRepository.save(alert);
  }

  async getStats(greenhouseId?: string) {
    const where: any = {};
    if (greenhouseId) where.greenhouseId = greenhouseId;

    const [total, pending, acknowledged, resolved] = await Promise.all([
      this.alertRepository.count({ where }),
      this.alertRepository.count({ where: { ...where, status: AlertStatus.PENDING } }),
      this.alertRepository.count({ where: { ...where, status: AlertStatus.ACKNOWLEDGED } }),
      this.alertRepository.count({ where: { ...where, status: AlertStatus.RESOLVED } }),
    ]);

    return { total, pending, acknowledged, resolved };
  }

  async getUnacknowledged(greenhouseId?: string): Promise<Alert[]> {
    const where: any = { status: AlertStatus.PENDING };
    if (greenhouseId) where.greenhouseId = greenhouseId;

    return this.alertRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
}
