'use client'

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react'
import { Contract, Category, ContractFilters, PaginationParams } from '@/lib/types'

interface ContractState {
  contracts: Contract[]
  categories: Category[]
  selectedContract: Contract | null
  totalContracts: number
  currentPage: number
  totalPages: number
  loading: boolean
  error: string | null
  filters: ContractFilters
  pagination: PaginationParams
}

type ContractAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONTRACTS'; payload: { contracts: Contract[]; total: number; page: number; pages: number } }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_SELECTED_CONTRACT'; payload: Contract | null }
  | { type: 'SET_FILTERS'; payload: ContractFilters }
  | { type: 'SET_PAGINATION'; payload: PaginationParams }
  | { type: 'UPDATE_CONTRACT'; payload: Contract }
  | { type: 'DELETE_CONTRACT'; payload: string }

const initialState: ContractState = {
  contracts: [],
  categories: [],
  selectedContract: null,
  totalContracts: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    page_size: 10,
    sort_by: 'start_date',
    sort_dir: 'desc',
  },
}

function contractReducer(state: ContractState, action: ContractAction): ContractState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CONTRACTS':
      return {
        ...state,
        contracts: action.payload.contracts,
        totalContracts: action.payload.total,
        currentPage: action.payload.page,
        totalPages: action.payload.pages,
        loading: false,
        error: null,
      }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'SET_SELECTED_CONTRACT':
      return { ...state, selectedContract: action.payload }
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload }
    case 'UPDATE_CONTRACT':
      return {
        ...state,
        contracts: state.contracts.map((contract) =>
          contract.id === action.payload.id ? action.payload : contract
        ),
        selectedContract: state.selectedContract?.id === action.payload.id ? action.payload : state.selectedContract,
      }
    case 'DELETE_CONTRACT':
      return {
        ...state,
        contracts: state.contracts.filter((contract) => contract.id !== action.payload),
        selectedContract: state.selectedContract?.id === action.payload ? null : state.selectedContract,
      }
    default:
      return state
  }
}

interface ContractContextType {
  state: ContractState
  dispatch: React.Dispatch<ContractAction>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setContracts: (contracts: Contract[], total: number, page: number, pages: number) => void
  setCategories: (categories: Category[]) => void
  setSelectedContract: (contract: Contract | null) => void
  setFilters: (filters: ContractFilters) => void
  setPagination: (pagination: PaginationParams) => void
  updateContract: (contract: Contract) => void
  deleteContract: (contractId: string) => void
}

const ContractContext = createContext<ContractContextType | undefined>(undefined)

export function ContractProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contractReducer, initialState)

  const setLoading = useCallback((loading: boolean) => 
    dispatch({ type: 'SET_LOADING', payload: loading }), [])
  
  const setError = useCallback((error: string | null) => 
    dispatch({ type: 'SET_ERROR', payload: error }), [])
  
  const setContracts = useCallback((contracts: Contract[], total: number, page: number, pages: number) =>
    dispatch({ type: 'SET_CONTRACTS', payload: { contracts, total, page, pages } }), [])
  
  const setCategories = useCallback((categories: Category[]) => 
    dispatch({ type: 'SET_CATEGORIES', payload: categories }), [])
  
  const setSelectedContract = useCallback((contract: Contract | null) =>
    dispatch({ type: 'SET_SELECTED_CONTRACT', payload: contract }), [])
  
  const setFilters = useCallback((filters: ContractFilters) => 
    dispatch({ type: 'SET_FILTERS', payload: filters }), [])
  
  const setPagination = useCallback((pagination: PaginationParams) => 
    dispatch({ type: 'SET_PAGINATION', payload: pagination }), [])
  
  const updateContract = useCallback((contract: Contract) => 
    dispatch({ type: 'UPDATE_CONTRACT', payload: contract }), [])
  
  const deleteContract = useCallback((contractId: string) => 
    dispatch({ type: 'DELETE_CONTRACT', payload: contractId }), [])

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    setLoading,
    setError,
    setContracts,
    setCategories,
    setSelectedContract,
    setFilters,
    setPagination,
    updateContract,
    deleteContract,
  }), [
    state,
    setLoading,
    setError,
    setContracts,
    setCategories,
    setSelectedContract,
    setFilters,
    setPagination,
    updateContract,
    deleteContract,
  ])

  return <ContractContext.Provider value={contextValue}>{children}</ContractContext.Provider>
}

export function useContract() {
  const context = useContext(ContractContext)
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider')
  }
  return context
}