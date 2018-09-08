import React, {Component} from 'react';

import axios from 'axios';
import {Grid, Row, Col} from 'react-bootstrap';

import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import RequestForm from "./components/RequestForm";
import urls from "../../utils/urls";
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
        let URL = `${urls.API_ROOT}/api/v1/requests/`;
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
                <RequestForm />
                <Grid>
                    <Row>
                        {requests && requests.map((request, index) => {
                            let name = '';
                            if(request.first_name) name = `${request.first_name} `;
                            if(request.last_name) name = `${name} ${request.last_name}`;

                            return (
                                <Col xs={3} key={index}>
                                    <Card key={index} name={name} image={`${urls.API_ROOT}${request.photo}`}
                                          action={() => this.props.history.push(`detail/${request.contract_deployed_address}/`)}
                                          lastSeenLocation={'LOCATION'}
                                          lastSeenDate={request.lost_date} />
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