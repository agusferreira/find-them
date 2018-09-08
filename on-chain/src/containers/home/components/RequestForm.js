import React, {Component} from 'react';

import axios from 'axios';
import {GoogleMap, Marker} from 'react-google-maps';
import {
    Grid, Row, Col, Modal, FormGroup,
    ControlLabel, FormControl, Form, HelpBlock
} from 'react-bootstrap';
import Datepicker from 'react-16-bootstrap-date-picker';

import {BasicGoogleMap} from "../../../components/map/Map";
import Button from "../../../components/button/Button";

class RequestForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            ajaxInProgress: false,
            show: false,

            name: '',
            surname: '',
            id: '',
            picture: '',
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
        }

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

    _handleDateChange = (value, formattedValue) => {
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

    _submitForm = (ev) => {
        ev.preventDefault();
        console.log('Submitted');

        // TO DO

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

        let {name, surname, id, email, description, age,
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
                                            <ControlLabel>Name</ControlLabel>
                                            <FormControl
                                                type="text"
                                                value={name}
                                                placeholder="Enter the name"
                                                onChange={ev => this._handleInput('name', ev.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <FormGroup>
                                            <ControlLabel>Surname</ControlLabel>
                                            <FormControl
                                                type="text"
                                                value={surname}
                                                placeholder="Enter the surname"
                                                onChange={ev => this._handleInput('surname', ev.target.value)}
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
                                                value={id}
                                                placeholder="Enter the legal document id"
                                                onChange={ev => this._handleInput('id', ev.target.value)}
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
                                                onChange={(ev) => this.setState({picture: ev.target.files[0]})}
                                                accept={"image/*"}
                                            />
                                            <HelpBlock>Please upload a picture as updated as possible</HelpBlock>
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

export default RequestForm;