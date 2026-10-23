const dotenv = require('dotenv');

dotenv.config();

const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/database');
require('./src/models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();

    const isDev = process.env.NODE_ENV !== 'production';
    await sequelize.sync({ alter: isDev });
    console.log(' Database models synchronized successfully.');

    const startListening = (initialPort, maxRetries = 5) => {
      let currentPort = Number(initialPort);
      let retries = 0;

      const attempt = () => {
        const server = app.listen(currentPort);

        server.once('listening', () => {
          console.log(`====================================================`);
          console.log(`  Healthcare Backend Server running on port ${currentPort}`);
          console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
          console.log(`  Health Check: http://localhost:${currentPort}/api/health`);
          console.log(`====================================================`);

          const handleShutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(async () => {
              try {
                await sequelize.close();
                console.log('Database connection closed.');
                process.exit(0);
              } catch (err) {
                console.error('Error during database disconnection:', err);
                process.exit(1);
              }
            });
          };

          process.once('SIGTERM', () => handleShutdown('SIGTERM'));
          process.once('SIGINT', () => handleShutdown('SIGINT'));
        });

        server.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️  Port ${currentPort} is in use (often used by macOS AirPlay Receiver on 5000).`);
            retries++;
            if (retries <= maxRetries) {
              currentPort++;
              console.log(`🔄 Automatically trying port ${currentPort}...`);
              attempt();
            } else {
              console.error(`❌ Unable to find an open port after ${maxRetries} attempts.`);
              process.exit(1);
            }
          } else {
            console.error('Server error:', err);
            process.exit(1);
          }
        });
      };

      attempt();
    };

    startListening(PORT);

  } catch (error) {
    console.error(' Fatal error during server initialization:', error);
    process.exit(1);
  }
};

startServer();
