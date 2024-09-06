# Выбор базового образа для сборки React приложения
FROM node:16-alpine as build

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json (если есть)
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов проекта
COPY . .

# Сборка React приложения
RUN npm run build

# Финальный этап - использование Nginx для раздачи статики
FROM nginx:alpine

# Копирование кастомной конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копирование собранного приложения в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Открытие порта 80 для доступа к приложению
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
