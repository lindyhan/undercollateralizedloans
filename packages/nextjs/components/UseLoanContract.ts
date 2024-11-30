//import { abi as loanAbi } from "../../hardhat/artifacts/contracts/Loan_.sol/Loan.json";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "viem";
import { useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

export function useLoanContract() {
  const stakingContractAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`;
  const usdETokenAddress = process.env.NEXT_PUBLIC_USDE_TOKEN as `0x${string}`;
  const deployerWalletAddress = process.env.NEXT_PUBLIC_DEPLOYER_WALLET as `0x${string}`;
  const aaveContractAddress = process.env.NEXT_PUBLIC_AAVE_CONTRACT as `0x${string}`;
  const usdcTokenAddress = process.env.NEXT_PUBLIC_USDC_TOKEN as `0x${string}`;
  const aEthUSDCTokenAddress = process.env.NEXT_PUBLIC_AETHUSDC_TOKEN as `0x${string}`;
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`;

  const { writeContract } = useWriteContract();

  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
  const deployerSigner = new ethers.Wallet(privateKey, provider);

  const approveUSDe = async (amount: bigint) => {
    console.log(`Approving ${Number(amount) / 10 ** 18} USDe deposit`);
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          abi: [
            {
              name: "approve",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ name: "", type: "bool" }],
            },
          ],
          address: usdETokenAddress,
          functionName: "approve",
          args: [stakingContractAddress, amount],
        },
        {
          onSuccess: () => {
            console.log("USDe approval transaction successful.");
            resolve();
          },
          onError: error => {
            console.error("Approval error:", error);
            notification.error((error as Error).message);
            reject(new Error("Approval failed, stopping deposit process."));
          },
        },
      );
    });
  };

  const depositUSDe = async (amount: bigint) => {
    console.log("Depositing USDe...");
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          abi: [
            {
              name: "deposit",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [
                { name: "_usdEAmount", type: "uint256" },
                { name: "_recipient", type: "address" },
              ],
              outputs: [],
            },
          ],
          address: stakingContractAddress,
          functionName: "deposit",
          args: [amount, deployerWalletAddress],
        },
        {
          onSuccess: () => {
            console.log("USDe deposit transaction successful.");
            resolve();
          },
          onError: error => {
            console.error("Deposit error:", error);
            notification.error((error as Error).message);
            reject(new Error("Deposit failed."));
          },
        },
      );
    });
  };

  const approveUSDC = new ethers.Contract(
    usdcTokenAddress,
    [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "spender", type: "address" },
          { name: "usdcAmount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
    ],
    deployerSigner,
  );

  const supplyUSDCToAave = new ethers.Contract(
    aaveContractAddress,
    [
      {
        name: "supply",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "asset", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "onBehalfOf", type: "address" },
          { name: "referralCode", type: "uint16" },
        ],
        outputs: [],
      },
    ],
    deployerSigner,
  );

  const aEthUSDCContract = new ethers.Contract(
    aEthUSDCTokenAddress,
    [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
    ],
    deployerSigner,
  );

  const aaveContract = new ethers.Contract(
    aaveContractAddress,
    [
      {
        name: "withdraw",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "asset", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "to", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ],
    deployerSigner,
  );

  const stakingContract = new ethers.Contract(
    stakingContractAddress,
    [
      {
        name: "cooldownShares",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "assets", type: "uint256" }],
        outputs: [],
      },
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "cooldownDuration",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
      },
      {
        name: "unstake",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "receiver", type: "address" }],
        outputs: [],
      },
    ],
    deployerSigner,
  );

  const deposit = async (usdEAmount: number, selectedLeverage: number) => {
    try {
      const amountInWei = parseUnits(usdEAmount.toString(), 18);

      console.log("Starting approval process...");
      await approveUSDe(amountInWei);

      await depositUSDe(amountInWei);

      const usdcAmount = parseUnits((Number(usdEAmount) * Number(selectedLeverage)).toString(), 6);

      console.log(`Approving ${Number(usdcAmount) / 10 ** 6} USDC for Aave...`);

      await approveUSDC.approve(aaveContractAddress, usdcAmount);

      console.log("Waiting for USDC approval to complete...");
      await new Promise(resolve => setTimeout(resolve, 25000));

      console.log("Supplying USDC to Aave...");
      await supplyUSDCToAave.supply(usdcTokenAddress, usdcAmount, deployerSigner, 0);
    } catch (error) {
      console.error("Deposit flow error:", error);
    }
  };

  const closeLoan = async (usdEAmount: number, selectedLeverage: number) => {
    try {
      const usdcAmount = parseUnits((Number(usdEAmount) * Number(selectedLeverage)).toString(), 6);

      console.log(`Withdrawing ${Number(usdcAmount) / 10 ** 6} USDC`);

      await aEthUSDCContract.approve(aaveContractAddress, usdcAmount);
      await new Promise(resolve => setTimeout(resolve, 30000));
      console.log("aEthUSDC approval in progress..");

      await aaveContract.withdraw(usdcTokenAddress, usdcAmount, deployerWalletAddress);

      const sUSDe_balance = await stakingContract.balanceOf(deployerSigner);
      console.log(`Initiating cooldown for ${formatUnits(sUSDe_balance, 18)} sUSDe`);

      await stakingContract.cooldownShares(sUSDe_balance);

      const cooldownDuration = await stakingContract.cooldownDuration();
      console.log(`Cooldown duration: ${cooldownDuration} seconds`);

      return {
        aUSDCWithdrawn: usdcAmount,
        sUSDECooledDown: sUSDe_balance,
        cooldownDuration: Number(cooldownDuration),
      };
    } catch (error) {
      console.error("Loan closure error:", error);
      throw error;
    }
  };

  const unstakeSUSDe = async (address: `0x${string}`) => {
    try {
      await stakingContract.unstake(address);

      notification.success("sUSDe successfully unstaked!");
    } catch (error) {
      console.error("Unstaking error:", error);
      throw error;
    }
  };

  return {
    deposit,
    closeLoan,
    unstakeSUSDe,
  };
}
