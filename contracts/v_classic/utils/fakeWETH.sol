// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract fakeWETH is ERC20 {
    constructor(uint256 initialSupply) ERC20("Wrapped Ether", "WETH") {
        _mint(msg.sender, initialSupply);
    }
}