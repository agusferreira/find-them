import React, {Component} from 'react';

import {withRouter} from 'react-router-dom';
import {Grid, Row, Col} from 'react-bootstrap';

import Button from "../../../components/button/Button";

class GoToRequest extends Component{

    render(){

        return (
            <Grid className={'request-form'}>
                <Row>
                    <Col xs={12} className={'text-right'}>
                        <div className={'button-container'}>
                            <Button onClick={() => this.props.history.push(`/detail/${this.props.activeRequest}/`)}>
                                Go To Find Request
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }

}

export default withRouter(GoToRequest);