# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY frontend/package.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

COPY frontend ./

EXPOSE 4200

CMD ["npm", "run", "start"]
