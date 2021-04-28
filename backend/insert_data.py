#!/usr/bin/env python3
import os
import json
import sqlite3
import sys

if "DB_FILE" not in os.environ:
    if len(sys.argv) < 2:
        exit("Specify DB file")
    else:
        os.environ['DB_FILE'] = sys.argv[1]
os.environ['FLASK_CONFIG'] = 'instance/config.py'


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
        with open("db/ingredients_category.json") as f:
            data = json.load(f)
    except sqlite3.Error:
        print("Warn: db/ingredients_category.json not exist. Import fail.")
        return
    if not data:
        print("Warn: db/ingredients_category.json not exist. Import fail.")
        return

    conn = create_connection('database.db')
    cur = conn.cursor()

    # data read success, start importing
    for key in data:
        sql_insert_ingredients_category = f'''INSERT INTO Category(name) VALUES ('{key}')'''
        cur.execute(sql_insert_ingredients_category)
        conn.commit()
        for ingredients in data[key]:
            sql_select_id = f'''SELECT id from Category where name="{key}"'''
            cur.execute(sql_select_id)
            id = cur.fetchone()[0]
            sql_insert_ingredients = f'''INSERT INTO Ingredient(name, category_id, user_id) VALUES ('{ingredients}','{id}', 1)'''
            try:
                cur.execute(sql_insert_ingredients)
            except sqlite3.Error:
                continue
            else:
                conn.commit()

    # insert users
    # password: ping
    cur.execute("INSERT INTO Users(name,password,email,verified) VALUES ('Ping GAO', 'e60779826a4fcef8549e7d29a0d0fe47189bc81d1325d9743b7c9b0bb55317dd638da2dabb873457a06ba8f0c433592b043ceb04c929d49808c6c46a094748fd', 'ping@gao.com',1)")

    # insert tags
    # new added tags
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Japanese', 'Cuisine')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Snack', 'Meal type')")
    #
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Vegan', 'Diet')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Vegetarian', 'Diet')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Pescatarian', 'Diet')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Gluten free', 'Diet')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Lactose free', 'Diet')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Breads', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Breakfast', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Cakes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Casseroles', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Cookies', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Desserts', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Dinner', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Dips', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Drinks', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Fish recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Grilling & BBQ', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Kid Friendly', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Meat recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Poultry recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Quick & Easy', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Salad Dressings', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Salads', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Sandwiches', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Sauces', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Seafood recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Slow Cooker', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Soups', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Vegetarian recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Vegan recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Gluten free recipes', 'Meal type')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Lactose free recipes', 'Meal type')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Asian', 'Cuisine')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Caribbean', 'Cuisine')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Chinese', 'Cuisine')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('French', 'Cuisine')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('German', 'Cuisine')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Indian & Thai', 'Cuisine')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Italian', 'Cuisine')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Mediterranean', 'Cuisine')")
    # cur.execute("INSERT INTO Tag(name, tag_type) VALUES ('Mexican', 'Cuisine')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('Tex-Mex & Southwest', 'Cuisine')")
    # cur.execute(
    #     "INSERT INTO Tag(name, tag_type) VALUES ('British', 'Cuisine')")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    print("DB:" + os.environ['DB_FILE'])
    import_data()
