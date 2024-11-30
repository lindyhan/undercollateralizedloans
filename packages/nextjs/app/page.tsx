"use client";

import { useEffect, useState } from "react";
import { LoanDepositForm } from "../components/LoanDepositForm";
import { LoanDetails } from "../components/LoanDetails";
import { useLoanContract } from "../components/UseLoanContract";
import { useAccount } from "wagmi";

export default function LoansPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedLeverage, setSelectedLeverage] = useState<number | null>(null);
  const [buttonState, setButtonState] = useState({
    text: `Deposit USDe`,
    disabled: false,
  });
  const [userDeposits] = useState<{
    usdEDeposited: number;
    sUsdEDeposited: number;
    usdcSupplied: number;
    aEthUsdcAmount: number;
    loanAmount: number;
    cooldownEndTime?: number;
  } | null>(null);
  const [loanClosureStatus, setLoanClosureStatus] = useState<{
    aUSDCWithdrawn: bigint;
    sUSDECooledDown: bigint;
    cooldownDuration: number;
    cooldownStartTime: number;
    buttonText: string;
  } | null>(null);

  const { address } = useAccount();
  const { deposit, closeLoan, unstakeSUSDe } = useLoanContract();
  const [closingLoan, setClosingLoan] = useState(false);

  useEffect(() => {
    let unstakeTimer: NodeJS.Timeout;

    if (loanClosureStatus && address) {
      const cooldownEndTime = (loanClosureStatus.cooldownStartTime + loanClosureStatus.cooldownDuration) * 1000;
      const timeUntilUnstake = cooldownEndTime - Date.now();

      if (timeUntilUnstake > 0) {
        unstakeTimer = setTimeout(async () => {
          try {
            await unstakeSUSDe(address as `0x${string}`);
            setLoanClosureStatus(null);
          } catch (error) {
            console.error("Automatic unstaking failed:", error);
          }
        }, timeUntilUnstake);
      } else {
        unstakeSUSDe(address as `0x${string}`);
        setLoanClosureStatus(null);
      }
    }

    return () => {
      if (unstakeTimer) clearTimeout(unstakeTimer);
    };
  }, [loanClosureStatus, address, unstakeSUSDe]);

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setSelectedLeverage(null);
  };

  const handleLeverageSelection = (leverage: number) => {
    setSelectedLeverage(leverage);
  };

  const [showCloseLoanButton, setShowCloseLoanButton] = useState(false);

  const handleDeposit = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (selectedAmount && selectedLeverage) {
      try {
        setButtonState({ text: "Depositing USDe and USDC..", disabled: true });
        await deposit(selectedAmount, selectedLeverage);
        setButtonState({ text: "Deposit Complete", disabled: false });

        setShowCloseLoanButton(true);
      } catch (error) {
        console.error("Deposit failed:", error);
        setButtonState({ text: "Deposit Failed", disabled: false });
      }
    }
  };

  const handleCloseLoan = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    setClosingLoan(true);

    try {
      setLoanClosureStatus({
        aUSDCWithdrawn: 0n,
        sUSDECooledDown: 0n,
        cooldownDuration: 0,
        cooldownStartTime: Math.floor(Date.now() / 1000),
        buttonText: "Closing loan..",
      });

      const closureResult = await closeLoan(selectedAmount!, selectedLeverage!);

      setLoanClosureStatus({
        aUSDCWithdrawn: BigInt(closureResult.aUSDCWithdrawn),
        sUSDECooledDown: BigInt(closureResult.sUSDECooledDown),
        cooldownDuration: closureResult.cooldownDuration,
        cooldownStartTime: Math.floor(Date.now() / 1000),
        buttonText: "Loan Closed. Starting 1 hr cooldown period..",
      });
    } catch (error) {
      console.error("Loan closure failed:", error);
      setLoanClosureStatus(prev =>
        prev
          ? {
              ...prev,
            }
          : {
              aUSDCWithdrawn: 0n,
              sUSDECooledDown: 0n,
              cooldownDuration: 0,
              cooldownStartTime: 0,
              buttonText: "Close Loan Failed",
            },
      );
    } finally {
      setClosingLoan(false);
    }
  };

  const handleUnstake = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await unstakeSUSDe(address as `0x${string}`);

      setLoanClosureStatus(null);
    } catch (error) {
      console.error("Unstaking failed:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Up to 10x USDe Leverage for Aave supply</h1>

        {!address ? (
          <div className="text-center text-gray-600">Connecting your wallet.. Please wait..</div>
        ) : (
          <>
            <LoanDepositForm
              selectedAmount={selectedAmount}
              selectedLeverage={selectedLeverage}
              onAmountSelect={handleAmountSelection}
              onLeverageSelect={handleLeverageSelection}
              onDeposit={handleDeposit}
              buttonState={buttonState}
            />

            <LoanDetails
              userLoanDetails={userDeposits}
              loanClosureStatus={loanClosureStatus}
              onCloseLoan={handleCloseLoan}
              onUnstake={handleUnstake}
            />

            {showCloseLoanButton && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseLoan}
                  disabled={closingLoan || !!loanClosureStatus}
                  className="w-full bg-red-500 text-white py-3 rounded-lg 
                 hover:bg-red-600 transition-colors font-semibold
                 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loanClosureStatus?.buttonText || "Close Loan"}
                </button>
                {loanClosureStatus && loanClosureStatus?.buttonText.includes("cooldown") && (
                  <p className="mt-2 text-sm text-gray-600">You will receive your USDe in your wallet after 1 hr.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
