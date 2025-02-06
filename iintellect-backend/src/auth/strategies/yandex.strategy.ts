import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/yandex/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      provider: 'yandex',
      provider_id: profile.id,
      email: profile.emails[0].value,
      first_name: profile.displayName.split(' ')[0],
      last_name: profile.displayName.split(' ')[1],
    };
  }
}
