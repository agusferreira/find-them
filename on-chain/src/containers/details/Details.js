import React, {Component} from 'react';

import './style.scss';
import BasicDetails from "./components/basicDetails/BasicDetails";

class Details extends Component {

    render() {

        return (
            <div className={"details-section"}>
                <BasicDetails name={"Waldo Perez"} age={"12 years old"} location={"Görlitzer Park, Berlin"}
                              date={"07/09/2018"} contact={"john.doe@gmail.com"} description={"1.80m, dark hair, blue eyes"}
                              incentive={"12 ETH"}/>


            </div>
        )

    }

}

export default Details;