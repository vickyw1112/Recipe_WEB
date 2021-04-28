#!/usr/bin/env python3
import os
import json
import sqlite3
import sys
import re

# if "DB_FILE" not in os.environ:
#     if len(sys.argv) < 2:
#         exit("Specify DB file")
#     else:
os.environ['DB_FILE'] = 'database.db'
os.environ['FLASK_CONFIG'] = 'instance/config.py'

tag_dict = {}
cuisine = ['Turkish', 'Greek', 'Mexican', 'British', 'Dutch', 'Italian', 'Japanese', 'Thai', 'French', 'Canadian',
           'Vietnamese', 'Russian', 'Spanish', 'Moroccan', 'Jamaican', 'Chinese', 'Egyptian', 'Tunisian', 'Polish',
           'Kenyan', 'Irish', 'Indian', 'American', 'Malaysian']
diet = ['Seafood', 'Shellfish', 'Chicken', 'Cheasy', 'Meat', 'Alcoholic', 'Fruity', 'Lamb', 'Beef', 'Vegetarian',
        'Fish', 'Vegan', 'Chocolate', 'Sweet', 'Dairy', 'UnHealthy', 'Calorific', 'Nutty', 'Pork', 'Light',
        'LowCalorie', 'Egg', 'Greasy', 'heavy', 'Caramel', 'Vegetables', 'StrongFlavor', 'Heavy', 'Paleo', 'Keto',
        'HighFat', 'LowCarbs', 'Salad', 'Goat']
meal_type = ['Dessert', 'Baking', 'Snack', 'Breakfast', 'Lunch', 'Dinner', 'Starter', 'Brunch', 'MainMeal', 'SideDish',
             'BBQ', 'Side', 'Soup']
others = ['Casserole', 'Tart', 'Pasta', 'Curry', 'DateNight', 'Cake', 'Desert', 'Pudding', 'Savory', 'Stew', 'Pulse',
          'Treat', 'Speciality', 'Spicy', 'Pie', 'Miscellaneous', 'HangoverFood', 'Bun', 'Mild', 'Halloween', 'Sour',
          'Chilli', 'Summer', 'DinnerParty', 'Glazed', 'Warm', 'Expensive', 'Paella', 'Easter', 'Fusion', 'Sandwich',
          'Christmas']
tag_dict['Cuisine'] = cuisine
tag_dict['Diet'] = diet
tag_dict['Meal type'] = meal_type
tag_dict['Others'] = others


def get_ingredient_id(name, cur):
    name = name.lower().replace("es",'').replace('s','')
    flag = False
    id = None
    while (not flag):
        # using name to search
        sql_select_ingredient_id = f'''SELECT id from Ingredient where name like "%{name}%"'''
        cur.execute(sql_select_ingredient_id)
        curfetchone = cur.fetchone()
        if curfetchone:
            id = curfetchone[0]
            flag = True
        # if not found
        # if name is not a single word (example: "king prawn")
        # split name by ' ', and use its elements to search
        else:
            if ' ' in name:
                tmp_list = name.split(' ')
                for word in tmp_list:
                    sql_select_ingredient_id = f'''SELECT id from Ingredient where name="{word}"'''
                    cur.execute(sql_select_ingredient_id)
                    sub_fetchone = cur.fetchone()
                    if sub_fetchone:
                        id = sub_fetchone[0]
                        flag = True
                        break
                break
            else:
                break
    return id


def get_tag_type(tag):
    tag_type = ''
    for key in tag_dict.keys():
        if tag in tag_dict[key]:
            tag_type = key
            break
    return tag_type


def database_update(recipe_name, instruction, tags, ingredients, image, cur, conn):
    # update Recipe table
    instruction = instruction.replace('"','')
    sql_insert_recipe = f'''INSERT INTO Recipe(name, recipeInstructions, image) VALUES("{recipe_name}", "{instruction}", "{image}")'''
    cur.execute(sql_insert_recipe)
    conn.commit()
    # get the recipe_id
    sql_select_r_id = f'''SELECT id from Recipe where name="{recipe_name}"'''
    cur.execute(sql_select_r_id)
    r_id = cur.fetchone()[0]
    # deal with tags
    for tag in tags:
        # try to get t_id
        tag = tag.replace(' recipes','')
        sql_select_t_id = f'''SELECT id from Tag where name like "%{tag}%"'''
        cur.execute(sql_select_t_id)
        curfetchone = cur.fetchone()
        # if tag does not exist
        # insert tag into tag table
        if not curfetchone:
            t_type = get_tag_type(tag)
            tag = tag.replace(' recipes','')
            sql_insert_tag = f'''INSERT INTO Tag(name, tag_type) VALUES('{tag}', '{t_type}') '''
            cur.execute(sql_insert_tag)
            conn.commit()
            # get tag_id again
            sql_select_t_id = f'''SELECT id from Tag where name like"%{tag}%"'''
            cur.execute(sql_select_t_id)
            curfetchone = cur.fetchone()
        t_id = curfetchone[0]

    sql_insert_r_t = f'''INSERT INTO RecipeTag(recipe_id, tag_id) VALUES("{r_id}", "{t_id}")'''
    cur.execute(sql_insert_r_t)
    conn.commit()
    # deal with ingredients
    # if not match any ingredient we drop the ingredient
    for ingredient in ingredients:
        # get ingredient name , amount and id
        i_name = list(ingredient.keys())[0]
        i_amount = ingredient[i_name]
        i_id = get_ingredient_id(i_name, cur)
        # if ingredient match a record in the db
        # insert a new record into the recipe_ingredient table
        if i_id:
            sql_insert_r_i = f'''INSERT INTO RecipeIngredient(ingredient_id, recipe_id, amount) VALUES("{i_id}", "{r_id}", "{i_amount}"); '''
            cur.execute(sql_insert_r_i)
            conn.commit()


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except sqlite3.Error as e:
        print(e)
    return conn


def import_data():
    data = None
    try:
        with  open('db/data.json', 'r') as f:
            data = json.load(f)
    except sqlite3.Error:
        print("Warn: db/ingredients_category.json not exist. Import fail.")
        return
    if not data:
        print("Warn: db/ingredients_category.json not exist. Import fail.")
        return

    conn = create_connection('database.db')
    cur = conn.cursor()

    for item in data:
        tags = []
        ingredient = []
        recipe_name = ''
        instruction = ''
        tmp_ingredient = {}
        tmp_amount = {}
        image = ''

        # deal with data
        for keys in item:
            # get recipe_name
            if keys == 'strMeal':
                recipe_name = item[keys]
            # get all tags
            if keys == 'strCategory' or keys == 'strArea' or keys == "strTags":
                if item[keys] != "Unknown" and item[keys] != '':
                    if ',' in item[keys]:
                        tmp_list = item[keys].split(',')
                        tags.extend(tmp_list)
                    else:
                        tags.append(item[keys])

            # get instruction
            if keys == 'strInstructions':
                instruction = item[keys]
            # get ingredient
            if 'strIngredient' in keys:
                number = keys[13:]
                tmp_ingredient[number] = item[keys]
            # get amount
            if 'Measure' in keys:
                number = keys[10:]
                tmp_amount[number] = item[keys]
            # get the image
            if 'strMealThumb' in keys:
                image = item[keys]

        # get ingredient amount pair
        for keys in tmp_ingredient:
            pair = {}
            if keys in tmp_amount:
                if tmp_amount[keys] is not None:
                    pair[tmp_ingredient[keys]] = tmp_amount[keys]
                else:
                    pair[tmp_ingredient[keys]] = ''
                ingredient.append(pair)

        database_update(recipe_name, instruction, tags, ingredient, image, cur, conn)
    conn.close()


if __name__ == "__main__":
    # print("DB:" + os.environ['DB_FILE'])
    import_data()


