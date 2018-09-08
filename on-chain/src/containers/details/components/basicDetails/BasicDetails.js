import React, {Component} from 'react';

import {Grid, Row, Col} from "react-bootstrap";

import './styles.scss';
import Button from "../../../../components/button/Button";
import Header from "../../../../components/header/Header";
import avatar from '../../../../assets/waldo2.jpg';


class BasicDetails extends Component {

    render() {
        return (
            <div className={"details-basics-section"}>
                <Header/>
                <Grid>
                    <Row>
                        <Col xs={6} className={"data"}>
                            <h2 className={"username"}>Waldo Perez</h2>
                        </Col>
                        <Col xs={6} style={{marginTop:25}}>
                            <Button className={"blue-full"}>Give a Hint</Button>
                            <Button className={"blue-full"}>Donate</Button>

                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} className={"data"}>
                            <img src={avatar} alt={"Usuario"} className={"avatar-icon"} />
                            <p><b>Age: </b> 12 years</p>
                            <p><b>Location: </b> Görlitzer Park, Berlin</p>
                            <p><b>Date: </b> 07/09/2018 </p>
                            <p><b>Email: </b> john.doe@gmail.com</p>
                            <p><b>Description: </b> 1.80m, dark hair, blue eyes</p>
                            <p><b>Incentive: </b> 12 ETH</p>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default BasicDetails;