import React, { useState, useEffect, useRef } from 'react';
import { From, Button, Form, Col } from 'react-bootstrap';

export const AddCityForm = ({ show, onClickReload, city, countryCode }) => {
    const [validated, setValidated] = useState(false);
    const [mode, setMode] = useState("add");
    const [responseMessage, setResponseMessage] = useState("");
    const [formName, setFormName] = useState(<Form.Control className="mb-4" type="text" placeholder="City Name" required />);
    const [formDistrict, setFormDistrict] = useState(<Form.Control className="mb-4" type="text" placeholder="District" required />);
    const [formPopulation, setFormPopulation] = useState(<Form.Control className="mb-4" type="number" placeholder="Population" required />);
    const formRef = useRef(null);

    // set variables depending on add/edit mode.
    // if city object is passed, it means it is in edit mode.
    useEffect(
        () => {
            if (city) {
                setFormName(<Form.Control className="mb-4" type="text" placeholder="City Name" defaultValue={city.name} required />);
                setFormDistrict(<Form.Control className="mb-4" type="text" placeholder="District" defaultValue={city.district} required />);
                setFormPopulation(<Form.Control className="mb-4" type="number" placeholder="Population" defaultValue={city.population} required />);
                setMode("edit");
            } 
        }, [show]);


    // action for handling edit/add city form
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        let query = "";
        let cityName = event.target.formName.value;
        let cityDistrict = event.target.formDistrict.value;
        let cityPopulation = event.target.formPopulation.value;
        event.preventDefault();

        // if form didn't pass the requirement, stop the process.
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        // set query input values
       
        if (city) {
            const decoded_id = window.atob(city.id);
            const id_ls = decoded_id.split(":");

            query = `
mutation editCity {
updateCity(id: ${id_ls[1]}, name: "${cityName}", countrycode: "${city.countrycode}", district: "${cityDistrict}", population: ${cityPopulation}) {
city {
id 
name 
countrycode 
district 
population
}
}
}
`;
        } else {
            query = `
mutation addCity {
createCity(name: "${cityName}", countrycode: "${countryCode}", district: "${cityDistrict}", population: ${cityPopulation}) {
city {
id 
name 
countrycode 
district 
population
}
}
}

`;
        }

        // set post request options to api
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        };

        // send post request and display the response message
        fetch('/graphql', requestOptions)
            .then(response => response.json())
            .then(data => {
                if ("errors" in data) {
                    setResponseMessage("System failed to " + mode + " city. (" + data.errors + ")");
                } else {
                    onClickReload();
                    if (mode == "add") {
                        formRef.current.reset();
                        setResponseMessage(data.data.createCity.city.name + " is created.");
                    } else {
                        setResponseMessage("The city information has changed.");
                    }

                    setTimeout(function () {
                        setResponseMessage("");
                    }, 3000);
                }
            });
        setValidated(false);
        }

    // if only show variable is true, show the form.
    if (mode == "add" && !show) {
        return <div></div>
    }

    return (
        <div>
            <Form inline noValidate validated={validated} onSubmit={handleSubmit} style={{ width: "100%" }} ref={formRef}>
                <Form.Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Group controlId="formName">
                            {formName}
                        </Form.Group>
                    </Col>
                    <Col xs="auto">
                        <Form.Group controlId="formDistrict">
                            {formDistrict}
                        </Form.Group>
                    </Col>
                    <Col xs="auto">
                        <Form.Group controlId="formPopulation">
                            {formPopulation}
                        </Form.Group>
                    </Col>
                    <Col xs="auto">
                        <Button className="mb-4" variant="success" type="submit">
                            Submit
                    </Button>
                    </Col>
                </Form.Row>
            </Form>
            <p>{responseMessage}</p>
        </div>
    )
}