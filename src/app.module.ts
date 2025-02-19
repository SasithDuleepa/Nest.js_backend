import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
