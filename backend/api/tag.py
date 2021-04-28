import sqlite3
from app import api, app
from flask_restplus import Resource, abort, fields, marshal
from flask import request, jsonify
from model import *
from utils.db import *
from flask_login import login_required

tag = api.namespace('tag', descriptions='tags stuff')


@tag.route('/gettag')
class tagList(Resource):
    @tag.doc(description="get tag by type")
    @tag.expect(tagByType)
    @tag.response(400, 'Failure', ErrorMsgModel)
    @tag.response(200, 'Success', tagList)
    @login_required
    def post(self):
        print('hhhhh')
        db = DB()
        data = request.get_json()
        data = marshal(data, tagByType, skip_none=True)
        res = []
        tags = db.select('Tag').where(tag_type=data['type']).execute()
        if not tags:
            return abort(400, message='not tags')
        for row in tags:
            res.append(row['name'])
        db.commit()
        return dict(tags=res)
