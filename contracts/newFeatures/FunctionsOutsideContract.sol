//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// function outside contract
function helper(uint256 x) pure returns (uint256) {
    return x * 2;
}

contract FunctionsOutsideContract {
    function useHelper(uint256 _num) external pure returns (uint256) {
        return helper(_num);
    }
}
