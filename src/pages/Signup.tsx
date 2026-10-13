import { useState } from 'react'
import type { FormEvent } from 'react'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function Signup({
  onBack,
  onLogin,
}: {
  onBack: () => void
  onLogin: () => void
}) {
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
    } else if (password.length < 8 || password.length > 128) {
      setPasswordError('Use a password between 8 and 128 characters.')
      valid = false
    } else {
      setPasswordError(null)
    }

    if (!valid) {
      setNotice(null)
      return
    }
    setNotice('Preview only. No account changes or emails were sent.')
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
              Create an account
            </h1>

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
                  htmlFor="signup-email"
                >
                  Email
                </label>
                <input
                  id="signup-email"
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
                    emailError ? 'signup-email-error' : undefined
                  }
                />
                {emailError && (
                  <p id="signup-email-error" className="login-error mt-2 text-sm">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="login-label mb-2 block text-sm font-semibold"
                  htmlFor="signup-password"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  className="input login-input"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setPasswordError(null)
                  }}
                  aria-invalid={passwordError !== null}
                  aria-describedby={
                    passwordError ? 'signup-password-error' : undefined
                  }
                />
                {passwordError && (
                  <p
                    id="signup-password-error"
                    className="login-error mt-2 text-sm"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              <button type="submit" className="btn login-submit mt-2">
                Sign up
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
