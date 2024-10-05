// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <=0.8.25;

import { FHERC20 } from "@fhenixprotocol/contracts/experimental/token/FHERC20/FHERC20.sol";
import { FHE, euint128, inEuint128 } from "@fhenixprotocol/contracts/FHE.sol";

contract FHEWETH is FHERC20 {
    
     constructor(inEuint128 memory initialSupply) FHERC20("FHE Wrapped Ether", "FHEWETH") {
        _mintEncrypted(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
    
}