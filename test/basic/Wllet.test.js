const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtherWallet", () => {
  let etherWallet;
  let _deployer;

  beforeEach(async () => {
    const EtherWallet = await ethers.getContractFactory("EtherWallet");
    etherWallet = await EtherWallet.deploy();
    await etherWallet.deployed();

    const [deployer] = await ethers.getSigners();
    _deployer = deployer;
  });
  it("sends and withdraws Ether from contract", async () => {
    const eth0 = ethers.utils.parseEther("0");
    const eth1 = ethers.utils.parseEther("1");
    const tx1 = await _deployer.sendTransaction({
      to: etherWallet.address,
      value: eth1,
    });
    await tx1.wait();

    expect(await etherWallet.getBalance()).to.equal(eth1);

    const tx2 = await etherWallet.withdraw(eth1);
    await tx2.wait();

    expect(await etherWallet.getBalance()).to.equal(eth0);
  });
});
