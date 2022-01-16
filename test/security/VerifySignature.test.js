const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerifySignature", () => {
  let etherWallet;
  let _deployer;

  beforeEach(async () => {
    const VerifySignature = await ethers.getContractFactory("VerifySignature");
    verifySignature = await VerifySignature.deploy();
    await verifySignature.deployed();

    const [deployer] = await ethers.getSigners();
    _deployer = deployer;
  });
  it("sends and withdraws Ether from contract", async () => {});
});
