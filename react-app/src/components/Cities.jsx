import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { AddCityForm } from './CityForm';
import ReactDOM from 'react-dom';

export const Cities = ({ country }) => {
    const [cities, setCities] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [mutationTime, setMutationTime] = useState(false);

    // get cities from api
    useEffect(
        () => {
            const GET_CITIES = `
query getCities {
cities(filters: {countrycode: "${country.code}"}) {
edges {
node {
id 
name 
countrycode 
district 
population 
}
}
}
}

`;

            fetch('/graphql?query=' + GET_CITIES).then(res => res.json())
                .then(data => {
                    if (data.data.cities) {
                        setCities(data.data.cities.edges);
                    }
                });
        }, [country, mutationTime]);


    // if there is no city in list, return empty div
    if (!country || country.length === 0) {
        if (cities.length !== 0) {
            setCities([]);
        }
        return <div></div>
    }

    // otherwise, make list of jsons of city attributes
    // this is necessary to use BootstrapTable
    let city_ls = [];
    for (const city of cities) {
        city_ls.push(city.node);
    }

    // data table headers
    const columns = [{
        dataField: 'name',
        text: 'City Name',
            sort: true,
            filter: textFilter()
    }, {
        dataField: 'district',
        text: 'District',
            sort: true,
            filter: textFilter()
    }, {
        dataField: 'population',
        text: 'Population',
        sort: true
    }];

    // content in expanded row area
    const expandRow = {
        renderer: row => (
            <div>
                <div className="App-data-buttons">
                    <Button variant="success" id={row.id + "-edit"} onClick={() => onEditBtnClick(row)}><FaPencilAlt /> Edit City</Button>
                    <Button variant="secondary" id={row.id + "-delete"} onClick={() => onDeleteBtnClick(row.id)}><FaTrashAlt /> Delete City</Button>
                </div>
                <div id={row.id + "-edit-form"} className="city-edit-form"></div>
                <div>
                    <div id={row.id + "-msg"}></div>
                </div>
            </div>
        ),
        showExpandColumn: true
    };

    // display/hide add city form
    function onAddBtnClick() {
        setAddShow(!addShow);
    }

    // display/hide edit city form
    function onEditBtnClick(row) {
        if (document.getElementById(row.id + "-edit-form").innerHTML === "") {
            ReactDOM.render(<AddCityForm city={row} onClickReload={reload} />, document.getElementById(row.id + "-edit-form"));
        } else {
            ReactDOM.render("", document.getElementById(row.id + "-edit-form"));
        }
    }

    // reload table after add/edit/delete
    function reload() {
        setMutationTime(Date.now());
    }

    // action for deletion
    function onDeleteBtnClick(id) {
        const decoded_id = window.atob(id);
        const id_ls = decoded_id.split(":");
        const DELETE_CITY = `
mutation deleteCity {
deleteCity(id: "${id_ls[1]}") {
status 
}
}`;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: DELETE_CITY })
        };

        fetch('/graphql', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.data.deleteCity.status != "OK") {
                    const msg = (
                        <div>System failed to remove the city({data.errors}).</div>
                    );
                    ReactDOM.render(msg, document.getElementById(id + '-msg'));

                    setTimeout(function () {
                        ReactDOM.render("", document.getElementById(id + '-msg'));
                    }, 3000);
                } else {
                    reload();
                }
            });
    }


    return (
        <div className="App-data-wrap">
            <p>Cities in Country</p>
            <div>
                <Button variant="success" className="App-button" onClick={() => onAddBtnClick()}>Add City</Button>
                {<AddCityForm show={addShow} countryCode={country.code} onClickReload={reload} />}
                </div>
            <div className="App-table">
                <BootstrapTable wrapperClasses="table-responsive" keyField="id" data={city_ls} columns={columns} filter={filterFactory()} expandRow={expandRow} pagination={paginationFactory()} striped hover condensed />
            </div>
        </div>
    )
}