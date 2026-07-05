import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryTaskDto) {
    const {
      search,
      completed,
      overdue,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;
    const where = {
      ...(completed !== undefined && { completed }),
      ...(overdue && { completed: false, dueAt: { lt: new Date() } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { assignee: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: data.map((task) => this.withScheduleStatus(task)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task #${id} does not exist`);
    return this.withScheduleStatus(task);
  }

  async create(dto: CreateTaskDto) {
    this.validateSchedule(dto.startAt, dto.dueAt);
    const task = await this.prisma.task.create({ data: dto });
    return this.withScheduleStatus(task);
  }

  async update(id: number, dto: UpdateTaskDto) {
    const current = await this.findOne(id);
    const fields = Object.keys(dto);
    const isReopening = fields.length === 1 && dto.completed === false;
    if (current.completed && !isReopening) {
      throw new BadRequestException(
        'A completed task cannot be edited. Reopen the task before making changes.',
      );
    }
    this.validateSchedule(
      dto.startAt ?? current.startAt?.toISOString(),
      dto.dueAt ?? current.dueAt?.toISOString(),
    );
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.completed !== undefined && {
          completedAt: dto.completed ? new Date() : null,
        }),
      },
    });
    return this.withScheduleStatus(task);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Đã xóa task #${id}` };
  }

  private validateSchedule(startAt?: string, dueAt?: string) {
    if (startAt && dueAt && new Date(dueAt) <= new Date(startAt)) {
      throw new BadRequestException(
        'The due date must be later than the start date',
      );
    }
  }

  private withScheduleStatus<T extends {
    dueAt: Date | null;
    completed: boolean;
    completedAt: Date | null;
  }>(task: T) {
    let scheduleStatus:
      | 'NO_DEADLINE'
      | 'ON_TRACK'
      | 'OVERDUE'
      | 'COMPLETED_ON_TIME'
      | 'COMPLETED_LATE';

    if (!task.dueAt) scheduleStatus = 'NO_DEADLINE';
    else if (task.completed) {
      scheduleStatus = task.completedAt && task.completedAt <= task.dueAt
        ? 'COMPLETED_ON_TIME'
        : 'COMPLETED_LATE';
    } else {
      scheduleStatus = task.dueAt < new Date() ? 'OVERDUE' : 'ON_TRACK';
    }

    return { ...task, scheduleStatus };
  }
}
