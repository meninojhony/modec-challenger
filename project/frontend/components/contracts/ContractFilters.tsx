import React, { useState, useEffect } from 'react'
import { ContractFilters as ContractFiltersType, Category } from '@/lib/types'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'

interface ContractFiltersProps {
  onFiltersChange: (filters: ContractFiltersType) => void
  initialFilters?: ContractFiltersType
}

interface FormFilters {
  q: string
  supplier: string
  status: string
  category_id: string
  min_value: string
  max_value: string
  start_date_from: string
  start_date_to: string
  end_date_from: string
  end_date_to: string
}

const ContractFilters: React.FC<ContractFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<FormFilters>({
    q: initialFilters.q || '',
    supplier: initialFilters.supplier || '',
    status: initialFilters.status || '',
    category_id: initialFilters.category_id?.toString() || '',
    min_value: initialFilters.min_value?.toString() || '',
    max_value: initialFilters.max_value?.toString() || '',
    start_date_from: initialFilters.start_date_from || '',
    start_date_to: initialFilters.start_date_to || '',
    end_date_from: initialFilters.end_date_from || '',
    end_date_to: initialFilters.end_date_to || '',
  })

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters({
      q: initialFilters.q || '',
      supplier: initialFilters.supplier || '',
      status: initialFilters.status || '',
      category_id: initialFilters.category_id?.toString() || '',
      min_value: initialFilters.min_value?.toString() || '',
      max_value: initialFilters.max_value?.toString() || '',
      start_date_from: initialFilters.start_date_from || '',
      start_date_to: initialFilters.start_date_to || '',
      end_date_from: initialFilters.end_date_from || '',
      end_date_to: initialFilters.end_date_to || '',
    })
  }, [initialFilters])

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'expired', label: 'Expired' },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/')
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ]

  const handleInputChange = (field: keyof FormFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleApplyFilters = () => {
    const apiFilters: ContractFiltersType = {}
    
    if (filters.q.trim()) apiFilters.q = filters.q.trim()
    if (filters.supplier.trim()) apiFilters.supplier = filters.supplier.trim()
    if (filters.status) apiFilters.status = filters.status as any
    if (filters.category_id) apiFilters.category_id = parseInt(filters.category_id)
    
    // Handle min_value with proper validation
    if (filters.min_value.trim()) {
      const minValue = parseFloat(filters.min_value)
      if (!isNaN(minValue) && minValue >= 0) {
        apiFilters.min_value = minValue
      }
    }
    
    // Handle max_value with proper validation
    if (filters.max_value.trim()) {
      const maxValue = parseFloat(filters.max_value)
      if (!isNaN(maxValue) && maxValue >= 0) {
        apiFilters.max_value = maxValue
      }
    }
    
    if (filters.start_date_from) apiFilters.start_date_from = filters.start_date_from
    if (filters.start_date_to) apiFilters.start_date_to = filters.start_date_to
    if (filters.end_date_from) apiFilters.end_date_from = filters.end_date_from
    if (filters.end_date_to) apiFilters.end_date_to = filters.end_date_to

    onFiltersChange(apiFilters)
  }

  const handleClearFilters = () => {
    const emptyFilters: FormFilters = {
      q: '',
      supplier: '',
      status: '',
      category_id: '',
      min_value: '',
      max_value: '',
      start_date_from: '',
      start_date_to: '',
      end_date_from: '',
      end_date_to: '',
    }
    setFilters(emptyFilters)
    onFiltersChange({})
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      {/* First row: Search, Supplier, Status, Category */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Search contracts..."
          value={filters.q}
          onChange={(e) => handleInputChange('q', e.target.value)}
        />
        <Input
          placeholder="Supplier name"
          value={filters.supplier}
          onChange={(e) => handleInputChange('supplier', e.target.value)}
        />
        <Select
          options={statusOptions}
          placeholder="Filter by status"
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        />
        <Select
          options={categoryOptions}
          placeholder="Filter by category"
          value={filters.category_id}
          onChange={(e) => handleInputChange('category_id', e.target.value)}
        />
      </div>

      {/* Second row: Value range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min value"
            type="number"
            min="0"
            step="0.01"
            value={filters.min_value}
            onChange={(e) => handleInputChange('min_value', e.target.value)}
          />
          <Input
            placeholder="Max value"
            type="number"
            min="0"
            step="0.01"
            value={filters.max_value}
            onChange={(e) => handleInputChange('max_value', e.target.value)}
          />
        </div>
        <div className="flex space-x-2 justify-end">
          <Button variant="secondary" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button variant="primary" size="sm" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Third row: Date ranges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date Period</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="From"
              value={filters.start_date_from}
              onChange={(e) => handleInputChange('start_date_from', e.target.value)}
            />
            <Input
              type="date"
              placeholder="To"
              value={filters.start_date_to}
              onChange={(e) => handleInputChange('start_date_to', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date Period</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="From"
              value={filters.end_date_from}
              onChange={(e) => handleInputChange('end_date_from', e.target.value)}
            />
            <Input
              type="date"
              placeholder="To"
              value={filters.end_date_to}
              onChange={(e) => handleInputChange('end_date_to', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractFilters