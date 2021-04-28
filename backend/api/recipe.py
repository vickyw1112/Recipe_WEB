import sqlite3
from app import api, app
import base64
from flask_restplus import Resource, abort, fields, marshal
from flask import request, jsonify
from werkzeug.datastructures import FileStorage
from model import *
from utils.db import *
from flask_login import current_user, login_required

recipe = api.namespace('recipe', descriptions='recipe stuff')


@recipe.route('/list')
class RecipeList(Resource):
    @recipe.doc(description=''' Let you make a new post of recipe.''')
    @recipe.expect(NewRecipeModel)
    @recipe.response(200, 'Success', api.model('id', {'id': fields.Integer()}))
    @recipe.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def put(self):
        data = request.get_json()
        data = marshal(data, NewRecipeModel, skip_none=True)

        db = DB()
        try:
            recipe_id = db.insert("Recipe") \
                .values(name=data['name'], recipeInstructions=data['instruction'], author_id=current_user.user_id, image=data['image']) \
                .execute()
        except sqlite3.Error as e:
            return abort(400, message="Invalid data")

        ingredient_list = data['ingredients']
        for ingredient in ingredient_list:
            ingredient_id = db.select_one('Ingredient') \
                .where(name=ingredient['ingredient']).execute()
            if ingredient_id is None:
                return abort(400, message="Ingredient does not exist")
            try:
                db.insert('RecipeIngredient') \
                    .values(ingredient_id=ingredient_id['id'], recipe_id=recipe_id, amount=ingredient['amount']) \
                    .execute()
            except sqlite3.Error as e:
                return abort(400, message="Invalid data")

        tag_list = data['tags']
        for tag in tag_list:
            tag_id = db.select_one('Tag') \
                .where(name=tag['tag']) \
                .execute()
            if tag_id is None:
                return abort(400, message="tag does not exist")
            try:
                db.insert('RecipeTag') \
                    .values(recipe_id=recipe_id, tag_id=tag_id['id']).execute()
            except sqlite3.Error as e:
                return abort(400, message="Invalid data")

        db.commit()
        return jsonify(id=recipe_id)


@recipe.route('/<int:id>')
@recipe.doc(params={'id': 'recipe id'})
class RecipeDetail(Resource):

    @recipe.doc(description="Delete recipe")
    @recipe.response(200, 'Success')
    @recipe.response(400, 'Failure', ErrorMsgModel)
    @login_required
    def delete(self, id):
        db = DB()
        recipe = db.select_one('Recipe') \
            .where(id=id).execute()
        if recipe is None:
            return abort(400, message="recipe does not exist")
        db.delete('RecipeTag').where(recipe_id=id).execute()
        db.delete('RecipeIngredient').where(recipe_id=id).execute()
        db.delete('Recipe').where(id=id).execute()

        db.commit()
        return jsonify(message="success")

    @recipe.doc(description="get details of a given recipe")
    @recipe.response(400, 'Failure', ErrorMsgModel)
    @recipe.marshal_with(RecipeDetailModel, code=200)
    @login_required
    def get(self, id):
        db = DB()
        recipe = db.select_one('Recipe') \
            .where(id=id).execute()
        if recipe is None:
            return abort(400, message="recipe does not exist")
        ingredients = db.select('ingredientName_amount_recipe') \
            .where(recipe_id=id).execute()
        ingredient_list = []
        for row in ingredients:
            an_ingredient = {}
            an_ingredient['ingredient'] = row['name']
            an_ingredient['amount'] = row['amount']
            ingredient_list.append(an_ingredient)


        tags_name = []
        tags = db.select('recipe_with_tags').where(recipe_id=id).execute()
        for row in tags:
            tags_name.append(row['tags'])

        # print(tags_name)

        res = {
            'id': recipe['id'],
            'author_id': recipe['author_id'],
            'name': recipe['name'],
            'rating': recipe['rating'],
            'image': recipe['image'],
            'ingredients': ingredient_list,
            'instruction': recipe['recipeInstructions'],
            'tags': tags_name
        }
        return res


# add_recipe_image_parser = api.parser()
# add_recipe_image_parser.add_argument('recipe_id', type=int, required=True)
# add_recipe_image_parser.add_argument(
#     'image', location='files', type=FileStorage, required=True)
#
#
# # image upload receiver
# # insert into database as a base64 encoded image
#
#
# @recipe.route('/image')
# class Files(Resource):
#     @recipe.doc(description="upload img for a given recipe")
#     @recipe.response(200, 'Success')
#     @recipe.response(400, 'Failure', ErrorMsgModel)
#     @recipe.expect(add_recipe_image_parser)
#     def post(self):
#         db = DB()
#         args = add_recipe_image_parser.parse_args()
#         recipe_id = args['recipe_id']
#         image = args['image']  # This is FileStorage instance
#         image_string = base64.b64encode(image.read())
#         db.update('Recipe').set(image=image_string) \
#             .where(id=recipe_id).execute()
#         # db.conn.execute(f'''UPDATE Recipe SET image="{image_string}" WHERE id="{recipe_id}"''')
#         db.commit()
#         return {'success': True}, 200


@recipe.route('/search')
class SearchRecipe(Resource):
    @recipe.doc(description="search recipe")
    @recipe.response(200, 'Success', api.model('ids', {'ids': fields.List(fields.Integer(example=1))}))
    @recipe.response(400, 'Failure', ErrorMsgModel)
    @recipe.expect(SearchRecipeModel)
    @login_required
    def post(self):
        data = request.get_json()
        data = marshal(data, SearchRecipeModel, skip_none=True)
        db = DB()
        id_list = []
        res = {}

        if not data.keys():
            return abort(400, message="bad request")

        # get all the recipes
        recipe_list = db.select('recipe_tag_ingredient') \
            .execute()

        # if ingredient list is not null
        # we first select all recipes from the recipe_list where recipe.ingredients >= searched_ingredients
        if 'ingredients' in data.keys():
            recipe_list = list(filter(lambda x: set(x['ingredients'].split(
                ',')) >= set(data['ingredients']), recipe_list))

        # if tags list is not null
        # we then select all recipes from recipe_list where recipe.tags >= searched_tags
        if 'tags' in data.keys():
            recipe_list = list(filter(lambda x: set(
                x['tags'].split(',')) >= set(data['tags']), recipe_list))

        # if blacklist list is not null
        # we then select all recipes from recipes where recipe.tags join blacklist is empty
        if 'tags' in data.keys():
            recipe_list = list(filter(lambda x: set(x['tags'].split(
                ',')).isdisjoint(set(data['blackList'])), recipe_list))

        if not recipe_list:
            return abort(400, message="recipe doesn't exist")

        # add ids of all remaining recipes to res
        for row in recipe_list:
            id_list.append(row['recipe_id'])
            searched = db.select_one('Recipe').where(
                id=row['recipe_id']).execute()['searched'] + 1
            db.update("Recipe").set(searched=searched).where(
                id=row['recipe_id']).execute()
        db.commit()
        return dict(ids=id_list)


@recipe.route('/nextIngredient')
class NextIngredient(Resource):
    @recipe.doc(description="help to find next ingredient")
    @recipe.response(200, 'Success', api.model('ingredients', {'ingredients': fields.List(fields.String(example='milk'))}))
    @recipe.response(400, 'Failure', ErrorMsgModel)
    @recipe.expect(SearchRecipeModel)
    @login_required
    def post(self):

        data = request.get_json()
        data = marshal(data, SearchRecipeModel, skip_none=True)
        db = DB()
        id_list = []
        res = {}

        # get all the recipes
        recipe_list = db.select('recipe_tag_ingredient') \
            .execute()

        # if ingredient list is not null
        # we first select all recipes from the recipe_list where recipe.ingredients >= searched_ingredients
        if 'ingredients' in data.keys():
            recipe_list = list(filter(lambda x: set(x['ingredients'].split(
                ',')) >= set(data['ingredients']), recipe_list))

        # if tags list is not null
        # we then select all recipes from recipe_list where recipe.tags >= searched_tags
        if 'tags' in data.keys():
            recipe_list = list(filter(lambda x: set(
                x['tags'].split(',')) >= set(data['tags']), recipe_list))

        # if blacklist list is not null
        # we then select all recipes from recipes where recipe.tags join blacklist is empty
        if 'tags' in data.keys():
            recipe_list = list(filter(lambda x: set(x['tags'].split(
                ',')).isdisjoint(set(data['blackList'])), recipe_list))

        if not recipe_list:
            return abort(400, message="recipe doesn't exist")

        res = []
        for row in recipe_list:
            temp = list(set(row['ingredients'].split(
                ',')) - set(data['ingredients']))[0]
            res.append(temp)

        db.commit()
        return dict(ingredients=res)


@recipe.route('/suggestion')
class SuggestRecipe(Resource):
    @recipe.doc(description="suggestion recipe")
    @recipe.response(200, 'Success', api.model('ids', {'ids': fields.List(fields.Integer(example=1))}))
    @recipe.response(400, 'Failure', ErrorMsgModel)
    def post(self):
        conn = sqlite3.connect('database.db')
        cur = conn.cursor()
        id_list = []
        db = DB()

        sql_recip_id_top = f'''SELECT id FROM Recipe ORDER BY searched DESC LIMIT 5'''
        cur.execute(sql_recip_id_top)
        r_id_top = cur.fetchall()

        if not r_id_top:
            return abort(400, message="no recipes")

        for row in r_id_top:
            r_id = row[0]
            id_list.append(r_id)
            searched = db.select_one('Recipe').where(
                id=r_id).execute()['searched'] + 1
            db.update("Recipe").set(searched=searched).where(id=r_id).execute()

        db.commit()

        db = DB()
        sql_recip_id_bottom = f'''SELECT id FROM Recipe ORDER BY searched ASC LIMIT 5'''
        cur.execute(sql_recip_id_bottom)
        r_id_bottom = cur.fetchall()

        if not r_id_bottom:
            return abort(400, message="no recipes")

        for row in r_id_bottom:
            r_id = row[0]
            id_list.append(r_id)
            searched = db.select_one('Recipe').where(
                id=r_id).execute()['searched'] + 1
            db.update("Recipe").set(searched=searched).where(id=r_id).execute()

        # recip_id_bottom = db.raw(f'''SELECT id FROM Recipe ORDER BY searched ASC LIMIT 5''')
        # if not recip_id_bottom:
        #     return abort(400, message="no recipes")
        #
        # for row in recip_id_bottom:
        #     r_id = row["id"]
        #     print(r_id)
        #     id_list.append(r_id)
        #     searched = db.select_one('Recipe').where(id=r_id).execute()['searched'] + 1
        #     db.update("Recipe").set(searched=searched).where(id=r_id).execute()

        db.commit()
        conn.close()
        return dict(ids=id_list)
