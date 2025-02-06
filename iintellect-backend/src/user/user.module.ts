import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, JwtService],
  exports: [UserService],
})
export class UserModule {}