import { createConnection, Connection, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'hubmanage',
  entities: [
    __dirname + '/../../../core/**/entities/*.{ts,js}'
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create database schema in development
  logging: process.env.NODE_ENV !== 'production',
  migrations: [
    __dirname + '/../migrations/*.{ts,js}'
  ],
  // Remove CLI configuration as it's no longer supported
};

export const initializeDatabase = async (): Promise<Connection> => {
  try {
    const connection = await createConnection(config);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

