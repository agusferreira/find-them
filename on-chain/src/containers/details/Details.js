import React, {Component} from 'react';

import {Grid, Col, Row} from 'react-bootstrap';
import './style.scss';
import BasicDetails from "./components/basicDetails/BasicDetails";
import Tips from "./components/tips/Tips";

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hints: [{type:'success',hint:"Waldo was seen in Full Node programming"},
                {type:'danger',hint:"Waldo was seen in Berghain drunk AF"},
                {type:'info', hint:"Waldo was in ETHBerlin pitball"},
                {type:'success',hint:"Waldo was seen in Full Node programming"},
                {type:'danger',hint:"Waldo was seen in Berghain drunk AF"},
                {type:'info', hint:"Waldo was in ETHBerlin pitball"}]
        }
    }

    _renderHints = ()=>{
        return this.state.hints.map((hint,index)=>{
            return <Tips key={hint.hint} type={hint.type} title={`Hint ${index+1}`} hint={hint.hint}/>})
    };

    render() {

        return (
            <div>
                <BasicDetails name={"Waldo Perez"} age={"12 years old"} location={"Görlitzer Park, Berlin"}
                              date={"07/09/2018"} contact={"john.doe@gmail.com"}
                              description={"1.80m, dark hair, blue eyes"}
                              incentive={"12 ETH"}/>

                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h2 className={"title"}>Hints</h2>
                            {this._renderHints()}
                        </Col>
                    </Row>
                </Grid>
            </div>
        )

    }

}

export default Details;