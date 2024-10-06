// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract fakeUSD is ERC20 {
    constructor(uint256 initialSupply) ERC20("FUSD Coin", "FUSD") {
        _mint(msg.sender, initialSupply);
    }
}