const express = require('express');
const promClient = require('prom-client');
const app = express();

// Создаем реестр метрик
const register = new promClient.Registry();

// Собираем стандартные метрики Node.js
promClient.collectDefaultMetrics({
    register,
    prefix: 'node_',
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// HTTP метрики
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5],
    registers: [register]
});

const httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

const httpRequestSize = new promClient.Histogram({
    name: 'http_request_size_bytes',
    help: 'Size of HTTP requests in bytes',
    labelNames: ['method', 'route'],
    buckets: [100, 1000, 5000, 10000, 50000],
    registers: [register]
});

const httpResponseSize = new promClient.Histogram({
    name: 'http_response_size_bytes',
    help: 'Size of HTTP responses in bytes',
    labelNames: ['method', 'route'],
    buckets: [100, 1000, 5000, 10000, 50000],
    registers: [register]
});

// Бизнес метрики (пример)
const activeUsers = new promClient.Gauge({
    name: 'app_active_users',
    help: 'Number of active users',
    registers: [register]
});

const lastApiCallTimestamp = new promClient.Gauge({
    name: 'app_last_api_call_timestamp',
    help: 'Timestamp of the last API call',
    registers: [register]
});

// Middleware для сбора метрик
app.use((req, res, next) => {
    const start = process.hrtime();
    const requestSize = Buffer.byteLength(JSON.stringify(req.body || ''));

    res.on('finish', () => {
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;
        const route = req.route ? req.route.path : req.path;
        const responseSize = Buffer.byteLength(JSON.stringify(res.locals.data || ''));

        httpRequestDuration.observe(
            { method: req.method, route, status_code: res.statusCode },
            durationInSeconds
        );

        httpRequestsTotal.inc({
            method: req.method,
            route,
            status_code: res.statusCode
        });

        httpRequestSize.observe(
            { method: req.method, route },
            requestSize
        );

        httpResponseSize.observe(
            { method: req.method, route },
            responseSize
        );

        lastApiCallTimestamp.setToCurrentTime();
    });

    next();
});

// Эндпоинт для метрик
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
});

// Тестовые эндпоинты
// Обновляем корневой маршрут для отображения HTML страницы
app.get('/', (req, res) => {
    activeUsers.set(Math.floor(Math.random() * 100)); // Симуляция активных пользователей

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Test Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 20px auto;
                padding: 0 20px;
                background-color: #f5f5f5;
            }
            .button-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin: 20px 0;
            }
            .api-button {
                padding: 15px;
                font-size: 16px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                background-color: #4CAF50;
                color: white;
                transition: background-color 0.3s;
            }
            .api-button:hover {
                background-color: #45a049;
            }
            .api-button.slow {
                background-color: #2196F3;
            }
            .api-button.slow:hover {
                background-color: #1976D2;
            }
            .api-button.error {
                background-color: #f44336;
            }
            .api-button.error:hover {
                background-color: #d32f2f;
            }
            #response {
                margin-top: 20px;
                padding: 15px;
                background-color: white;
                border-radius: 5px;
                border: 1px solid #ddd;
                min-height: 100px;
            }
            .time {
                color: #666;
                font-size: 14px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <h1>API Test Page</h1>
        <div class="time">
            Current UTC Time: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}
        </div>
        <div class="button-container">
            <button class="api-button" onclick="callApi('/')">Test Normal Response (GET /)</button>
            <button class="api-button slow" onclick="callApi('/slow')">Test Slow Response (GET /slow)</button>
            <button class="api-button error" onclick="callApi('/error')">Test Error Response (GET /error)</button>
        </div>
        <div>
            <h3>Response:</h3>
            <pre id="response">Click any button to test the API...</pre>
        </div>

        <script>
        async function callApi(path) {
            const responseDiv = document.getElementById('response');
            responseDiv.textContent = 'Loading...';
            
            try {
                const start = Date.now();
                const response = await fetch(path);
                const data = await response.json();
                const duration = Date.now() - start;
                
                responseDiv.textContent = JSON.stringify({
                    status: response.status,
                    duration: duration + 'ms',
                    data: data
                }, null, 2);
            } catch (error) {
                responseDiv.textContent = 'Error: ' + error.message;
            }
        }
        </script>
    </body>
    </html>
    `;

    res.send(html);
});

// Обновляем маршрут /slow для более информативного ответа
app.get('/slow', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    res.locals.data = {
        message: 'Slow response',
        duration: '2000ms',
        timestamp: new Date().toISOString()
    };
    res.json(res.locals.data);
});

// Обновляем маршрут /error для более информативного ответа
app.get('/error', (req, res) => {
    res.locals.data = {
        error: 'Test error',
        errorCode: 500,
        timestamp: new Date().toISOString()
    };
    res.status(500).json(res.locals.data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});