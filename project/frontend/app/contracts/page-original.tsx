'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Download } from 'lucide-react'
import { useContracts, useContractFilters } from '@/hooks/useContracts'
import { Contract, ContractFilters as ContractFiltersType } from '@/lib/types'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Alert from '@/components/ui/Alert'
import Pagination from '@/components/ui/Pagination'
import ContractFilters from '@/components/contracts/ContractFilters'
import ContractTable from '@/components/contracts/ContractTable'
import DeleteConfirmationModal from '@/components/contracts/DeleteConfirmationModal'

const ContractsPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    contracts,
    totalContracts,
    currentPage,
    totalPages,
    loading,
    error,
    fetchContracts,
    deleteContract,
  } = useContracts()
  
  const { filters, pagination, updateFilters, updatePagination } = useContractFilters()
  
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const urlFilters: ContractFiltersType = {}
    const urlParams = new URLSearchParams(searchParams.toString())
    
    urlParams.forEach((value, key) => {
      if (value) {
        if (key === 'category_id') {
          const numValue = parseInt(value)
          if (!isNaN(numValue)) {
            urlFilters[key] = numValue
          }
        } else {
          ;(urlFilters as any)[key] = value
        }
      }
    })

    if (Object.keys(urlFilters).length > 0) {
      updateFilters(urlFilters)
    }
  }, [searchParams])

  useEffect(() => {
    fetchContracts(filters, pagination)
  }, [filters, pagination])

  const handleFiltersChange = (newFilters: ContractFiltersType) => {
    updateFilters(newFilters)
    
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

  const handlePageChange = (page: number) => {
    updatePagination({ page })
  }

  const handleSort = (field: string) => {
    const newSortDir = pagination.sort_by === field && pagination.sort_dir === 'asc' ? 'desc' : 'asc'
    updatePagination({ sort_by: field, sort_dir: newSortDir })
  }

  const handleEdit = (contract: Contract) => {
    router.push(`/contracts/${contract.id}/edit`)
  }

  const handleDeleteClick = (contract: Contract) => {
    setContractToDelete(contract)
  }

  const handleView = (contract: Contract) => {
    router.push(`/contracts/${contract.id}`)
  }

  const handleDeleteConfirm = async () => {
    if (!contractToDelete) return

    try {
      setDeleteLoading(true)
      await deleteContract(contractToDelete.id)
      setContractToDelete(null)
      fetchContracts(filters, pagination)
    } catch (error) {
      console.error('Failed to delete contract:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setContractToDelete(null)
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          className="mb-6"
        />
      )}

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

          <ContractTable
            contracts={contracts}
            pagination={pagination}
            onSort={handleSort}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showInfo={true}
              totalItems={totalContracts}
              itemsPerPage={pagination.page_size}
            />
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={!!contractToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        contract={contractToDelete}
        loading={deleteLoading}
      />
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