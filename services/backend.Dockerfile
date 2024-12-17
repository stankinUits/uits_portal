FROM python:3.10.16-alpine

ENV PYTHONUNBUFFERED 1

RUN mkdir /app

WORKDIR /app

COPY ./backend/requirements.txt /app

RUN pip install --upgrade pip && pip install -r requirements.txt
