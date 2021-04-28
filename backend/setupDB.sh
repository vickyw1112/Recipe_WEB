#!/bin/bash
db_file=$1
dummy=$2

if [[ -f "$db_file" ]]
then
    rm "$db_file"
fi

# database.db
sqlite3 "$db_file" < db/schema.sql
if [[ $? -ne 0 ]]
then
    exit 1
fi

echo "$db_file initialised with schema.sql successfully"
./insert_data.py "$db_file"

if [ -n "$(ls -A $dummy 2>/dev/null)" ]
then
    if [[ "$dummy" = "dummy" ]]
    then
        for file in dummy/*.sql
        do
            sqlite3 "$db_file" < "$file" || exit 1
            echo "successfully load $file"
        done
        echo "$db_file loaded with dummy data"
    fi
fi

./insert_recipe.py "$db_file"
