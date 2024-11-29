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
  } | null>(null);

  const { address } = useAccount();
  const { deposit, closeLoan, unstakeSUSDe } = useLoanContract();

  useEffect(() => {
    const fetchUserDeposits = async () => {
      if (address) {
      }
    };
    fetchUserDeposits();
  }, [address]);

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setSelectedLeverage(null); // Reset leverage when amount changes
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
        setButtonState({ text: "Approving USDe...", disabled: true });
        await deposit(selectedAmount, selectedLeverage);
        setButtonState({ text: "Deposit Complete", disabled: false });

        setShowCloseLoanButton(true);

        setSelectedAmount(null);
        setSelectedLeverage(null);
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

    try {
      const closureResult = await closeLoan();

      // Store closure details for countdown and future unstaking
      setLoanClosureStatus({
        ...closureResult,
        cooldownStartTime: Math.floor(Date.now() / 1000),
      });
    } catch (error) {
      console.error("Loan closure failed:", error);
    }
  };

  const handleUnstake = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await unstakeSUSDe(address as `0x${string}`);

      // Reset loan closure status and user deposits
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
                  className="w-full bg-red-500 text-white py-3 rounded-lg 
                           hover:bg-red-600 transition-colors font-semibold"
                >
                  Close Loan
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
