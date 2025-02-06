import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { MockUser } from '../users/MockUser';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateCredentials: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const mockUser = MockUser.create();
      const mockToken = { access_token: 'mocked-token' };

      jest
        .spyOn(authService, 'validateCredentials')
        .mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await controller.login('test@example.com', 'password123');

      expect(result).toEqual(mockToken);
      expect(authService.validateCredentials).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if credentials are invalid', async () => {
      jest
        .spyOn(authService, 'validateCredentials')
        .mockRejectedValue(new UnauthorizedException('Неверный пароль'));

      await expect(
        controller.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(new UnauthorizedException('Неверный пароль'));
    });
  });
});
