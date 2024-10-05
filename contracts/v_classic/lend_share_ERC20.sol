//SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract lend_share_ERC20 is ERC20, Ownable {
    
    address public FHElend;

    constructor() ERC20("FHElend Yield Share", "y_FUSD_WETH") Ownable(msg.sender) {}

    function setFHElend(address _FHElend) public onlyOwner {
        FHElend = _FHElend;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == FHElend, "Not FHElend");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        require(msg.sender == FHElend, "Not FHElend");
        _burn(from, amount);
    }
}