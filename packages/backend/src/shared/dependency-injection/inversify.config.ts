import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { TYPES } from './types';

// Repositories
import { IProductRepository } from '../../application/products/interfaces/IProductRepository';
import { PgProductRepository } from '../../infrastructure/data/repositories/PgProductRepository';
import { ITaskRepository } from '../../application/tasks/interfaces/ITaskRepository';
import { PgTaskRepository } from '../../infrastructure/data/repositories/PgTaskRepository';
import { IUserRepository } from '../../application/users/interfaces/IUserRepository';
import { PgUserRepository } from '../../infrastructure/data/repositories/PgUserRepository';

// Services
import { IProductService } from '../../application/products/interfaces/IProductService';
import { ProductService } from '../../application/products/services/ProductService';
import { ITaskService } from '../../application/tasks/interfaces/ITaskService';
import { TaskService } from '../../application/tasks/services/TaskService';
import { IUserService } from '../../application/users/interfaces/IUserService';
import { UserService } from '../../application/users/services/UserService';
import { IAuthService } from '../../application/users/interfaces/IAuthService';
import { AuthService } from '../../application/users/services/AuthService';

// Controllers
import { ProductController } from '../../presentation/products/ProductController';
import { TaskController } from '../../presentation/tasks/TaskController';
import { UserController } from '../../presentation/users/UserController';

// Security / Utils
import { IPasswordHasher, BcryptPasswordHasher } from '../../infrastructure/security/password-hasher';
import { ITokenGenerator, JwtTokenGenerator } from '../../infrastructure/security/token-generator';

// Create container function
export function createContainer(dataSource: DataSource): Container {
  const container = new Container();

  // Register DataSource
  container.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);

  // Register security utils
  container.bind<IPasswordHasher>(TYPES.PasswordHasher).to(BcryptPasswordHasher).inSingletonScope();
  container.bind<ITokenGenerator>(TYPES.TokenGenerator).to(JwtTokenGenerator).inSingletonScope();

  // Register repositories
  container.bind<IProductRepository>(TYPES.ProductRepository).to(PgProductRepository).inSingletonScope();
  container.bind<ITaskRepository>(TYPES.TaskRepository).to(PgTaskRepository).inSingletonScope();
  container.bind<IUserRepository>(TYPES.UserRepository).to(PgUserRepository).inSingletonScope();

  // Register services
  container.bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();
  container.bind<ITaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
  container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

  // Register controllers
  container.bind<ProductController>(TYPES.ProductController).to(ProductController).inSingletonScope();
  container.bind<TaskController>(TYPES.TaskController).to(TaskController).inSingletonScope();
  container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();

  return container;
}