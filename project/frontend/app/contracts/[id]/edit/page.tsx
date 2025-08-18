'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useContracts } from '@/hooks/useContracts'
import { ContractUpdateInput } from '@/lib/validations'
import ContractForm from '@/components/contracts/ContractForm'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const EditContractPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string
  
  const { selectedContract, loading, error, fetchContract, updateContract } = useContracts()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    if (contractId) {
      fetchContract(contractId)
    }
  }, [contractId])

  const handleSubmit = async (data: ContractUpdateInput) => {
    try {
      setUpdateLoading(true)
      const contract = await updateContract(contractId, data)
      setSuccessMessage(`Contract ${contract.contract_number} updated successfully!`)
      
      setTimeout(() => {
        router.push(`/contracts/${contract.id}`)
      }, 2000)
    } catch (error) {
      console.error('Failed to update contract:', error)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/contracts/${contractId}`)
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          type="error"
          title="Contract Not Found"
          message="The contract you're trying to edit doesn't exist or has been deleted."
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href={`/contracts/${contractId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contract
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Contract</h1>
        <p className="mt-2 text-gray-600">
          Update the contract details for {selectedContract.contract_number}
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Updating Contract"
          message={error}
          className="mb-6"
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          title="Success"
          message={successMessage}
          className="mb-6"
        />
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Contract Information</h2>
          <p className="text-sm text-gray-600 mt-1">
            Update any fields that need to be changed. Changes will be tracked in the contract history.
          </p>
        </div>

        <ContractForm
          initialData={selectedContract}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updateLoading}
          submitLabel="Update Contract"
        />
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <h3 className="font-medium text-yellow-900 mb-1">Edit Contract Notes</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• All changes are automatically tracked in the contract history</li>
              <li>• Ensure you have the proper authorization to modify this contract</li>
              <li>• Changes to critical fields like value or dates may require approval</li>
              <li>• Consider the impact on related documents and agreements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditContractPage