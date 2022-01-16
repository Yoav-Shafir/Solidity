const { expect } = require("chai");
const { ethers } = require("hardhat");

const config = require("../../hardhat.config");
const GAS_PRICE_BN = ethers.BigNumber.from(config.networks.hardhat.gasPrice);

describe("Gas", () => {
  let gas;
  let _deployer;

  it("calculates transaction fee between accounts (EOA) and final balance", async () => {
    const [account0, account1] = await ethers.getSigners();
    const eth1 = ethers.utils.parseEther("1");

    // account0 balance before transaction
    const initialBalance = await ethers.provider.getBalance(account0.address);

    // transfer 1 eth from account0 to account1
    // transaction gas base fee 21000
    const tx = await account0.sendTransaction({
      to: account1.address,
      value: eth1,
    });
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;

    // this is constant, base fee
    expect(gasUsed.toString()).to.equal("21000");

    const txFee = GAS_PRICE_BN.mul(gasUsed);

    expect(txFee.toString()).to.equal("420000000000000");

    // get balance after transaction
    const balanceAfter = await ethers.provider.getBalance(account0.address);

    expect(balanceAfter).to.equal(initialBalance.sub(eth1).sub(txFee));
  });

  // TODO: add assertions
  it("gets the estimated gas before deploy and function call", async () => {
    const [deployer, account1] = await ethers.getSigners();
    const Gas = await ethers.getContractFactory("Gas");

    // estimate gas to be used for deployment
    const deploymentData = Gas.interface.encodeDeploy(["Initial value"]);
    const deploymentEstimatedGas = await ethers.provider.estimateGas({
      data: deploymentData,
    });

    // deploy the contract
    const gas = await Gas.deploy("Initial value");
    await gas.deployed();

    // estimate gas to be used for calling this function
    const gasEstimated = await gas.estimateGas.setValue("New value");
  });

  it("calculates cost of different parts of the transaction", async () => {
    const [deployer, account1] = await ethers.getSigners();
    const Gas = await ethers.getContractFactory("Gas");
    const gas = await Gas.deploy("Initial value");
    await gas.deployed();

    /*
    - From Eethereum yellow paper Appendix G. Fee Schedule:
    - `Gtxcreate` 32000 Paid by all contract-creating transactions after the Homestead transition.
    - `Gtxdatazero` 4 Paid for every zero byte of data or code for a transaction.
    - `Gtxdatanonzero` 16 Paid for every non-zero byte of data or code for a transaction.
    - `Gtransaction` 21000 Paid for every transaction (base fee)
    */

    const tx = await gas.saveB(5);

    // this is the payload we send to the network when calling the saveB(uint256) function
    const data = tx.data;
    expect(data).to.equal(
      "0x348218ec0000000000000000000000000000000000000000000000000000000000000005"
    );
    // payload components:
    // -------------------
    // 0x
    // 348218ec => function name, first 4 non zero bytes [34 82 18 ec] in hex
    // 0000000000000000000000000000000000000000000000000000000000000005 => function arguments, 31 zero bytes and 1 non zero byte

    // payload gas breakdown (without execution gas used):
    // ----------------------
    // 4 non zero bytes => 4 * 16 = 64 gas (Gtxdatanonzero)
    // 31 zero bytes => 31* 4 = 124 gas (Gtxdatazero)
    // 1 non zero byte => 1 * 16 = 16 gas (Gtxdatanonzero)
    // transaction base fee => 21000 (Gtransaction)
    // Total: 21204 gas

    // calculate execution cost:
    // -------------------------
    // total gas used - 21204

    // manually hashing the function interface
    const dataHexString = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("saveB(uint256)")
    );

    // when we do that, we can see that this hash also starts with 0x 348218ec, same as the tx data field
    expect(dataHexString).to.equal(
      "0x348218ec5e13d72ab0b6b9db1556cba7b0b97f5626b126d748db81c97e97e43d"
    );

    const receipt = await tx.wait();
    const txTotalGasUsed = receipt.gasUsed;
    const txCoastWithoutExecution = ethers.BigNumber.from("21204"); // `Gtransaction` fixed
    const txExecutionCoast = txTotalGasUsed.sub(txCoastWithoutExecution);

    console.log(`Transaction total gas used: ${txTotalGasUsed}`);
    console.log(`Transaction payload gas used: ${txCoastWithoutExecution}`);
    console.log(`Transaction execution gas used: ${txExecutionCoast}`);
  });
});
