# NEXT — Magazine Mews (magazine-mews/ on this branch)

## Waiting on Mark
- **Room sizes still to come from Mom** (since 31 Oct 2026): entrance
  hallway, second bedroom and WC. They go in ROOMS (and under the matching
  photos) in magazine-mews/api/inside.js.
- **Key facts say "Bathrooms: 2"** (since 31 Oct 2026): the text now says
  there's no family bathroom, just the en suite and a guest WC. Check
  whether that figure should change.
- **Check the two test emails reached Mom** (since 11 Oct 2026): "Confirmed:
  Mark (test) has seen inside Magazine Mews" and "Viewing enquiry from Mark
  (test)". Resend shows both delivered to viewings@; this confirms the
  forwarding on to her inbox. If they're in spam, mark them "not spam".
- **Facebook Page rename to "Magazine Mews"** (since 11 Oct 2026): needs
  Mark's password, then Request Change.
- **Instagram account** (since 11 Oct 2026): create it, then the next session
  fills in the profile and stages the posts.
- **Facebook posts** (since 11 Oct 2026): ready. Each one is staged and Mark
  presses Post.
- **Remaining house facts** (since 2 Oct 2026): estate/service charge,
  broadband, reception rooms. Each appears on the site once filled in.

## Waiting on someone else
- **Hendricks**: the drone shots without their logo, plus the drone video
  (asked for 11 Oct 2026). The front aerial then becomes the top photo.
- Walkthrough video link and floorplan, if they're coming from the shoot.

## Next up
1. Swap the top photo for the clean drone shot when Hendricks sends it (with
   its -800/-1200 WebP copies, then rebuild).
2. Instagram profile and posts; ads in the Housing category; Meta pixel.
3. Search Console for www.magazinemews.co.uk; Facebook Page website field.
4. Tidy-up: Vercel suggests saving RESEND_API_KEY as a "Secret" type
   (re-run Resend's Vercel integration to make a fresh key, then delete
   the old "Vercel Integration" key in Resend).

## Done 2 Nov 2026
- Contacts page for Mom: magazinemews.co.uk/admin?k=… (the link was given
  to Mark in chat; it isn't written down here). It lists everyone who asked
  for the photos, opened them or sent an enquiry, grouped by email, newest
  first, with tap-to-call/email, a status and notes she can save, search,
  and a spreadsheet download. The device remembers the link after the
  first visit. To change the link, make a new key and update
  ADMIN_KEY_SHA256 in magazine-mews/api/_inside.js.
- The contacts page also asks for a password (given to Mark in chat; not
  written here), once per browser session. Its fingerprint is mixed with
  the link key: ADMIN_PW_SHA256 in api/_inside.js. Page parts are named
  "cx-", not "ad-", because ad blockers hide "ad-…".
- Every sign-up, first photo open and enquiry is now also saved in the
  private Blob store (leads/ folder, one small file each). Status and notes
  changes are saved the same way. api/admin.js reads them.
- Contacts from 21 Oct to 2 Nov brought in from Resend's email log (that's
  as far back as the log goes; anything earlier is only in the family inbox).

## Done 31 Oct 2026
- Photos 2, 3, 4, 5 and 9 (living room x2, kitchen, bedroom, guest
  bedroom) softened a lot, at Mom's request: colour cut, brightness and
  detail untouched. New files are in the private store and Mark's "Magazine
  Mews private photos" folder; the old ones are in its "before softening
  31 Oct" subfolder. Uploaded through the Vercel dashboard's Blob page
  (Upload, inside/ folder), using the file staged from the Mac.
- Inside page: laundry room photo and the mews photo taken out (20 photos
  now), the laundry shower photo captioned "Laundry", room sizes under the
  matching photos, and a "Room sizes" list (metric and feet) under the grid.
- "Seating area" photo re-captioned "South facing rear garden" (Mom, 31 Oct).
  She's happy with the softened colours.
- Text: "a second bedroom and separate guest WC" (no family bathroom),
  laundry room out of the plot list, new paragraph about the 2010 build,
  and two paragraphs about the community in "Living on the Garrison".
- Family shortcut into the inside photos: magazinemews.co.uk/inside?k=…
  opens all the inside photos with no sign-up and sends no email. The link was
  given to Mark in chat; it isn't written down here. To change it, make a
  new key and update FAMILY_KEY_SHA256 in magazine-mews/api/_inside.js.
- The family's number, 07984 111375, "call or text": under "Viewings and
  enquiries", on the inside photos page, and in the buyer's link email.

## Done 22 Oct 2026
- The top photo loads first: it's now in the page itself (it used to wait
  for the scripts), with 92KB and 203KB WebP copies for phones and
  desktops instead of the 631KB original. Tested on a slow-phone setting:
  loading 6.6s → 2.2–2.8s, page weight 878KB → 339KB. Done in the shared
  template, so every future house gets it.
- When the drone shot replaces it, make its -800 and -1200 WebP copies and
  rebuild (README, "Adding photos").

## Done 11 Oct 2026
- "See inside" is live: a buyer leaves name, email and phone (phone is a
  must, checked on the page and by the server), gets a 30-day link,
  and sees all 22 inside photos from the private store. The first time a
  link is opened, viewings@ gets their details. Tested end to end.
- The enquiry form sends to viewings@ through the site's own function.
  Phone is required there too (page and server).
- Sending: Resend (Mark's account, Pro), magazinemews.co.uk verified
  (Ireland). DNS at Namecheap: DKIM TXT, rsend and send CNAMEs, DMARC
  p=none. The key reaches Vercel through Resend's Vercel integration,
  limited to the 1magazinemews project.
- magazinemews.co.uk bought (Namecheap, renews 11 Oct 2027). The site is live
  on www.magazinemews.co.uk (the bare domain redirects there).
  viewings@magazinemews.co.uk forwards to the family inbox.

## Updated
2 Nov 2026 — contacts page (CRM) for Mom, with past contacts brought in.
(If Vercel doesn't pick up a push within a few minutes, use Deployments →
… → Create Deployment on the branch.)
