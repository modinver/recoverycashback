interface PromotedCardDetailsProps {
  minimumSalary?: number;
  annualFee?: string;
  maxCashbackRate?: number;
}

export const PromotedCardDetails = ({
  minimumSalary,
  annualFee,
  maxCashbackRate,
}: PromotedCardDetailsProps) => {
  return (
    <div className="md:col-span-1">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase">Minimum Salary</h4>
          <p className="font-semibold text-lg">
            {minimumSalary ? `AED ${minimumSalary.toLocaleString()}` : 'Contact bank'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase">Annual Fee</h4>
          <p className="font-semibold text-lg">{annualFee || 'Contact bank'}</p>
        </div>
        {maxCashbackRate !== undefined && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase">Max Cashback</h4>
            <p className="font-semibold text-lg text-green-600">{maxCashbackRate}%</p>
          </div>
        )}
      </div>
    </div>
  );
};