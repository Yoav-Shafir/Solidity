const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControl", () => {
  const adminRoleHash =
    "0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42";
  const userRoleHash =
    "0x2db9fd3d099848027c2383d0a083396f6c41510d7acfd92adc99b6cffcf31e96";
  let accessControl;
  let _deployer;
  let _account1;

  beforeEach(async () => {
    const AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.deployed();

    const [deployer, account1] = await ethers.getSigners();
    _deployer = deployer;
    _account1 = account1;
  });
  it("should confirm that contract deployer has ADMIN role", async () => {
    expect(await accessControl.roles(adminRoleHash, _deployer.address)).to.be
      .true;
  });

  it("should grant role USER to different account", async () => {
    const tx = await accessControl
      .connect(_deployer)
      .grantRole(userRoleHash, _account1.address);
    await tx.wait();

    expect(await accessControl.roles(userRoleHash, _account1.address)).to.be
      .true;
  });

  it("should revoke role USER from account", async () => {
    const tx = await accessControl
      .connect(_deployer)
      .revokeRole(userRoleHash, _account1.address);
    await tx.wait();

    expect(await accessControl.roles(userRoleHash, _account1.address)).to.be
      .false;
  });
});
