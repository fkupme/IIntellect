import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 1,
    username: 'existinguser',
    email: 'existing@example.com',
    password_hash: 'hashed_password',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
    phone: '1234567890',
    first_name: 'John',
    last_name: 'Doe',
    second_name: 'Michael',
    provider: 'local',
    provider_id: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        PrismaService,
        { provide: JwtService, useValue: { sign: jest.fn(() => 'mocked-token') } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user by ID from JWT payload', async () => {
      const payload = { sub: mockUser.id };
      const result = await authService.validateUser(payload);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: payload.sub } });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const payload = { sub: 999 };
      await expect(authService.validateUser(payload)).rejects.toThrow(
        new NotFoundException('Пользователь не найден'),
      );
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-token');

      const result = await authService.login(mockUser);

      expect(result).toEqual({ access_token: 'mocked-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });
});