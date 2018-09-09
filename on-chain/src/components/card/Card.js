import React, {Component} from 'react';

import MaterialIcon from 'material-icons-react';
import {Button} from "react-bootstrap";

import './card.scss';
import Geocode from "react-geocode";


class Card extends Component {
    constructor(props){
        super(props);
        this.state={
            address:'',
        }
    }

    _findReverseGeocoding = () =>{
        Geocode.setApiKey("AIzaSyDe1q7rvBSFYyG_d87OZplzm5IVeJodp6A");
        let latLang= this.props.lastSeenLocation.split(",");
        console.log(latLang);
        Geocode.fromLatLng(latLang[0], latLang[1]).then(
            response => {
                const address = response.results[0].formatted_address;
                console.log(address);
                this.setState({address});
            },
            error => {
                console.error(error);
            }
        );
    };

    componentDidMount (){
        this._findReverseGeocoding();
    };

    render(){
        let {image, name, lastSeenDate, action} = this.props;


        return (
        <div className={'card-container'}>
            <div className={'card-title-image'}>
                <img src={image} alt={'Name'} />
            </div>
            <div className={'card-body'}>
                <h1 className={'truncate'}>{name}</h1>
                <p className={'truncate'}>Last seen on {lastSeenDate}</p>
                <p className={'truncate'}>Near {this.state.address}</p>
                <div className={'card-call-to-action'}>
                    <Button className onClick={action}>
                        <MaterialIcon icon={"arrow_forward"} />
                    </Button>
                </div>
            </div>
        </div>
    );
}


}


export default Card;