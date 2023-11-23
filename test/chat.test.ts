// const {expect} = require('chai');
import {expect} from 'chai';
import {ethers, network} from 'hardhat';
import {Signer, Contract} from 'ethers';
import {parseUnits} from 'ethers/lib/utils';

let owner: Signer, user1: Signer, user2: Signer;
let owner_Ad: string, user1_Ad: string, user2_Ad: string;
let tokenContract: Contract, escrowContract: Contract;

beforeEach(async () => {
  [owner, user1, user2] = await ethers.getSigners();
  owner_Ad = await owner.getAddress();
  user1_Ad = await user1.getAddress();
  user2_Ad = await user2.getAddress();
  //deploy token Contract
  const tokenContractFactory = await ethers.getContractFactory('MyToken');
  tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  //deploy escrow Contract
  const escrowContractFactory = await ethers.getContractFactory('MyEscrow');
  escrowContract = await escrowContractFactory.deploy(tokenContract.address);
  await escrowContract.deployed();
});

describe('Escrow Contract :', () => {
  // beforeEach(async () => {
  //   await tokenContract.transfer(escrowContract.address, 1000000);
  //   await tokenContract.transfer(user1_Ad, 10000);
  //   await tokenContract.transfer(user2_Ad, 20000);
  //   await tokenContract.connect(user1).approve(escrowContract.address, 10000);
  //   await tokenContract.connect(user2).approve(escrowContract.address, 20000);
  // });

  //npx hardhat test --grep 'everyone can get token' ///will run which ( it ) includes
  it('everyone can get token for free',async()=>{
    //remove beforeEach first
    const oneToken = ethers.utils.parseUnits('1',18);
    await tokenContract.connect(user1).freeToMint();
    expect( await tokenContract.balanceOf(user1_Ad)).to.equal(oneToken)
  })
  // it('check updateDeposits function', async () => {
  //   await escrowContract.connect(user1).deposit_DD(10000);
  //   // await ethers.provider.send('evm_increaseTime', [3600 * 24 * 365]);
  //   await network.provider.send('hardhat_mine', [
  //     ethers.utils.hexStripZeros(ethers.utils.hexlify(2)),
  //     ethers.utils.hexStripZeros(ethers.utils.hexlify(3600*24*365))
  //   ]);
  //   const a = await escrowContract.connect(user1).depositsOf_DD();
  //   console.log(a);
  // });
  // it('give bonus:', async () => {
  //   await escrowContract.connect(user1).deposit_DD(2500);
  //   await escrowContract.connect(user1).deposit_FD_30(2500);
  //   await escrowContract.connect(user1).deposit_FD_60(2500);
  //   await escrowContract.connect(user1).deposit_FD_90(2500);
  //   await escrowContract.connect(user2).deposit_DD(9000);
  //   expect(await escrowContract.maxDepositor()).to.equal(user1_Ad);
  //   await expect(escrowContract.giveBonusTo(user1_Ad))
  //     .to.emit(escrowContract, 'GiveBonus')
  //     .withArgs(user1_Ad, (await ethers.provider.getBlock('latest')).timestamp);
  //   console.log(await escrowContract.connect(user1).depositsOf_DD());
  // });
  // it('users deposit and withdraw with BigNumber', async () => {
  //   // clear beforeEach first
  //   await tokenContract.transfer(escrowContract.address, parseUnits('100', 18));
  //   await tokenContract.transfer(user1_Ad, parseUnits('1', 18));
  //   await tokenContract.transfer(user2_Ad, parseUnits('2', 18));
  //   await tokenContract
  //     .connect(user1)
  //     .approve(escrowContract.address, parseUnits('1', 18));
  //   await tokenContract
  //     .connect(user2)
  //     .approve(escrowContract.address, parseUnits('2', 18));
  //   // deposit
  //   await escrowContract.connect(user1).deposit_FD_30(parseUnits('0.5', 18));
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(
  //     parseUnits('0.5', 18)
  //   );
  //   expect(await escrowContract.connect(user1).depositsOf_FD_30()).to.equal(
  //     parseUnits('0.5', 18)
  //   );
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     parseUnits('100.5', 18)
  //   );
  //   // withdraw
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_30()
  //   ).to.be.revertedWith("It's locked !");
  //   //deposit again
  //   await escrowContract.connect(user1).deposit_FD_30(parseUnits('0.5', 18));
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(0);
  //   expect(await escrowContract.connect(user1).depositsOf_FD_30()).to.equal(
  //     parseUnits('1', 18)
  //   );
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     parseUnits('101', 18)
  //   );
  // });
  // it('users deposit and withdraw FD_90', async () => {
  //   //deposit
  //   await escrowContract.connect(user1).deposit_FD_90(1);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(9999);
  //   //withdraw
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_90()
  //   ).to.be.revertedWith("It's locked !");
  //   //change time
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 90]);
  //   await escrowContract.connect(user1).withdraw_FD_90();
  //   expect(await escrowContract.connect(user1).depositsOf_FD_90()).to.equal(0);
  //   //withdraw again
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_90()
  //   ).to.be.revertedWith("It's locked !");
  //   let balance = await tokenContract.balanceOf(user1_Ad);
  //   //x2
  //   await escrowContract.connect(user1).deposit_FD_90(1);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(balance - 1);
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_90()
  //   ).to.be.revertedWith("It's locked !");
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 90]);
  //   await escrowContract.connect(user1).withdraw_FD_90();
  //   expect(await escrowContract.connect(user1).depositsOf_FD_90()).to.equal(0);
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_90()
  // ).to.be.revertedWith("It's locked !");
  // });
  // it('users deposit and withdraw FD_60', async () => {
  //   //deposit
  //   await escrowContract.connect(user1).deposit_FD_60(1);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(9999);
  //   //withdraw
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_60()
  //   ).to.be.revertedWith("It's locked !");
  //   //change time
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 60]);
  //   await escrowContract.connect(user1).withdraw_FD_60();
  //   expect(await escrowContract.connect(user1).depositsOf_FD_60()).to.equal(0);
  //   //withdraw again
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_60()
  //   ).to.be.revertedWith("It's locked !");
  //   let balance = await tokenContract.balanceOf(user1_Ad);
  //   //x2
  //   await escrowContract.connect(user1).deposit_FD_60(1);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(balance - 1);
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_60()
  //   ).to.be.revertedWith("It's locked !");
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 60]);
  //   await escrowContract.connect(user1).withdraw_FD_60();
  //   expect(await escrowContract.connect(user1).depositsOf_FD_60()).to.equal(0);
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_60()
  //   ).to.be.revertedWith("It's locked !");
  // });
  // it('users deposit and withdraw FD_30', async () => {
  //   // deposit
  //   await escrowContract.connect(user1).deposit_FD_30(5000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(5000);
  //   expect(await escrowContract.connect(user1).depositsOf_FD_30()).to.equal(
  //     5000
  //   );
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1005000
  //   );
  //   // withdraw
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_30()
  //   ).to.be.revertedWith("It's locked !");
  //   //deposit again
  //   await escrowContract.connect(user1).deposit_FD_30(5000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(0);
  //   expect(await escrowContract.connect(user1).depositsOf_FD_30()).to.equal(
  //     10000
  //   );
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1010000
  //   );
  //   //change time
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 30]);
  //   await escrowContract.connect(user1).withdraw_FD_30();
  //   let balance = await tokenContract.balanceOf(user1_Ad);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(11643);
  //   expect(await escrowContract.connect(user1).depositsOf_FD_30()).to.equal(0);
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1010000 - 11643
  //   );
  //   //withdraw again
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_30()
  //   ).to.be.revertedWith("It's locked !");
  //   //x2
  //   await tokenContract.connect(user1).approve(escrowContract.address, 2);
  //   await escrowContract.connect(user1).deposit_FD_30(1);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(balance - 1);
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_30()
  //   ).to.be.revertedWith("It's locked !");
  //   await escrowContract.connect(user1).deposit_FD_30(1);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(balance - 2);
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 30]);
  //   await escrowContract.connect(user1).withdraw_FD_30();
  //   expect(await escrowContract.connect(user1).depositsOf_FD_30()).to.equal(0);
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_30()
  //   ).to.be.revertedWith("It's locked !");
  // });
  // it('users deposit and withdraw DD', async () => {
  //   await escrowContract.connect(user1).deposit_DD(10000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(0);
  //   expect(await escrowContract.connect(user1).depositsOf_DD()).to.equal(10000);
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1010000
  //   );
  //   await escrowContract.connect(user1).withdraw_DD(5000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(5000);
  //   expect(await escrowContract.connect(user1).depositsOf_DD()).to.equal(5000);
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1005000
  //   );
  //   await tokenContract.connect(user1).approve(escrowContract.address, 5000);
  //   await escrowContract.connect(user1).deposit_DD(5000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(0);
  //   expect(await escrowContract.connect(user1).depositsOf_DD()).to.equal(10000);
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1010000
  //   );
  //   after 1 year
  //   await ethers.provider.send('evm_increaseTime', [3600 * 24 * 30 * 365]);
  //   await escrowContract.connect(user1).withdraw_DD(10000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(10000);
  //   expect(await escrowContract.connect(user1).depositsOf_DD()).to.equal(10000);
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     1000000
  //   );
  //   await escrowContract.connect(user1).withdraw_DD(10000);
  //   expect(await tokenContract.balanceOf(user1_Ad)).to.equal(20000);
  //   expect(await escrowContract.connect(user1).depositsOf_DD()).to.equal(0);
  //   expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
  //     990000
  //   );
  // });
  // it('users cannot check balance and withdraw before making deposit', async () => {
  //   await expect(
  //     escrowContract.connect(user2).depositsOf_DD()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user2).depositsOf_FD_30()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user2).depositsOf_FD_60()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user2).depositsOf_FD_90()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user1).withdraw_DD(1000)
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_30()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_60()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  //   await expect(
  //     escrowContract.connect(user1).withdraw_FD_90()
  //   ).to.be.revertedWith("Haven't deposit yet!");
  // });
});

// describe('Token Contract', () => {
//   it('transfer tokens to contract and users', async () => {
//     await tokenContract.transfer(escrowContract.address, 1000000000);
//     expect(await tokenContract.balanceOf(escrowContract.address)).to.equal(
//       1000000000
//     );
//     await tokenContract.transfer(user1_Ad, 10000);
//     expect(await tokenContract.balanceOf(user1_Ad)).to.equal(10000);
//     await tokenContract.transfer(user2_Ad, 20000);
//     expect(await tokenContract.balanceOf(user2_Ad)).to.equal(20000);
//   });
//   it('users approve', async () => {
//     await tokenContract.connect(user1).approve(escrowContract.address, 10000);
//     expect(
//       await tokenContract.allowance(user1_Ad, escrowContract.address)
//     ).to.equal(10000);
//     await tokenContract.connect(user2).approve(escrowContract.address, 20000);
//     expect(
//       await tokenContract.allowance(user2_Ad, escrowContract.address)
//     ).to.equal(20000);
//   });
// });
