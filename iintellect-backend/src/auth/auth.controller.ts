import { Controller, Get, Post, Body, HttpCode, HttpStatus, Req, Res, UseGuards  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator'
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.authService.validateCredentials(email, password);
    return this.authService.login(user);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Перенаправление на страницу авторизации Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const token = this.authService.login(user);
    res.redirect(`http://localhost:3000?token=${token}`);
  }

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  yandexAuth() {
  }

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  yandexAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const token = this.authService.login(user);
    res.redirect(`http://localhost:3000?token=${token}`);
  }

  @Get('vk')
  @UseGuards(AuthGuard('vk'))
  vkAuth() {
  }

  @Get('vk/callback')
  @UseGuards(AuthGuard('vk'))
  vkAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const token = this.authService.login(user);
    res.redirect(`http://localhost:3000?token=${token}`);
  }
}