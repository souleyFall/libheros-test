import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { List } from './list.model';
import { CreateListDto } from './dto/create-list.dto';
import { Task } from '../task/task.model';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List) private listModel: typeof List,
    @InjectModel(Task) private taskModel: typeof Task,
  ) {}

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

  async delete(id: number, userId: number) {
    // Vérifier que la liste appartient à l'utilisateur
    const list = await this.listModel.findOne({
      where: { id, userId },
    });

    if (!list) {
      return null;
    }

    // Supprimer toutes les tâches associées
    await this.taskModel.destroy({
      where: { listId: id },
    });

    // Supprimer la liste
    await list.destroy();

    return { message: 'Liste et tâches associées supprimées' };
  }
}
