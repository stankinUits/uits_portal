FROM nginx:stable-alpine
COPY ./configs/nginx.conf /etc/nginx/nginx.conf
