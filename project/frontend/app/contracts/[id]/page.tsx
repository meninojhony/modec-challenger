'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Clock, Building, Calendar, DollarSign, User, FileText } from 'lucide-react'
import { Contract } from '@/lib/types'
import { contractsAPI } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Alert from '@/components/ui/Alert'
import StatusBadge from '@/components/ui/StatusBadge'

const ContractDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string
  
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchContract = async () => {
      if (!contractId) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await contractsAPI.getContract(contractId)
        setContract(response)
      } catch (error: any) {
        setError('Failed to fetch contract details')
        console.error('Error fetching contract:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContract()
  }, [contractId])

  const handleEdit = () => {
    router.push(`/contracts/${contractId}/edit`)
  }

  const handleDelete = async () => {
    if (!contract) return
    
    if (confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      try {
        setDeleteLoading(true)
        await contractsAPI.deleteContract(contract.id)
        router.push('/contracts')
      } catch (error) {
        console.error('Failed to delete contract:', error)
        alert('Failed to delete contract. Please try again.')
      } finally {
        setDeleteLoading(false)
      }
    }
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

  if (!contract) {
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
            <Button variant="error" onClick={handleDelete} disabled={deleteLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Contract Details</h2>
      </div>

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
    </div>
  )
}

export default ContractDetailPage