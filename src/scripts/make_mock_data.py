#!/usr/bin/python3
import json
import requests

if __name__ == "__main__":
    with open("data.json") as json_file:
        data = json.load(json_file)
        all = []
        for d in data:
            image = {}
            # print(d["strMeal"])
            url = d["strMealThumb"]
            image_file_name = url.split('/')[-1]
            # print(image_file_name)
            image["image_file_name"] = image_file_name
            image["meal_name"] = d["strMeal"]
            # r = requests.get(url, allow_redirects=True)
            # open(image_file_name, 'wb').write(r.content)
            all.append(image)
    print(json.dumps(all))
    with open('image.json', 'w') as f:
        json.dump(all, f)
