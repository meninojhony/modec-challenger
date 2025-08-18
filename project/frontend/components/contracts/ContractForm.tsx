import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Contract, Category } from '@/lib/types'
import { ContractCreateInput, ContractUpdateInput, contractCreateSchema, contractUpdateSchema } from '@/lib/validations'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'

interface ContractFormProps {
  initialData?: Contract
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
  submitLabel?: string
}

type FormData = {
  contract_number: string
  supplier: string
  description: string
  category_id: string
  responsible: string
  status: 'draft' | 'active' | 'suspended' | 'terminated' | 'expired'
  value: string
  start_date: string
  end_date: string
}

const ContractForm: React.FC<ContractFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save Contract',
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const isEdit = !!initialData
  
  const schema = isEdit ? contractUpdateSchema : contractCreateSchema
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      contract_number: initialData.contract_number,
      supplier: initialData.supplier,
      description: initialData.description,
      category_id: String(initialData.category_id),
      responsible: initialData.responsible,
      status: initialData.status,
      value: String(initialData.value),
      start_date: initialData.start_date,
      end_date: initialData.end_date
    } : {
      status: 'draft'
    }
  })

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

  const onSubmitForm = (data: FormData) => {
    console.log('Form data being submitted:', data)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contract_number" className="block text-sm font-medium text-gray-700 mb-2">
            Contract Number *
          </label>
          <input
            {...register('contract_number')}
            type="text"
            id="contract_number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., SW-2024-001"
          />
          {errors.contract_number && (
            <p className="mt-1 text-sm text-red-600">{errors.contract_number.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
            Supplier *
          </label>
          <input
            {...register('supplier')}
            type="text"
            id="supplier"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Microsoft Corporation"
          />
          {errors.supplier && (
            <p className="mt-1 text-sm text-red-600">{errors.supplier.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Detailed description of the contract"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            {...register('category_id')}
            id="category_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="responsible" className="block text-sm font-medium text-gray-700 mb-2">
            Responsible Person *
          </label>
          <input
            {...register('responsible')}
            type="text"
            id="responsible"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="João Silva"
          />
          {errors.responsible && (
            <p className="mt-1 text-sm text-red-600">{errors.responsible.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            {...register('status')}
            id="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
            <option value="expired">Expired</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
            Contract Value *
          </label>
          <input
            {...register('value')}
            type="number"
            step="0.01"
            min="0"
            id="value"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            {...register('start_date')}
            type="date"
            id="start_date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <input
            {...register('end_date')}
            type="date"
            id="end_date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.end_date && (
            <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ContractForm