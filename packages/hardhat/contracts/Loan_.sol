// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

interface IEthenaStaking {
    function stake(address user, uint256 amount) external returns (uint256 sUSDeAmount);
}

contract Loan {
    IERC20 public immutable usdEToken;
    IERC20 public immutable usdcToken;
    IPool public immutable aavePool;
    IEthenaStaking public immutable ethenaStaking;

    address public deployer;
    
    mapping(address => UserDeposit) public userDeposits;

    struct UserDeposit {
        uint256 usdEAmount;
        uint256 sUsdEAmount;
        uint256 usdcAmount;
        uint256 aEthUsdcAmount;
    }

    constructor(address _usdEToken, address _usdcToken, address _aavePool, address _ethenaStaking, address _deployer) {
        usdEToken = IERC20(_usdEToken);
        usdcToken = IERC20(_usdcToken);
        aavePool = IPool(_aavePool);
        ethenaStaking = IEthenaStaking(_ethenaStaking);
        deployer = _deployer;
    }

    function deposit(uint256 _usdEAmount, uint256 _leverage) external {
        // 1. User sends USDe to Ethena staking contract
        usdEToken.transferFrom(msg.sender, address(ethenaStaking), _usdEAmount);

        // 2. Internal contract receives sUSDe tokens from Ethena (assuming it's returned by stake)
        uint256 sUsdEAmount = ethenaStaking.stake(msg.sender, _usdEAmount);

        // 3. Calculate and send USDC (USD * leverage) to Aave pool
        uint256 _usdcAmount = _usdEAmount * _leverage;
        usdcToken.approve(address(aavePool), _usdcAmount);
        aavePool.deposit(address(usdcToken), _usdcAmount, address(this), 0);

        // 4. Receive aEthUSDC tokens from Aave (assuming balance is updated by Aave)
        uint256 aEthUsdcAmount = usdcToken.balanceOf(address(this)); 

        // Store deposit details
        userDeposits[msg.sender] = UserDeposit({
            usdEAmount: _usdEAmount,
            sUsdEAmount: sUsdEAmount,
            usdcAmount: _usdcAmount,
            aEthUsdcAmount: aEthUsdcAmount
        });
    }

    function closeLoan() external {
        // Renamed variable to avoid name conflict
        UserDeposit storage userDeposit = userDeposits[msg.sender];

        // 1. Send sUSDe tokens back to Ethena staking contract (releasing USDe to user)
        ethenaStaking.stake(msg.sender, userDeposit.sUsdEAmount);

        // 2. Send aEthUSDC tokens to Aave for withdrawal
        aavePool.withdraw(address(usdcToken), userDeposit.aEthUsdcAmount, address(this));

        // 3. Aave will release the original USDC + interest to the deployer
        uint256 withdrawnUSDC = usdcToken.balanceOf(address(this)); // Assuming Aave returns the USDC

        // 4. Calculate excess USDC (withdrawn - original deposit)
        uint256 excessUSDC = withdrawnUSDC - userDeposit.usdcAmount;

        // 5. Send excess USDC to the user
        usdcToken.transfer(msg.sender, excessUSDC);

        // Remove user deposit record
        delete userDeposits[msg.sender];
    }
}
// deployed to 0xC66421665c37050ce2C2cA05f8aFE718ded5F993