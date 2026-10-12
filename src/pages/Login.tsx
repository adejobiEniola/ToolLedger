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
    <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
      <div className="w-full max-w-sm">
        <p className="mb-4 text-center text-2xl font-bold">ToolLedger</p>
        <div className="card bg-base-100 shadow-xl">
          <form className="card-body" onSubmit={handleSubmit} noValidate>
            <h1 className="card-title">Log in</h1>

            {notice && (
              <p role="status" className="text-sm">
                {notice}
              </p>
            )}

            <div className="form-control">
              <label className="label" htmlFor="login-email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setEmailError(null)
                }}
                aria-invalid={emailError !== null}
                aria-describedby={emailError ? 'login-email-error' : undefined}
              />
              {emailError && (
                <p id="login-email-error" className="text-error mt-1 text-sm">
                  {emailError}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="login-password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className="input input-bordered w-full"
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
                <p id="login-password-error" className="text-error mt-1 text-sm">
                  {passwordError}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary mt-2 w-full">
              Log in
            </button>

            <div className="flex items-center justify-between text-sm">
              <a className="link link-primary" href="#signup">
                Sign Up
              </a>
              <a className="link link-primary" href="#forgot-password">
                Forgot Password
              </a>
            </div>
          </form>
        </div>
        {onBack && (
          <button
            type="button"
            className="link link-primary mt-4 w-full text-center text-sm"
            onClick={onBack}
          >
            ← Back to home
          </button>
        )}
      </div>
    </main>
  )
}
