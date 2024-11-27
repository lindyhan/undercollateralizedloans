import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const deployLoan: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Load addresses from environment variables
  const usdEToken = process.env.USDE_TOKEN || "";
  const stakingContract = process.env.STAKING_CONTRACT || "";
  const susdEToken = process.env.SUSDE_TOKEN || "";
  const usdcToken = process.env.USDC_TOKEN || "";
  const aavePoolAddress = process.env.AAVE_CONTRACT || "";
  const aEthUsdcToken = process.env.AETHUSDC_TOKEN || "";
  const deployerWallet = process.env.DEPLOYER_WALLET || "";

  // Validate that all required environment variables are set
  if (
    !usdEToken ||
    !stakingContract ||
    !susdEToken ||
    !usdcToken ||
    !aavePoolAddress ||
    !aEthUsdcToken ||
    !deployerWallet
  ) {
    throw new Error("One or more required environment variables are missing");
  }

  // Deploy the Loan contract
  const loanDeployment = await deploy("Loan", {
    from: deployer,
    args: [
      usdEToken, // USDe token address
      usdcToken, // USDC token address
      aavePoolAddress, // Aave pool address
      stakingContract, // Ethena staking contract address
      deployerWallet, // Deployer wallet address
    ],
    log: true,
    autoMine: true,
  });

  // Log the deployed contract's address
  console.log("Loan contract deployed to:", loanDeployment.address);
};

export default deployLoan;
deployLoan.tags = ["Loan"];
