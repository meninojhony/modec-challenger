'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useContracts } from '@/hooks/useContracts'
import { ContractCreateInput } from '@/lib/validations'
import ContractForm from '@/components/contracts/ContractForm'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'

const CreateContractPage: React.FC = () => {
  const router = useRouter()
  const { createContract, loading, error } = useContracts()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (data: ContractCreateInput) => {
    try {
      const contract = await createContract(data)
      setSuccessMessage(`Contract ${contract.contract_number} created successfully!`)
      
      setTimeout(() => {
        router.push(`/contracts/${contract.id}`)
      }, 2000)
    } catch (error) {
      console.error('Failed to create contract:', error)
    }
  }

  const handleCancel = () => {
    router.push('/contracts')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/contracts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Contract</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to create a new service provider contract.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error Creating Contract"
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
            All fields marked with * are required.
          </p>
        </div>

        <ContractForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          submitLabel="Create Contract"
        />
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <h3 className="font-medium text-blue-900 mb-1">Getting Started Tips</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Use a consistent contract numbering scheme (e.g., DEPT-YEAR-###)</li>
              <li>• Ensure the contract value is accurate and includes all costs</li>
              <li>• Double-check start and end dates for accuracy</li>
              <li>• Assign a responsible person who will manage this contract</li>
              <li>• Choose the appropriate category for better organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateContractPage