import React from 'react';

import {Link} from 'react-router-dom';
import {Navbar} from 'react-bootstrap';

import logo from '../../assets/find-them-blue-aqua.png';
import './header.scss';


function Header() {
    return (
        <Navbar className={'app-header'}>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to={'/'}>
                        <img src={logo} alt={'Find Them Logo'} />
                    </Link>
                </Navbar.Brand>
            </Navbar.Header>
        </Navbar>
    );
}


export default Header;