import { useState } from 'react'
import type { FormEvent } from 'react'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function ForgotPassword({
  onBack,
  onLogin,
}: {
  onBack: () => void
  onLogin: () => void
}) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setEmailError('This field is required.')
      return
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Enter a valid email address.')
      return
    }
    setEmailError(null)
    setSent(true)
  }

  return (
    <main className="login-stage flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <div className="login-stack">
          <div aria-hidden="true" className="login-layer login-layer-2" />
          <div aria-hidden="true" className="login-layer login-layer-1" />
          <section className="login-panel">
            <p className="login-brand font-display text-center text-xl font-extrabold">
              ToolLedger
            </p>
            <h1 className="login-heading font-display mt-6 text-center font-bold">
              Reset your password
            </h1>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 flex flex-col gap-5"
            >
              {sent && (
                <p role="status" className="login-notice text-sm">
                  If an account exists for this email, a reset link will be
                  sent. Preview only. No account changes or emails were sent.
                </p>
              )}

              <div>
                <label
                  className="login-label mb-2 block text-sm font-semibold"
                  htmlFor="forgot-email"
                >
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  className="input login-input"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setEmailError(null)
                  }}
                  aria-invalid={emailError !== null}
                  aria-describedby={
                    emailError ? 'forgot-email-error' : undefined
                  }
                />
                {emailError && (
                  <p id="forgot-email-error" className="login-error mt-2 text-sm">
                    {emailError}
                  </p>
                )}
              </div>

              <button type="submit" className="btn login-submit mt-2">
                Send reset link
              </button>

              <p className="text-center text-sm">
                <button
                  type="button"
                  className="link login-link"
                  onClick={onLogin}
                >
                  Back to Log in
                </button>
              </p>
            </form>
          </section>
        </div>
        <button
          type="button"
          className="login-back mt-5 w-full text-center text-sm"
          onClick={onBack}
        >
          ← Back to home
        </button>
      </div>
    </main>
  )
}
