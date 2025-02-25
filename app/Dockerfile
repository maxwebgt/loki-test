FROM node:16

WORKDIR /app

# Установка PM2 глобально
RUN npm install pm2 -g

# Копирование файлов приложения
COPY package*.json ./
COPY . .

# Установка зависимостей
RUN npm install

# Использование pm2-runtime вместо pm2
CMD ["pm2-runtime", "app.js"]