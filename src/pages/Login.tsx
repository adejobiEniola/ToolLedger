import { useState } from 'react'
import type { FormEvent } from 'react'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function Login({ onBack }: { onBack?: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    let valid = true

    if (!trimmedEmail) {
      setEmailError('This field is required.')
      valid = false
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError('Enter a valid email address.')
      valid = false
    } else {
      setEmailError(null)
    }

    if (!password) {
      setPasswordError('This field is required.')
      valid = false
    } else {
      setPasswordError(null)
    }

    if (!valid) {
      setNotice(null)
      return
    }
    setNotice('Preview only. No real login happens here yet.')
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
              Welcome back
            </h1>
            <p className="login-sub mt-3 text-center">
              Log in to keep track of your workshop&apos;s tool loans.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 flex flex-col gap-5"
            >
              {notice && (
                <p role="status" className="login-notice text-sm">
                  {notice}
                </p>
              )}

              <div>
                <label
                  className="login-label mb-2 block text-sm font-semibold"
                  htmlFor="login-email"
                >
                  Email
                </label>
                <input
                  id="login-email"
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
                    emailError ? 'login-email-error' : undefined
                  }
                />
                {emailError && (
                  <p id="login-email-error" className="login-error mt-2 text-sm">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="login-label mb-2 block text-sm font-semibold"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  className="input login-input"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setPasswordError(null)
                  }}
                  aria-invalid={passwordError !== null}
                  aria-describedby={
                    passwordError ? 'login-password-error' : undefined
                  }
                />
                {passwordError && (
                  <p
                    id="login-password-error"
                    className="login-error mt-2 text-sm"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              <button type="submit" className="btn login-submit mt-2">
                Log in
              </button>

              <div className="flex items-center justify-between text-sm">
                <a className="link login-link" href="#signup">
                  Sign Up
                </a>
                <a className="link login-link" href="#forgot-password">
                  Forgot Password
                </a>
              </div>
            </form>
          </section>
        </div>
        {onBack && (
          <button
            type="button"
            className="login-back mt-5 w-full text-center text-sm"
            onClick={onBack}
          >
            ← Back to home
          </button>
        )}
      </div>
    </main>
  )
}
