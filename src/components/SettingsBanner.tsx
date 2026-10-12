import { supabaseSettingsMessage } from '../lib/supabase.ts'

export default function SettingsBanner() {
  if (!supabaseSettingsMessage) return null

  return (
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
  )
}
