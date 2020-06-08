import React, { useState } from 'react';
import './App.css';
import { Continents } from './components/Continents';
import 'bootstrap/dist/css/bootstrap.css';
import { Regions } from './components/Regions';
import { Countries } from './components/Countries';
import { CountryAttr } from './components/CountryAttr';
import { Language } from './components/Language';
import { Cities } from './components/Cities';

function App() {
    const [continent, setContinent] = useState([]);
    const [region, setRegion] = useState([]);
    const [country, setCountry] = useState([]);
    const [selectedString, setSelectedString] = useState("");


    function onContinentClick(cont) {
        setRegion([]);
        setCountry([]);
        setContinent(cont);
        setSelectedString(cont)
    }


    function onRegionClick(reg) {
        setCountry([]);
        setRegion(reg);
        let selectedString_ls = selectedString.split(" > ");
        setSelectedString(selectedString_ls[0] + " > " + reg);
    }


    function onCountryClick(country) {
        setCountry(country);
        let selectedString_ls = selectedString.split(" > ");
        setSelectedString(selectedString_ls[0] + " > " + selectedString_ls[1] + " > " + country.name)
    }

    
    return (
        <div className="App App-header">
            <h1>World Database</h1>
            <div className="App-filters">
                <Continents onClick={onContinentClick} />
                <Regions continent={continent} onClick={onRegionClick} />
                <Countries continent={continent} region={region} onClick={onCountryClick} />
            </div>
            <p>{selectedString}</p>
            <div className="App-data">
                <CountryAttr country={country} />
                <Language country={country} />
                <Cities country={country} />
            </div>
        </div>
    );
}

export default App;
