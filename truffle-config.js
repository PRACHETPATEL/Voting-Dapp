module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost
      port: 7545,          // Ganache's default port
      network_id: 5777,     // Any network id
    },
    deployment: {
      host: "127.0.0.1",  // Localhost
      port: 7545,          // Ganache's default port
      network_id: 5777,     // Any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",  // Solidity version
    },
  },
};
