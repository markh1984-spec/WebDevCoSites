# NEXT — Magazine Mews (magazine-mews/ on this branch)

## Waiting on Mark
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

## Done 31 Oct 2026
- Family shortcut into the inside photos: magazinemews.co.uk/inside?k=…
  opens all 22 photos with no sign-up and sends no email. The link was
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
31 Oct 2026 — family shortcut into the inside photos, and the family's
number added to the site and the buyer email. (If Vercel doesn't pick up
a push within a few minutes, use Deployments → … → Create Deployment on
the branch.)
