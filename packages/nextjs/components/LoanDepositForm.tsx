"use client";

const DEPOSIT_AMOUNTS = [1, 200, 500];
const LEVERAGE_OPTIONS = [1, 5, 10];

interface LoanDepositFormProps {
  selectedAmount: number | null;
  selectedLeverage: number | null;
  onAmountSelect: (amount: number) => void;
  onLeverageSelect: (leverage: number) => void;
  onDeposit: () => void;
  buttonState?: {
    text?: string;
    disabled?: boolean;
  };
}

export function LoanDepositForm({
  selectedAmount,
  selectedLeverage,
  onAmountSelect,
  onLeverageSelect,
  onDeposit,
  buttonState = { text: "Deposit ${selectedAmount} USDe at ${selectedLeverage}x Leverage", disabled: false },
}: LoanDepositFormProps) {
  return (
    <div className="space-y-6">
      {/* USDe Amount Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Select USDe Amount</h2>
        <div className="grid grid-cols-3 gap-3">
          {DEPOSIT_AMOUNTS.map(amount => (
            <label
              key={amount}
              className={`
                p-3 border rounded-lg cursor-pointer text-center transition-all
                ${selectedAmount === amount ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-100"}
              `}
            >
              <input
                type="radio"
                className="hidden"
                name="usde-amount"
                value={amount}
                checked={selectedAmount === amount}
                onChange={() => onAmountSelect(amount)}
              />
              {amount} USDe
            </label>
          ))}
        </div>
      </div>

      {/* Leverage Selection */}
      {selectedAmount && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Select Leverage</h2>
          <div className="grid grid-cols-3 gap-3">
            {LEVERAGE_OPTIONS.map(leverage => (
              <label
                key={leverage}
                className={`
                  p-3 border rounded-lg cursor-pointer text-center transition-all
                  ${selectedLeverage === leverage ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-100"}
                `}
              >
                <input
                  type="radio"
                  className="hidden"
                  name="leverage"
                  value={leverage}
                  checked={selectedLeverage === leverage}
                  onChange={() => onLeverageSelect(leverage)}
                />
                {leverage}x
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Deposit Button */}
      {selectedAmount && selectedLeverage && (
        <button
          onClick={onDeposit}
          disabled={buttonState.disabled}
          className="w-full bg-green-500 text-white py-3 rounded-lg 
                     hover:bg-green-600 transition-colors font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonState.text}
        </button>
      )}
    </div>
  );
}
