# Выбор базового образа
FROM node:16-alpine as build

# Установка рабочей директории в контейнере
WORKDIR /app

# Копирование файлов package.json и package-lock.json (или yarn.lock)
COPY package*.json ./
# Если используете yarn, добавьте:
# COPY yarn.lock ./

# Установка зависимостей
RUN npm install
# Или если используете yarn, то:
# RUN yarn install

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения
RUN npm run build
# Или если используете yarn, то:
# RUN yarn build

# Финальный этап - nginx используется для раздачи статики
FROM nginx:alpine

# Копирование собранного проекта в директорию nginx
COPY --from=build /app/build /usr/share/nginx/html

# Открытие порта 80 для доступа к приложению
EXPOSE 80

# Запуск nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]
