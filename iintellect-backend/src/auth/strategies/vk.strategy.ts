import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('VK_CLIENT_ID'),
      clientSecret: configService.get<string>('VK_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/vk/callback',
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      provider: 'vk',
      provider_id: profile.id,
      email: profile.emails[0].value,
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
    };
  }
}
