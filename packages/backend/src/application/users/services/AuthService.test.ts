import { AuthService } from './AuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IPasswordHasher } from '../../../infrastructure/security/password-hasher';
import { ITokenGenerator } from '../../../infrastructure/security/token-generator';
import { User } from '../../../core/users/entities/User';
import { AppError } from '../../../presentation/middlewares/errorHandler';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;
  let tokenGenerator: jest.Mocked<ITokenGenerator>;

  const mockUser = new User(
    'user-1',
    'johndoe',
    'john@example.com',
    'hashed-password',
    ['user']
  );

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addRole: jest.fn(),
      removeRole: jest.fn()
    } as jest.Mocked<IUserRepository>;

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn()
    };

    tokenGenerator = {
      generate: jest.fn(),
      verify: jest.fn()
    };

    authService = new AuthService(userRepository, passwordHasher, tokenGenerator);
  });

  describe('register', () => {
    it('should create a new user and return auth result', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue('hashed-password');
      userRepository.save.mockResolvedValue(mockUser);
      tokenGenerator.generate.mockReturnValue('jwt-token');

      const result = await authService.register({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(tokenGenerator.generate).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', roles: ['user'] })
      );
      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 'user-1',
          username: 'johndoe',
          email: 'john@example.com',
          roles: ['user']
        }
      });
    });

    it('should throw 409 if username already exists', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(
        authService.register({ username: 'johndoe', email: 'a@b.com', password: 'password123' })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('should throw 409 if email already exists', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.register({ username: 'johndoe', email: 'john@example.com', password: 'password123' })
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login', () => {
    it('should return auth result with valid credentials', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);
      passwordHasher.compare.mockResolvedValue(true);
      tokenGenerator.generate.mockReturnValue('jwt-token');

      const result = await authService.login('johndoe', 'password123');

      expect(passwordHasher.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result.token).toBe('jwt-token');
    });

    it('should throw 401 for unknown user', async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(authService.login('nobody', 'password123'))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 401 for wrong password', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);
      passwordHasher.compare.mockResolvedValue(false);

      await expect(authService.login('johndoe', 'wrong-password'))
        .rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('verifyToken', () => {
    it('should return userId and roles', async () => {
      tokenGenerator.verify.mockReturnValue({ userId: 'user-1', username: 'johndoe', roles: ['user'] });

      const result = await authService.verifyToken('jwt-token');

      expect(result).toEqual({ userId: 'user-1', roles: ['user'] });
    });
  });
});