import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import axios from 'axios';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import {GoogleMap, Marker} from 'react-google-maps';
import {
    Grid, Row, Col, Modal, FormGroup,
    ControlLabel, Form, HelpBlock
} from 'react-bootstrap';

import {BasicGoogleMap} from "../../../../components/map/Map";
import Button from "../../../../components/button/Button";
import RequestContract from '../../../../contracts/FindRequest.json';
import helpers from "../../../../utils/helpers";
import './styles.scss';

const requestABI = RequestContract["abi"];

class LocationForm extends Component{

    constructor(props, context){
        super(props);

        this.state = {
            ajaxInProgress: false,
            show: false,

            address: this.props.address,
            locations: this.props.locations,

            newLocation: {
                lat: '',
                lng: ''
            },

            myLatLng: {
                lat: 0,
                lng: 0
            }
        };

    }

    componentDidMount() {
        this._getLocation();
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

    _handleClose = () => {
        this.setState({show: false});
    };

    _submitForm = async (ev) => {
        ev.preventDefault();

        let {newLocation} = this.state;

        let {drizzle} = this.context;
        let state = drizzle.store.getState();
        let {drizzleStatus} = this.props;
        const accounts = await drizzle.web3.eth.getAccounts();
        let findRequest = new drizzle.web3.eth.Contract(requestABI, this.state.address);

        let location = `${newLocation.lat},${newLocation.lng}`;

        if (drizzleStatus.initialized) {
            console.log('Calling!');
            const stackId = await findRequest.methods.addKnownLocation(location).send({from: accounts[0]});

            console.log(stackId);

            //Use the dataKey to display the transaction status.
            if (state.transactionStack[stackId]) {
                const txHash = state.transactionStack[stackId];
                console.log('TxHash: ', state.transactions[txHash].status);
            }

        }
    };

    _mapRender = (props) => {
        let _self = this;
        let {centerMap, markers} = props;
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={centerMap}
                onClick={(ev) => {
                    let lat = ev.latLng.lat();
                    let lng = ev.latLng.lng();
                    _self.setState({
                        newLocation: {lat, lng}
                    });
                }}
            >
                {markers.map((location, index) => {
                    return <Marker key={index} position={location} />
                })}
            </GoogleMap>
        );
    };

    render(){
        let {
            locations, newLocation, myLatLng,
            address, ajaxInProgress
        } = this.state;
        let buttonsDisabled = ajaxInProgress;

        if(!address) return <div/>;

        // If I can't get user location, just center on initial point
        let centerMap = myLatLng;
        if(locations.length > 0){
            let coords = helpers.coords(locations[0]);
            if(coords) centerMap = coords;
        }

        let markers = [];
        locations.forEach(location => {
            let coords = helpers.coords(location);
            if(coords) markers.push(coords);
        });

        if(newLocation && newLocation.lat && newLocation.lng){
            markers.push(newLocation);
        }else{
            // Disabled Submit button
        }

        return (
            <div className={'location-form'}>
                <Button onClick={() => this.setState({show: true})}>
                    Add New Location
                </Button>
                <Modal show={this.state.show} onHide={this._handleClose} className={'request-form-modal'}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Form
                                onSubmit={this._submitForm}
                            >
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>New location</ControlLabel>
                                            <HelpBlock>Please click on the map on the last known location</HelpBlock>
                                        </FormGroup>
                                        <BasicGoogleMap
                                            renderMethod={this._mapRender}
                                            centerMap={centerMap}
                                            markers={markers}
                                        />
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
            </div>
        );
    }

}

LocationForm.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        web3: state.web3,
        drizzleStatus: state.drizzleStatus
    }
};

const LocationFormContainer = withRouter(drizzleConnect(LocationForm, mapStateToProps));
export default LocationFormContainer;