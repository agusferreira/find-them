'use strict';

// Init & set infure provider
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "nephew gap absurd clay upper manage accident ensure private topic mention chunk";
var rinkeby_provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/6a38bf6089ba43d59418b0ba54c6c5f1");
var ropsten_provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/5e1ece6b79e44b798852e50f68c5360b");

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 7545,
      gas: 5000000,
      network_id: '*'
    }
    ,rinkeby: {
      provider: rinkeby_provider,
      network_id: 4
    }
    ,ropsten: {
      provider: ropsten_provider,
      network_id: 3,
    },

  }
};
