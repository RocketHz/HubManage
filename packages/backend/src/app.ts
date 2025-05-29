import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import routes from './presentation/routes';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler';
import { initializeDatabase } from './infrastructure/data/config/database';
import 'reflect-metadata';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }
  
  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());
    
    // Request parsing
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    
    // Logging middleware could be added here
  }
  
  private configureRoutes(): void {
    this.app.use('/api', routes);
  }
  
  private configureErrorHandling(): void {
    // Handle 404 errors
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }
  
  public async initialize(): Promise<void> {
    try {
      // Initialize database connection
      await initializeDatabase();
      
      // Additional initialization steps could go here
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }
}

export default App;

