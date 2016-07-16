```
pip install Flask
npm install electron-prebuilt -g
npm install request-promise -g
npm install
```

```bash
electron . # . as the working directory
```

### Setting Up Celery
- pip install celery
> celery worker -A FILE  --loglevel=info

### Setting Up RabbitMQ
- Source: http://docs.celeryproject.org/en/latest/getting-started/brokers/rabbitmq.html
- brew install rabbitmq
- add rabbitmq to path; PATH=$PATH:/usr/local/sbin
- sudo scutil --set HostName YOUR_NAME
- add to /etc/hosts; 127.0.0.1 localhost YOUR_NAME YOUR_NAME.local
> rabbitmq-server
- to kill it -> rabbitmqctl stop
- rabbitmqctl status

### Flower
- Real-time monitor and web admin for Celery distributed task queue http://flower.readthedocs.org
- API: http://nbviewer.jupyter.org/github/mher/flower/blob/master/docs/api.ipynb
> flower -A FILE --port=5555  # Need the -A for filename