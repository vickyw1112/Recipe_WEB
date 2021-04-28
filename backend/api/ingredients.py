import sqlite3
from app import api, app
from flask_restplus import Resource, abort, fields, marshal
from flask import request, jsonify
from model import *
from utils.db import *
from flask_login import login_required

sidebar = api.namespace('ingredients', descriptions='ingredients stuff')


@sidebar.route('/list')
class sidebarList(Resource):
    @sidebar.doc(description="get ingredients")
    @sidebar.marshal_with(SidebarListModel, code=200)
    @sidebar.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def get(self):
        db = DB()
        res = []
        ingredients = db.select('ingredient_with_category').execute()
        if not ingredients:
            ingredients = []
        for row in ingredients:
            ingred = row['ingredients'].split(",")
            res.append({'type': row["category"], 'ingredients': ingred})
        return dict(sidebarData=res)

    @sidebar.doc(description="Add ingredients")
    @sidebar.expect(AddIngredientListModel)
    @sidebar.response(200, 'Success')
    @sidebar.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def put(self):
        d = request.get_json()
        d = marshal(d, AddIngredientListModel, skip_none=True)

        db = DB()
        category_id = None
        for data in d['ingredients']:
            category_id = db.select_one("Category") \
                .where(name=data['category']).execute()
            if not category_id:
                return abort(400, message="category does not exist")

            ingredient = db.select_one("Ingredient") \
                .where(name=data['ingredient']).execute()
            if ingredient:
                return abort(400, message="ingredient has alreay existed")

            try:
                ingredient_id = db.insert('Ingredient') \
                    .values(name=data['ingredient'], category_id=category_id['id']) \
                    .execute()
            except sqlite3.Error:
                return abort(400, message="invalid data")

        db.commit()
        return jsonify(message='success')


@sidebar.route('/<int:id>')
@sidebar.doc(params={'id': 'ingredient id'})
class ingredientDeatil(Resource):

    @sidebar.doc(descriiption=""" Delete a ingredient by given id """)
    @sidebar.response(200, 'Success')
    @sidebar.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def delete(self, id):
        db = DB()
        # TODO: users can only delete the ingredient they added before
        try:
            ingredient = db.select_one("Ingredient") \
                .where(id=id).execute()
            if not ingredient:
                return abort(400, message="ingredient not exist")

            rows = db.delete('Ingredient') \
                .where(id=id) \
                .execute()
        except sqlite3.Error:
            return abort(400, message="invalid data")

        db.commit()
        return jsonify(message="success")


@sidebar.route('/getall')
class allList(Resource):
    @sidebar.doc(description="get all ingredients without tags")
    @sidebar.marshal_with(AllIngredients, code=200)
    @sidebar.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def get(self):
        db = DB()
        res = []
        ingredients = db.select('ingredient').execute()
        if not ingredients:
            ingredients = []
        for row in ingredients:
            res.append(row['name'])
        db.commit()
        return dict(ingredients=res)


@sidebar.route('/getallcategory')
class allCategory(Resource):
    @sidebar.doc(description="get all category")
    @sidebar.marshal_with(Allcategorys, code=200)
    @sidebar.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def get(self):
        db = DB()
        res = []
        ingredients = db.select('category').execute()
        if not ingredients:
            ingredients = []
        for row in ingredients:
            res.append(row['name'])

        res = list(set(res))
        db.commit()
        return dict(category=res)
