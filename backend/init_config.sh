#!/bin/bash
if [[ ! -f secrets.py ]]
then
    touch secrets.py
    echo "class Secret(object):" >> secrets.py
    echo "  SECRET_KEY = `python3 -c 'import os; print(os.urandom(16))'`" >> secrets.py
fi
