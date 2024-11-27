require("@chainlink/env-enc").config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("./task")

const PRIVATE_KEY = process.env.PRIVATE_KEY
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const LINEA_SEPOLIA_RPC_URL = process.env.LINEA_SEPOLIA_RPC_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.27"
      }
    ]
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    }
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
      companionNetworks: {
        destChain: "linea"
      }
    },
    linea: {
      url: LINEA_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 59141,
      blockConfirmations: 6,
      companionNetworks: {
        destChain: "sepolia"
      }
    }
  }
};