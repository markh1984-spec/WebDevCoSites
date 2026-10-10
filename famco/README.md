# FamCo Properties: house websites

Every FamCo house gets its own website. They all come from one template, so
a design fix or improvement happens once and every house gets it.

```
famco/
├── template/            ← the shared website: page, styles, behaviour
│   └── content.example.js  ← the blank content file each new house starts from
├── agency.js            ← FamCo's details, shared by every house (name, contact, legal)
├── houses.json          ← the list of house folders to build
├── build.mjs            ← turns template + each house's content.js into that house's site
└── new-house.mjs        ← starts a new house folder

magazine-mews/           ← house #1 (live at https://1magazinemews.vercel.app)
houses/<name>/           ← every house after that
```

**What belongs to a house** (edit freely): `content.js`, `photos/`,
`og-image.jpg` (optional share picture), its README, and optionally
`house.css` for styles only that house has (Magazine Mews keeps its
wallpaper there, with the drawings in `walls/`).

**What's generated** (don't edit in the house folder; it gets overwritten):
`index.html`, `site.js`, `style.css`, `favicon.svg`, `agency.js`,
`vercel.json`, `api/`. Change the file in `famco/` instead, then rebuild.

Needs Node 18 or later. No packages to install.

## Starting a new house

```sh
node famco/new-house.mjs houses/12-acacia-avenue "12 Acacia Avenue"
```

1. Fill in `houses/12-acacia-avenue/content.js`. Start with the address,
   `site.url` and `seo.summary`. The rest can come once Rory has shot it.
   Anything left empty is hidden, so the site can go live early.
2. Put resized photos in its `photos/` folder (about 2000px on the long
   side, under 1MB) and list them in `content.js`.
3. `node famco/build.mjs houses/12-acacia-avenue`
4. Commit and push. In Vercel, add a new project from this repo with
   **Root Directory** set to the house folder and the framework preset set to
   "Other". Every push then updates it automatically.
5. Set up Google Search Console for the new address (see the Magazine Mews
   README, section 4).

## Giving a house its own look

The `theme` block in a house's `content.js` changes its colours, and
optionally its fonts and the brick edging. `{}` keeps the standard green,
brass and brick. The options are listed in `template/content.example.js`.
The crest (shown until there's a hero photo) is worked out from the
address unless `crest` says otherwise.

## Changing every house at once

Edit `template/` or `agency.js`, then:

```sh
node famco/build.mjs        # rebuilds every house in houses.json
```

Commit everything it changed. Each house's Vercel project redeploys on push.

## Before FamCo branding goes live

`agency.js` has `live: false`. While it's false, every house shows as a
private sale by the owner and no FamCo details appear. Switch it to `true`
and rebuild once:

- [ ] FamCo Properties is registered with **HMRC for anti-money-laundering
      supervision**. Trading as an estate agency before this is a criminal offence.
- [ ] FamCo has joined a **property redress scheme** (The Property Ombudsman
      or the Property Redress Scheme). Put the membership line in `redress`.
- [ ] The **company details** are filled in (`company`). UK company websites
      must show the registered name, number and office.
- [ ] FamCo's **enquiry form** (`enquiries.formspreeId`) is set up, so enquiries
      for every house reach FamCo.
- [ ] Each live house's **share picture** (`og-image.jpg`) is regenerated, so it
      doesn't still say "for sale privately".

When it flips, every house's wording changes together:
- the top of the page reads "For sale with FamCo Properties"
- the enquiry section carries FamCo's blurb and contact details
- the footer gets the FamCo small print, redress membership and company details
- Google's listing data names FamCo as the agent
