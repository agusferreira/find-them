import React from 'react'
import Loading from "./Loading";
import './styles.scss';

export default class LoadingPageBlockchain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false};
    }

    render() {

        return (
            <div className={`blockchain-animation-container`}>
                <div className={'block-message'}>
                    <p>
                        We're retrieving the information you requested from the network. Please be patient
                    </p>
                    <p>
                        Make sure that you're using Chrome or Firebox with Metamask installed and unlocked
                    </p>
                    <p>
                        In case you don't have Metamask, <a href={"https://metamask.io/"} target={"_blank"}>you can find it here</a>
                    </p>
                    <Loading />
                </div>
            </div>
        )
    }
}