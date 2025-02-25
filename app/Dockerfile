# Используем официальный образ Node.js
FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json /app/
RUN npm install

# Копируем весь код приложения в контейнер
COPY . /app/

# Устанавливаем PM2 глобально
RUN npm install pm2 -g

# Открываем порт для вашего приложения
EXPOSE 3000

# Команда для запуска приложения через PM2
CMD ["pm2-runtime", "start", "app.js", "--name", "my-app"]
