import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadUserWithFile(
    @Body() body: { name: string; email: string }, // Receive user data
    @UploadedFile() file: Express.Multer.File, // Receive file
  ) {
    console.log('User Data:', body);
    console.log('Uploaded File:', file);

    return {
      message: 'User data and file uploaded successfully!',
      user: body,
      file: {
        filename: file.filename,
        url: `http://localhost:3000/uploads/${file.originalname}`, // Full URL
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }
}
