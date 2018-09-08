/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

// Init & set infura provider 
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "nephew gap absurd clay upper manage accident ensure private topic mention chunk";
var infura_provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/6a38bf6089ba43d59418b0ba54c6c5f1")

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 7545,
      gas: 5000000,
      network_id: '*'
    }
    ,rinkeby: {
      provider: infura_provider,
      network_id: 4
    }
  }
};
