import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { JournalsPage } from './pages/JournalsPage'
import { AccrualBondsPage } from './pages/AccrualBondsPage'
import { AccrualDepositsPage } from './pages/AccrualDepositsPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { PartnersPage } from './pages/PartnersPage'
import { InstrumentsPage } from './pages/InstrumentsPage'
import { DepositsPage } from './pages/DepositsPage'
import { OperationsPage } from './pages/OperationsPage'
import { AccountabilityAccountsPage } from './pages/AccountabilityAccountsPage'
import { AISupportPage } from './pages/AISupportPage'
import { DocExportsPage } from './pages/DocExportsPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { UsersPage } from './pages/UsersPage'
import { ErrorsPage } from './pages/ErrorsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/journals" element={<JournalsPage />} />
                  <Route path="/accrual-bonds" element={<AccrualBondsPage />} />
                  <Route path="/accrual-deposits" element={<AccrualDepositsPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/partners" element={<PartnersPage />} />
                  <Route path="/instruments" element={<InstrumentsPage />} />
                  <Route path="/deposits" element={<DepositsPage />} />
                  <Route path="/operations" element={<OperationsPage />} />
                  <Route path="/accountability-accounts" element={<AccountabilityAccountsPage />} />
                  <Route path="/ai-support" element={<AISupportPage />} />
                  <Route path="/doc-exports" element={<DocExportsPage />} />
                  <Route path="/statistics" element={<StatisticsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/errors" element={<ErrorsPage />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App