import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll() {
    const users = await this.userModel.findAll();
    return users.map(u => {
      const { password, ...rest } = u.get();
      return rest;
    });
  }

  async findById(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    const { password, ...rest } = user.get();
    return rest;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

}