import sys, os
import time
import logging
import coloredlogs
from celery import Celery
from fireman import *

celery = Celery('tasks')
celery.config_from_object({
    'BROKER_URL': 'amqp://localhost',
    'CELERY_RESULT_BACKEND': 'amqp://',
    'CELERYD_POOL_RESTARTS': True,  # Required for /worker/pool/restart API
})
logging.basicConfig()
coloredlogs.install()
logger = logging.getLogger(__file__)
logger.setLevel(logging.DEBUG)
logger.debug("Tasks Started")

@celery.task
def add(x, y):
    return x + y

@celery.task
def sub(x, y):
    time.sleep(30)
    return x - y

@celery.task
def post_dummy_data(count = 1):
    put_dummy_data(count)

@celery.task
def post_user(name, regKey, extra={}):
    return put_user(name, regKey, extra)

@celery.task
def trigger_notifcation(regKey):
    return send_notifcation(regKey)

if __name__ == '__main__':
    logger.warn("Called as Main")
    logger.warn("Should call with `celery` command")