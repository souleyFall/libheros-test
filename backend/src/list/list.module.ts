import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List } from './list.model';
import { Task } from '../task/task.model';

@Module({
  imports: [SequelizeModule.forFeature([List, Task])],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
