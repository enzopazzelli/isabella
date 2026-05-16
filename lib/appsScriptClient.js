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
    // Apps Script web apps redirect POST requests. We follow the redirect manually
    // and re-POST with the original body so doPost receives the payload intact.
    // On 302 we re-POST to the Location; on 307/308 fetch would preserve method
    // automatically but we keep the same path for consistency.
    let targetUrl = url
    let res
    for (let hop = 0; hop < 4; hop++) {
      res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
        redirect: 'manual',
      })
      if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
        const loc = res.headers.get('location')
        if (!loc) break
        targetUrl = loc
        continue
      }
      break
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
