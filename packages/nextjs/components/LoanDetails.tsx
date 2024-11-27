"use client";

interface LoanDetailsProps {
  userLoanDetails: {
    usdEDeposited: number;
    sUsdEDeposited: number;
    usdcSupplied: number;
    aEthUsdcAmount: number;
    loanAmount: number;
  } | null;
  onCloseLoan: () => void;
}

export function LoanDetails({ userLoanDetails, onCloseLoan }: LoanDetailsProps) {
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

      {hasActiveLoan && (
        <button
          onClick={onCloseLoan}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg 
                     hover:bg-red-600 transition-colors font-semibold"
        >
          Close Loan
        </button>
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
