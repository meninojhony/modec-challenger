import React from 'react'
import { Contract } from '@/lib/types'
import Button from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  contract: Contract | null
  loading?: boolean
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contract,
  loading = false,
}) => {
  if (!isOpen || !contract) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            Delete Contract
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete contract{' '}
              <span className="font-medium">{contract.contract_number}</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={onConfirm}
                loading={loading}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal