import React, {Component} from 'react';

import {Grid, Row, Col} from "react-bootstrap";
import {GoogleMap, Marker} from 'react-google-maps';
import Geocode from "react-geocode";

import ButtonModal from "../buttonModal/ButtonModal";
import Header from "../../../../components/header/Header";
import {BasicGoogleMap} from "../../../../components/map/Map";

import urls from '../../../../utils/urls';
import './styles.scss';


class BasicDetails extends Component {

    constructor(props){
        super(props);
        this.state={
            donation_amount:'',
            hint:'',
            comment:'',
            address:'',
        }
    }

    _mapRender = (props) => {
        let _self = this;

        let {myLatLng, lastSeenLocation} = props;

        if (!myLatLng) myLatLng = {lat: 52.5067614, lng: 13.284651};

        let marker = '';
        if (lastSeenLocation && lastSeenLocation.lat && lastSeenLocation.lng) {
            marker = (
                <Marker position={lastSeenLocation}/>
            );
        }

        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={myLatLng}
            >
                <Marker position={myLatLng}/>
                {marker}
            </GoogleMap>
        );
    };

    _findReverseGeocoding = () =>{
        Geocode.setApiKey("AIzaSyDe1q7rvBSFYyG_d87OZplzm5IVeJodp6A");
        let latLang= this.props.myLatLng.split(",");
        console.log(latLang);
        Geocode.fromLatLng(latLang[0], latLang[1]).then(
            response => {
                const address = response.results[0].formatted_address;
                this.setState({address});
            },
            error => {
                console.error(error);
            }
        );
    };

    componentDidMount= ()=>{
        this._findReverseGeocoding();
    };

    _handleInput = (prop, value) => {
        console.log("PROP", prop);
        console.log("VALUE", value);

        this.setState({[prop]: value});
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
                            <ButtonModal username={this.props.name} buttonTitle={"Close Search"} className={'aqua-full'}
                                         action={()=>this.props.actionClose(this.state.comment)}
                                         textContent={`Are you sure you want to close the search of ${this.props.name}?.
                                         If you want you can enter a comment for all the people who helped you.`}
                                         title={"Close Search"} type={"textarea"}
                                         inputProp={'comment'}
                                         handleAction={this._handleInput}
                                         placeholder={"Comment"}
                                         value={this.state.comment}
                                         acceptButtonText={"Close"}/>
                            <ButtonModal username={this.props.name} buttonTitle={"Give a Hint"} type={"textarea"}
                                         action={()=>this.props.actionSendHint(this.state.hint)}
                                         handleAction={this._handleInput}
                                         inputProp={'hint'}
                                         value={this.state.hint}
                                         placeholder={"Hint"}
                                         textContent={`Do you have any information about ${this.props.name}?
                                         Please give us all the information you can in order to help us find him.
                                          \nWe will refound your gas as soon as we find him!
                                         \nAny detail is appreciated!`}/>
                            <ButtonModal username={this.props.name} buttonTitle={"Donate"} type={"input"}
                                         action={()=>this.props.actionDonate(this.state.donation_amount)}
                                         value={this.state.donation_amount}
                                         textContent={`With your donation we will be able to help ${this.props.name}
                                         and others in these situation. Please enter the amount you wish to donate.
                                         \nAny value is appreciated!`}
                                         handleAction={this._handleInput}
                                         inputProp={'donation_amount'}
                                         placeholder={"Amount in ETH"}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4} className={"data"}>
                            <img src={urls.API_ROOT + this.props.photo} alt={"Usuario"} className={"avatar-icon"}/>
                            <p><b>AGE: </b> {this.props.age}</p>
                            <p><b>LOCATION: </b> {this.state.address}</p>
                            <p><b>DATE: </b>{this.props.date}</p>
                            <p><b>CONTACT: </b> {this.props.contact}</p>
                            <p><b>DESCRIPTION: </b> {this.props.description}</p>
                            {/*<p><b>INCENTIVE: </b> {this.props.incentive}</p>*/}
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