import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../../assets/animation'
import Button from "../button/Button";

export default class Loading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false};
    }

    render() {

        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div className={`animation-container ${this.props.className}`}>
                <Lottie options={defaultOptions}
                        height={this.props.height}
                        width={this.props.width}
                />
            </div>
        )
    }
}


Loading.defaultProps = {
    className: '',
    style: {},
    height: 200,
    width: 200
};