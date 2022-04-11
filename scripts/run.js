const {ethers} = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();

  //console.log("Contract deployed to:", waveContract.address);
  //console.log("Contract deployed by:", owner.address);

  let waveCount;
  let allWaves;

  // let contractBalance = await hre.ethers.provider.getBalance(
  //   waveContract.address
  // );
  // console.log("contractBalance", hre.ethers.utils.formatEther(contractBalance));

  //waveCount = await waveContract.getWaveCount();
  //console.log("waveCount : ", waveCount.toString());

  let waveTxn = await waveContract.wave("Heeeeelllllooooo");
  let receipt = await waveTxn.wait();
  console.log(receipt)
  console.log(receipt.events)
  console.log(receipt.events.args);


  // waveContract.on("waveEvent",(from, message, time)=> {
  //   console.log(from,message,time);
  // });
  //waveCount = await waveContract.getWaveCount();
  //console.log("waveCount : ", waveCount.toString());

  // contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  // console.log("contractBalance", hre.ethers.utils.formatEther(contractBalance));

  // allWaves = await waveContract.getAllWaves();
  // console.log(allWaves);


  // for (let i = 0; i < 10; i++) {
  //   waveTxn = await waveContract.connect(randomPerson).wave("let me win!");
  //   await waveTxn.wait();
  //   contractBalance = await hre.ethers.provider.getBalance(
  //     waveContract.address
  //   );
  //   console.log(
  //     "contractBalance",
  //     hre.ethers.utils.formatEther(contractBalance)
  //   );
  // }

  // allWaves = await waveContract.getAllWaves();
  // console.log(allWaves);
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
//0x7509d78CDb63eb5A2BEAf12f5C8ACdf1915Ff9f3
