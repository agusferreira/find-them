import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import axios from 'axios';
import {Grid, Row, Col} from 'react-bootstrap';

import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import RequestForm from "./components/RequestForm";
import GoToRequest from "./components/GoToRequest";
import Loading from "../../components/loading/Loading";
import urls from "../../utils/urls";
import './styles.scss';

class Home extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            requests: false,
            showForm: true,
            account: '',
            activeRequest: '',
        };

    }

    componentDidMount(){
        this._fetchRequests();
        if(this.props.drizzleStatus.initialized){
            this._checkAccount();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(!this.props.drizzleStatus.initialized && nextProps.drizzleStatus.initialized){
            this._checkAccount();
        }
    }

    _checkAccount = async () => {
        let {drizzle} = this.context;
        const accounts = await drizzle.web3.eth.getAccounts();
        if(accounts){
            let account = accounts[0];
            this.setState({account}, this._fetchRequests);
        }
    };

    _fetchRequests = () => {
        let URL = `${urls.API_ROOT}/api/v1/requests/`;
        axios.get(URL)
            .then(response => {
                let requests = response.data;
                let showForm = true;
                let activeRequest = '';
                if(this.state.account){
                    let active = requests.find(each => each.creator_address.toString().toUpperCase() === this.state.account.toString().toUpperCase());
                    if(active){
                        showForm = false;
                        activeRequest = active.contract_deployed_address;
                    }
                }
                this.setState({requests, showForm, activeRequest});
            });
    };

    _fetchSummary = () => {
        let {drizzle} = this.context;
        drizzle.contracts.FindRequestFactory.methods.getSummary().call()
            .then(contractSummary => {
                let contracts = parseInt(contractSummary[2], 10);
                for(let i = 0; i < contracts; i++){
                    drizzle.contracts.FindRequestFactory.methods
                        .getFindRequest(i).call()
                        .then(rta => {
                            console.log(rta);
                        });
                }
            });
    };

    render() {
        let {requests, showForm, activeRequest} = this.state;
        return (
            <div>
                <Header />
                {requests &&
                    <div>
                        {showForm && <RequestForm /> }
                        {!showForm && <GoToRequest activeRequest={activeRequest} /> }
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
                }

                {!requests &&
                    <Loading />
                }
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
