import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ContractProvider } from '@/contexts/ContractContext'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Contract Management System',
  description: 'A comprehensive web application for managing service provider contracts',
  keywords: ['contracts', 'management', 'service providers', 'business'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContractProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ContractProvider>
      </body>
    </html>
  )
}