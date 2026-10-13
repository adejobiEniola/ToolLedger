import { useCallback, useEffect, useState } from 'react'
import Landing from './pages/Landing.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ResetPassword from './pages/ResetPassword.tsx'
import Dashboard from './pages/Dashboard.tsx'
import LoanForm from './pages/LoanForm.tsx'
import type { LoanFormData } from './pages/LoanForm.tsx'
import LoanDetails from './pages/LoanDetails.tsx'
import SettingsBanner from './components/SettingsBanner.tsx'
import { lagosToday } from './lib/dates.ts'
import { getFixture } from './lib/loans.ts'
import {
  fetchLoansFromSupabase,
  insertLoanInSupabase,
  markReturnedInSupabase,
  supabase,
  supabaseSettingsMessage,
  updateLoanInSupabase,
} from './lib/supabase.ts'
import type { Loan, StatusFilter } from './lib/types.ts'

type View =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot'
  | 'reset'
  | 'dashboard'
  | 'add'
  | 'edit'
  | 'details'

function resetIsExpired(): boolean {
  return window.location.hash.includes('reset=expired')
}

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [loans, setLoans] = useState<Loan[]>([])
  const [loansLoading, setLoansLoading] = useState(true)
  const [loansError, setLoansError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all-outstanding')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [today, setToday] = useState<string>(() => lagosToday())

  const loadLoans = useCallback(async () => {
    setLoansLoading(true)
    setLoansError(null)
    try {
      if (getFixture() === 'fetch-error') {
        throw new Error('fixture fetch error')
      }
      if (supabase === null) {
        throw new Error(supabaseSettingsMessage ?? 'missing Supabase config')
      }
      const rows = await fetchLoansFromSupabase(supabase)
      setLoans(rows)
    } catch {
      setLoansError('Unable to load loans. Please try again.')
    } finally {
      setLoansLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadLoans()
  }, [loadLoans])

  // Recalculate statuses on load, focus, and Lagos date change while open.
  useEffect(() => {
    const refresh = () => {
      const current = lagosToday()
      setToday((prev) => (prev === current ? prev : current))
    }
    refresh()
    const onFocus = () => refresh()
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const timer = setInterval(refresh, 30000)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const goHome = () => setView('landing')
  const goLogin = (message?: string) => {
    setFlash(message ?? null)
    setView('login')
  }

  function handleLogout() {
    setStatusFilter('all-outstanding')
    setDateFilter('')
    setSelectedId(null)
    setFlash(null)
    setView('login')
  }

  function openDetails(id: string) {
    setSelectedId(id)
    setView('details')
  }

  async function handleAddSave(data: LoanFormData): Promise<void> {
    if (supabase === null) {
      throw new Error(supabaseSettingsMessage ?? 'missing Supabase config')
    }
    const loan = await insertLoanInSupabase(supabase, data, lagosToday())
    setLoans((prev) => [loan, ...prev])
    setSelectedId(loan.id)
    setView('details')
  }

  async function handleEditSave(data: LoanFormData): Promise<void> {
    if (selectedId === null) return
    if (supabase === null) {
      throw new Error(supabaseSettingsMessage ?? 'missing Supabase config')
    }
    const loan = await updateLoanInSupabase(supabase, selectedId, data)
    setLoans((prev) => prev.map((l) => (l.id === loan.id ? loan : l)))
    setView('details')
  }

  async function handleReturned(): Promise<void> {
    if (selectedId === null) return
    if (supabase === null) {
      throw new Error(supabaseSettingsMessage ?? 'missing Supabase config')
    }
    const current = lagosToday()
    const loan = await markReturnedInSupabase(supabase, selectedId, current)
    setToday(current)
    setLoans((prev) => prev.map((l) => (l.id === loan.id ? loan : l)))
  }

  const selected = loans.find((l) => l.id === selectedId) ?? null

  return (
    <div className="flex min-h-dvh flex-col">
      <SettingsBanner />
      {view === 'landing' && <Landing onLogin={() => goLogin()} />}
      {view === 'login' && (
        <Login
          onBack={goHome}
          onPreview={() => setView('dashboard')}
          onSignup={() => setView('signup')}
          onForgot={() => setView('forgot')}
          flash={flash}
        />
      )}
      {view === 'signup' && (
        <Signup onBack={goHome} onLogin={() => goLogin()} />
      )}
      {view === 'forgot' && (
        <ForgotPassword onBack={goHome} onLogin={() => goLogin()} />
      )}
      {view === 'reset' && (
        <ResetPassword
          onBack={goHome}
          onLogin={(message) => goLogin(message)}
          onForgot={() => setView('forgot')}
          linkExpired={resetIsExpired()}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard
          loans={loans}
          today={today}
          status={statusFilter}
          date={dateFilter}
          loading={loansLoading}
          loadError={loansError}
          onRetry={() => void loadLoans()}
          onStatus={setStatusFilter}
          onDate={setDateFilter}
          onAdd={() => setView('add')}
          onOpen={openDetails}
          onLogout={handleLogout}
        />
      )}
      {view === 'add' && (
        <LoanForm
          initial={null}
          today={today}
          onSave={handleAddSave}
          onCancel={() => setView('dashboard')}
          onLogout={handleLogout}
        />
      )}
      {view === 'edit' &&
        (selected && selected.actualReturnDate === null ? (
          <LoanForm
            initial={selected}
            today={today}
            onSave={handleEditSave}
            onCancel={() => setView('details')}
            onLogout={handleLogout}
          />
        ) : (
          <LoanDetails
            loan={selected}
            today={today}
            onBack={() => setView('dashboard')}
            onEdit={() => setView('edit')}
            onReturned={handleReturned}
            onLogout={handleLogout}
          />
        ))}
      {view === 'details' && (
        <LoanDetails
          loan={selected}
          today={today}
          onBack={() => setView('dashboard')}
          onEdit={() => setView('edit')}
          onReturned={handleReturned}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
