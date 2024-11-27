"use client";

import { useState } from "react";
import { LoanDepositForm } from "../components/LoanDepositForm";
import { LoanDetails } from "../components/LoanDetails";
import { useLoanContract } from "../components/UseLoanContract";
import { useAccount } from "wagmi";

export default function LoansPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedLeverage, setSelectedLeverage] = useState<number | null>(null);

  const { address } = useAccount();
  console.log("Connected Address:", address);

  const { deposit, closeLoan, userDeposits } = useLoanContract();

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setSelectedLeverage(null); // Reset leverage when amount changes
  };

  const handleLeverageSelection = (leverage: number) => {
    setSelectedLeverage(leverage);
  };

  const handleDeposit = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (selectedAmount && selectedLeverage) {
      await deposit(selectedAmount, selectedLeverage);
      // Reset selections after deposit
      setSelectedAmount(null);
      setSelectedLeverage(null);
    }
  };

  const handleCloseLoan = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    await closeLoan();
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">USDe Loan Platform</h1>

        {!address ? (
          <div className="text-center text-gray-600">Please connect your wallet to use the loan platform</div>
        ) : (
          <>
            <LoanDepositForm
              selectedAmount={selectedAmount}
              selectedLeverage={selectedLeverage}
              onAmountSelect={handleAmountSelection}
              onLeverageSelect={handleLeverageSelection}
              onDeposit={handleDeposit}
            />

            <LoanDetails userLoanDetails={userDeposits} onCloseLoan={handleCloseLoan} />
          </>
        )}
      </div>
    </div>
  );
}
