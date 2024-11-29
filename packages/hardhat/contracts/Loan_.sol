// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Loan {
    IERC20 public usdEToken;
    IERC20 public usdcToken;
    IERC20 public sUsdEToken;
    IERC20 public aEthUsdcToken;

    address public deployer;

    struct UserDeposit {
        uint256 usdEAmount;        // Original USDe amount sent to Ethena
        uint256 sUsdEAmount;       // sUSDe tokens received from Ethena
        uint256 usdcAmount;        // Original USDC amount sent to Aave
        uint256 aEthUsdcAmount;    // aEthUSDC tokens received from Aave
    }

    mapping(address => UserDeposit) public userDeposits;

    event StakeRecorded(
        address indexed user, 
        uint256 usdEAmount, 
        uint256 sUsdEAmount
    );

    event AaveDepositRecorded(
        address indexed user, 
        uint256 usdcAmount, 
        uint256 aEthUsdcAmount
    );

    event LoanClosed(
        address indexed user,
        uint256 sUsdEAmount,
        uint256 aEthUsdcAmount
    );

    constructor(
        address _usdEToken, 
        address _usdcToken, 
        address _sUsdEToken, 
        address _aEthUsdcToken,
        address _deployer
    ) {
        usdEToken = IERC20(_usdEToken);
        usdcToken = IERC20(_usdcToken);
        sUsdEToken = IERC20(_sUsdEToken);
        aEthUsdcToken = IERC20(_aEthUsdcToken);
        deployer = _deployer;
    }

    function recordStake(
        address user, 
        uint256 usdEAmount, 
        uint256 sUsdEAmount
    ) external {
        userDeposits[user].usdEAmount = usdEAmount;
        userDeposits[user].sUsdEAmount = sUsdEAmount;

        emit StakeRecorded(user, usdEAmount, sUsdEAmount);
    }

    function recordAaveDeposit(
        address user, 
        uint256 usdcAmount, 
        uint256 aEthUsdcAmount
    ) external {
        userDeposits[user].usdcAmount = usdcAmount;
        userDeposits[user].aEthUsdcAmount = aEthUsdcAmount;

        emit AaveDepositRecorded(user, usdcAmount, aEthUsdcAmount);
    }

    function closeLoan() external {
        UserDeposit storage userDeposit = userDeposits[msg.sender];
        
        // Ensure the user has an active deposit
        require(userDeposit.sUsdEAmount > 0, "No active loan to close");

        // Emit event with loan closure details
        emit LoanClosed(
            msg.sender, 
            userDeposit.sUsdEAmount, 
            userDeposit.aEthUsdcAmount
        );

        // Clear the user's deposit record
        delete userDeposits[msg.sender];
    }

    function getUserDeposit(address user) external view returns (UserDeposit memory) {
        return userDeposits[user];
    }
}