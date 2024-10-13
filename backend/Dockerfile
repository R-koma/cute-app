FROM python:3.10-slim

ENV DEPLOYMENT_ENV "dev"
ENV EXPOSE_PORT 8000
ENV GUNICORN_WORKERS 2

RUN apt-get update && apt-get install gcc -y
WORKDIR /app

COPY requirements.txt /app
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD [ "fastapi", "run", "main.py" ]
# CMD [ "gunicorn", "main:app" ]