### Deployments

- FUSD -> `0xbc48636ab88C078908F507fF8EE511923A0d73DB`
- WETH -> `0xc775Bf6F4d6D4F83B6b86Be7DFD6e3b4bDb7C3eC`
- Oracle -> `0x73F72440d029504672a11f7B30d0D3931259DB05`
- Debt_Share -> `0x38256a333956747DC297634C59B22E44e292E6C8`
- Lend_Share -> `0xD5aC15a3B003AD0433b089Fa7f45B39AE32544C1`
- FHELend -> `0xD5aC15a3B003AD0433b089Fa7f45B39AE32544C1`


### DEMO FLOW

1. FHELend.lend(5000000000000000000000) => 5000 USD
2. FHELend.depositCollateral(1000000000000000000) => 1 WETH
3. FHELend.borrow(1875000000000000000000) => 1875 USD (75% of 2500 (hardcoded value of WETH in fake_oracle.sol))
4. get healthFactor = FHELend.getHealthFactor(0xuser) => 1.33333
5. oracle.update_debt_ERC20_price(2000) 
6. get healthFactor = FHELend.getHealthFactor(0xuser) => 1.06666
7. FHELend.liquidate(0xuser, 1875000000000000000000)
8. FHELend.positions(0xuser) => 0.25 WETH - LIQ PREMIUM
9. FHELend.withdrawCollateral(amount)