FROM python:3.10-slim

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*


WORKDIR /code

COPY ./requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /code/