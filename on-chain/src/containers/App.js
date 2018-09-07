import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './../containers/home/Home';
import Details from './../containers/details/Details';

class App extends Component {

    constructor(props, context) {
        super(props);
    }

    render() {

        /*
        if(this.context && this.context.drizzle && this.context.drizzle.web3){
            let web3 = this.context.drizzle.web3;
            web3.eth.net.getNetworkType().then(console.log);
        }
        */

        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/detail/:address" component={Details} />
                </Switch>
            </Router>
        );
    }

}

App.contextTypes = {
    drizzle: PropTypes.object
};

export default App;