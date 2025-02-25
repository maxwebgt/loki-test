const express = require('express');
const logger = require('./logger');
const app = express();
const port = 3000;

// Тестовый console.log
console.log('Приложение запускается...');
console.error('Тестовая ошибка через console.error');

// Middleware для логирования всех запросов через console.log
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Тестовый endpoint с обоими типами логов
app.get('/', (req, res) => {
    // Winston лог
    logger.info('Запрос к корневому пути через winston');

    // Console.log
    console.log('Запрос к корневому пути через console.log');

    res.send('Hello World!');
});

// Тестовый endpoint для ошибок
app.get('/error', (req, res) => {
    // Winston error
    logger.error('Тестовая ошибка через winston');

    // Console.error
    console.error('Тестовая ошибка через console.error');

    res.status(500).send('Test Error');
});

// Периодический вывод логов обоими способами
setInterval(() => {
    console.log('Периодический лог через console.log');
    logger.info('Периодический лог через winston');
}, 30000);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    logger.info(`Сервер запущен на порту ${port} (winston)`);
});