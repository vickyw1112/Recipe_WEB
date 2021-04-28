# import xml.etree.ElementTree as ET
#
# tree = ET.parse('raw_category_data.xml')
# root = tree.getroot()
#
# for child in root:
#     element = child.find('[v-pane-header]').text
#     print(element)
#     print(element.tag, element.attrib)


from bs4 import BeautifulSoup

with open('raw_category_data.xml') as f:
    soup = BeautifulSoup(f.read())

data = dict()

categories = soup.find_all('ul')
for category in categories:
    category_name = category.h1.div
    category_ingredients = category.h2.div.find_all('h3')
    # print(category_name)
    # print(category_ingredients.prettify())
    ingredients = []
    for ingredient in category_ingredients:
        ingredient_label = ingredient.find("div", {"class": "md-label"})
        ingredient_name = ingredient_label.text
        ingredients.append(ingredient_name)
    data[category_name] = ingredients

with open("ingredients_category.json", "w") as f:
    f.write(str(data))
