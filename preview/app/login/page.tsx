import { loginAction } from "./actions"

export const dynamic = "force-dynamic"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string }
}) {
  const next = searchParams.next?.startsWith("/") ? searchParams.next : "/"

  return (
    <main className="page">
      <div className="login-card">
        <h1 className="page-title">Offers</h1>
        <p className="page-subtitle">Sign in with the preview login from Vercel env.</p>
        {searchParams.error ? (
          <p className="login-error">Wrong login or password.</p>
        ) : null}
        <form action={loginAction} className="login-form">
          <input type="hidden" name="next" value={next} />
          <label className="login-label">
            Login
            <input className="login-input" name="user" type="text" autoComplete="username" required />
          </label>
          <label className="login-label">
            Password
            <input
              className="login-input"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="login-submit" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}
