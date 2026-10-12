import { useState } from 'react'
import SettingsBanner from './components/SettingsBanner.tsx'
import Landing from './pages/Landing.tsx'
import Login from './pages/Login.tsx'

function App() {
  const [view, setView] = useState<'landing' | 'login'>('landing')

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SettingsBanner />
      {view === 'landing' ? (
        <Landing onLogin={() => setView('login')} />
      ) : (
        <Login onBack={() => setView('landing')} />
      )}
    </div>
  )
}

export default App
