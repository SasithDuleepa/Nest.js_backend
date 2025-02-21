import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users') // Base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Get user details from JWT token
  }
  // @Get()
  // getAllUsers() {
  //   return this.usersService.getAllUsers();
  // }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`); // Prevent file name conflicts
        },
      }),
    }),
  )
  async uploadUserWithFile(
    @Body() body: { name: string; email: string; password: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.usersService.createUserWithFile(
      body.name,
      body.email,
      body.password,
      file,
    );

    return {
      message: 'User data and file uploaded successfully!',
      user,
    };
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`); // Prevent file name conflicts
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: number,
    @Body() updatedData: { name?: string; email?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.usersService.updateUser(id, updatedData, file);
  }
}
