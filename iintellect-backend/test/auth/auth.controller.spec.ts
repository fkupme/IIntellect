import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '@prisma/client';

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
      const user: User = { id: 1, username: 'testuser', email: 'test@example.com' } as User;
      const mockToken = { access_token: 'mocked-token' };
      (authService.login as jest.Mock).mockResolvedValue(mockToken);

      const result = await controller.login(user);
      expect(result).toEqual(mockToken);
      expect(authService.login).toHaveBeenCalledWith(user);
    });
  });
});