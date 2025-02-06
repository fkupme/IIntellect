import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async validateCredentials(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }

  async validateOAuthUser(provider: string, providerId: string, email: string, firstName: string, lastName: string, secondName: string, phone: string) {
    let user = await this.userService.findOneByProviderId(providerId);

    if (!user) {
      user = await this.userService.create({
        username: email.split('@')[0],
        email,
        first_name: firstName ?? null,
        last_name: lastName ?? null,
        provider,
        provider_id: providerId ?? null,
        second_name: secondName ?? null,
        phone: phone ?? null,
      });
    }

    return user;
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
