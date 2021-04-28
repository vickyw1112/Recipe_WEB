import os


class Default(object):
    DEBUG = True
    SWAGGER_DOC = True
    RESTPLUS_VALIDATE = True
    AUTO_LOGIN = False
    DB_FILE = os.environ['DB_FILE']
    FRONT_END_URL = "http://localhost:3000"
    TESTING = False
