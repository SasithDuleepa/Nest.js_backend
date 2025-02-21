import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async createUserWithFile(
    name: string,
    email: string,
    password: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      fileName: file.filename,
      // fileUrl: `http://localhost:3000/uploads/${file.filename}`,
      // fileSize: file.size,
    });

    return await this.usersRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { _id: id } });
  }

  async updateUser(
    id: number,
    updatedData: Partial<User>,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { _id: id } });

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's data
    Object.assign(user, updatedData);

    //remove old file
    if (file && user.fileName) {
      const oldFilePath = path.join(
        __dirname,
        './../../uploads',
        user.fileName,
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // If a new file is uploaded, update the file name
    if (file) {
      user.fileName = file.filename;
    }

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
