require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./src",
    tests: "./test",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    chilizTestnet: {
      url: "https://rpc.chiliz.com", // RPC de testnet Chiliz
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
