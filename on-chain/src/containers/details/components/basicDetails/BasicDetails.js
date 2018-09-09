import React, {Component} from 'react';

import {Grid, Row, Col, Modal} from "react-bootstrap";
import {GoogleMap, Marker} from 'react-google-maps';
import Geocode from "react-geocode";

import ButtonModal from "../buttonModal/ButtonModal";
import {BasicGoogleMap} from "../../../../components/map/Map";
import LocationForm from "../locationForm/LocationForm";
import helpers from "../../../../utils/helpers";
import urls from '../../../../utils/urls';
import {dateFormat} from "../../../../utils/formatters";
import Button from "../../../../components/button/Button";
import './styles.scss';


class BasicDetails extends Component {

    constructor(props){
        super(props);
        this.state={
            donation_amount:'',
            hint:'',
            comment:'',
            action: '',
            showModal: false
        }
    }

    _mapRender = (props) => {
        let markers = [];
        this.props.locations.forEach(location => {
            let coords = helpers.coords(location);
            if(coords) markers.push(coords);
        });

        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={markers[0]}
            >
                {markers.map((location, index) => {
                    return <Marker key={index} position={location} />
                })}
            </GoogleMap>
        );
    };

    // _findReverseGeocoding = () =>{
    //     Geocode.setApiKey("AIzaSyDe1q7rvBSFYyG_d87OZplzm5IVeJodp6A");
    //     let latLang= this.props.myLatLng.split(",");
    //     Geocode.fromLatLng(latLang[0], latLang[1]).then(
    //         response => {
    //             const address = response.results[0].formatted_address;
    //             this.setState({address});
    //         },
    //         error => {
    //             console.error(error);
    //         }
    //     );
    // };

    componentDidMount = () => {
        // this._findReverseGeocoding();
    };

    _handleInput = (prop, value) => {
        this.setState({[prop]: value});
    };

    _showModal = (action) => {
        this.setState({showModal: true, action});
    };

    _closeModal = () => {
        this.setState({showModal: false});
    };

    render() {

        let {action, showModal} = this.state;

        let name = '';
        let buttonsDisabled = false;
        if(this.props.otherData.first_name) name = `${this.props.otherData.first_name} `;
        if(this.props.otherData.last_name) name = `${name} ${this.props.otherData.last_name}`;


        let modalContent = action !== '' ? `Are you sure you want to ${action} this request?` : '';

        return (
            <div className={"details-basics-section"}>
                <Grid>
                    <Row className={"detail-title"}>
                        <Col xs={12} md={4} className={"data"}>
                            <h2 className={"username truncate text-center"}>{name}</h2>
                            <div className={"text-center persons-data"}>
                                <img src={urls.API_ROOT + this.props.otherData.photo} alt={"Missing"} className={"avatar-icon"}/>
                                <div className={'info text-left'}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style={{width: '30%'}}>
                                                    <b>Age: </b> {this.props.blockChainData[2]}
                                                </td>
                                                <td>
                                                    <b>Last date seen: </b>{dateFormat(this.props.blockChainData[4])}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/*<p><b>LOCATION: </b> {this.props.blockChainData[3]}</p>*/}
                                    <div className={'detail'}>
                                        {this.props.blockChainData[5]}
                                    </div>
                                </div>
                            </div>
                            {this.props.status === 1 &&
                                <div>
                                    {this.props.isOwner &&
                                    <div className={'text-center'}>
                                        <LocationForm locations={this.props.locations} address={this.props.address} />
                                        <ButtonModal username={name} buttonTitle={"Close Search"} className={'aqua-full'}
                                                     action={()=>this.props.actionClose(this.state.comment)}
                                                     textContent={`Are you sure you want to close the search of ${name}?.
                                         If you want you can enter a comment for all the people who helped you.`}
                                                     title={"Close Search"} type={"textarea"}
                                                     inputProp={'comment'}
                                                     handleAction={this._handleInput}
                                                     placeholder={"Comment"}
                                                     value={this.state.comment}
                                                     acceptButtonText={"Close"}/>
                                    </div>
                                    }
                                    {!this.props.isOwner &&
                                    <div className={'text-center'}>
                                        <ButtonModal username={name} buttonTitle={"Give a Hint"} type={"textarea"}
                                                     action={()=>this.props.actionSendHint(this.state.hint)}
                                                     handleAction={this._handleInput}
                                                     inputProp={'hint'}
                                                     value={this.state.hint}
                                                     placeholder={"Hint"}
                                                     textContent={`Do you have any information about ${name}?
                                         Please give us all the information you can in order to help us find him.
                                          \nWe will refound your gas as soon as we find him!
                                         \nAny detail is appreciated!`}/>
                                        <ButtonModal username={name} buttonTitle={"Donate"} type={"input"}
                                                     action={()=>this.props.actionDonate(this.state.donation_amount)}
                                                     value={this.state.donation_amount}
                                                     textContent={`With your donation we will be able to help ${name}
                                         and others in these situation. Please enter the amount you wish to donate.
                                         \nAny value is appreciated!`}
                                                     handleAction={this._handleInput}
                                                     inputProp={'donation_amount'}
                                                     placeholder={"Amount in ETH"}/>
                                    </div>
                                    }
                                </div>
                            }
                        </Col>
                        <Col xs={12} md={8} className={"button-container text-right"}>
                            {this.props.showMap &&
                            <BasicGoogleMap
                                renderMethod={this._mapRender}
                            />
                            }

                            {this.props.redeemIncentives &&
                            <div className={"map-container closed-info"}>
                                <div>
                                    <h2 className={"text-center"}>
                                        CLOSED REQUEST
                                    </h2>
                                    <div className={'text-left'}>
                                        <p>
                                            This request was closed and is now in the redeeming state. If you contributed
                                            to this request, feel free to redeem your share.
                                        </p>
                                        {this.props.closingMessage ?
                                        <div className={'closing-message'}>
                                            <h4>Here's a message from the request's creator: </h4>
                                            <div className={'c-message'}>
                                                {this.props.closingMessage}
                                            </div>
                                        </div>
                                        :
                                        <div style={{height: '275px'}} />
                                        }
                                        {!this.props.isOwner &&
                                        <div className={'text-center final-buttons'}>
                                            <Button onClick={() => this._showModal("redeem")}>
                                                Redeem
                                            </Button>
                                            <Button onClick={() => this._showModal("donate")}>
                                                Donate
                                            </Button>
                                        </div>
                                        }
                                    </div>
                                </div>
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
                                                                this.state.action === "redeem" ? this.props.actionRedeem() : this.props.actionReject();
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
                            </div>
                            }
                            {this.props.redeemBalance &&
                            <div className={"map-container closed-info"}>
                                <div>
                                    <h2 className={"text-center"}>
                                        CLOSED REQUEST
                                    </h2>
                                    <div className={'text-left'}>
                                        <p>
                                            This request was closed and is now in the redeeming state.
                                            {this.props.isOwner &&
                                            <span>
                                                As the owner of this request, you can redeem the remaing balance or donate ir
                                                to other requests of the network.
                                            </span>
                                            }
                                        </p>
                                        {this.props.closingMessage ?
                                            <div className={'closing-message'}>
                                                <h4>Here's a message from the request's creator: </h4>
                                                <div className={'c-message'}>
                                                    {this.props.closingMessage}
                                                </div>
                                            </div>
                                            :
                                            <div style={{height: '275px'}} />
                                        }
                                        {this.props.isOwner &&
                                        <div className={'text-center final-buttons'}>
                                            <Button onClick={() => this._showModal("redeem")}>
                                                Redeem
                                            </Button>
                                            <Button onClick={() => this._showModal("donate")}>
                                                Donate
                                            </Button>
                                        </div>
                                        }
                                    </div>
                                </div>
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
                                                                this.state.action === "redeem" ? this.props.actionRedeem() : this.props.actionReject();
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
                            </div>
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

BasicDetails.defaultProps = {
    showMap: false,
    redeemIncentives: false,
    redeemBalance: false,
};

export default BasicDetails;