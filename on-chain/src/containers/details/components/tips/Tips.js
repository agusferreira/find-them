import React, {Component} from 'react';

import {Panel, Grid, Col, Row, Modal} from 'react-bootstrap';
import MaterialIcon from 'material-icons-react';

import './styles.scss';
import Button from "../../../../components/button/Button";


class Tips extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            action: '',
            buttonsDisabled: false,
        }
    }

    _showModal = (action) => {
        this.setState({showModal: true, action});
    };

    _closeModal = () => {
        this.setState({showModal: false});
    };

    render() {
        let {showModal, action, buttonsDisabled} = this.state;
        let modalContent = action !== '' ? `Are you sure you want to ${action} this hint?` : '';
        let type='';
        if(this.props.type===1){
            type = "info";
        }else if(this.props.type===2){
            type = "success";
        }else{
            type = "danger";
        }

        return (
            <Grid>
                <Panel className={`custom-panel ${type}`} bsStyle={type}>
                    <Panel.Body>
                        <Grid>
                            <Row>
                                <Col xs={10}>
                                    <p style={{fontSize: 18, padding: 14}}>{this.props.hint}</p>
                                </Col>
                                {this.props.type === 1 && this.props.isOwner &&
                                <Col xs={2}>
                                    <Col xs={3} className={'pointer'} onClick={() => this._showModal("accept")}>
                                        <MaterialIcon icon="check_circle_outline"
                                                      style={{padding: 5}} size={'medium'} color="#32cd32"/>
                                    </Col>
                                    <Col xs={3} className={'pointer'} onClick={() => this._showModal("reject")}>
                                        <MaterialIcon icon="highlight_off"
                                                      style={{padding: 5}} size={'medium'} color="#FF4843"/>
                                    </Col>
                                </Col>}
                            </Row>
                        </Grid>
                    </Panel.Body>
                </Panel>

                <Modal show={showModal} onHide={this._closeModal} className={'vertical-center'}>
                    <Modal.Body>
                        <Grid className={"row margin-top-20 margin-bottom-20 text-center"}>
                            <Row>
                                <Col xs={6}>
                                    <p>{modalContent}</p>
                                </Col>
                            </Row>

                            <Row className={"modal-buttons"}>
                                <Col xs={6}>
                                    <Button className={`blue ${buttonsDisabled ? 'disabled' : ''}`}
                                            onClick={this._closeModal}>
                                        Cancel
                                    </Button>
                                    <Button className={`blue-full ${buttonsDisabled ? 'disabled' : ''}`}
                                            onClick={() => {
                                                this.state.action === "accept" ? this.props.acceptAction(this.props.id) : this.props.rejectAction(this.props.id);
                                                this._closeModal();
                                            }}>
                                        {action.toUpperCase()}
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                        {/*{this.state.ajaxInProgress ? <Spinner/> : <div><br/><br/></div>}*/}
                    </Modal.Body>
                </Modal>

            </Grid>
        )

    }

}

export default Tips;