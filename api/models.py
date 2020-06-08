# coding: utf-8
from db import db

class City(db.Model):
    __tablename__ = 'city'

    id = db.Column(db.Integer, primary_key=True, server_default=db.text("nextval('city_id_seq'::regclass)"))
    name = db.Column(db.Text, nullable=False)
    countrycode = db.Column(db.CHAR(3), nullable=False)
    district = db.Column(db.Text, nullable=False)
    population = db.Column(db.Integer, nullable=False)


class Country(db.Model):
    __tablename__ = 'country'
    __table_args__ = (
        db.CheckConstraint("(continent = 'Asia'::text) OR (continent = 'Europe'::text) OR (continent = 'North America'::text) OR (continent = 'Africa'::text) OR (continent = 'Oceania'::text) OR (continent = 'Antarctica'::text) OR (continent = 'South America'::text)"),
    )

    code = db.Column(db.CHAR(3), primary_key=True)
    name = db.Column(db.Text, nullable=False)
    continent = db.Column(db.Text, nullable=False)
    region = db.Column(db.Text, nullable=False)
    surfacearea = db.Column(db.Float, nullable=False)
    indepyear = db.Column(db.SmallInteger)
    population = db.Column(db.Integer, nullable=False)
    lifeexpectancy = db.Column(db.Float)
    gnp = db.Column(db.Numeric(10, 2))
    gnpold = db.Column(db.Numeric(10, 2))
    localname = db.Column(db.Text, nullable=False)
    governmentform = db.Column(db.Text, nullable=False)
    headofstate = db.Column(db.Text)
    capital = db.Column(db.ForeignKey('city.id'))
    code2 = db.Column(db.CHAR(2), nullable=False)

    city = db.relationship('City')


class Countrylanguage(db.Model):
    __tablename__ = 'countrylanguage'

    countrycode = db.Column(db.ForeignKey('country.code'), primary_key=True, nullable=False)
    language = db.Column(db.Text, primary_key=True, nullable=False)
    isofficial = db.Column(db.Boolean, nullable=False)
    percentage = db.Column(db.Float, nullable=False)

    country = db.relationship('Country')
