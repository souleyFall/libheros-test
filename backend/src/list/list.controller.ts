import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/users.model';

@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @Get('me')
  getMyLists(@CurrentUser() user: User) {
    return this.listService.findByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listService.findById(id);
  }

  @Post()
  create(@Body() createListDto: CreateListDto, @CurrentUser() user: User) {
    return this.listService.create(createListDto, user.id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.listService.delete(id, user.id);
  }
}
