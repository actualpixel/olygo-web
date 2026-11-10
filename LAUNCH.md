# Olygo website — pre-launch mode

The site currently runs in **coming-soon mode**:

| File | What it is |
| --- | --- |
| `index.html` | Coming-soon page (countdown + waitlist). This is what visitors see. |
| `preview.html` | The full landing page, parked for launch day. `noindex`, so search engines skip it. |
| `privacy.html`, `terms.html`, `safety.html`, `404.html` | Live as usual. Their nav links to sections point at `preview.html#…` for now. |

## Before going live with the coming-soon page

1. **Launch date** — in `index.html`, edit `data-launch="2026-12-19T10:00:00+05:30"` on the countdown (and the "Launching 19 December 2026" text and meta description if the date moves).
2. **Waitlist** — sign up for a form service that accepts JSON POST (e.g. Formspree, Basin, Getform), then in `index.html`:
   - set `data-endpoint="https://formspree.io/f/XXXX"` on `<form id="waitlist">`
   - add the service origin to `connect-src` in the Content-Security-Policy meta tag, e.g. `connect-src 'self' https://formspree.io;`

   Until an endpoint is set, joining opens the visitor's email app addressed to `hello@olygo.app` (`data-fallback`).

## On launch day

```bash
cd web
mv index.html coming-soon.html        # keep it, or delete it
mv preview.html index.html
sed -i '' 's/noindex, nofollow/index, follow, max-image-preview:large/' index.html
sed -i '' 's#<title>#<link rel="canonical" href="https://olygo.app/">\n  <title>#' index.html
sed -i '' 's#href="preview.html\##href="./\##g; s#href="./\#waitlist"#href="./\#download"#g' privacy.html terms.html safety.html 404.html
```

Then replace the placeholder App Store / Google Play links in `index.html` (search for `TODO`).
