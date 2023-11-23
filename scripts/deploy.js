const {ethers} = require('hardhat');
// const main = async () => {
//   //const [deployer] = await hre.ethers.getSigners();
//   //const accountBalance = await deployer.getBalance();

//   //console.log("Deploying contracts with account:", deployer.address)
//   //console.log("Account Balance:", accountBalance.toString());

//   const chatContractFactory = await hre.ethers.getContractFactory(
//     "ChatContract"
//   );
//   const chatContract = await chatContractFactory.deploy({value: hre.ethers.utils.parseEther("0.001")});
//   await chatContract.deployed();

//   console.log("WavePortal address: ", chatContract.address);
// };

// const runMain = async () => {
//   try {
//     await main();
//     process.exit(0);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };
// runMain();


const main = async () => {
  const tokenContractFactory = await ethers.getContractFactory('MyToken');
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  console.log("token address: ", tokenContract.address);
  const escrowContractFactory = await ethers.getContractFactory('MyEscrow');
  const escrowContract = await escrowContractFactory.deploy(
    tokenContract.address
  );
  await escrowContract.deployed();
  console.log("escrow address: ", escrowContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();


//token
// 0x6934572c78155DaF175E7fC539784E6fd4B144Cc

//escrow
// 0xd05592D89E29fd95d7EEff7DE446c6B1319Ac4ff

// token address:  0x1967bf604F61f438C7c60dB3aEfBf0993b993C76
// escrow address:  0xBDd2d0A69c40de6Cf1b1a1620F1fDB184317D753