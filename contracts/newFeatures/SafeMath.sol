//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SafeMath {
    function testUnderFlow() public pure returns (uint256) {
        uint256 x = 0;
        x -= 1;
        return x;
    }

    function testUncheckedUnderFlow() public pure returns (uint8) {
        uint8 x = 0;
        unchecked {
            x--;
        }
        return x;
    }
}
