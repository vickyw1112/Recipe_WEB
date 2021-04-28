# By default, downloads 20 recipes
# To specify the number of recipes to download,
# run `python3 scraper.py NUMBER`
# eg. `python3 scraper.py 500`

import sys
import json
import requests
from tqdm import tqdm  # progress bar

# define the default number of recipes to download
# and use the given number if any
download_total = 244
if len(sys.argv) >= 2:
    try:
        download_total = int(sys.argv[1])
    except ValueError:
        pass

# get recipes by meal id


def download_all_htmls():
    htmls = []
    downloaded_count = 0
    url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
    with tqdm(total=download_total) as pbar:
        current_id = 52764
        while downloaded_count < download_total:
            response = requests.get(url + str(current_id)).text
            response = json.loads(response)
            if response["meals"] is not None:
                htmls.append(response)
                downloaded_count += 1
                pbar.update(1)
            current_id += 1
    return htmls


htmls = download_all_htmls()
meals = []
for item in htmls:
    for key in list(item['meals'][0].keys()):
        if not item['meals'][0].get(key):
            del item['meals'][0][key]
    m = item['meals'][0]
    meals.append(m)

with open("data.json", "w") as f:
    f.write(json.dumps(meals, ensure_ascii=False, indent=4))
