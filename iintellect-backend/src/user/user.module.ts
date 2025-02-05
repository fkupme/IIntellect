import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuthService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}