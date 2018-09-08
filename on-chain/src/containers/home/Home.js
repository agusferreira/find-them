import React, {Component} from 'react';

import {Grid, Row, Col} from 'react-bootstrap';

import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import './styles.scss';

class Home extends Component {

    render() {

        return (
            <div>
                <Header />
                <h1>
                    FIND THEM
                </h1>

                <Grid>
                    <Row>
                        <Col xs={3}>
                            <Card />
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default Home;