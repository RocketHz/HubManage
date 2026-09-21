import { UserService } from './UserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IPasswordHasher } from '../../../infrastructure/security/password-hasher';
import { User } from '../../../core/users/entities/User';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;

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

    userService = new UserService(userRepository, passwordHasher);
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      userRepository.findAll.mockResolvedValue([mockUser]);

      const users = await userService.getAllUsers();

      expect(users).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const user = await userService.getUserById('user-1');

      expect(user).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const user = await userService.getUserById('missing');

      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should hash the password and save the user', async () => {
      passwordHasher.hash.mockResolvedValue('hashed-password');
      userRepository.save.mockResolvedValue(mockUser);

      const user = await userService.createUser({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(passwordHasher.hash).toHaveBeenCalledWith('password123');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'johndoe',
          email: 'john@example.com',
          passwordHash: 'hashed-password',
          roles: ['user']
        })
      );
      expect(user).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update username and email without touching password', async () => {
      const updated = { ...mockUser, username: 'jane' };
      userRepository.update.mockResolvedValue(updated);

      const result = await userService.updateUser('user-1', { username: 'jane' });

      expect(userRepository.update).toHaveBeenCalledWith('user-1', { username: 'jane' });
      expect(result).toEqual(updated);
    });

    it('should re-hash the password when provided', async () => {
      passwordHasher.hash.mockResolvedValue('new-hash');
      userRepository.update.mockResolvedValue({ ...mockUser, passwordHash: 'new-hash' });

      await userService.updateUser('user-1', { password: 'newpassword123' });

      expect(passwordHasher.hash).toHaveBeenCalledWith('newpassword123');
      expect(userRepository.update).toHaveBeenCalledWith('user-1', {
        passwordHash: 'new-hash'
      });
    });

    it('should return null if user does not exist', async () => {
      userRepository.update.mockResolvedValue(null);

      const result = await userService.updateUser('missing', { username: 'x' });

      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      userRepository.delete.mockResolvedValue(true);

      const result = await userService.deleteUser('user-1');

      expect(result).toBe(true);
    });
  });

  describe('findByEmail / findByUsername', () => {
    it('should find by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const user = await userService.findByEmail('john@example.com');

      expect(user).toEqual(mockUser);
    });

    it('should find by username', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);

      const user = await userService.findByUsername('johndoe');

      expect(user).toEqual(mockUser);
    });
  });

  describe('addRole / removeRole', () => {
    it('should add a role', async () => {
      const withRole = { ...mockUser, roles: ['user', 'admin'] };
      userRepository.addRole.mockResolvedValue(withRole);

      const result = await userService.addRole('user-1', 'admin');

      expect(userRepository.addRole).toHaveBeenCalledWith('user-1', 'admin');
      expect(result).toEqual(withRole);
    });

    it('should remove a role', async () => {
      const withoutRole = { ...mockUser, roles: ['user'] };
      userRepository.removeRole.mockResolvedValue(withoutRole);

      const result = await userService.removeRole('user-1', 'admin');

      expect(userRepository.removeRole).toHaveBeenCalledWith('user-1', 'admin');
      expect(result).toEqual(withoutRole);
    });
  });
});