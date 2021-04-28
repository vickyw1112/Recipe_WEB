from flask import Flask
from flask_restplus import Api
from flask_cors import CORS
from flask_mail import Mail
import os

app = Flask(__name__)
app.config.from_object('config.Default')
app.config.from_object('secrets.Secret')

apiConfig = {
    'doc': '/' if app.config['SWAGGER_DOC'] else False,
    'validate': app.config['RESTPLUS_VALIDATE']
}
mail_settings = {
    "MAIL_SERVER": 'smtp-mail.outlook.com',
    "MAIL_PORT": 587,
    "MAIL_USE_TLS": True,
    "MAIL_USE_SSL": False,
    "MAIL_USERNAME": os.environ['EMAIL_USER'],
    "DEFAULT_FROM_EMAIL": os.environ['EMAIL_USER'],
    "MAIL_FROM": os.environ['EMAIL_USER'],
    "MAIL_PASSWORD": os.environ['EMAIL_PASSWORD']
}
app.config.update(mail_settings)
mail = Mail(app)
if app.debug:
    CORS(app, supports_credentials=True)
# if app.debug:
#     CORS(app, supports_credentials=True,
#          origins=['http://localhost:3000', 'http://localhost:5000'])

api = Api(app, **apiConfig)
