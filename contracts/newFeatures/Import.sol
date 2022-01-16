//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import {Unauthorized} from "./CustomError.sol";

// prevent function names collision
import {helper as importedHelper} from "./FunctionsOutsideContract.sol";

function helper(uint256 x) pure returns (uint256) {
    return x / 2;
}

contract Import {
    function useLocalHelper(uint256 _num) external pure returns (uint256) {
        return helper(_num);
    }

    function useImportedHelper(uint256 _num) external pure returns (uint256) {
        return importedHelper(_num);
    }
}
