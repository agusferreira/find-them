import React, { Component } from 'react';

import './button.scss';

export default class Button extends Component {

    render() {

        let {color, className, onClick, children, disabled} = this.props;

        if(disabled){
            return (
                <button onClick={onClick} disabled={'disabled'}
                        className={`santander-button ${className} disabled`}>
                    {children}
                </button>
            );
        }

        return (
            <button onClick={onClick}
                className={`santander-button ${color} ${className}`}>
                {children}
            </button>
        );
    }
}

Button.defaultProps = {
    onClick: () => {},
    className: '',
    color: '',
    disabled: false
};