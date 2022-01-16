//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Gas {
    string public value;
    uint256 b;

    constructor(string memory _value) {
        value = _value;
    }

    function setValue(string memory _newValue) public {
        value = _newValue;
    }

    function getValue() public view returns (string memory) {
        return value;
    }

    function saveB(uint256 _b) public {
        b = _b;
    }
}
