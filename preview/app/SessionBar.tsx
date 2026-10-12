import { cookies } from "next/headers"
import { logoutAction } from "./login/actions"
import { SessionExpiry } from "./SessionExpiry"
import { PREVIEW_COOKIE, readPreviewSession } from "../lib/previewAuth"

export async function SessionBar() {
  const token = cookies().get(PREVIEW_COOKIE)?.value
  const session = await readPreviewSession(token)
  if (!session) return null

  return (
    <div className="session-bar">
      <span className="session-user">{session.user}</span>
      <span className="session-until">
        <SessionExpiry exp={session.exp} />
      </span>
      <form action={logoutAction}>
        <button className="session-logout" type="submit">
          Log out
        </button>
      </form>
    </div>
  )
}
