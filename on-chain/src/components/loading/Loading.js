import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../../assets/animation'

export default class Loading extends React.Component {

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