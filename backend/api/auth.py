import sqlite3
from app import app, api
from flask_restplus import Resource, abort, marshal
from flask_mail import Message
from flask import request, jsonify, render_template
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from model import *
from utils.db import *
from utils.crypto import hash_password, check_password
from utils.email import *
from utils.user import *
import secrets

auth = api.namespace('auth', descriptions='Authentication')

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    user = DB().select_one('Users').where(id=user_id).execute()
    if not user:
        return None
    return User(user['name'], user['email'], user_id)


@auth.route('/signup')
class Signup(Resource):
    @auth.doc(description="create account, user can only login after verifying their email")
    @auth.response(200, 'Success')
    @auth.response(400, 'Failure', ErrorMsgModel)
    @auth.expect(SignUpModel)
    def post(self):
        data = request.get_json()
        name = data['name']
        password = data['password']
        email = data['email']
        print(email)
        password_encrypted = hash_password(password)

        db = DB()
        try:
            uid = db.insert('Users') \
                    .values(email=email, password=password_encrypted, name=name).execute()
        except sqlite3.IntegrityError as e:
            abort(400, message="email already exists")

        # token = secrets.token_hex()
        token = '12345678'
        print(token)
        db.insert('email_verification') \
                .values(user_id=uid, token=token).execute()

        verify_link = app.config['FRONT_END_URL'] + '/verify/' + token

        send_mail_flask(email, "verification", verify_link=verify_link, title='Verify your email')

        db.commit()

        return {'userid': uid}, 200


@auth.route('/verify/<string:token>')
class Verify(Resource):
    @auth.doc(description="verify email using given token")
    @auth.response(200, "Success")
    @auth.response(400, "Invalid token")
    def get(self, token):
        db = DB()
        user = db.select_one("email_verification").where(token=token).execute()
        if not user:
            return abort(400, message="Invalid Token")

        uid = user['user_id']
        db.update('Users').set(verified=1).where(id=uid).execute()
        db.delete('email_verification').where(user_id=uid).execute()
        db.commit()
        return jsonify(message='Success')


@auth.route('/info')
class Details(Resource):
    @auth.doc(description="get current logged in user details")
    @auth.response(401, 'Auth failed', ErrorMsgModel)
    @auth.response(200, 'success')
    #@auth.marshal_with(UserDashboardModel, code=200)
    @login_required
    def get(self):
        db = DB()
        user = db.select_one("Users") \
            .where(id=current_user.user_id).execute()
        if not user:
            return abort(400, message="User does exist")

        # auth_list = db.select('recipe') \
        #     .where(author_id=current_user.user_id) \
        #     .execute()
        # auth_ids = list(
        #     map(lambda x: x['id'], auth_list)) if auth_list else None

        ingredient_list = db.select('Ingredient') \
            .where(user_id=current_user.user_id) \
            .execute()
        ingredient_ids = list(
            map(lambda x: x['id'], ingredient_list)) if ingredient_list else None
        return jsonify(
                id=user['id'],
                name=user['name'],
                email=user['email'],
                email_interval=user['email_interval'],
                allergy=user['allergy'],
                added_ingredient_ids=ingredient_ids,
            # 'added_auth_ids': auth_ids
            )


@auth.route('/signin')
class Signin(Resource):
    @auth.doc(description="Sign in")
    @auth.expect(SignInModel)
    @auth.response(200, 'Success')
    @auth.response(400, 'Invalid request')
    @auth.response(401, 'Auth failed', ErrorMsgModel)
    def post(self):
        data = request.get_json()
        password = data['password']
        email = data['email']
        print(password)
        print(email)
        db = DB()

        user = db.select_one("Users") \
            .where(email=email).execute()
        if not user:
            return abort(401, message="Invalid Email")

        if not user['verified']:
            return abort(401, message="Unverified Email")

        if check_password(password, user['password']):
            login_user(User(user['name'], user['email'], user['id']))
            return {'userid': user['id']}, 200
        else:
            return abort(401, message="Incorrect password")


@auth.route('/logout')
class logout(Resource):
    @login_required
    @auth.response(200, "Success")
    def post(self):
        logout_user()
        return {'message': 200}


@auth.route('/comment')
class Comment(Resource):
    @auth.doc(description="User comment recipe")
    @auth.response(200, 'Success')
    @auth.response(400, 'Invalid request')
    @auth.response(401, 'Auth failed', ErrorMsgModel)
    @auth.expect(UserCommentModel)
    def post(self):
        user_id = current_user.user_id
        db = DB()
        data = request.get_json()
        data = marshal(data, UserCommentModel)
        r_id = data['recipe_id']
        comment = data['comment']
        try:
            db.insert("UserRecipeComment") \
                .values(user_id=user_id, recipe_id=r_id, comment=comment) \
                .execute()
        except sqlite3.Error as e:
            return abort(400, message="Invalid data")
        db.commit()
        return {'message': "Success"}
