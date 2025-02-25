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

module.exports = logger;
