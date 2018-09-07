

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://rinkeby.infura.io/v3/6a38bf6089ba43d59418b0ba54c6c5f1'
        }
    },
    events: {
    },
    contracts: [
    ],
};

export default drizzleOptions
