//SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.25;

contract fake_oracle {

    address public lendERC20 = 0xb68De1A5C21576d316C105609d1C3916fB080Ff3; // FUSD
    address public debtERC20 = 0xF6e801cB6080c4a07BbACD33dbE359e9fB2b6668; // WETH

    uint256 public lendERC20_price = 1 * 1e18;
    uint256 public debtERC20_price = 2500 * 1e18;

    function get_asset_price(address token) public view returns (uint256) {
        if (token == address(lendERC20)) return lendERC20_price;
        if (token == address(debtERC20)) return debtERC20_price;
        return 0; 
    }

    function update_debt_ERC20_price(uint256 newPrice) public {
        debtERC20_price = newPrice * 1e18;
    }
}