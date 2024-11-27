import { abi } from "../../hardhat/artifacts/contracts/Loan_.sol/Loan.json";
import { parseUnits } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

export function useLoanContract() {
  const contractAddress = process.env.NEXT_PUBLIC_LOAN_CONTRACT as `0x${string}`;
  const { writeContract } = useWriteContract();

  // Read user deposits
  const { data: userDepositsRaw } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "userDeposits",
    args: [typeof window !== "undefined" ? (window as any)?.ethereum?.selectedAddress : "0x0"],
  });

  // Process user deposits
  const userDeposits = (() => {
    // Default object with all properties initialized
    const defaultDeposits = {
      usdEDeposited: 0,
      sUsdEDeposited: 0,
      usdcSupplied: 0,
      aEthUsdcAmount: 0,
      loanAmount: 0,
    };

    if (!userDepositsRaw || !Array.isArray(userDepositsRaw)) {
      return defaultDeposits;
    }

    // Destructure the returned tuple based on the ABI structure
    const [usdEAmount, sUsdEAmount, usdcAmount, aEthUsdcAmount] = userDepositsRaw;

    return {
      usdEDeposited: Number(usdEAmount) / 10 ** 18,
      sUsdEDeposited: Number(sUsdEAmount) / 10 ** 18,
      usdcSupplied: Number(usdcAmount) / 10 ** 18,
      aEthUsdcAmount: Number(aEthUsdcAmount) / 10 ** 18,
      loanAmount: (Number(usdcAmount) / 10 ** 18) * 10, // Assuming 10x leverage calculation
    };
  })();

  // Perform deposit with amount and leverage
  const deposit = (usdEAmount: number, leverage: number) => {
    try {
      console.log("Deposit called with:", { usdEAmount, leverage });
      console.log(
        "Connected Address:",
        typeof window !== "undefined" ? (window as any)?.ethereum?.selectedAddress : "No address",
      );

      const amountInWei = parseUnits(usdEAmount.toString(), 18);
      const leverageValue = BigInt(leverage);
      console.log("Amount in Wei:", amountInWei);
      console.log("Leverage Value:", leverageValue);

      const result = writeContract({
        abi,
        address: contractAddress,
        functionName: "deposit",
        args: [amountInWei, leverageValue],
      });
      console.log("Deposit transaction result:", result);
    } catch (error) {
      console.error("Deposit error:", error);
      console.log(typeof notification, notification);
      notification.error((error as Error).message);
    }
  };

  // Perform close loan
  const closeLoan = () => {
    try {
      writeContract({
        abi,
        address: contractAddress,
        functionName: "closeLoan",
      });
    } catch (error) {
      console.error("Close loan error:", error);
      notification.error((error as Error).message);
    }
  };

  return {
    deposit,
    closeLoan,
    userDeposits,
  };
}
