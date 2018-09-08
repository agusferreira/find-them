import React, {Component} from 'react';

import {Grid, Row, Col} from "react-bootstrap";

import './styles.scss';
import Button from "../../../../components/button/Button";

class BasicDetails extends Component {

    render() {
        return (
            <div className={"details-basics-section"}>
                <Grid>
                    <Row>
                        <Col xs={6} className={"data"}>
                            <h2 className={"username"}>John Doe</h2>
                        </Col>
                        <Col xs={6}>
                            <Button>Give a Hint</Button>
                            <Button>Donate</Button>

                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} className={"data"}>
                            <p><b>Age: </b> 12 years</p>
                            <p><b>Location: </b> Görlitzer Park, Berlin</p>
                            <p><b>Date: </b> 07/09/2018 </p>
                            <p><b>Email: </b> john.doe@gmail.com</p>
                            <p><b>Description: </b> 1.80m, dark hair, blue eyes</p>
                            <p><b>Incentive: </b> 12 euros</p>
                        </Col>


                    </Row>
                </Grid>
            </div>
        )

    }

}

export default BasicDetails;