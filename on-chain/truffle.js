'use strict';

// Init & set infure provider
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "nephew gap absurd clay upper manage accident ensure private topic mention chunk";
var infura_provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/6a38bf6089ba43d59418b0ba54c6c5f1");

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 7545,
      gas: 5000000,
      network_id: '*'
    }
    , rinkeby: {
      provider: infura_provider,
      network_id: 4
    }
  }
};
