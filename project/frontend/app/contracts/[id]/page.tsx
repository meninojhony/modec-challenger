'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Clock, Building, Calendar, DollarSign, User, FileText } from 'lucide-react'
import { useContracts } from '@/hooks/useContracts'
import { formatDate, formatCurrency } from '@/lib/utils'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Alert from '@/components/ui/Alert'
import StatusBadge from '@/components/ui/StatusBadge'
import ContractHistory from '@/components/contracts/ContractHistory'
import DeleteConfirmationModal from '@/components/contracts/DeleteConfirmationModal'

const ContractDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string
  
  const { selectedContract, loading, error, fetchContract, deleteContract } = useContracts()
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (contractId) {
      fetchContract(contractId)
    }
  }, [contractId])

  const handleEdit = () => {
    router.push(`/contracts/${contractId}/edit`)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedContract) return

    try {
      setDeleteLoading(true)
      await deleteContract(selectedContract.id)
      router.push('/contracts')
    } catch (error) {
      console.error('Failed to delete contract:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          type="error"
          title="Error"
          message={error}
        />
        <div className="mt-4">
          <Link href="/contracts">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedContract) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          type="error"
          title="Contract Not Found"
          message="The contract you're looking for doesn't exist or has been deleted."
        />
        <div className="mt-4">
          <Link href="/contracts">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const contract = selectedContract

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/contracts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{contract.contract_number}</h1>
              <p className="mt-1 text-gray-600">{contract.supplier}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="error" onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Contract Details
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Change History
          </button>
        </nav>
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Contract Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Contract Number</label>
                    </div>
                    <p className="text-sm text-gray-900">{contract.contract_number}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Supplier</label>
                    </div>
                    <p className="text-sm text-gray-900">{contract.supplier}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Contract Value</label>
                    </div>
                    <p className="text-sm text-gray-900 font-semibold">{formatCurrency(contract.value)}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Responsible Person</label>
                    </div>
                    <p className="text-sm text-gray-900">{contract.responsible}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <StatusBadge status={contract.status} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                    <p className="text-sm text-gray-900">{contract.category.name}</p>
                    {contract.category.description && (
                      <p className="text-xs text-gray-500 mt-1">{contract.category.description}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Start Date</label>
                    </div>
                    <p className="text-sm text-gray-900">{formatDate(contract.start_date)}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">End Date</label>
                    </div>
                    <p className="text-sm text-gray-900">{formatDate(contract.end_date)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <p className="text-sm text-gray-900 leading-relaxed">{contract.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Timeline</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Created</span>
                  </div>
                  <p className="text-sm text-gray-900">{formatDate(contract.created_at)}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                  </div>
                  <p className="text-sm text-gray-900">{formatDate(contract.updated_at)}</p>
                </div>

                <div className="pt-4">
                  <div className="text-sm text-gray-500">
                    <p>Contract Duration:</p>
                    <p className="font-medium text-gray-900">
                      {Math.ceil((new Date(contract.end_date).getTime() - new Date(contract.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                {contract.status === 'active' && (
                  <div className="pt-4">
                    <div className="text-sm text-gray-500">
                      <p>Days Remaining:</p>
                      <p className="font-medium text-gray-900">
                        {Math.max(0, Math.ceil((new Date(contract.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Change History</h2>
          <ContractHistory contractId={contractId} />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        contract={contract}
        loading={deleteLoading}
      />
    </div>
  )
}

export default ContractDetailPage