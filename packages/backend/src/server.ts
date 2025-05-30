import App from './app';
import { AddressInfo } from 'net';

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces

async function startServer() {
  try {
    const app = new App();
    console.log('Initializing application...');
    await app.initialize();
    
    const server = app.app.listen(PORT, HOST, () => {
      const addressInfo = server.address() as AddressInfo;
      const actualPort = addressInfo.port;
      const actualHost = addressInfo.address === '0.0.0.0' ? 'localhost' : addressInfo.address;
      
      console.log(`Server running on ${HOST}:${actualPort}`);
      console.log(`API available at http://${actualHost}:${actualPort}/api`);
      console.log(`Health check available at http://${actualHost}:${actualPort}/health`);
    });
    
    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

