import { Module } from '@nestjs/common';
import { UserTestsController } from './user-tests.controller';
import { UserTestsService } from './user-tests.service';

@Module({
  controllers: [UserTestsController],
  providers: [UserTestsService]
})
export class UserTestsModule {}
