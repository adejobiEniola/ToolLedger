import { useState } from 'react'
import type { FormEvent } from 'react'

export default function ResetPassword({
  onBack,
  onLogin,
  onForgot,
  linkExpired,
}: {
  onBack: () => void
  onLogin: (flash: string) => void
  onForgot: () => void
  linkExpired: boolean
}) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    let valid = true

    if (!password) {
      setPasswordError('This field is required.')
      valid = false
    } else if (password.length < 8 || password.length > 128) {
      setPasswordError('Use a password between 8 and 128 characters.')
      valid = false
    } else {
      setPasswordError(null)
    }

    if (password !== confirm) {
      setConfirmError('Passwords do not match.')
      valid = false
    } else {
      setConfirmError(null)
    }

    if (!valid) return
    onLogin('Password updated. Please log in.')
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
              Choose a new password
            </h1>

            {linkExpired ? (
              <div className="mt-8 flex flex-col gap-5">
                <p role="alert" className="login-notice text-sm">
                  This reset link is invalid or has expired. Request a new
                  link.
                </p>
                <p className="text-center text-sm">
                  <button
                    type="button"
                    className="link login-link"
                    onClick={onForgot}
                  >
                    Forgot Password
                  </button>
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 flex flex-col gap-5"
              >
                <div>
                  <label
                    className="login-label mb-2 block text-sm font-semibold"
                    htmlFor="reset-password"
                  >
                    New password
                  </label>
                  <input
                    id="reset-password"
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
                      passwordError ? 'reset-password-error' : undefined
                    }
                  />
                  {passwordError && (
                    <p
                      id="reset-password-error"
                      className="login-error mt-2 text-sm"
                    >
                      {passwordError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="login-label mb-2 block text-sm font-semibold"
                    htmlFor="reset-confirm"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="reset-confirm"
                    type="password"
                    autoComplete="new-password"
                    className="input login-input"
                    value={confirm}
                    onChange={(event) => {
                      setConfirm(event.target.value)
                      setConfirmError(null)
                    }}
                    aria-invalid={confirmError !== null}
                    aria-describedby={
                      confirmError ? 'reset-confirm-error' : undefined
                    }
                  />
                  {confirmError && (
                    <p
                      id="reset-confirm-error"
                      className="login-error mt-2 text-sm"
                    >
                      {confirmError}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn login-submit mt-2">
                  Save new password
                </button>
              </form>
            )}
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
