import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UserModule } from './users/user.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // Database type
      host: 'localhost', // Database host
      port: 3306, // MySQL default port
      username: 'root', // MySQL username
      password: 'root', // MySQL password
      database: 'nest_test', // Your database name
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Sync DB schema (disable in production)
    }),
    AuthModule,
    StudentsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
