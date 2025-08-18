import React from 'react'
import { Contract, PaginationParams } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import { Edit, Trash2, Eye } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ContractTableProps {
  contracts: Contract[]
  pagination: PaginationParams
  onSort: (field: string) => void
  onView: (contract: Contract) => void
  onEdit: (contract: Contract) => void
  onDelete: (contract: Contract) => void
}

const ContractTable: React.FC<ContractTableProps> = ({
  contracts,
  pagination,
  onSort,
  onView,
  onEdit,
  onDelete,
}) => {
  if (contracts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500">No contracts found</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contract
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supplier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {contract.contract_number}
                  </div>
                  <div className="text-sm text-gray-500">
                    {contract.category.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contract.supplier}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={contract.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(contract.value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(contract.end_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(contract)} title="View Contract">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(contract)} title="Edit Contract">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(contract)} title="Delete Contract">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ContractTable