FROM python:3.10-slim

WORKDIR /code

COPY ./requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /code/

EXPOSE 8000

CMD ["sh", "-c", "python manage.py collectstatic --noinput && python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"]