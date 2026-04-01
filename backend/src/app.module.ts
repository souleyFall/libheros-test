import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { User } from './user/users.model';
import { ListModule } from './list/list.module';
import { List } from './list/list.model';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 

    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, List, Task], 
      autoLoadModels: true, 
      synchronize: true,    
      logging: true,
    }),

    // Modules de l'app
    AuthModule,
    UsersModule,
    ListModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}