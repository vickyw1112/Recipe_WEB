#!/usr/bin/env python3
import os
os.environ['DB_FILE'] = 'database.db'
os.environ['EMAIL_USER'] = 'hailiang.adam.wang@outlook.com'
os.environ['EMAIL_PASSWORD'] = 'wanghailiang2007'

from app import app
from api.tag import *
from api.auth import *
from api.dashboard import *
from api.recipe import *
from api.ingredients import *


app.run(debug=True)
