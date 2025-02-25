const express = require('express');
const logger = require('./logger');
const app = express();
const port = 3000;

// Middleware для логирования запросов
app.use((req, res, next) => {
    logger.info('Входящий запрос', {
        method: req.method,
        path: req.path,
        ip: req.ip
    });
    next();
});

// Тестовый эндпоинт
app.get('/', (req, res) => {
    logger.info('Запрос к корневому пути');
    res.send('Hello World!');
});

// Периодическая отправка тестовых логов
setInterval(() => {
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    logger.info('Тестовое сообщение', {
        timestamp: new Date().toISOString(),
        status: 'running'
    });
}, 10000);

app.listen(port, () => {
    logger.info(`Приложение запущено на порту ${port}`);
});

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
    logger.error('Необработанное исключение:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Необработанное отклонение промиса:', reason);
});