import React, {Component} from 'react';

import {Grid, Row, Col} from "react-bootstrap";

import './styles.scss';
import Header from "../../../../components/header/Header";
import avatar from '../../../../assets/waldo2.jpg';
import ButtonModal from "../buttonModal/ButtonModal";


class BasicDetails extends Component {

    _sendHint = (text) => {

    };

    _sendDonation = (amount) => {

    };

    render() {
        return (
            <div className={"details-basics-section"}>
                <Header/>
                <Grid>
                    <Row>
                        <Col xs={8} className={"data"}>
                            <h2 className={"username"}>{this.props.name}</h2>
                        </Col>
                        <Col xs={4} style={{marginTop: 25}}>
                            <Col xs={7}>
                            <ButtonModal username={this.props.name} buttonTitle={"Give a Hint"} type={"textarea"} action={this._sendHint}
                                          placeholder={"Hint"} textContent={`Do you have any information about ${this.props.name}?
                                         Please give us all the information you can in order to help us find him.
                                          \nWe will refound your gas as soon as we find him!
                                         \nAny detail is appreciated!`}/>
                            </Col>
                            <Col xs={5}>
                            <ButtonModal username={this.props.name} buttonTitle={"Donate"} type={"input"} action={this._sendDonation}
                                         textContent={`With your donation we will be able to help ${this.props.name}
                                         and others in these situation. Please enter the amount you wish to donate.
                                         \nAny value is appreciated!`}
                                         placeholder={"Amount in ETH"}/>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} className={"data"}>
                            <img src={avatar} alt={"Usuario"} className={"avatar-icon"}/>
                            <p><b>AGE: </b> {this.props.age}</p>
                            <p><b>LOCATION: </b> {this.props.location}</p>
                            <p><b>DATE: </b>{this.props.date}</p>
                            <p><b>CONTACT: </b> {this.props.contact}</p>
                            <p><b>DESCRIPTION: </b> {this.props.description}</p>
                            <p><b>INCENTIVE: </b> {this.props.incentive}</p>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default BasicDetails;