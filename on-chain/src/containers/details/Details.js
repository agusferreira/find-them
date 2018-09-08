import React, {Component} from 'react';

import {Grid, Col, Row} from 'react-bootstrap';
import './style.scss';
import BasicDetails from "./components/basicDetails/BasicDetails";
import Tips from "./components/tips/Tips";
import Button from "../../components/button/Button";
import ButtonModal from "./components/buttonModal/ButtonModal";

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hints: [{type: 'success', hint: "Waldo was seen in Full Node programming", isAdmin: false},
                {type: 'info', hint: "Waldo was in ETHBerlin pitball", isAdmin: true},
                {type: 'success', hint: "Waldo was seen in Full Node programming", isAdmin: false},
                {type: 'info', hint: "Waldo was in ETHBerlin pitball", isAdmin: true}]
        }
    }

    _rejectHint = (id) => {

    };

    _acceptHint = (id) => {

    };

    _addWatcher = (address) => {

    };

    _renderHints = () => {
        return this.state.hints.map((hint, index) => {
            return <Tips key={hint.hint} type={hint.type} title={`Hint ${index + 1}`} hint={hint.hint}
                         editable={hint.isAdmin} acceptAction={this._acceptHint} rejectAction={this._rejectHint}/>
        })
    };

    render() {

        return (
            <div className={"details-section"}>
                <BasicDetails name={"Waldo Perez"} age={"12 years old"} location={"Görlitzer Park, Berlin"}
                              date={"07/09/2018"} contact={"john.doe@gmail.com"}
                              description={"1.80m, dark hair, blue eyes"}
                              incentive={"12 ETH"}/>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <Row>
                                <Col xs={10}>
                                    <h2 className={"title"}>Hints</h2>
                                </Col>
                                <Col xs={2} style={{marginTop:50}}>
                                    <ButtonModal username={this.props.name} buttonTitle={"Add watcher"} type={"input"}
                                                 action={this._addWatcher}
                                                 title={"Add new watcher"}
                                                 acceptButtonText={"Add"}
                                                 placeholder={"Address"} textContent={`If you add a watcher to this search, he/she would be
                                                 able to watch all the hints available. Are you sure you want to proceed?`}/>
                                </Col>
                            </Row>
                            {this._renderHints()}
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default Details;