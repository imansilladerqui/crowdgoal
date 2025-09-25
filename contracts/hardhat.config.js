const dotenv = require("dotenv");

// Load the correct env file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.integration";
dotenv.config({ path: envFile });

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
      url: process.env.RPC_URL || "https://rpc.chiliz.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
