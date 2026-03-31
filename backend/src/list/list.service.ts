import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { List } from './list.model';
import { CreateListDto } from './dto/create-list.dto';

@Injectable()
export class ListService {
  constructor(@InjectModel(List) private listModel: typeof List) {}

  async findAll() {
    return this.listModel.findAll();
  }

  async findById(id: number) {
    const list = await this.listModel.findByPk(id);
    return list || null;
  }

  async findByUser(userId: number) {
    return this.listModel.findAll({
      where: { userId },
    });
  }

  async create(dto: CreateListDto, userId: number) {
    return this.listModel.create({
      title: dto.title,
      userId,
    });
  }
}
