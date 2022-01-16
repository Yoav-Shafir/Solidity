//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Salted contract creations / create2
contract D {
    uint256 public x;

    constructor(uint256 a) {
        x = a;
    }
}
