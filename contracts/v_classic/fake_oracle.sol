//SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.25;

contract fake_oracle {

    address public lendERC20 = 0xbc48636ab88C078908F507fF8EE511923A0d73DB; // USD
    address public debtERC20 = 0xc775Bf6F4d6D4F83B6b86Be7DFD6e3b4bDb7C3eC; // WETH

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