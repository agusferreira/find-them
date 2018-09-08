import React, {Component} from 'react';

import axios from 'axios';
import {Grid, Row, Col} from 'react-bootstrap';

import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import './styles.scss';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            requests: false
        };

    }

    componentDidMount(){
        this._fetchRequests();
    }

    _fetchRequests = () => {
        let URL = "http://www.mocky.io/v2/5b93873633000052002061e3";
        axios.get(URL)
            .then(response => {
               this.setState({requests: response.data});
            });
    };


    render() {

        let {requests} = this.state;

        return (
            <div>
                <Header />
                <Grid>
                    <Row>
                        {requests && requests.map((request, index) => {
                            return (
                                <Col xs={3}>
                                    <Card key={index} name={request.name} image={request.image}
                                          action={() => this.props.history.push(`detail/${request.contract}/`)}
                                          lastSeenLocation={request.lastSeenLocation}
                                          lastSeenDate={request.lastSeenDate} />
                                </Col>
                            );
                        })}
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default Home;