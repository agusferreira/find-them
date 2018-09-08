import React, {Component} from 'react';

import {Modal, Grid, Row, Col, FormGroup, FormControl, HelpBlock} from 'react-bootstrap';

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

    _handleInput = (text) => {
        console.log(text);
        this.props.handleAction(this.props.inputProp, text);
    };


    render() {
        let {showModal, donation_amount, ajaxInProgress} = this.state;
        let modalTitle = this.props.title ? this.props.title : `Contribute to ${this.props.username}'s cause`;
        let buttonsDisabled = ajaxInProgress;
        let className = this.props.className ? this.props.className : 'blue-full';
        return (
            <div className={"donate-section"}>
                <Button className={className} onClick={this._showModal}>{this.props.buttonTitle}</Button>
                <Modal show={showModal} onHide={this._closeModal} className={'vertical-center'}>
                    <Modal.Header closeButton>
                        <Modal.Title id={"modalTitle"}>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid className={"row margin-top-20 margin-bottom-20 text-center"}>
                            <Row>
                                <Col xs={6}>
                                    <p>{this.props.textContent}</p>
                                </Col>
                            </Row>
                            {this.props.placeholder && this.props.type &&
                            <Row>
                                <Col xs={6}>
                                    <FormGroup
                                        validationState={this.props.validation}
                                    >
                                        <FormControl
                                            type="text"
                                            componentClass={this.props.type}
                                            style={{marginBottom: 20}}
                                            value={this.props.value}
                                            placeholder={this.props.placeholder}
                                            onChange={ev => this._handleInput(ev.target.value)}
                                        />
                                        {this.props.validation === 'error' &&
                                        <HelpBlock>Invalid Address.</HelpBlock>}
                                    </FormGroup>
                                </Col>
                            </Row>}
                            <Row className={"modal-buttons"}>
                                <Col xs={6}>
                                    <Button className={`blue ${buttonsDisabled ? 'disabled' : ''}`}
                                            onClick={this._closeModal}>
                                        Cancel
                                    </Button>
                                    <Button className={`blue-full ${buttonsDisabled ? 'disabled' : ''}`}
                                            onClick={() => {
                                                this.setState({showModal: false});
                                                this.props.action()
                                            }}>
                                        {this.props.acceptButtonText ? this.props.acceptButtonText : 'Send'}
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