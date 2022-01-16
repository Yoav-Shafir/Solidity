const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SendEther", () => {
  let sendEther;
  let ethReceiver;
  let _deployer;

  beforeEach(async () => {
    const SendEther = await ethers.getContractFactory("SendEther");
    sendEther = await SendEther.deploy();
    await sendEther.deployed();

    const EthReceiver = await ethers.getContractFactory("EthReceiver");
    ethReceiver = await EthReceiver.deploy();
    await ethReceiver.deployed();

    const [deployer] = await ethers.getSigners();
    _deployer = deployer;

    // fund the `SendEther` contract with 10 ether
    const tx = await _deployer.sendTransaction({
      to: sendEther.address,
      value: ethers.utils.parseEther("10"), // 10 ether
    });
    await tx.wait();

    // check the balance
    const balance = await ethers.provider.getBalance(sendEther.address);

    // console.log(`Contract SendEther balance: ${balance}`);
  });
  it("should send ether to the `EthReceiver` contract", async () => {
    const tx1 = await sendEther.sendViaTransfer(ethReceiver.address);
    await tx1.wait();

    const tx2 = await sendEther.sendViaSend(ethReceiver.address);
    await tx2.wait();

    const tx3 = await sendEther.sendViaCall(ethReceiver.address);
    await tx3.wait();

    const balance = await ethers.provider.getBalance(ethReceiver.address);
    expect(balance).to.equal(ethers.utils.parseEther("3"));
  });
});
