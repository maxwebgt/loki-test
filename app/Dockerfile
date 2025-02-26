# Базовый образ
FROM node:16 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Образ для тестирования
FROM base as test
ENV NODE_ENV=test
CMD ["npm", "run", "test"]

# Продакшн образ
FROM base as production
ENV NODE_ENV=production
RUN npm install pm2 -g
CMD ["pm2-runtime", "app.js", "--no-daemon", "--merge-logs"]