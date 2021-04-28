CREATE TABLE Users
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT                                  NOT NULL,
    password       TEXT                                  NOT NULL,
    -- even provide a default value still need the not null constraint
    -- i checked stackoverflow, it is the valid syntax
    verified    INTEGER CHECK (verified IN (1, 0)) NOT NULL           DEFAULT 0,
    -- ED -> every day, EW -> every week, EM -> every month, may change in later, OFF is never
    email_interval TEXT CHECK (email_interval IN ('ED', 'EW', 'EM', 'OFF')) DEFAULT 'OFF',
    email          TEXT                                  NOT NULL UNIQUE,
    allergy        TEXT                                                     DEFAULT ''
);

CREATE TABLE UserBookmarkedRecipe
(
    user_id   INTEGER,
    recipe_id INTEGER,
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id),
    FOREIGN KEY (user_id) REFERENCES Users (id)
);

CREATE TABLE Recipe
(
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id          INTEGER NOT NULL DEFAULT 1,
    -- rating here is the overall mean of all the user rating
    rating             REAl    NOT NULL DEFAULT 0,
    -- base64 encoded image
    image              TEXT,
    name               TEXT    NOT NULL,
    --recipeCuisine TEXT,
    --recipeCategory TEXT,
    --recipeIngredients TEXT NOT NULL,
    recipeInstructions TEXT    NOT NULL,

    -- the number of time this recipe being searched,
    -- every time this recipe is searched,
    -- or as a recommended recipe send to a user,
    -- the number increase by one
    searched           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES Users (id)
);

CREATE TABLE Tag
(
    id       INTEGER PRIMARY KEY,
    name     TEXT NOT NULL UNIQUE,
    -- refer to the sample website, may add more later
    tag_type TEXT CHECK (tag_type IN ('Cuisine', 'Meal type', 'Diet', 'Others'))
);

CREATE TABLE RecipeTag
(
    recipe_id INTEGER,
    tag_id    INTEGER,
    PRIMARY KEY (recipe_id, tag_id) ON CONFLICT REPLACE,
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id),
    FOREIGN KEY (tag_id) REFERENCES Tag (id)
    -- one recipe can't have the same tag mutiple time
);

CREATE TABLE Ingredient
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    category_id INTEGER,
    user_id     INTEGER,
    FOREIGN KEY (category_id) REFERENCES Category (id),
    FOREIGN KEY (user_id) REFERENCES Users (id)
);

CREATE TABLE RecipeIngredient
(
    ingredient_id INTEGER,
    recipe_id     INTEGER,
    amount        TEXT,
    PRIMARY KEY (ingredient_id, recipe_id) ON CONFLICT REPLACE,
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id)
);

CREATE TABLE Category
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE email_verification
(
    user_id INTEGER,
    token TEXT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


CREATE TABLE UserRecipeComment
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER,
    recipe_id INTEGER,
    comment   TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id),
    FOREIGN KEY (user_id) REFERENCES Users (id)
);

CREATE VIEW ingredient_with_category
AS
SELECT c.name AS category, group_concat(i.name) AS ingredients
FROM Category c,
     Ingredient i
WHERE c.id = i.category_id
GROUP BY c.name;


CREATE VIEW ingredientName_amount_recipe
AS
SELECT r.recipe_id AS recipe_id, r.amount AS amount, i.name as name
FROM RecipeIngredient r,
     Ingredient i
WHERE r.ingredient_id = i.id;

CREATE VIEW recipe_with_tags(recipe_id, tags)
AS
SELECT rt.recipe_id, group_concat(t.name)
FROM RecipeTag rt,
     Tag t
WHERE rt.tag_id = t.id
GROUP BY rt.recipe_id;

CREATE VIEW recipe_with_ingredients(recipe_id, ingredients)
AS
SELECT ri.recipe_id, group_concat(i.name)
FROM RecipeIngredient ri,
     Ingredient i
WHERE ri.ingredient_id = i.id
GROUP BY ri.recipe_id;

CREATE VIEW recipe_tag_ingredient
AS
SELECT *
FROM recipe_with_tags rt,
     recipe_with_ingredients ri
WHERE rt.recipe_id = ri.recipe_id;

CREATE VIEW bookmark_recipe
AS
SELECT user_id, recipe_id, name
FROM UserBookmarkedRecipe ubr,
     Recipe re
WHERE ubr.recipe_id = re.id;





