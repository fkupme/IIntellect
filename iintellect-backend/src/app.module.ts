import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { UserTestsModule } from './user-tests/user-tests.module';
import { ContentModule } from './content/content.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, TestsModule, QuestionsModule, AnswersModule, UserTestsModule, ContentModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
