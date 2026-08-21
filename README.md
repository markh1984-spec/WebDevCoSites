# Community site template

A starting point for client sites — nurseries, village halls, small schools.
Same plain HTML/CSS/JS approach as everything else in this repo: no build
step, no framework, edit and deploy.

Live example of the pattern this is built on: [Elena's Cakes](../../sites/elenas-cakes/).

## What's here

```
index.html                          structure — sections are generic, content is placeholder
assets/css/style.css                every colour is a token at the top — reskin by editing ~6 values
assets/js/content.js                ← THE FILE YOU EDIT PER CLIENT — offerings, gallery, hours, quotes
assets/js/site.js                   behaviour (nav, gallery, lightbox, form, reveals) — shouldn't need touching
assets/img/                         placeholder images — replace with real photos
.github/workflows/deploy-pages.yml  deploys to GitHub Pages on every push — shouldn't need touching
.nojekyll                           stops GitHub running the site through Jekyll — don't delete
```

Every `[Replace: ...]` in `index.html` and `content.js` is a marker for text
that needs writing for the actual client. Search the file for `[Replace`
before calling a site done.

## Starting a new client from this

Client sites deploy on **GitHub Pages, one repo per client.** Decided over
Vercel/Cloudflare because these sites hold nothing sensitive — opening
times, term dates, a contact form — so the one real cost of the free tier
(the repo has to be public) isn't a real cost here.

1. **Create an empty repo on GitHub** for the client and tell Claude the
   name. This is the one step that needs you — Claude can't create repos in
   this session. To keep it a 30-second, no-decisions step every time:
   - Name it something obvious (e.g. `riverside-hall`).
   - **Public** — required for free Pages hosting.
   - Do **not** initialize with a README, `.gitignore` or license — leave it
     genuinely empty, so the first push is clean. (New repos default to
     `main` as the branch name, which is what the workflow below expects.)
   - Everything after this — copying the template in, editing content,
     pushing, the custom domain — can be done from chat.
   - `.github/workflows/deploy-pages.yml` and `.nojekyll` are already in this
     folder and come along with the copy. The `.nojekyll` file matters more
     than it looks: without it, GitHub runs the site through Jekyll by
     default, which ignores any filename starting with `_` and processes
     `{{ }}` as template syntax — silent, confusing breakage for a site that
     was never meant to be built at all.
   - The **first** deploy to any new repo needs Pages switched on by hand,
     once: **Settings → Pages → Build and deployment → Source → GitHub
     Actions.** The workflow can't do this itself (same permissions gap as
     repo creation) — it'll fail once with a clear error until this is done,
     then work on every push after.
2. **Edit `content.js`.** Replace every placeholder array entry — offerings,
   gallery captions, opening times/rates/dates, quotes.
3. **Edit `index.html`.** Replace every `[Replace: ...]` marker — title, meta
   description, hero copy, about copy, contact details, footer tagline.
4. **Swap the photos** in `assets/img/` for real ones, keeping the same
   filenames referenced in `content.js`, or update the filenames to match.
   **Strip EXIF metadata first** — phone photos carry GPS coordinates and a
   capture date, which for a nursery or hall is often a home address or a
   safeguarding concern if children are in shot. See the note in
   `sites/elenas-cakes/assets/img/README.md` for the one-liner that does it.
5. **Reskin the colours**, if the default sage-green doesn't suit — edit the
   `:root` block at the top of `style.css`. Keep the two-value pattern
   (`--sage` for fills/rules, `--sage-ink` for text) and re-check contrast if
   you change the hue — a bright accent that reads fine as a hairline can fail
   as button text. `python3` + the WCAG contrast formula used elsewhere in
   this repo's commit history is the quick way to check.
6. **Set the custom domain.** Add a file named exactly `CNAME` (no extension)
   at the repo root, containing *only* the domain — one line, no `https://`,
   no trailing slash, no comments:
   ```
   www.riversidehall.org.uk
   ```
   GitHub Pages reads this literally, so anything else in the file breaks it.

   Point the domain's DNS at GitHub:
   - **`www` subdomain** (`www.riversidehall.org.uk`) — a `CNAME` record
     pointing to `<owner>.github.io` (e.g. `markh1984-spec.github.io`).
   - **Apex/root domain** (`riversidehall.org.uk`, no `www`) — four `A`
     records pointing to GitHub Pages' IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`. *Double-check these against GitHub's current Pages
     docs before using them on a real client's DNS* — they've been stable
     for years but a wrong IP takes a live site down, so it's worth the
     thirty seconds to confirm rather than trust a value from a chat log.

   Most registrars also let you set both and redirect apex → `www` (or vice
   versa) — either works, just be consistent with what's in the `CNAME` file.
   HTTPS is provisioned automatically once DNS resolves; this can take up to
   a few hours after the record is first added, and GitHub won't issue the
   certificate until it can see the DNS pointing correctly.
7. **Push.** The workflow deploys automatically. First push to a brand new
   repo needs the Pages toggle from step 1; every push after that just works.

## Real testimonials only

The `QUOTES` placeholders in `content.js` say `[Replace with a real quote...]`
for a reason — do not invent reviews or attribute quotes to people who didn't
say them once this is a live site for a real business. That was fine as
placeholder demo copy on the portfolio sites; it isn't fine attributed to a
real name on a real nursery's site. Leave the section out entirely if there
isn't a real quote yet, rather than making one up.

## Enquiry form

Validates in the browser and reports that it isn't connected, by default.
Set `ENDPOINT` near the bottom of `assets/js/site.js` to wire it to a real
backend — same pattern as the cake site, documented in the top-level README.
