import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';


export const Countries = ({ continent, region, onClick }) => {
    const [countries, setCountries] = useState([]);
    let ddl = "";
    

    useEffect(
        () => {
            const GET_COUNTRIES = `
query getCountries {
countries(filters: {continent: "${continent}", region: "${region}"}) {
edges {
node {
code 
name 
continent 
region 
surfacearea 
indepyear 
population 
lifeexpectancy 
gnp 
gnpold 
localname 
governmentform 
headofstate 
capital 
code2
}
}
}
}
`;
            fetch('/graphql?query=' + GET_COUNTRIES).then(res => res.json())
                .then(data => {
                    setCountries(data.data.countries.edges);
                });
        }, [continent, region]);

    ddl = (countries.map(country =>
        <Dropdown.Item key={country.node.code} onClick={() => onClick(country.node)}>
            {country.node.name}
        </Dropdown.Item>
    )
    );
    return (
        <Dropdown className="App-filter">
            <Dropdown.Toggle variant="success" id="country-dropdown">
                Country
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {ddl}
            </Dropdown.Menu>
        </Dropdown>
    )
}