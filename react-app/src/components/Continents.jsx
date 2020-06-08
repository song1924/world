import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';


export const Continents = ({ onClick }) => {
    const [continents, setContinents] = useState([]);

    useEffect(
        () => {
            fetch('/continents').then(res => res.json()).then(data => {
                setContinents(data.continents);
            });
        }, []);

    return (
        <Dropdown className="App-filter" >
            <Dropdown.Toggle variant="success" id="continent-dropdown">
                Continent
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {continents.map(cont =>
                    <Dropdown.Item key={cont} onClick={() => onClick(cont)}>
                        {cont}
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}