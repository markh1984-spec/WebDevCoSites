# FamCo Search

A buyer tells an AI matchmaker what they want in plain English. It keeps a
structured brief, and FamCo's database is matched against it. They see
the best match free and pay a small fee to unlock every match plus alerts.
FamCo takes no commission from agents.

## Prototype

`prototype/index.html` is published as a private claude.ai page:
https://claude.ai/artifact/Wpvf9E8EUdX1eznAVPo6KG

- **Chat:** each message goes to Claude (on the viewer's own Claude account)
  with the current brief. Claude replies and returns the updated brief as JSON.
- **Brief:** a list of criteria, each with a weight. Weights are Must
  (deal-breaker), Important, Helpful or Bonus. Criterion types: `min_beds`,
  `min_baths`, `min_sqft`, `max_station_walk`, `area`, `avoid_area`,
  `property_type`, `line`, `feature`, `avoid_feature`, `min_epc`, plus
  `budgetMax`. The page throws away anything Claude returns outside that list.
- **Matching:** runs in the page, with no AI involved, so it's instant and
  repeatable. Any missed Must, or a price more than 5% over budget, rules a
  home out. The rest are scored by weight (a near miss counts half) and
  ranked. The "why it fits" list on each card comes from the same scoring.
- **Refining:** "Love it" and "Not for me (reason)" send a message to the
  matchmaker, which adjusts the weights. The buyer can also change a weight
  or remove a criterion directly in the brief.
- **Paywall:** shows the best match, a teaser of the next three (type, beds,
  fit and price band, but not the area), then "Unlock all N matches · £9.99
  for 3 months". In the prototype the button just unlocks; nothing is charged.
- **Homes:** 41 made-up sample homes around Southend-on-Sea. The stations
  and train lines are real.

## Production plan

| Part | Choice | Cost to start |
|---|---|---|
| Database / CRM | Supabase (hosted Postgres; table editor for managing listings, buyer accounts, location search) | Free tier, then $25/month |
| Website and API | Vercel, like the house sites | Free tier to start |
| Matchmaker | Claude API, server-side, so buyers don't need a Claude account | Pay per conversation |
| Payments | Stripe Checkout (one-off £9.99 per 3 months) | Per-transaction fee only |
| Alerts | A daily job that re-runs saved briefs against new listings and emails new matches | Within the above |

The brief format and the matching rules carry over as they are. The
matching moves into a database query, so it works across thousands of homes.
