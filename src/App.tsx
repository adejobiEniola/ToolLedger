import { useState } from 'react'
import Landing from './pages/Landing.tsx'
import Login from './pages/Login.tsx'
import { supabaseSettingsMessage } from './lib/supabase.ts'

function App() {
  const [view, setView] = useState<'landing' | 'login'>('landing')

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {supabaseSettingsMessage && (
        <p
          role="alert"
          style={{
            margin: 0,
            padding: '12px 16px',
            background: '#fff4d6',
            borderBottom: '1px solid #e5cf8a',
            color: '#5c4a00',
            fontSize: '15px',
            textAlign: 'left',
          }}
        >
          {supabaseSettingsMessage}
        </p>
      )}
      {view === 'landing' ? (
        <Landing onLogin={() => setView('login')} />
      ) : (
        <Login onBack={() => setView('landing')} />
      )}
    </div>
  )
}

export default App
