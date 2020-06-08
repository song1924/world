import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from graphene_sqlalchemy_filter import FilterableConnectionField, FilterSet
from models import City, Country, Countrylanguage
from db import db
import sys


class CityObj(SQLAlchemyObjectType):
    class Meta:
        model = City
        filter_fields = ['countrycode']
        interfaces = (graphene.relay.Node, )


class CountryObj(SQLAlchemyObjectType):
    class Meta:
        model = Country
        interfaces = (graphene.relay.Node, )


class CountrylanguageObj(SQLAlchemyObjectType):
    class Meta:
        model = Countrylanguage
        interfaces = (graphene.relay.Node, )


class CountryFilter(FilterSet):
    class Meta:
        model = Country
        fields = {
            'code': [...],
            'name': [...],
            'continent': [...],
            'region': [...],
            'surfacearea': [...],
            'indepyear': [...],
            'population': [...],
            'lifeexpectancy': [...],
            'gnp': [...],
            'gnpold': [...],
            'localname': [...],
            'governmentform': [...],
            'headofstate': [...],
            'capital': [...],
            'code2': [...]
            }


class CityFilter(FilterSet):
    class Meta:
        model = City
        fields = {
            'id': [...],
            'name': [...],
            'countrycode': [...],
            'district': [...],
            'popluation': [...]
            }


class CountryLanguageFilter(FilterSet):
    class Meta:
        model = Countrylanguage
        fields = {
            'language': [...],
            'countrycode': [...],
            'isofficial': [...],
            'percentage': [...]
            }


class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()

    countries = FilterableConnectionField(CountryObj.connection, filters=CountryFilter())
    cities = FilterableConnectionField(CityObj.connection, filters=CityFilter())
    country_languages = FilterableConnectionField(CountrylanguageObj.connection, filters=CountryLanguageFilter())


class CreateCity(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        countrycode = graphene.String(required=True)
        district = graphene.String(required=True)
        population = graphene.Int(required=True)

    city = graphene.Field(lambda: CityObj)

    def mutate(self, info, **kwargs):
        city = City(name=kwargs.get('name'), countrycode=kwargs.get('countrycode'), district=kwargs.get('district'), population=kwargs.get('population'))

        db.session.add(city)
        db.session.commit()

        return CreateCity(city=city)


class UpdateCity(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(required=True)
        countrycode = graphene.String(required=True)
        district = graphene.String(required=True)
        population = graphene.Int(required=True)

    city = graphene.Field(lambda: CityObj)

    def mutate(self, info, **kwargs):
        cities = City.query.filter_by(id=kwargs.get('id'))
        
        if cities:
            city = cities.first()
        
            if city.name != kwargs.get('name'):
                city.name = kwargs.get('name')
            if city.countrycode != kwargs.get('countrycode'):
                city.countrycode = kwargs.get('countrycode')
            if city.district != kwargs.get('district'):
                city.district = kwargs.get('district')
            if city.population != kwargs.get('population'):
                city.population = kwargs.get('population')

            db.session.commit()
            return UpdateCity(city=city)


class DeleteCity(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    status = graphene.String()

    def mutate(self, info, **kwargs):
        city = City.query.filter_by(id=kwargs.get('id')).first()

        try:
            db.session.delete(city)
            db.session.commit()
            return DeleteCity(status="OK")
        except:
            return DeleteCity(status="FAILED")
        

class Mutation(graphene.ObjectType):
    create_city = CreateCity.Field()
    update_city = UpdateCity.Field()
    delete_city = DeleteCity.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
