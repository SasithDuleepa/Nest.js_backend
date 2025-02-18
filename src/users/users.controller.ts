import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('users') // Base route: /users
export class UsersController {
  @Get()
  getAllUsers() {
    return [{ id: 1, name: 'John Doe' }];
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return { id, name: 'John Doe' };
  }

  @Post()
  createUser(@Body() createUserDto: { name: string }) {
    return { id: 2, name: createUserDto.name };
  }
}
