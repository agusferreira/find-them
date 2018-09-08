import React, {Component} from 'react';

import {Link} from 'react-router-dom';
import {Grid, Row, Col} from 'react-bootstrap';

import Header from "../header/Header";
import './errors.scss';


class PageNotFound extends Component {

    render(){
        return (
            <div>
                <Header />
                <Grid className={'error-body'}>
                    <Row>
                        <Col xs={12} sm={6} smOffset={3}>
                            <div className={'text-center'}>
                                <div className={'big-error'}>404</div>
                                <p className="text-center error-text">
                                    This page isn't available<br />
                                    The link you followed may be broken, or the page may have been removed.
                                </p>
                                <p className="text-center">
                                    <Link to={"/"}>Back To Home</Link>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


export default PageNotFound;