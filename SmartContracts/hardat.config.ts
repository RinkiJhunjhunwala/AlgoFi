import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "algorand-evm-testnet": {
      url: process.env.ALGORAND_EVM_TESTNET_RPC || "https://testnet-api.algonode.cloud",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 412346,
    },
  },
  etherscan: {
    apiKey: {
      "algorand-evm-testnet": "testnet",
    },
    customChains: [
      {
        network: "algorand-evm-testnet",
        chainId: 412346,
        urls: {
          apiURL: "https://testnet.algoexplorerapi.io/evm",
          browserURL: "https://testnet.algoexplorer.io",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;