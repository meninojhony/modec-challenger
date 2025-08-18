'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useContracts } from '@/hooks/useContracts'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatCurrency } from '@/lib/utils'

const Dashboard: React.FC = () => {
  const { contracts, loading, fetchContracts } = useContracts()

  useEffect(() => {
    fetchContracts()
  }, [])

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiringSoon: contracts.filter(c => {
      const endDate = new Date(c.end_date)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return endDate <= thirtyDaysFromNow && c.status === 'active'
    }).length,
    totalValue: contracts.reduce((sum, c) => sum + parseFloat(c.value), 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contract Management Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your contract portfolio and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contracts</h2>
            <Link href="/contracts">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          {contracts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No contracts found</p>
              <Link href="/contracts/create" className="inline-block mt-4">
                <Button size="sm">Create Your First Contract</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.slice(0, 5).map((contract) => (
                <div key={contract.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{contract.contract_number}</p>
                    <p className="text-sm text-gray-500">{contract.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(contract.value)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      contract.status === 'active' ? 'bg-success-100 text-success-800' :
                      contract.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      contract.status === 'expired' ? 'bg-gray-100 text-gray-600' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/contracts/create" className="block">
              <Button className="w-full justify-start" variant="primary">
                <FileText className="h-4 w-4 mr-2" />
                Create New Contract
              </Button>
            </Link>
            <Link href="/contracts" className="block">
              <Button className="w-full justify-start" variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                View All Contracts
              </Button>
            </Link>
            <Link href="/contracts?status=active" className="block">
              <Button className="w-full justify-start" variant="secondary">
                <CheckCircle className="h-4 w-4 mr-2" />
                View Active Contracts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard