const {ethers} = require('hardhat');

const main = async () => {
  const [owner, user1, user2] = await ethers.getSigners();
  //console.log("Contract deployed by:", owner.address);
  //deploy ERC20 -------------------------------
  const tokenContractFactory = await ethers.getContractFactory('MyToken');
  const tokenContract = await tokenContractFactory.deploy({
    // value: hre.ethers.utils.parseEther("0.1"),
  });
  await tokenContract.deployed();
  console.log('token Contract deployed to : ', tokenContract.address);

  //deploy Escrow -------------------------------
  const escrowContractFactory = await ethers.getContractFactory('MyEscrow');
  const escrowContract = await escrowContractFactory.deploy(
    tokenContract.address
  );
  await escrowContract.deployed();
  console.log('escrow Contract deployed to : ', escrowContract.address);

  //transfer token -------------------------------
  let txn = await tokenContract.transfer(tokenContract.address, 10000000);
  let receipt = await txn.wait();
  txn = await tokenContract.transfer(user1.address, 100);
  receipt = await txn.wait();
  txn = await tokenContract.transfer(user2.address, 200);
  receipt = await txn.wait();
  // console.log("token tranfer receipt:", receipt);
  // console.log("token tranfer gas used:", receipt.gasUsed);

  //check balance
  const user1_balance = await tokenContract.balanceOf(user1.address);
  console.log('balance of user1 : ', user1_balance);

  //user approve escrow before deposit
  txn = await tokenContract.connect(user1).approve(escrowContract.address, 100);
  receipt = await txn.wait();
  txn = await tokenContract.connect(user2).approve(escrowContract.address, 200);
  receipt = await txn.wait();

  console.log(
    '🚀 -----------------------------------------------------------------------🚀'
  );
  //user1 deposit 50
  txn = await escrowContract.connect(user1).deposit_DD(50);
  receipt = await txn.wait();
  console.log(' gas used:', receipt.gasUsed);
  receipt = await escrowContract.connect(user1).depositsOf_DD();
  console.log('user1 deposit amounts : ', receipt);
  console.log(
    '🚀 -----------------------------------------------------------------------🚀'
  );
  //user2 deposit 100
  txn = await escrowContract.connect(user2).deposit_DD(100);
  receipt = await txn.wait();
  receipt = await escrowContract.connect(user2).depositsOf_DD();
  console.log('user2 deposit amounts : ', receipt);
  console.log(
    '🚀 -----------------------------------------------------------------------🚀'
  );
  //user1 deposit 50 again
  txn = await escrowContract.connect(user1).deposit_DD(50);
  receipt = await txn.wait();
  receipt = await escrowContract.connect(user1).depositsOf_DD();
  console.log('user1 deposit amounts : ', receipt);
  console.log(
    '🚀 -----------------------------------------------------------------------🚀'
  );
  //user2 deposit 100 again
  txn = await escrowContract.connect(user2).deposit_DD(100);
  receipt = await txn.wait();
  receipt = await escrowContract.connect(user2).depositsOf_DD();
  console.log('user2 deposit amounts : ', receipt);


  // txn = await escrowContract.

  // let chatCount;
  // let allChats;

  // chatContract.on("chatEvent", (index, from, to, message, time) => {
  //   console.log(index, from, to, message, time);
  // });

  // // let contractBalance = await hre.ethers.provider.getBalance(
  // //   waveContract.address
  // // );
  // // console.log("contractBalance", hre.ethers.utils.formatEther(contractBalance));

  // //waveCount = await waveContract.getWaveCount();
  // //console.log("waveCount : ", waveCount.toString());

  // let chatTxn = await chatContract.chat(
  //   randomPerson.address,
  //   "Heeeeelllllooooo"
  // );
  // let receipt = await chatTxn.wait();
  // console.log("receipt", receipt);
  // console.log("receipt-events", receipt.events);
  // console.log("receipt.events.args", receipt.events[0].args);
  // console.log("receipt.events.blockHash", receipt.events[0].blockHash);

  // chatTxn = await chatContract.chat(randomPerson.address, "2");
  // receipt = await chatTxn.wait();
  // chatTxn = await chatContract.chat(randomPerson.address, "3");
  // receipt = await chatTxn.wait();
  // chatTxn = await chatContract.chat(randomPerson.address, "4");
  // receipt = await chatTxn.wait();

  // chatTxn = await chatContract.getChatCount();
  // // receipt = await chatTxn.wait();
  // // console.log("getChatCount:" ,receipt);
  // console.log("getChatCount:", chatTxn);
  // chatTxn = await chatContract.getAllChats();
  // // receipt = await chatTxn.wait();
  // // console.log("getAllChats:", receipt);
  // console.log("getAllChats:", chatTxn);
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
