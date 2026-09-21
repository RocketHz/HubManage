import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import { DataSource } from 'typeorm';
import routes from './presentation/routes';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler';
import { createContainer } from './shared/dependency-injection/inversify.config';
import { Container } from 'inversify';
import { dataSourceOptions } from './infrastructure/data/config/data-source';
import 'reflect-metadata';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private container: Container;
  private dataSource: DataSource;
  
  constructor() {
    this.app = express();
    this.configureMiddleware();
  }
  
  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    this.app.use(cors(corsOptions));
    
    // Request parsing
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    
    // Basic status endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }
  
  private configureRoutes(): void {
    // Import routes with the container that has been initialized
    const configuredRoutes = routes(this.container);
    this.app.use('/api', configuredRoutes);
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
      console.log('Initializing database connection...');
      
      // Create TypeORM DataSource
      this.dataSource = new DataSource({
        ...dataSourceOptions,
        // In development, let TypeORM keep the schema in sync. Migrations still
        // apply in production (synchronize:false).
        synchronize: process.env.NODE_ENV !== 'production'
      });
      
      // Initialize the DataSource
      await this.dataSource.initialize();
      console.log('Database connection established successfully');
      
      // Initialize the container with the DataSource
      this.container = createContainer(this.dataSource);
      console.log('Dependency injection container initialized');
      
      // Configure routes after container is ready
      this.configureRoutes();
      
      // Configure error handling
      this.configureErrorHandling();
      
      // Additional initialization steps could go here
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }
}

export default App;

