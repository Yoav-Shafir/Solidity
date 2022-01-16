const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeMath", () => {
  let safeMath;

  beforeEach(async () => {
    const SafeMath = await ethers.getContractFactory("SafeMath");
    safeMath = await SafeMath.deploy();
    await safeMath.deployed();
  });
  it("should throw an an error", async () => {
    try {
      await safeMath.testUnderFlow();
    } catch (err) {
      expect(err.message).to.have.string(
        "Arithmetic operation underflowed or overflowed outside of an unchecked block"
      );
    }
  });

  it("should underflow", async () => {
    expect(await safeMath.testUncheckedUnderFlow()).to.equal(255);
  });
});

describe("CustomError", () => {
  it("should throw Unauthorized custom error", async () => {
    const CustomError = await ethers.getContractFactory("CustomError");
    customError = await CustomError.deploy();
    await customError.deployed();

    const [_, account1] = await ethers.getSigners();

    try {
      await customError.connect(account1).withdraw();
    } catch (err) {
      expect(err.message).to.have.string("Unauthorized");
    }
  });
});

describe("FunctionsOutsideContract", () => {
  it("should multiply by 2", async () => {
    const FunctionsOutsideContract = await ethers.getContractFactory(
      "FunctionsOutsideContract"
    );
    const functionsOutsideContract = await FunctionsOutsideContract.deploy();
    await functionsOutsideContract.deployed();

    expect(await functionsOutsideContract.useHelper(2)).to.equal(4);
  });
});

describe("Import", () => {
  it("should use the correct helper", async () => {
    const Import = await ethers.getContractFactory("Import");
    const _import = await Import.deploy();
    await _import.deployed();

    expect(await _import.useLocalHelper(2)).to.equal(1);
    expect(await _import.useImportedHelper(2)).to.equal(4);
  });
});

describe("Create2", () => {
  it("should predict the address where the contract will be deployed", async () => {
    const Create2 = await ethers.getContractFactory("Create2");
    const create2 = await Create2.deploy();
    await create2.deployed();

    const salt = await create2.getBytes32(123);
    expect(salt).to.equal(
      "0x000000000000000000000000000000000000000000000000000000000000007b"
    );

    const constructorArg = 777;
    const predictedAddress = await create2.getAddress(salt, constructorArg);
    expect(predictedAddress).to.equal(
      "0x2e0dDDa29B27F0Ce058238936b8596cee3047FA7"
    );

    const tx = await create2.createDSalted(salt, constructorArg);
    await tx.wait();

    const deployedAddress = await create2.deployedAddress();

    expect(deployedAddress).to.equal(predictedAddress);
  });
});
