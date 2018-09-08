import React, {Component} from 'react';

import {Grid, Row, Col} from "react-bootstrap";
import {GoogleMap, Marker} from 'react-google-maps';

import ButtonModal from "../buttonModal/ButtonModal";
import Header from "../../../../components/header/Header";
import {BasicGoogleMap} from "../../../../components/map/Map";

import avatar from '../../../../assets/waldo2.jpg';
import './styles.scss';



class BasicDetails extends Component {


    _sendHint = (text) => {

    };

    _sendDonation = (amount) => {

    };

    _closeSearch = () => {

    };

    _mapRender = (props) => {
        // let _self = this;
        //
        // let {myLatLng, lastSeenLocation} = props;
        //
        // if(!myLatLng) myLatLng = {lat: 52.5067614, lng: 13.284651};
        //
        // let marker = '';
        // if(lastSeenLocation && lastSeenLocation.lat && lastSeenLocation.lng){
        //     marker = (
        //         <Marker position={lastSeenLocation} />
        //     );
        // }

        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={{lat: 52.5067614, lng: 13.284651}}
            >
            </GoogleMap>
        );
    };

    render() {
        return (
            <div className={"details-basics-section"}>
                <Header/>
                <Grid>
                    <Row className={"detail-title"}>
                        <Col xs={12} md={6} className={"data"}>
                            <h2 className={"username"}>{this.props.name}</h2>
                        </Col>
                        <Col xs={12} md={6} className={"button-container text-right"}>
                            <ButtonModal username={this.props.name} buttonTitle={"Close Search"} className={'aqua-full'} action={this._closeSearch}
                                         textContent={`Are you sure you want to close the search of ${this.props.name}?`}
                                         title={"Close Search"}
                                         acceptButtonText={"Close"}/>
                            <ButtonModal username={this.props.name} buttonTitle={"Give a Hint"} type={"textarea"} action={this._sendHint}
                                         handleAction ={this._handleInput}
                                         inputProp={"hint"}
                                          placeholder={"Hint"} textContent={`Do you have any information about ${this.props.name}?
                                         Please give us all the information you can in order to help us find him.
                                          \nWe will refound your gas as soon as we find him!
                                         \nAny detail is appreciated!`}/>
                            <ButtonModal username={this.props.name} buttonTitle={"Donate"} type={"input"} action={this._sendDonation}
                                         textContent={`With your donation we will be able to help ${this.props.name}
                                         and others in these situation. Please enter the amount you wish to donate.
                                         \nAny value is appreciated!`}
                                         handleAction ={this._handleInput}
                                         inputProp={"donation"}
                                         placeholder={"Amount in ETH"}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4} className={"data"}>
                            <img src={avatar} alt={"Usuario"} className={"avatar-icon"}/>
                            <p><b>AGE: </b> {this.props.age}</p>
                            <p><b>LOCATION: </b> {this.props.location}</p>
                            <p><b>DATE: </b>{this.props.date}</p>
                            <p><b>CONTACT: </b> {this.props.contact}</p>
                            <p><b>DESCRIPTION: </b> {this.props.description}</p>
                            <p><b>INCENTIVE: </b> {this.props.incentive}</p>
                        </Col>
                        <Col xs={12} md={8} className={""}>
                            <BasicGoogleMap
                                renderMethod={this._mapRender}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default BasicDetails;