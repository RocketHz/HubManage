export const TYPES = {
  // Repositories
  ProductRepository: Symbol.for('ProductRepository'),
  TaskRepository: Symbol.for('TaskRepository'),
  UserRepository: Symbol.for('UserRepository'),
  
  // Services
  ProductService: Symbol.for('ProductService'),
  TaskService: Symbol.for('TaskService'),
  UserService: Symbol.for('UserService'),
  AuthService: Symbol.for('AuthService'),
  
  // Utils
  Logger: Symbol.for('Logger'),
  PasswordHasher: Symbol.for('PasswordHasher'),
  TokenGenerator: Symbol.for('TokenGenerator')
};

