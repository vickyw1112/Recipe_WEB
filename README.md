# COMP3900 Group Project

## Project Initialization

Initialize project as steps show in a [tutorial](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project).
if you don't have there env in local machine, please download:

install Nodejs: https://nodejs.org/en/

install   yarn: npm install -g yarn (A package and project manager for Node.js applications.)

install Python: https://www.python.org/downloads/


## Preject setUp

Backend setup

```shell script
cd backend

# create venv in local environment
python3 -m venv venv

# activate the vitural environment in the backend
source venv/bin/activate

# Install backend dependency
pip3 install -r requirements.txt

# run back-end before
./init_config.sh

# set up database with initial data
python3 scraper.py 244

#setupdatabase
./setupDB.sh database.db

# run back-end
python3 run.py

# deactivate venv
deactivate
```

Frontend setup

```shell script
# Install frontend dependency
yarn install
```

Run commands shortcut

```shell script
# run front-end
yarn start-fd

# run back-end
yarn start-bd

# Run the whole app
yarn start

# if get error below
# socket.error: [Errno 48] Address already in use
kill -9 $(lsof -t -i:5000)
```

## Library dependency

-   For backend
    ```shell script
    pip install -r path/to/requirements.txt
    ```
-   For front end  
    nodejs, yarn, reactstrap, ant-design

## Shared doc

-   [user story](https://docs.google.com/spreadsheets/d/1qSPU-KEQnGpVmDDSivxHypBpjh8esTrcqYm7yF3MPrk/edit#gid=812299105)
-   [project proposal](https://docs.google.com/document/d/1RtghPqgeN_DQ1P-0ZA0ga-XivQWohAAlo604RircTu4/edit#)
-   [project database](https://docs.google.com/document/d/1z_uow2fpJijJQOvk1MSehG06YD3CALLbAlJlMDtUWhg/edit?usp=sharing)
-   [Retrospective](https://docs.google.com/document/d/1OwacGHSDu5soEKpAGqDM-SZqsrttbojkQm1Iq_qPdTo/edit?usp=sharing)
-   [RetroB](https://docs.google.com/document/d/1Fu2RoV33VDY5eA_-zdMSLR9a2O-JJt3YScuUI8OpKz0/edit?usp=sharing)
-   [final Report](https://docs.google.com/document/d/1D2gH69ixrhdPNliHAtXvlHHMustSOKuStBcGKYY9GRc/edit?usp=sharing)
## Resources

-   [TheMeanDB.com](https://www.themealdb.com)
-   [Supercook.com](https://www.supercook.com)
