import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

export const Language = ({ country }) => {
    const [languages, setLanguages] = useState([]);

    
    useEffect(
        () => {
            const GET_LANGUAGES = `
query getLangauages { 
countryLanguages(filters: {countrycode: "${country.code}"}) { 
edges{ 
node{ 
countrycode 
language 
isofficial 
percentage
}
}
}
}
`;

            fetch('/graphql?query=' + GET_LANGUAGES).then(res => res.json())
                .then(data => {
                    if (data.data.countryLanguages) {
                        setLanguages(data.data.countryLanguages.edges);
                    }
                });
        }, [country]);
    
    if (!country || country.length === 0) {
        if (languages.length !== 0) {
            setLanguages([]);
        }
        return <div></div>
    }

    let lan_ls = [];
    for (const lan of languages) {
        lan_ls.push(lan.node);
    }

    const columns = [{
        dataField: 'language',
        text: 'Language Name',
        sort: true
    }, {
        dataField: 'isofficial',
        text: 'Official',
        sort: true
    }, {
        dataField: 'percentage',
        text: 'Percentage',
        sort: true
        }];

    const defaultSorted = [{
        dataField: 'percentage',
        order: 'desc'
    }];

    return (
        <div className="App-data-wrap">
            <p>Languages in Use</p>
            <div className="App-table">
                <BootstrapTable wrapperClasses="table-responsive" keyField="language" data={lan_ls} columns={columns} defaultSorted={defaultSorted} striped hover condensed/>
            </div>
        </div>
    )
}