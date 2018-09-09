import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {drizzleConnect} from 'drizzle-react';

import axios from 'axios';
import {Grid, Row, Col} from 'react-bootstrap';

import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import RequestForm from "./components/RequestForm";
import urls from "../../utils/urls";
import {dateFormat} from "../../utils/formatters"

import './styles.scss';

class Home extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            requests: false
        };

    }

    componentDidMount() {
        this._fetchRequests();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!this.props.drizzleStatus.initialized && nextProps.drizzleStatus.initialized) {
            this._fetchSummary();
        }
    }

    _fetchRequests = () => {
        let URL = `${urls.API_ROOT}/api/v1/requests/`;
        axios.get(URL)
            .then(response => {
                this.setState({requests: response.data});
            });
    };

    _fetchSummary = () => {
        let {drizzle} = this.context;
        drizzle.contracts.FindRequestFactory.methods.getSummary().call()
            .then(contractSummary => {
                let contracts = parseInt(contractSummary[2], 10);
                for (let i = 0; i < contracts; i++) {
                    drizzle.contracts.FindRequestFactory.methods
                        .getFindRequest(i).call()
                        .then(rta => {
                            console.log(rta);
                        });
                }
            });
    };



    render() {
        let {requests} = this.state;

        return (
            <div>
                <Header/>
                <div className={"background-img"}>
                    <Grid>
                        <Row>
                            <Col mdOffset={6} md={6} xs={12}>
                                <h1 className={"landing-text"}>WE ARE HERE <br/>TO HELP YOU</h1>
                                <p className={"landing-p"}>Decentralized network to find missing people</p>

                            </Col>
                        </Row>
                    </Grid>
                </div>
                <RequestForm/>
                <Grid>

                    <Row>
                        {requests && requests.map((request, index) => {
                            let name = '';
                            console.log(request);
                            if (request.first_name) name = `${request.first_name} `;
                            if (request.last_name) name = `${name} ${request.last_name}`;

                            return (
                                <Col xs={3} key={index}>
                                    <Card key={index} name={name} image={`${urls.API_ROOT}${request.photo}`}
                                          action={() => this.props.history.push(`detail/${request.contract_deployed_address}/`)}
                                          lastSeenLocation={request.location}
                                          lastSeenDate={dateFormat(request.lost_date)}/>
                                </Col>
                            );
                        })}
                    </Row>
                </Grid>
            </div>
        )

    }

}

Home.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        web3: state.web3,
        drizzleStatus: state.drizzleStatus,
        FindRequestFactory: state.contracts.FindRequestFactory
    }
};

const HomeContainer = drizzleConnect(Home, mapStateToProps);
export default HomeContainer;
