import React, {Component} from 'react';

import {Modal, Grid, Row, Col, FormGroup, FormControl} from 'react-bootstrap';

import './styles.scss';
import Button from "../../../../components/button/Button";


class ButtonModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            donation_amount: '',
            warn_amount: false,
            ajaxInProgress: false
        }
    }

    _closeModal = () => {
        this.setState({showModal: false});
    };

    _showModal = () => {
        this.setState({showModal: true});
    };

    _handleInput = (prop, value) => {
        this.setState({[prop]: value});
    };


    render() {
        let {showModal, donation_amount, ajaxInProgress }= this.state;
        let modalTitle = `Contribute to ${this.props.username}'s cause`;
        let buttonsDisabled = ajaxInProgress;

        return (
            <div className={"donate-section text-right"}>
                <Button className={"blue-full"} onClick={this._showModal}>{this.props.buttonTitle}</Button>
                <Modal show={showModal} onHide={this._closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title id={"modalTitle"}>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid  className={"row margin-top-20 margin-bottom-20 text-center"}>
                            <Row>
                                <Col xs={6}>
                                    <p>{this.props.textContent}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <FormGroup>
                                        <FormControl
                                            type="text"
                                            componentClass={this.props.type}
                                            style={{marginBottom:20}}
                                            value={donation_amount}
                                            placeholder={this.props.placeholder}
                                            onChange={ev => this._handleInput('donation_amount', ev.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className={"modal-buttons"}>
                                <Col xs={6}>
                                <Button className={`blue ${buttonsDisabled ? 'disabled' : ''}`}
                                        onClick={this._closeModal}>
                                    Cancel
                                </Button>
                                <Button className={`blue-full ${buttonsDisabled ? 'disabled' : ''}`}
                                        onClick={this.props.action}>
                                    Send
                                </Button>
                                </Col>
                            </Row>
                        </Grid>
                        {/*{this.state.ajaxInProgress ? <Spinner/> : <div><br/><br/></div>}*/}
                    </Modal.Body>
                </Modal>

            </div>
        )

    }

}

export default ButtonModal;