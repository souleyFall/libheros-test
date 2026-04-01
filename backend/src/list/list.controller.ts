import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/users.model';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyLists(@CurrentUser() user: User) {
    return this.listService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createListDto: CreateListDto, @CurrentUser() user: User) {
    return this.listService.create(createListDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.listService.delete(id, user.id);
  }
}
