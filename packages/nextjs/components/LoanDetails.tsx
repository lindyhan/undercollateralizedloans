"use client";

import { useEffect, useState } from "react";

interface LoanDetailsProps {
  userLoanDetails: {
    usdEDeposited: number;
    sUsdEDeposited: number;
    usdcSupplied: number;
    aEthUsdcAmount: number;
    loanAmount: number;
    cooldownEndTime?: number;
  } | null;
  loanClosureStatus: {
    aUSDCWithdrawn: bigint;
    sUSDECooledDown: bigint;
    cooldownDuration: number;
    cooldownStartTime: number;
  } | null;
  onCloseLoan: () => void;
  onUnstake: () => void;
}

export function LoanDetails({ userLoanDetails, loanClosureStatus, onCloseLoan, onUnstake }: LoanDetailsProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    // If there's a cooldown end time, start countdown
    if (userLoanDetails?.cooldownEndTime) {
      const timer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = userLoanDetails.cooldownEndTime! - now;

        if (remaining > 0) {
          setTimeRemaining(remaining);
        } else {
          setTimeRemaining(0);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [userLoanDetails?.cooldownEndTime]);

  const hasActiveLoan = userLoanDetails && userLoanDetails.usdEDeposited > 0;

  // Default values if userLoanDetails is null
  const defaultLoanDetails = {
    usdEDeposited: 0,
    sUsdEDeposited: 0,
    usdcSupplied: 0,
    aEthUsdcAmount: 0,
    loanAmount: 0,
  };

  // Use userLoanDetails if it exists, otherwise use default values
  const loanDetails = userLoanDetails || defaultLoanDetails;

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

      <div className="space-y-3">
        <DetailRow label="USDe Deposited" value={loanDetails.usdEDeposited.toFixed(2)} unit="USDe" />
        <DetailRow label="sUSDe in Contract" value={loanDetails.sUsdEDeposited.toFixed(2)} unit="sUSDe" />
        <DetailRow label="USDC Supplied" value={loanDetails.usdcSupplied.toFixed(2)} unit="USDC" />
        <DetailRow label="aEthUSDC Amount" value={loanDetails.aEthUsdcAmount.toFixed(2)} unit="aEthUSDC" />
        <DetailRow label="Loan Amount" value={loanDetails.loanAmount.toFixed(2)} unit="USDC" />
      </div>

      {hasActiveLoan && !loanClosureStatus && (
        <button
          onClick={onCloseLoan}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg 
                     hover:bg-red-600 transition-colors font-semibold"
        >
          Close Loan
        </button>
      )}

      {loanClosureStatus && timeRemaining !== null && (
        <div className="mt-4">
          {timeRemaining > 0 ? (
            <div className="text-center">
              <p className="text-yellow-600 font-semibold">Cooldown Period Remaining</p>
              <p className="text-xl font-bold">{formatTimeRemaining(timeRemaining)}</p>
            </div>
          ) : (
            <button
              onClick={onUnstake}
              className="w-full bg-green-500 text-white py-2 rounded-lg 
                         hover:bg-green-600 transition-colors font-semibold"
            >
              Unstake USDe
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component for consistent detail row formatting
function DetailRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">
        {value} {unit}
      </span>
    </div>
  );
}
