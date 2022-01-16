//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EtherWallet {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function withdraw(uint256 _amount) external {
        require(msg.sender == owner, "Caller is not owner");

        // not using here `owner` which is a state variable, saves some gas
        payable(msg.sender).transfer(_amount);

        // an alternative approach:
        // (bool success, ) = msg.sender.call{value: _amount}("");
        // require(success, "Failed to send Ether");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
