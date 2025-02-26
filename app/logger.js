const winston = require('winston');
const LokiTransport = require('winston-loki');

// Создаем логгер с транспортом для Loki
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new LokiTransport({
            host: 'http://loki:3100',
            labels: {
                job: 'nodejs-app',
                environment: 'production',
                service: 'my-app'
            },
            json: true,
            batching: true,
            interval: 5,
            format: winston.format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error(err)
        })
    ]
});

// Helper function to generate random log messages
logger.generateRandomLog = (level) => {
  const messages = {
    debug: [
      'Debugging database connection',
      'Variable state check completed',
      'Cache hit ratio: 78%',
      'Function execution trace completed',
      'Debug mode enabled for module'
    ],
    info: [
      'User logged in successfully',
      'API request completed',
      'Data processing finished',
      'Service started successfully',
      'Configuration loaded'
    ],
    warn: [
      'High memory usage detected',
      'API rate limit approaching',
      'Deprecated function called',
      'Slow database query detected',
      'Connection pool near capacity'
    ],
    error: [
      'Database connection failed',
      'Authentication error',
      'API request failed',
      'File not found exception',
      'Uncaught exception in request handler'
    ]
  };
  
  // Select a random message from the appropriate category
  const randomIndex = Math.floor(Math.random() * messages[level].length);
  return messages[level][randomIndex];
};

module.exports = logger;
