import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List } from './list.model';

@Module({
  imports: [SequelizeModule.forFeature([List])],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
