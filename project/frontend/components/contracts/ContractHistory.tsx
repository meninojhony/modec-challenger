import React from 'react'

interface ContractHistoryProps {
  contractId: string
}

const ContractHistory: React.FC<ContractHistoryProps> = ({ contractId }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-500">Contract history for {contractId}</p>
      <div className="text-sm text-gray-600">
        Change history functionality would be implemented here.
      </div>
    </div>
  )
}

export default ContractHistory