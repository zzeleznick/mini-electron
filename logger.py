import os, sys
import logging

logging.basicConfig()
logger = logging.getLogger(__file__)
logger.setLevel(logging.DEBUG)

class CriticalFilter(logging.Filter):
    def filter(self, record):
        return (record.levelno >= logging.CRITICAL)

class ErrorFilter(logging.Filter):
    def filter(self, record):
        return (record.levelno < logging.CRITICAL )

h1 = logging.StreamHandler(sys.stdout)
h1.addFilter(CriticalFilter())
logger.addHandler(h1)
console = logger.critical

h2 = logging.StreamHandler(sys.stderr)
h2.addFilter(ErrorFilter())
logger.addHandler(h2)

logger.info('oh hello')
console("YELLO")