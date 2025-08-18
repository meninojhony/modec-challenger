'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Download } from 'lucide-react'
import { contractsAPI } from '@/lib/api'
import { Contract, ContractFilters as ContractFiltersType } from '@/lib/types'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Alert from '@/components/ui/Alert'
import ContractFilters from '@/components/contracts/ContractFilters'
import ContractTable from '@/components/contracts/ContractTable'

const ContractsPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [totalContracts, setTotalContracts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ContractFiltersType>({})

  const fetchContracts = async (newFilters?: ContractFiltersType) => {
    try {
      setLoading(true)
      setError(null)
      const filtersToUse = newFilters !== undefined ? newFilters : filters
      const response = await contractsAPI.getContracts(filtersToUse)
      setContracts(response.items)
      setTotalContracts(response.total)
    } catch (error: any) {
      setError('Failed to fetch contracts')
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Parse URL parameters and set initial filters
    const initialFilters: ContractFiltersType = {}
    
    if (searchParams.get('status')) {
      initialFilters.status = searchParams.get('status') as any
    }
    if (searchParams.get('supplier')) {
      initialFilters.supplier = searchParams.get('supplier')!
    }
    if (searchParams.get('category_id')) {
      initialFilters.category_id = parseInt(searchParams.get('category_id')!)
    }
    if (searchParams.get('min_value')) {
      initialFilters.min_value = parseFloat(searchParams.get('min_value')!)
    }
    if (searchParams.get('max_value')) {
      initialFilters.max_value = parseFloat(searchParams.get('max_value')!)
    }
    if (searchParams.get('q')) {
      initialFilters.q = searchParams.get('q')!
    }
    if (searchParams.get('start_date_from')) {
      initialFilters.start_date_from = searchParams.get('start_date_from')!
    }
    if (searchParams.get('start_date_to')) {
      initialFilters.start_date_to = searchParams.get('start_date_to')!
    }
    if (searchParams.get('end_date_from')) {
      initialFilters.end_date_from = searchParams.get('end_date_from')!
    }
    if (searchParams.get('end_date_to')) {
      initialFilters.end_date_to = searchParams.get('end_date_to')!
    }

    setFilters(initialFilters)
    fetchContracts(initialFilters)
  }, [searchParams])

  const handleFiltersChange = (newFilters: ContractFiltersType) => {
    setFilters(newFilters)
    fetchContracts(newFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value))
      }
    })
    
    const queryString = params.toString()
    const newUrl = queryString ? `/contracts?${queryString}` : '/contracts'
    router.replace(newUrl, { scroll: false })
  }

  const handleSort = (field: string) => {
    // Simple sorting implementation - can be enhanced later
    console.log('Sort by:', field)
  }

  const handleView = (contract: Contract) => {
    router.push(`/contracts/${contract.id}`)
  }

  const handleEdit = (contract: Contract) => {
    router.push(`/contracts/${contract.id}/edit`)
  }

  const handleDelete = async (contract: Contract) => {
    if (confirm(`Are you sure you want to delete contract "${contract.contract_number}"? This action cannot be undone.`)) {
      try {
        await contractsAPI.deleteContract(contract.id)
        
        // Remove the contract from the local state
        setContracts(prevContracts => 
          prevContracts.filter(c => c.id !== contract.id)
        )
        setTotalContracts(prev => prev - 1)
        
        // Show success message (optional)
        alert('Contract deleted successfully!')
        
      } catch (error: any) {
        console.error('Failed to delete contract:', error)
        alert('Failed to delete contract. Please try again.')
      }
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert
          type="error"
          title="Error"
          message={error}
          className="mb-6"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="mt-2 text-gray-600">
            Manage and track all your service provider contracts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/contracts/create">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </Link>
        </div>
      </div>

      <ContractFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {totalContracts} contract{totalContracts !== 1 ? 's' : ''}
            </p>
          </div>

          {contracts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-gray-500">No contracts found</p>
              {Object.keys(filters).length > 0 && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => handleFiltersChange({})}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <ContractTable
              contracts={contracts}
              pagination={{ page: 1, page_size: 10, sort_by: 'start_date', sort_dir: 'desc' }}
              onSort={handleSort}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  )
}

function ContractsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><LoadingSpinner size="lg" /></div>}>
      <ContractsPage />
    </Suspense>
  )
}

export default ContractsPageWrapper