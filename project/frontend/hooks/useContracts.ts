'use client'

import { useCallback, useEffect } from 'react'
import { contractsAPI, categoriesAPI } from '@/lib/api'
import { useContract } from '@/contexts/ContractContext'
import { ContractFilters, PaginationParams } from '@/lib/types'
import { ContractCreateInput, ContractUpdateInput } from '@/lib/validations'

export function useContracts() {
  const {
    state,
    setLoading,
    setError,
    setContracts,
    setCategories,
    setSelectedContract,
    updateContract,
    deleteContract,
  } = useContract()

  const fetchContracts = useCallback(
    async (filters?: ContractFilters, pagination?: PaginationParams) => {
      try {
        setLoading(true)
        setError(null)
        const response = await contractsAPI.getContracts(filters, pagination)
        setContracts(response.items, response.total, response.page, response.pages)
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Failed to fetch contracts')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setContracts]
  )

  const fetchContract = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        setError(null)
        const contract = await contractsAPI.getContract(id)
        setSelectedContract(contract)
        return contract
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Failed to fetch contract')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setSelectedContract]
  )

  const createContract = useCallback(
    async (contractData: ContractCreateInput) => {
      try {
        setLoading(true)
        setError(null)
        const contract = await contractsAPI.createContract(contractData)
        return contract
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Failed to create contract')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  const updateContractData = useCallback(
    async (id: string, contractData: ContractUpdateInput) => {
      try {
        setLoading(true)
        setError(null)
        const contract = await contractsAPI.updateContract(id, contractData)
        updateContract(contract)
        return contract
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Failed to update contract')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, updateContract]
  )

  const deleteContractData = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        setError(null)
        await contractsAPI.deleteContract(id)
        deleteContract(id)
      } catch (error: any) {
        setError(error.response?.data?.error?.message || 'Failed to delete contract')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, deleteContract]
  )

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await categoriesAPI.getCategories()
      setCategories(categories)
      return categories
    } catch (error: any) {
      setError(error.response?.data?.error?.message || 'Failed to fetch categories')
      throw error
    }
  }, [setCategories, setError])

  return {
    contracts: state.contracts,
    categories: state.categories,
    selectedContract: state.selectedContract,
    totalContracts: state.totalContracts,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    loading: state.loading,
    error: state.error,
    fetchContracts,
    fetchContract,
    createContract,
    updateContract: updateContractData,
    deleteContract: deleteContractData,
    fetchCategories,
  }
}

export function useContractFilters() {
  const { state, setFilters, setPagination } = useContract()

  const updateFilters = useCallback(
    (newFilters: ContractFilters) => {
      setFilters(newFilters)
      setPagination({ ...state.pagination, page: 1 })
    },
    [setFilters, setPagination, state.pagination]
  )

  const updatePagination = useCallback(
    (newPagination: Partial<PaginationParams>) => {
      setPagination({ ...state.pagination, ...newPagination })
    },
    [setPagination, state.pagination]
  )

  const resetFilters = useCallback(() => {
    setFilters({})
    setPagination({
      page: 1,
      page_size: 10,
      sort_by: 'start_date',
      sort_dir: 'desc',
    })
  }, [setFilters, setPagination])

  return {
    filters: state.filters,
    pagination: state.pagination,
    updateFilters,
    updatePagination,
    resetFilters,
  }
}