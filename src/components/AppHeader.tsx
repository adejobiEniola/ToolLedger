export default function AppHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="flex shrink-0 items-center justify-between bg-base-100 px-4 py-3 shadow-sm sm:px-6">
      <p className="font-display text-lg font-extrabold">ToolLedger</p>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
        Logout
      </button>
    </header>
  )
}
