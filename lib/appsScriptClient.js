// Server-only helper for calling the Google Apps Script web app.
//
// Apps Script returns a 302 redirect on POST that native fetch (spec-compliant)
// would follow as GET, losing the body. We follow the redirect manually and
// re-POST to the Location header.
//
// Requires two env vars:
//   APPS_SCRIPT_URL  — the /exec URL from the Apps Script deployment
//   SYNC_SECRET      — must match the Script Property of the same name
//
// If APPS_SCRIPT_URL is empty, this function short-circuits with
// { ok: true, skipped: true } so that dev works without any configuration.

export async function callAppsScript(payload) {
  const url = process.env.APPS_SCRIPT_URL
  const secret = process.env.SYNC_SECRET

  if (!url) return { ok: true, skipped: 'no APPS_SCRIPT_URL' }
  if (!secret) return { ok: false, error: 'missing SYNC_SECRET env var' }

  const body = JSON.stringify({ ...payload, secret })

  try {
    // Apps Script processes doPost on the initial POST to /exec, then returns a
    // 302 redirect to script.googleusercontent.com/macros/echo?user_content_key=...
    // That echo URL is a content-delivery endpoint: it only accepts GET and serves
    // the response the script already prepared. Re-POSTing to it causes 405.
    const execRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
      redirect: 'manual',
    })

    let res = execRes
    if (execRes.status === 301 || execRes.status === 302) {
      const loc = execRes.headers.get('location')
      if (loc) {
        res = await fetch(loc, { method: 'GET', redirect: 'follow' })
      }
    } else if (execRes.status === 307 || execRes.status === 308) {
      // 307/308 preserve method — re-POST is correct here
      const loc = execRes.headers.get('location')
      if (loc) {
        res = await fetch(loc, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body,
          redirect: 'follow',
        })
      }
    }

    if (!res.ok) {
      return { ok: false, error: `apps script ${res.status}` }
    }

    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return { ok: false, error: 'invalid JSON from apps script', raw: text.slice(0, 200) }
    }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}
