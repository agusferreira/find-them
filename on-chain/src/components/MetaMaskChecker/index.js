import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}


class MetaMaskChecker extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            slideOpen: false
        }

    }

    componentDidMount(){
        setTimeout(this.checkMetamask, 5000);
    }


    render(){

        return (
            <div>
                {this.props.children}
                <Dialog
                    open={this.state.slideOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Wanna buidl?"}
                        <div className={'modal-subtitle'}>
                            You’ll need an account to deploy your rules!
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText className={"modal-image"}>
                            <img src={"https://www.cryptokitties.co/images/metamask-browser.svg"}
                                 alt={"Get Metamask"} />
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-slide-description">
                            The perfect tool is MetaMask. This will also act as your login for you to monitor your deployed rules.
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-slide-description">
                            <b>Do you already have Metamask installed?</b> Make sure that your account is not blocked.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className={'modal-action-buttons'}>
                        <Link to={"//metamask.io"} target={"_blank"}>
                            <Button onClick={this.handleClose} color="secondary" variant="contained">
                                Get Metamask
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

MetaMaskChecker.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus,
        web3: state.web3
    }
};

const MetaMaskContainer = drizzleConnect(MetaMaskChecker, mapStateToProps);

export default MetaMaskContainer
