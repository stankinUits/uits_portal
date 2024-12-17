FROM node:23.4-alpine3.21 AS build
WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install -g npm@11.0.0
RUN npm install --legacy-peer-deps
COPY ./frontend/ .
RUN npm run build
