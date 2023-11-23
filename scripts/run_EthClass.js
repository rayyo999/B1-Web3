const {ethers} = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const chatContractFactory = await hre.ethers.getContractFactory(
    "ChatContract"
  );
  const chatContract = await chatContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await chatContract.deployed();

  //console.log("Contract deployed to:", waveContract.address);
  //console.log("Contract deployed by:", owner.address);

  let chatCount;
  let allChats;

  chatContract.on("chatEvent", (index, from, to, message, time) => {
    console.log(index, from, to, message, time);
  });

  // let contractBalance = await hre.ethers.provider.getBalance(
  //   waveContract.address
  // );
  // console.log("contractBalance", hre.ethers.utils.formatEther(contractBalance));

  //waveCount = await waveContract.getWaveCount();
  //console.log("waveCount : ", waveCount.toString());

  let chatTxn = await chatContract.chat(
    randomPerson.address,
    "Heeeeelllllooooo"
  );
  let receipt = await chatTxn.wait();
  console.log("receipt", receipt);
  console.log("receipt-events", receipt.events);
  console.log("receipt.events.args", receipt.events[0].args);
  console.log("receipt.events.blockHash", receipt.events[0].blockHash);

  chatTxn = await chatContract.chat(randomPerson.address, "2");
  receipt = await chatTxn.wait();
  chatTxn = await chatContract.chat(randomPerson.address, "3");
  receipt = await chatTxn.wait();
  chatTxn = await chatContract.chat(randomPerson.address, "4");
  receipt = await chatTxn.wait();

  chatTxn = await chatContract.getChatCount();
  // receipt = await chatTxn.wait();
  // console.log("getChatCount:" ,receipt);
  console.log("getChatCount:", chatTxn);
  chatTxn = await chatContract.getAllChats();
  // receipt = await chatTxn.wait();
  // console.log("getAllChats:", receipt);
  console.log("getAllChats:", chatTxn);
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
