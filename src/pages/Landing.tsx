export default function Landing({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between p-4">
        <p className="text-xl font-bold">ToolLedger</p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onLogin}
        >
          Log in
        </button>
      </header>

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold">Know who has your tools.</h1>
        <p className="mt-3 max-w-md">
          ToolLedger is a simple lending tracker for workshops. Record every
          loan, spot overdue tools, and confirm returns.
        </p>
        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={onLogin}
        >
          Log in
        </button>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm opacity-70">
          <li>Record every loan</li>
          <li>Spot overdue tools</li>
          <li>Confirm returns</li>
        </ul>
      </section>
    </main>
  )
}
