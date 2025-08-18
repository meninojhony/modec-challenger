import React from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">ContractManager</span>
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/contracts" className="text-gray-900 hover:text-primary-600">
              Contracts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header