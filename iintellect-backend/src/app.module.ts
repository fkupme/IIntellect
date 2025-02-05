import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TestModule } from './test/test.module';
import { UserTestsModule } from './user-tests/user-tests.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, TestModule,  UserTestsModule, AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
