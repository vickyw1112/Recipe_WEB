import sqlite3
from app import app, api
from flask_restplus import Resource, abort, marshal
from flask import request, jsonify
from model import *
from utils.db import *
from flask_login import current_user, login_required
from utils.crypto import hash_password, check_password

dashboard = api.namespace('dashboard', descriptions='dashboard stuff')


@dashboard.route('/notinbookmark/<int:id>')
@dashboard.doc(params={'id': 'recipe id'})
class NotInBookmark(Resource):
    @dashboard.doc(description="check if a recipe in bookmark recipe list")
    @dashboard.response(400, 'Failure', ErrorMsgModel)
    @dashboard.response(200, 'Success')
    @dashboard.response(401, 'Auth Failure')
    @login_required
    def post(self, id):
        # if user didn't bookmark current recipe return true
        # else return false'
        print("in fuction")
        user_id = current_user.user_id
        db = DB()
        recipe = db.select_one("UserBookmarkedRecipe").where(
            recipe_id=id, user_id=user_id).execute()
        if not recipe:
            print('hh')
            return jsonify(message='true')
        db.commit()
        print('ll')
        return abort(400, message='in list')


@dashboard.route('/bookmark/<int:id>')
@dashboard.doc(params={'id': 'recipe id'})
class Bookmark(Resource):
    @dashboard.doc(description="bookmark recipe")
    @dashboard.response(400, 'Failure', ErrorMsgModel)
    @dashboard.response(200, 'Success')
    @dashboard.response(401, 'Auth Failure')
    # @dashboard.expect(BookmarkModel)
    @login_required
    def post(self, id):
        user_id = current_user.user_id
        db = DB()
        recipe = db.select_one("Recipe").where(id=id).execute()
        booked = db.select_one('UserBookmarkedRecipe').where(
            recipe_id=id, user_id=user_id).execute()
        if booked:
            return abort(400, message='already bookmarked')
        if not recipe:
            return abort(400, message="recipe does exist")
        db.insert('UserBookmarkedRecipe').values(
            user_id=user_id, recipe_id=id).execute()
        db.commit()
        return jsonify(message="Success")

    @dashboard.doc(description="unbookmark recipe")
    @dashboard.response(400, 'Failure', ErrorMsgModel)
    @dashboard.response(200, 'Success')
    @dashboard.response(401, 'Auth Failure')
    @login_required
    def delete(self, id):
        db = DB()
        recipe = db.select_one("UserBookMarkedRecipe").where(
            recipe_id=id, user_id=current_user.user_id).execute()
        if not recipe:
            return abort(400, message="recipe does exist")
        db.delete('UserBookMarkedRecipe').where(
            recipe_id=id, user_id=current_user.user_id).execute()
        db.commit()
        return jsonify(message='success')


@dashboard.route('/bookmarkList')
class BookmarkList(Resource):
    @dashboard.doc(description="get current user bookmark list")
    @dashboard.response(400, 'Failure', ErrorMsgModel)
    @dashboard.marshal_with(BookmarkListsModel, code=200)
    @login_required
    def get(self):
        user_id = current_user.user_id
        db = DB()
        data = db.select("bookmark_recipe").where(user_id=user_id).execute()
        list = []
        if not data:
            return abort(400, message="no bookmark recipes")
        for item in data:
            rid = item['recipe_id']
            r_name = item['name']
            recipe = {'recipe_id': rid,
                      'name': r_name}
            list.append(recipe)
        db.commit()
        return dict(recipes=list)


@dashboard.route('/recipeList')
class GetRecipeList(Resource):
    @dashboard.doc(description="get current user recipe list")
    @dashboard.response(400, 'Failure', ErrorMsgModel)
    @dashboard.marshal_with(BookmarkListsModel, code=200)
    @login_required
    def get(self):
        user_id = current_user.user_id
        db = DB()
        data = db.select("recipe").where(author_id=user_id).execute()
        list = []
        if not data:
            return abort(400, message="no recipes")
        for item in data:
            rid = item['id']
            r_name = item['name']
            recipe = {'recipe_id': rid,
                      'name': r_name}
            list.append(recipe)
        db.commit()
        return dict(recipes=list)


@dashboard.route('/editProfile')
class EditProfile(Resource):
    @dashboard.doc(description="edit profile")
    @dashboard.response(400, 'Failure', ErrorMsgModel)
    @dashboard.response(200, 'Success')
    @dashboard.response(401, 'Auth Failure')
    @dashboard.expect(UserEditInfoModel)
    @login_required
    def post(self):
        user_id = current_user.user_id
        db = DB()
        data = request.get_json()
        data = marshal(data, UserEditInfoModel, skip_none=True)
        if not data:
            return abort(400, message="nothing to update")
        if data['name']:
            db.update('Users').set(name=data['name']).where(
                id=user_id).execute()
        if data['email_interval']:
            db.update('Users').set(email_interval=data['email_interval']).where(
                id=user_id).execute()
        if data['allergy']:
            db.update('Users').set(allergy=data['allergy']).where(
                id=user_id).execute()
        if data['password']:
            password_encrypted = hash_password(data['password'])
            db.update('Users').set(password=password_encrypted).where(
                id=user_id).execute()
        db.commit()
        return jsonify(message="Success")
