import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: '0.8.4',
  // solidity: { compiler: [{ version: '0.8.4' }, { version: '0.6.6' }] },
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.ALCHEMY_KEY_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    // to verify contract on etherscan
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enable: true,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: 'MATIC',
  },
}

//if error : npx hardhat clean -> npx hardhat compile(deploy)
//npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
//npx hardhat verify --network rinkeby 0x99B70891824745237998d5F95631E35d3169515e
//npx hardhat verify --network rinkeby 0x238707996bdAacB2e60dA379851da0C5B68Dd9ea "0x99B70891824745237998d5F95631E35d3169515e"

//npx hardhat verify --network rinkeby 0x40Dd212E485AE1Ce7D6527c990860A7032658c8C
//npx hardhat verify --network rinkeby 0x85dd2C7629f76bfC45A686f385bc6BEb0C7ed096 "0x40Dd212E485AE1Ce7D6527c990860A7032658c8C"

//npx hardhat verify --network rinkeby 0x4F97058ebB7e0194a03a85aA2ed81A2910978264
//0x4F97058ebB7e0194a03a85aA2ed81A2910978264
//0x9eE79286aE5D5cf756E4Daf524965bda9B0810F8
//npx hardhat verify --network rinkeby 0x9eE79286aE5D5cf756E4Daf524965bda9B0810F8 "0x4F97058ebB7e0194a03a85aA2ed81A2910978264"
