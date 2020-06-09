import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';


export const Regions = ({ continent, onClick }) => {
    const [regions, setRegions] = useState([]);

    useEffect(
        () => {
            fetch('/regions/' + continent).then(res => res.json())
                .then(data => {
                    if (data.regions) {
                        setRegions(data.regions);
                    }
                });
        }, [continent]);

    return (
        <Dropdown className="App-filter">
            <Dropdown.Toggle variant="success" id="region-dropdown">
                Region
                </Dropdown.Toggle>
            <Dropdown.Menu>
                {regions.map(reg =>
                    <Dropdown.Item key={reg} onClick={() => onClick(reg)}>
                        {reg}
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}