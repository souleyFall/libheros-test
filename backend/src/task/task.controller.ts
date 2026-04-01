import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/users.model';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('list/:listId')
  findByList(@Param('listId', ParseIntPipe) listId: number) {
    return this.taskService.findByListId(listId);
  }

  @Get('me')
  getMyTasks(@CurrentUser() user: User) {
    return this.taskService.findByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findById(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.taskService.create(createTaskDto, user.id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
