//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VerifySignature {
    function verify(
        address _signer,
        string memory _message,
        bytes memory _sig
    ) external pure returns (bool) {
        // step 1: hash message
        bytes32 messageHash = getMessageHash(_message);

        // step 2: sign the hash message with the private key, offchain
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        // step 3: use the ecrecover to verify
        return recover(ethSignedMessageHash, _sig) == _signer;
    }

    function getMessageHash(string memory _message)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_message));
    }

    // Signature is produced by signing a keccak256 hash with the following format:
    // "\x19Ethereum Signed Message\n" + len(msg) + msg
    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function recover(bytes32 _ethSignedMessageHash, bytes memory _sig)
        public
        pure
        returns (address)
    {
        // split signature to 3 parts:
        // r & s are cryptographic parameters used for digital signatures
        // v is unique to ethereum
        (bytes32 r, bytes32 s, uint8 v) = _split(_sig);

        // returns the signer address
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    // _sig is a pointer to where the sinature is stored in memory
    // it is a dynamic data type, it has a variable length
    // the first 32 bytes store the length of the data
    function _split(bytes memory _sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        // check total bytes length of the signature
        // so the returns params total bytes length is the same
        require(_sig.length == 65, "Invalid signature length");

        assembly {
            // mload(p) loads next 32 bytes starting at the memory address p into memory
            // add(_sig, 32) add to the pointer of _sig

            // first 32 bytes, after skipping the length prefix
            r := mload(add(_sig, 32))
            // second 32 bytes, skipping the length prefix + r
            s := mload(add(_sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(_sig, 96)))
        }

        // implicitly return (r, s, v)
    }
}
