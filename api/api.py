from dotenv import load_dotenv

load_dotenv()

import os
import ast
from flask_graphql import GraphQLView
from flask import Flask, jsonify, request

# app initialization
app = Flask(__name__)

# configs
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from db import db

db.init_app(app)

import models

from schema import schema, City, Country, Countrylanguage

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True # for having the GraphiQL interface
    )
)


@app.route('/continents')
def continents():
    continents = []

    f_country = Country.query.with_entities(Country.continent).first()
    while f_country:
        continents.append(f_country.continent)
        f_country = Country.query\
            .with_entities(Country.continent)\
            .filter(Country.continent.notin_(continents))\
            .first()

    return jsonify({"continents": continents})


@app.route('/regions/<continent>')
def regions(continent):
    regions = []
    
    f_country = Country.query\
        .with_entities(Country.region)\
        .filter_by(continent=continent)\
        .first()

    while f_country:
        regions.append(f_country.region)
        f_country = Country.query\
            .with_entities(Country.region)\
            .filter(Country.continent == continent, Country.region.notin_(regions))\
            .first()

    return jsonify({"regions": regions})

