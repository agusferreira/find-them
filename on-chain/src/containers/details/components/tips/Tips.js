import React, {Component} from 'react';

import {Panel,Grid} from 'react-bootstrap';

import './styles.scss';


class Tips extends Component {

    render() {

        return (
            <Grid >
                <Panel bsStyle={this.props.type}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">{this.props.title}</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>{this.props.hint}</Panel.Body>
                </Panel>

            </Grid>
        )

    }

}

export default Tips;