import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/dependency-injection/types';
import { IUserService } from '../../application/users/interfaces/IUserService';
import { IAuthService } from '../../application/users/interfaces/IAuthService';
import { CreateUserDto } from '../../application/users/dtos/CreateUserDto';
import { LoginDto } from '../../application/users/dtos/LoginDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppError } from '../middlewares/errorHandler';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.AuthService) private authService: IAuthService
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const result = await this.authService.register(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(LoginDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const result = await this.authService.login(dto.username, dto.password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userDto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(userDto, { skipMissingProperties: true });

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const updatedUser = await this.userService.updateUser(id, userDto);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);

      if (!result) {
        throw new AppError('User not found', 404);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  addRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || typeof role !== 'string') {
        res.status(400).json({ message: 'Role is required' });
        return;
      }

      const user = await this.userService.addRole(id, role);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  removeRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || typeof role !== 'string') {
        res.status(400).json({ message: 'Role is required' });
        return;
      }

      const user = await this.userService.removeRole(id, role);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}