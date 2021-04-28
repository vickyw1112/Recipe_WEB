from flask_restplus import fields
from app import api

# Sidebars
SidebarDataModel = api.model("SidebarDataModel", {
    "type": fields.String(example="Diary"),
    "ingredients": fields.List(fields.String(example="milk"))
})

SidebarListModel = api.model("SidebarListModel", {
    "sidebarData": fields.List(fields.Nested(SidebarDataModel))
})

AddIngredientModel = api.model("AddIngredientModel", {
    'category': fields.String(example="Diary", required=True),
    'ingredient': fields.String(example="milk", required=True)
})

AddIngredientListModel = api.model('AddIngredientListModel', {
    'ingredients': fields.List(fields.Nested(AddIngredientModel))        
})

RecipeTagModel = api.model("RecipeTagModel", {
    'tag': fields.String(example="lunch", required=True),
    'type': fields.String(example="Meal type", required=True)
})

RecipeIngredientModel = api.model("RecipeIngredientModel", {
    "ingredient": fields.String(example="egg"),
    "amount": fields.String(example="two and half")
})

NewRecipeModel = api.model("NewRecipeModel", {
    'name': fields.String(required=True, example='beef stew'),
    'instruction': fields.String(required=True, example='some very long instruction'),
    'image': fields.String(required=True, example='this is a image path'),
    'tags': fields.List(fields.Nested(RecipeTagModel)),
    'ingredients': fields.List(fields.Nested(RecipeIngredientModel))
})

RecipeDetailModel = api.model("RecipeDetailModel", {
    'id': fields.Integer(),
    'name': fields.String(required=True, example='beef stew'),
    'author_id': fields.Integer(required=True, example=1),
    'instruction': fields.String(required=True, example='some very long instruction'),
    'ingredients': fields.List(fields.Nested(RecipeIngredientModel)),
    'rating': fields.Float(example=7.2),
    'image': fields.String(),
    'tags': fields.List(fields.String(example='Asia'))
})

SearchRecipeModel = api.model("SearchRecipeModel", {
    'ingredients': fields.List(fields.String(example='egg')),
    'tags': fields.List(fields.String(example='Chinese')),
    'blackList': fields.List(fields.String(example='egg'))
})

SignUpModel = api.model("SignUpModel", {
    'name': fields.String(example='Ping Gao'),
    'password': fields.String(example='pinggao123'),
    'email': fields.String(example='ping.gao@soyummy.com')
})

SignInModel = api.model("SignInModel", {
    'password': fields.String(example='ping'),
    'email': fields.String(example='ping@gao.com')
})

UserDashboardModel = api.model("UserDashboardModel", {
    'id': fields.Integer(),
    'name': fields.String(required=True, example='Ping Gao'),
    'email': fields.String(required=True, example='ping@gao.org'),
    'email_interval': fields.String(),
    'allergy': fields.String(),
    'added_ingredient_ids': fields.List(fields.Integer()),
    # 'added_recipe_ids': fields.List(fields.Integer())
})

# Errors
ErrorMsgModel = api.model('Error', {
    'msg': fields.String(example="Invaild request")
})

BookmarkModel = api.model("BookmarkModel", {
    'recipe_id': fields.Integer(require=True),
})

BookmarkListModel = api.model("BookmarkListModel", {
    'recipe_id': fields.Integer(example="1"),
    'name': fields.String(example="beef stew")
})

BookmarkListsModel = api.model("BookmarkListsModel", {
    'recipes': fields.List(fields.Nested(BookmarkListModel))
})

UserEditInfoModel = api.model("UserEditInfoModel", {
    'name': fields.String(example='PingG'),
    'email_interval': fields.String(),
    'allergy': fields.String(),
    'password': fields.String()
})

UserCommentModel = api.model("UserCommentModel", {
    'recipe_id': fields.Integer(require=True, example=1),
    'comment': fields.String(require=True, example="yuck")
})

SuggestRecipeModel = api.model("SuggestRecipeModel", {
    'recipe_id': fields.List(fields.Integer())
})

AllIngredients = api.model("AllIngredients", {
    'ingredients': fields.List(fields.String(example='milk'))
})

tagByType = api.model("tagByType", {
    'type': fields.String(example='Meal type', required=True)
})

tagList = api.model('tagList', {
    'tags': fields.List(fields.String(example='lunch'))
})

Allcategorys = api.model("Allcategorys", {
    'category': fields.List(fields.String(example='diary'))
})
