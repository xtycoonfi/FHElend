//SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.25;

import { FHE, euint32, ebool } from "@fhenixprotocol/contracts/FHE.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./lend_share_ERC20.sol";
import "./debt_share_ERC20.sol";
import "./fake_oracle.sol";

contract FHElend is Initializable {
   
    lend_share_ERC20 public lend_share;
    debt_share_ERC20 public debt_share;
    fake_oracle public oracle;
    IERC20 public underlying;
    IERC20 public collateral;

    uint256 public deposits;
    uint256 public borrows;
    uint256 public rate;

    struct position {
        uint256 collateral_amount;
        uint256 underlying_amount;
    }

    mapping(address => position) public positions;
    address[] public users;
    address public owner;

    uint256 public constant PRECISION = 1e18;
    uint256 public LAST_UPDATE;

    euint32 internal encrypted_base_APY;
    euint32 internal encrypted_slope_rate;

    uint256 public constant UTILIZATION_OPTIMAL = 8e17; // 80% 
    uint256 public constant UTILIZATION_MAX = 95e16; // 95%
    uint256 public constant LIQUIDATION_THRESHOLD = 75e16; // 75% 
    uint256 public constant LIQUIDATION_PREMIUM = 5e16; // 5%

    function initialize(
        address _lend_share,
        address _debt_share,
        address _oracle,
        address _underlying,
        address _collateral
    ) public initializer {
        lend_share = lend_share_ERC20(_lend_share);
        debt_share = debt_share_ERC20(_debt_share);
        oracle = fake_oracle(_oracle);
        underlying = IERC20(_underlying);
        collateral = IERC20(_collateral);
        rate = PRECISION;
        LAST_UPDATE = block.timestamp;
    }

    function initializeEncryptedRates(bytes calldata encryptedBaseAPY_, bytes calldata encryptedSlopeRate_) public {
        encrypted_base_APY = FHE.asEuint32(encryptedBaseAPY_);
        encrypted_slope_rate = FHE.asEuint32(encryptedSlopeRate_);
    }

    ////////////////// FHE APY CALCULATION ////////////////////////

    function calculateInterestRate() public view returns (uint256) {
        euint32 utilization = FHE.asEuint32(calculateUtilizationRate() / 1e16);
        euint32 encryptedOptimal = FHE.asEuint32(UTILIZATION_OPTIMAL / 1e16);
        euint32 encryptedMax = FHE.asEuint32(UTILIZATION_MAX / 1e16);
        euint32 encryptedRate;
        ebool isLessThanOptimal = FHE.lte(utilization, encryptedOptimal);
        euint32 rate1 = FHE.add(encrypted_base_APY, FHE.div(FHE.mul(utilization, encrypted_slope_rate), encryptedOptimal));
        euint32 excessUtilization = FHE.sub(utilization, encryptedOptimal);
        euint32 slope2 = FHE.div(FHE.mul(encrypted_slope_rate, encryptedMax), FHE.sub(encryptedMax, encryptedOptimal));
        euint32 rate2 = FHE.add(FHE.add(encrypted_base_APY, encrypted_slope_rate), FHE.div(FHE.mul(excessUtilization, slope2), FHE.sub(encryptedMax, encryptedOptimal)));
        encryptedRate = FHE.select(isLessThanOptimal, rate1, rate2);
        return uint256(FHE.decrypt(encryptedRate)) * 1e16;
    }

    /////////////////////// LENDING /////////////////////////////

   function lend(uint256 amount_underlying) public {
        updateAPY();
        require(amount_underlying > 0);
        uint256 lend_shares = (amount_underlying * PRECISION) / rate;
        deposits += amount_underlying;
        require(underlying.transferFrom(msg.sender, address(this), amount_underlying));
        lend_share.mint(msg.sender, lend_shares);
        updateAPY();
    }

    function withdraw(uint256 share_amount) public {
        updateAPY();
        require(share_amount > 0);
        uint256 underlying_amount = (share_amount * rate) / PRECISION;
        require(underlying_amount <= deposits);
        deposits -= underlying_amount;
        lend_share.burn(msg.sender, share_amount);
        require(underlying.transfer(msg.sender, underlying_amount));
        updateAPY();        
    }

    /////////////////////// BORROWING /////////////////////////////

    function depositCollateral(uint256 amount) public {
        require(collateral.transferFrom(msg.sender, address(this), amount));
        positions[msg.sender].collateral_amount += amount;
        if (positions[msg.sender].collateral_amount == amount) users.push(msg.sender);
    }

    function withdrawCollateral(uint256 amount) public {
        require(amount <= positions[msg.sender].collateral_amount, "Insufficient collateral");
        uint256 new_collateral = positions[msg.sender].collateral_amount - amount;
        require(!_wouldBeLiquidable(msg.sender, positions[msg.sender].underlying_amount), "Max reached");
        positions[msg.sender].collateral_amount = new_collateral;
        require(collateral.transfer(msg.sender, amount));
    }

    function borrow(uint256 amount) public {
        updateAPY();
        uint256 new_borrow = positions[msg.sender].underlying_amount + amount;
        require(!_wouldBeLiquidable(msg.sender, new_borrow), "Max reached");
        borrows += amount;
        positions[msg.sender].underlying_amount = new_borrow;
        debt_share.mint(msg.sender, amount);
        require(underlying.transfer(msg.sender, amount));
    }

    function repay(uint256 amount) public {
        updateAPY();
        uint256 debt = amount > positions[msg.sender].underlying_amount ? positions[msg.sender].underlying_amount : amount;
        borrows -= debt;
        positions[msg.sender].underlying_amount -= debt;  
        debt_share.burn(msg.sender, debt);
        require(underlying.transferFrom(msg.sender, address(this), debt));
    }
    
    /////////////////////// LIQUIDATIONS /////////////////////////////

    struct liquidablePosition {
        address user;
        uint256 amount;
    }
   
    function getLiquidablePositions() public view returns (liquidablePosition[] memory) {
        uint256 nbr = 0;
        for (uint256 i = 0; i < users.length; i++) if (isLiquidableBool(users[i])) nbr++;
        liquidablePosition[] memory liquidablePositions = new liquidablePosition[](nbr);
        uint256 index = 0;
        for (uint256 i = 0; i < users.length; i++) {
            if (isLiquidableBool(users[i])) {
                (bool liquidable, uint256 liquidableAmount) = isLiquidable(users[i]);
                if (liquidable) {
                    liquidablePositions[index] = liquidablePosition(users[i], liquidableAmount);
                    index++;
                }
            }
        }
        return liquidablePositions;
    }

    function isLiquidableBool(address user) public view returns (bool) {
        return _isLiquidable(user, positions[user].underlying_amount);
    }

    function liquidate(address user, uint256 amount) public {
        require(isLiquidableBool(user), "Not liquidatable");
        require(amount > 0 && amount <= positions[user].underlying_amount, "Invalid amount");
        uint256 collateral_price = oracle.get_asset_price(address(collateral));
        uint256 underlying_price = oracle.get_asset_price(address(underlying));
        uint256 liquidable_amount = (amount * underlying_price * (PRECISION + LIQUIDATION_PREMIUM)) / (collateral_price * PRECISION);
        borrows -= amount;
        positions[user].underlying_amount -= amount;
        positions[user].collateral_amount -= liquidable_amount;
        debt_share.burn(msg.sender, amount);
        require(underlying.transferFrom(msg.sender, address(this), amount));
        require(collateral.transfer(msg.sender, liquidable_amount));
    }

    function isLiquidable(address user) public view returns (bool, uint256) {
        uint256 collateral_value = (positions[user].collateral_amount * oracle.get_asset_price(address(collateral))) / PRECISION;
        uint256 borrow_value = (positions[user].underlying_amount * oracle.get_asset_price(address(underlying))) / PRECISION;
        uint256 max_borrow_value = (collateral_value * LIQUIDATION_THRESHOLD) / PRECISION;
        if (borrow_value > max_borrow_value) {
            uint256 liquidatable_amount = borrow_value - max_borrow_value;
            return (true, liquidatable_amount);
        } else return (false, 0);
    }
      
    function _isLiquidable(address user, uint256 borrow_amount) internal view returns (bool) {
        uint256 collateral_value = (positions[user].collateral_amount * oracle.get_asset_price(address(collateral))) / PRECISION;
        uint256 borrow_value = (borrow_amount * oracle.get_asset_price(address(underlying))) / PRECISION;
        return borrow_value > (collateral_value * LIQUIDATION_THRESHOLD) / PRECISION;
    }
   
    function _wouldBeLiquidable(address user, uint256 amount) internal view returns (bool) {
        return _isLiquidable(user, amount);
    }    

    /////////////////////// HELPERS /////////////////////////////

    function healthFactor(address user) public view returns (uint256) {
        if (positions[user].underlying_amount == 0) return type(uint256).max;
        uint256 collateral_value = (positions[user].collateral_amount * oracle.get_asset_price(address(collateral))) / PRECISION;
        uint256 borrow_value = (positions[user].underlying_amount * oracle.get_asset_price(address(underlying))) / PRECISION;
        return (collateral_value * PRECISION) / borrow_value;
    }

   function updateAPY() public {
        uint256 range = block.timestamp - LAST_UPDATE;
        if (range > 0 && deposits > 0) {
            uint256 current_rate = calculateInterestRate();
            uint256 interest = (borrows * current_rate * range) / (365 days * PRECISION);
            if (interest > 0) {
                deposits += interest;
                rate = (deposits * PRECISION) / lend_share.totalSupply();
            }
        }
        LAST_UPDATE = block.timestamp;
    }

    function calculateUtilizationRate() public view returns (uint256) {
        if (deposits == 0) return 0;
        return (borrows * PRECISION) / deposits;
    }

    function getLendingAPY() public view returns (uint256) {
        uint256 utilization = calculateUtilizationRate();
        uint256 borrowing = calculateInterestRate();
        return (utilization * borrowing) / PRECISION;
    }

    function getBorrowingAPY() public view returns (uint256) {
        return calculateInterestRate();
    }

}