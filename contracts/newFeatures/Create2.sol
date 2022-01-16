//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./D.sol";

contract Create2 {
    address public deployedAddress;

    function getBytes32(uint256 _salt) external pure returns (bytes32) {
        return bytes32(_salt);
    }

    function getAddress(bytes32 _salt, uint256 _arg)
        external
        view
        returns (address)
    {
        address addr = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            address(this),
                            _salt,
                            keccak256(
                                abi.encodePacked(type(D).creationCode, _arg)
                            )
                        )
                    )
                )
            )
        );

        return addr;
    }

    function createDSalted(bytes32 _salt, uint256 _arg) public {
        D d = new D{salt: _salt}(_arg);
        deployedAddress = address(d);
    }
}
