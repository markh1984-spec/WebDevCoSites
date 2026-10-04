# 1 Magazine Mews: house sale site

A single-page site for selling 1 Magazine Mews, Shoebury Garrison,
Shoeburyness SS3 9QB, privately. It's plain HTML, CSS and JS: no build step,
no framework, nothing to install.

```
magazine-mews/
├── content.js     ← ALL the words, prices, photos list. Edit this.
├── photos/        ← put photos (and floorplan) here
├── index.html     ← page structure (no need to touch)
├── site.js        ← behaviour (no need to touch)
├── style.css      ← look and feel (no need to touch)
├── og-image.jpg   ← picture shown when the link is shared on WhatsApp/Facebook
├── favicon.svg
└── vercel.json
```

**Anything left empty in `content.js` is hidden on the site.** So it's safe
to go live before all the content is in. Nothing half-finished or made-up
ever shows. Right now the site shows the address, the Garrison/area section
and the enquiry form. The rest appears as it's filled in.

---

## For Rory: adding the content

Everything is in **`content.js`**. Each field has a comment explaining it.

### Editing on GitHub (no software needed)

1. On github.com, open the repo → `magazine-mews` → `content.js`.
2. Click the **pencil** icon (Edit).
3. Fill in the `""` gaps. Keep the quotes and the commas at the end of lines.
4. Click **Commit changes**. Vercel redeploys automatically in under a
   minute.

If the page shows a red bar saying **"content.js has a typo"**, a quote or
comma has gone missing in the last edit. Undo it or check that line.

### Adding photos

1. **Resize first.** Aim for about 2000px on the long side and under 1MB
   each. Full-size phone photos make the site crawl on mobile.
   [squoosh.app](https://squoosh.app) does it in the browser.
2. In `magazine-mews/photos` on GitHub: **Add file → Upload files**.
   Use names like `01-front.jpg`, `02-kitchen.jpg` (lowercase, no spaces).
3. List them in the `photos:` section of `content.js`, in display order.
   Set `heroPhoto` to the best exterior shot.

A photo with a mistyped filename is just skipped (it won't show as broken),
so if one's missing, check the spelling matches exactly.

### Checklist of what buyers look for

- [ ] Headline + price
- [ ] Key facts: type, bedrooms, bathrooms, parking, garden
- [ ] Description (3–4 short paragraphs) and 4–6 highlights
- [ ] Photos: front, living room, kitchen, each bedroom, bathroom, garden, the Garrison/beach nearby
- [ ] Walkthrough video (optional): unlisted YouTube link in `video`
- [ ] Floorplan (image and/or PDF)
- [ ] Good to know: tenure, council tax band, EPC rating, any estate charge, heating, broadband, chain
- [ ] Check the DRAFT area text and fill in walking distances
- [ ] Open-house dates, if doing any

When it sells, change `status` to `"Under offer"` or
`"Sold subject to contract"`. A banner appears automatically.

---

## Setup (one-off)

### 1. Host on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the
   `WebDevCoSites` GitHub repo. You may need to give Vercel access to it.
2. **Root Directory → `magazine-mews`** (important: the repo has other
   sites in it).
3. Framework Preset: **Other**. Leave the build and output settings empty.
4. Pick a project name. It becomes the address, e.g.
   `1-magazine-mews.vercel.app`.
5. Deploy.

**Done 4 Oct 2026:** live at <https://1magazinemews.vercel.app> (Vercel
project `1magazinemews`, root `magazine-mews`, production branch
`claude/fervent-knuth-kux8rt` — a push there goes live), and the share
picture below already points at it.

Vercel publishes the repo's **production branch** (normally `main`). Every
other branch gets its own preview link, which is handy for checking changes
before they go live. If the site lives on a different branch, set it under
Project → Settings → Git → Production Branch.

A custom domain (e.g. `1magazinemews.co.uk`, about £10/yr) can be added
later under Project → Settings → Domains.

### 2. Turn on the enquiry form (5 minutes)

Until this is done the form shows "opens very soon" and can't be sent.

1. Sign up free at [formspree.io](https://formspree.io), using the email
   address enquiries should go to.
2. **New form**, then copy its ID: the code after `/f/` in the endpoint,
   e.g. `https://formspree.io/f/xyzabcde` → `xyzabcde`.
3. Paste it into `content.js` → `enquiries.formspreeId`.
4. Send yourself a test enquiry. Formspree asks you to confirm the first one.

The free plan covers 50 enquiries a month. It has a built-in spam trap,
and nobody's email address or phone number appears on the site.

### 3. Fix the share picture once the address is final

In `index.html`, change `<meta property="og:image" content="og-image.jpg">`
to the full URL, e.g. `https://1-magazine-mews.vercel.app/og-image.jpg`.
Facebook ignores relative paths. You can swap `og-image.jpg` for a real
photo of the house (1200 × 630px) once there is one.

### 4. Get it on Google (10 minutes, once it's live on Vercel)

The site is already set up for search engines. It has a sitemap at
`/sitemap.xml`, a `/robots.txt` that lets everyone in, and listing details
(address, price, bedrooms, photos) in the format Google reads. Both files
use whatever domain the site is on, so they don't need changing if a custom
domain is added later. The steps below just tell Google it exists.

1. Go to [Google Search Console](https://search.google.com/search-console)
   → **Add property** → **URL prefix** → paste the site's address.
2. Choose **HTML tag**, copy the `<meta name="google-site-verification" …>`
   line, and paste it into `index.html` where the comment says to. Commit,
   wait for Vercel to redeploy, then press **Verify**.
3. **Sitemaps** → enter `sitemap.xml` → Submit.
4. **URL inspection** → paste the homepage address → **Request indexing**.

Google usually picks it up within a few days. Links to the site from
Facebook posts, the Instagram bio and so on help it get found sooner.
Optional: [Bing Webmaster Tools](https://www.bing.com/webmasters) can
import everything from Search Console in one click, which covers Bing,
DuckDuckGo and Yahoo.

---

## Notes

- **Public from day one** (no `noindex`). Search engines can list it.
- The enquiry form asks "How did you hear about it?", so enquiries show
  which channel (Rightmove, Facebook, Instagram…) is working.
- The map is click-to-load, so Google isn't contacted (and sets no
  cookies) unless a visitor asks for the map.
- The footer carries a standard "details are a guide, not part of any
  contract" disclaimer for a private sale.
- Area facts were drafted from Southend Council's Shoebury Garrison
  conservation-area page, Historic England's listings for the powder
  magazines, and the c2c timetable. They're marked DRAFT in `content.js`
  for checking.
- The repo's GitHub Pages workflow publishes the whole repo when `main`
  changes, so this site will also appear at `…github.io/WebDevCoSites/magazine-mews/`.
  Vercel is the one to share.
