# NEXT — Magazine Mews (magazine-mews/ on this branch)

## Waiting on Mark
- **Check the two test emails reached Mum** (since 11 Oct 2026): "Confirmed:
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
1. Swap the top photo for the clean drone shot when Hendricks sends it.
2. Instagram profile and posts; ads in the Housing category; Meta pixel.
3. Search Console for www.magazinemews.co.uk; Facebook Page website field.
4. Tidy-up: Vercel suggests saving RESEND_API_KEY as a "Secret" type
   (re-run Resend's Vercel integration to make a fresh key, then delete
   the old "Vercel Integration" key in Resend).

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
11 Oct 2026 — email sending switched on; "See inside" and the enquiry form
are live and tested. Walking times now sit on their own line under each
nearby photo, lined up across the row. Phone number is now required on
both forms (See inside and Arrange a viewing). (Vercel is slow to pick up pushes
right now; if a push doesn't show within a few minutes, use Deployments →
… → Create Deployment on the branch.)
