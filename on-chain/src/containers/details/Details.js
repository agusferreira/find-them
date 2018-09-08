import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Grid, Col, Row} from 'react-bootstrap';
import {drizzleConnect} from 'drizzle-react';
import axios from 'axios';

import './style.scss';
import BasicDetails from "./components/basicDetails/BasicDetails";
import Tips from "./components/tips/Tips";
import ButtonModal from "./components/buttonModal/ButtonModal";
import LocationForm from "./components/locationForm/LocationForm";
import RequestContract from '../../contracts/FindRequest.json';
import urls from '../../utils/urls';
import {dateFormat} from "../../utils/formatters";

const requestABI = RequestContract["abi"];


class Details extends Component {

    constructor(props, context) {
        super(props);

        let address = '';
        if (props.match && props.match.params && props.match.params.address) {
            address = props.match.params.address;
        }

        this.state = {
            address,
            findRequest: false,
            donation_amount: '',
            hint: '',
            userOffchain: '',
            userBlockchain: '',
            errorAddress: null,

        }
    }

    componentDidMount() {
        if (this.props.drizzleStatus.initialized) {
            let {drizzle} = this.context;
            let findRequest = new drizzle.web3.eth.Contract(requestABI, this.state.address);
            this.setState({findRequest}, this._fetchSummary);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(!this.props.drizzleStatus.initialized && nextProps.drizzleStatus.initialized){
            let {drizzle} = this.context;
            let findRequest = new drizzle.web3.eth.Contract(requestABI, this.state.address);
            this.setState({findRequest}, this._fetchSummary);

        }
    }

    _fetchSummary = () => {
        this.state.findRequest.methods.getSummary().call().then((data) => {
            this.setState({userBlockchain: data}, this._fetchHints);
            // console.log(data);
            this._fetchOffChainData(this.state.address);

        })
    };

    _fetchOffChainData = (address) => {
        let REQUEST_URL = `${urls.API_ROOT}/api/v1/requests/${address}/`;
        axios.get(REQUEST_URL, {})
            .then((response) => {
                this.setState({userOffchain: response.data})
                // console.log(response.data)
            })
            .catch((error) => {
                console.log(error.response);
            })
    };

    _fetchHints = async () => {

        let {drizzle} = this.context;
        let findRequest = new drizzle.web3.eth.Contract(requestABI, this.state.address);
        const accounts = await drizzle.web3.eth.getAccounts();
        let hintsLength = this.state.userBlockchain[7];
        let hints = [];

        for (let i = 0; i < hintsLength; i++) {
            let hint = await findRequest.methods.getHint(i).call({from: accounts[0]});
            console.log(hint);
            hints.push(hint);
        }
        console.log(hints);
        this.setState({hints});
    };

    _rejectHint = async (id) => {
        console.log(id);
        let {drizzle} = this.context;
        let {findRequest} = this.state;
        const accounts = await drizzle.web3.eth.getAccounts();

        const stackId = await findRequest.methods.rejectHint(id)
            .send({
                from: accounts[0]
            });
    };

    _acceptHint = async (id) => {
        console.log(id);
        let {drizzle} = this.context;
        let {findRequest} = this.state;
        const accounts = await drizzle.web3.eth.getAccounts();

        const stackId = await findRequest.methods.acceptHint(id)
            .send({
                from: accounts[0]
            });
    };

    _sendHint = async (text) => {
        console.log(text);
        let {drizzle} = this.context;
        let {findRequest} = this.state;
        const accounts = await drizzle.web3.eth.getAccounts();

        const stackId = await findRequest.methods.submitHint(text)
            .send({
                from: accounts[0]
            });

    };

    _sendDonation = async (amount) => {
        let {drizzle} = this.context;
        let {findRequest} = this.state;
        const accounts = await drizzle.web3.eth.getAccounts();

        const stackId = await findRequest.methods.receiveDonations()
            .send({
                from: accounts[0],
                value: drizzle.web3.utils.toWei(amount.toString(), "ether")
            });

    };

    _closeSearch = () => {

    };
    _addWatcher = (address) => {
        if (this.checkAddress()) {

        } else {
            return false;
        }
    };

    checkAddress = () => {
        let {drizzle} = this.context;
        if (drizzle.web3.utils.isAddress(this.state.address)) {
            this.setState({errorAddress: 'success'});
            return true;
        } else {
            this.setState({errorAddress: 'error'});
            return false;
        }
    };

    _renderHints = () => {
        return this.state.hints.map((hint, index) => {
            return <Tips key={index} type={hint[1]} hint={hint[0]} id={index}
                         editable={true} acceptAction={this._acceptHint} rejectAction={this._rejectHint}/>
        })
    };

    _handleInput = (prop, value) => {
        this.setState({[prop]: value});
    };

    render() {
        let {userOffchain, userBlockchain} = this.state;
        return (
            <div className={"details-section"}>
                {this.state.userOffchain &&
                <BasicDetails myLatLng={userBlockchain[3]} photo={userOffchain.photo}
                              actionClose={this._closeSearch} actionDonate={this._sendDonation}
                              actionSendHint={this._sendHint}
                              propDonate={"donation_amount"} propHint={"hint"} valueDonate={this.state.donation_amount}
                              valueHint={this.state.hint}
                              name={`${userOffchain.first_name + ` ` + userOffchain.last_name}`}
                              age={`${userBlockchain[2]} years old`} location={"Görlitzer Park, Berlin"}
                              date={dateFormat(userOffchain.lost_date)} contact={userOffchain.creator_email}
                              description={userOffchain.description}/>}
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <Row>
                                <Col xs={10}>
                                    <h2 className={"title"}>Hints</h2>
                                </Col>
                                <Col xs={2} style={{marginTop: 50}}>
                                    <ButtonModal username={this.props.name} buttonTitle={"Add watcher"} type={"input"}
                                                 action={this._addWatcher}
                                                 value={this.state.address}
                                                 validation={this.state.errorAddress}
                                                 handleAction={this._handleInput}
                                                 inputProp={"address"}
                                                 title={"Add new watcher"}
                                                 acceptButtonText={"Add"}
                                                 placeholder={"Address"} textContent={`If you add a watcher to this search, he/she would be
                                                 able to watch all the hints available. Are you sure you want to proceed?`}/>
                                </Col>
                            </Row>
                            {this.state.hints &&
                            this._renderHints()}
                        </Col>
                    </Row>
                </Grid>
                <LocationForm address={this.state.address}/>
            </div>
        )

    }

}

Details.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        drizzleStatus: state.drizzleStatus,
        web3: state.web3,
    }
};

const DetailsContainer = drizzleConnect(Details, mapStateToProps);

export default DetailsContainer;

