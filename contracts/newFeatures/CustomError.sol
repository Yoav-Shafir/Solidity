//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// custom error
error Unauthorized(address caller);

contract CustomError {
    address payable owner = payable(msg.sender);

    function withdraw() public {
        if (msg.sender != owner) revert Unauthorized(msg.sender);
        owner.transfer(address(this).balance);
    }
}
