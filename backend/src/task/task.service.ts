import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async findAll() {
    return this.taskModel.findAll();
  }

  async findById(id: number) {
    const task = await this.taskModel.findByPk(id);
    return task || null;
  }

  async findByListId(listId: number) {
    return this.taskModel.findAll({
      where: { listId },
      order: [['dueDate', 'ASC']],
    });
  }

  async findByUser(userId: number) {
    return this.taskModel.findAll({
      where: { userId },
      order: [['dueDate', 'ASC']],
    });
  }

  async create(dto: CreateTaskDto, userId: number) {
    return this.taskModel.create({
      shortDescription: dto.shortDescription,
      longDescription: dto.longDescription || undefined,
      dueDate: new Date(dto.dueDate),
      listId: dto.listId,
      userId,
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      return null;
    }

    task.completed = dto.completed;
    return task.save();
  }

  async delete(id: number) {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      return null;
    }
    await task.destroy();
    return task;
  }
}
