import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import axios from 'axios';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import {GoogleMap, Marker} from 'react-google-maps';
import {
    Grid, Row, Col, Modal, FormGroup,
    ControlLabel, FormControl, Form, HelpBlock
} from 'react-bootstrap';
import Datepicker from 'react-16-bootstrap-date-picker';

import {BasicGoogleMap} from "../../../components/map/Map";
import Button from "../../../components/button/Button";
import urls from "../../../utils/urls";

class RequestForm extends Component{

    constructor(props, context){
        super(props);

        this.state = {
            ajaxInProgress: false,
            show: false,

            first_name: '',
            last_name: '',
            identifier: '',
            photo: '',
            email: '',
            description: '',
            age: '',
            lastSeenDate: new Date().toISOString(),
            lastSeenLocation: {
                lat: '',
                lng: ''
            },
            incentive: '',

            myLatLng: false
        };

    }

    componentDidMount() {
        this._getLocation();
    }

    componentDidUpdate(){
        // let hiddenInputElement = document.getElementById("last-seen-datepicker");
        // console.log(hiddenInputElement.value); // ISO String, ex: "2016-11-19T12:00:00.000Z"
        // console.log(hiddenInputElement.getAttribute('data-formattedvalue')) // Formatted String, ex: "11/19/2016"
    }

    _getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                        myLatLng: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }
                );
            })
        }
    };

    _handleDateChange = (value) => {
        this.setState({
            lastSeenDate: value
        });
    };

    _handleInput = (prop, value) => {

        // Setting up a max for age
        if(prop === 'age' && value > 99) value = 99;

        this.setState({[prop]: value});
    };

    _handleClose = () => {
        this.setState({show: false});
    };

    _submitForm = async (ev) => {
        ev.preventDefault();

        // TO DO
        let {
            first_name, last_name, identifier, photo, email, description, age,
            lastSeenLocation, lastSeenDate, incentive
        } = this.state;


        let {drizzle} = this.context;
        let state = drizzle.store.getState();
        let {drizzleStatus} = this.props;
        const accounts = await drizzle.web3.eth.getAccounts();

        let location = `${lastSeenLocation.lat},${lastSeenLocation.lng}`;
        let lastDate = `${lastSeenDate}`;

        if (drizzleStatus.initialized) {

            const stackId = await drizzle.contracts.FindRequestFactory.methods.createFindRequest(
                    age,
                    location,
                    lastDate,
                    description
                ).send({
                    from: accounts[0],
                    value: drizzle.web3.utils.toWei(incentive.toString(), "ether")
                });

            if(stackId.status){
                try{
                    drizzle.contracts.FindRequestFactory.methods.getSummary().call()
                        .then(contractSummary => {
                            let contractsAmount = parseInt(contractSummary[2], 10);
                            let newContract = stackId.events.newFindRequestCreated.returnValues.newAddress;

                            const formData = new FormData();
                            formData.append('photo', photo);
                            formData.set('first_name', first_name);
                            formData.set('last_name', last_name);
                            formData.set('identifier', identifier);
                            formData.set('creator_email', email);
                            formData.set('lost_date', lastDate);
                            formData.set('location', location);
                            formData.set('description', description);
                            formData.set('creator_address', accounts[0]);
                            formData.set('contract_deployed_address', newContract);
                            formData.set('finished', false);
                            formData.set('index', contractsAmount - 1);
                            this._postToOffChain(formData);
                        });
                }
                catch(e){
                    console.log(e);
                }
            }

            //Use the dataKey to display the transaction status.
            if (state.transactionStack[stackId]) {
                const txHash = state.transactionStack[stackId];
                console.log('TxHash: ', state.transactions[txHash].status);
            }

        }

    };

    _postToOffChain = (form) => {
        const URL = `${urls.API_ROOT}/api/v1/requests/`;
        axios.post(URL, form, {'Content-Type': 'multipart/form-data'})
            .then(response => {
                console.log(response);
                this.props.history.push(`/detail/${response.data.contract_deployed_address}/`);
            })
            .catch(e => {
                console.log(e);
            });
    };

    _mapRender = (props) => {
        let _self = this;

        let {myLatLng, lastSeenLocation} = props;

        if(!myLatLng) myLatLng = {lat: 52.5067614, lng: 13.284651};

        let marker = '';
        if(lastSeenLocation && lastSeenLocation.lat && lastSeenLocation.lng){
            marker = (
                <Marker position={lastSeenLocation} />
            );
        }

        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={myLatLng}
                onClick={(ev) => {
                    let lat = ev.latLng.lat();
                    let lng = ev.latLng.lng();
                    _self.setState({
                        lastSeenLocation: {lat, lng}
                    });
                }}
            >
                {marker}
            </GoogleMap>
        );
    };

    render(){
        let {first_name, last_name, identifier, email, description, age,
            incentive, lastSeenDate, lastSeenLocation,
            myLatLng, ajaxInProgress
        } = this.state;
        let buttonsDisabled = ajaxInProgress;

        return (
            <Grid className={'request-form'}>
                <Row>
                    <Col xs={12} className={'text-right'}>
                        <div className={'button-container'}>
                            <Button onClick={() => this.setState({show: true})}>
                                Create new request
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Modal show={this.state.show} onHide={this._handleClose} className={'request-form-modal'}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Finding Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Please complete the form below to create the request to the network
                        </p>
                        <div>
                            <Form
                                onSubmit={this._submitForm}
                            >
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>First Name</ControlLabel>
                                            <FormControl
                                                type="text"
                                                value={first_name}
                                                placeholder="Enter the first name"
                                                onChange={ev => this._handleInput('first_name', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Last Name</ControlLabel>
                                            <FormControl
                                                type="text"
                                                value={last_name}
                                                placeholder="Enter the last name"
                                                onChange={ev => this._handleInput('last_name', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Legal ID</ControlLabel>
                                            <FormControl
                                                type="text"
                                                value={identifier}
                                                placeholder="Enter the legal document identifier"
                                                onChange={ev => this._handleInput('identifier', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Age</ControlLabel>
                                            <FormControl
                                                type="number"
                                                value={age}
                                                placeholder="Enter the age"
                                                onChange={ev => this._handleInput('age', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>Description</ControlLabel>
                                            <FormControl
                                                componentClass="textarea"
                                                value={description}
                                                placeholder="Enter a description of the person that is missing"
                                                onChange={ev => this._handleInput('description', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Picture</ControlLabel>
                                            <FormControl
                                                type="file"
                                                onChange={(ev) => this.setState({photo: ev.target.files[0]})}
                                                accept={"image/*"}
                                            />
                                            <HelpBlock>Please upload a photo as updated as possible</HelpBlock>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Last Seen Date</ControlLabel>
                                            <Datepicker  id="last-seen-datepicker" value={lastSeenDate} onChange={this._handleDateChange}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>Last known location</ControlLabel>
                                            <HelpBlock>Please click on the map on the last known location</HelpBlock>
                                        </FormGroup>
                                        <BasicGoogleMap
                                            renderMethod={this._mapRender}
                                            myLatLng={myLatLng}
                                            lastSeenLocation={lastSeenLocation}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Contact Email</ControlLabel>
                                            <FormControl
                                                type="email"
                                                value={email}
                                                placeholder="Enter a contact email"
                                                onChange={ev => this._handleInput('email', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Incentive</ControlLabel>
                                            <FormControl
                                                type="number"
                                                value={incentive}
                                                placeholder="Enter an incentive in ETH"
                                                onChange={ev => this._handleInput('incentive', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row className={"modal-buttons"}>
                            <Col xs={12}>
                                <Button className={`blue ${buttonsDisabled ? 'disabled' : ''}`}
                                        onClick={this._handleClose}>
                                    Cancel
                                </Button>
                                <Button className={`blue-full ${buttonsDisabled ? 'disabled' : ''}`}
                                        onClick={this._submitForm}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>
            </Grid>
        );
    }

}

RequestForm.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        web3: state.web3,
        drizzleStatus: state.drizzleStatus,
        FindRequestFactory: state.contracts.FindRequestFactory
    }
};

const RequestFormContainer = withRouter(drizzleConnect(RequestForm, mapStateToProps));
export default RequestFormContainer;