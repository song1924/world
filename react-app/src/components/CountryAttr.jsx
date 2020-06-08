import React from 'react';
import { Table } from 'react-bootstrap';


export const CountryAttr = ({ country }) => {
    if (!country || country.length === 0) {
        return <div></div>
    }

    return (
        <div className="App-data-wrap">
        <Table striped bordered hover className="App-table" responsive>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Surface Area</th>
                    <th>Independence Year</th>
                    <th>Population</th>
                    <th>Life Expectancy</th>
                    <th>GNP</th>
                    <th>GNP(old)</th>
                    <th>Local Name</th>
                    <th>Government Form</th>
                    <th>Head of State</th>
                    <th>Capital</th>
                    <th>Code2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th className="App-table-body">{country.code}</th>
                    <th className="App-table-body">{country.name}</th>
                    <th className="App-table-body">{country.surfacearea}</th>
                    <th className="App-table-body">{country.indepyear}</th>
                    <th className="App-table-body">{country.population}</th>
                    <th className="App-table-body">{country.lifeexpectancy}</th>
                    <th className="App-table-body">{country.gnp}</th>
                    <th className="App-table-body">{country.gnpold}</th>
                    <th className="App-table-body">{country.localname}</th>
                    <th className="App-table-body">{country.governmentform}</th>
                    <th className="App-table-body">{country.headofstate}</th>
                    <th className="App-table-body">{country.capital}</th>
                    <th className="App-table-body">{country.code2}</th>
                </tr>
            </tbody>
            </Table>
            </div>
    )
}