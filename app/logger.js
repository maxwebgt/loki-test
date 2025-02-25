const winston = require('winston');
const LokiTransport = require('winston-loki');

// Создаем логгер с транспортом для Loki
const logger = winston.createLogger({
    level: 'info',
    transports: [
        // Стандартный вывод в консоль
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        // Логирование в Loki
        new LokiTransport({
            host: 'http://loki:3100', // Адрес Loki
            labels: { job: 'pm2-logs' },
            json: true,
        })
    ]
});

module.exports = logger;
