import FindRequestFactory from '../build/contracts/FindRequestFactory';
import FindRequest from '../build/contracts/FindRequest';

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://rinkeby.infura.io/v3/5e1ece6b79e44b798852e50f68c5360b'
        }
    },
    events: {
    },
    contracts: [
        FindRequestFactory,
        // FindRequest
    ],
};

export default drizzleOptions
