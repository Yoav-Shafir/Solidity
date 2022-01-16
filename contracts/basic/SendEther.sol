//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SendEther {
    // for sending Eth when this contract is deployed
    constructor() payable {}

    // fallback function that is only able to receive ether
    receive() external payable {}

    function sendViaTransfer(address payable _to) external payable {
        _to.transfer(1 ether); // 2300 gas
    }

    function sendViaSend(address payable _to) external payable {
        bool sent = _to.send(1 ether); // 2300 gas
        require(sent, "Send failed");
    }

    function sendViaCall(address payable _to) external payable {
        (bool success, ) = _to.call{value: 1 ether}("");
        require(success, "Send failed");
    }
}

contract EthReceiver {
    event Log(uint256 indexed amount, uint256 indexed gas);

    receive() external payable {
        emit Log(msg.value, gasleft());
    }
}
