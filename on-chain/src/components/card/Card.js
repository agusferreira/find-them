import React from 'react';

import MaterialIcon from 'material-icons-react';
import {Button} from "react-bootstrap";

import './card.scss';


function Card({image, name, lastSeenLocation, lastSeenDate, action}) {
    return (
        <div className={'card-container'}>
            <div className={'card-title-image'}>
                <img src={image} alt={'Name'} />
            </div>
            <div className={'card-body'}>
                <h1 className={'truncate'}>{name}</h1>
                <p className={'truncate'}>Last seen at {lastSeenDate}</p>
                <p className={'truncate'}>Near {lastSeenLocation}</p>
                <div className={'card-call-to-action'}>
                    <Button className onClick={action}>
                        <MaterialIcon icon={"arrow_forward"} />
                    </Button>
                </div>
            </div>
        </div>
    );
}


export default Card;