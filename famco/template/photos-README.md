# Photos go here

1. Resize first. Around **2000px on the longest side** and **under 1MB** each.
   Phone photos straight off the camera are 4–8MB and make the site slow on
   mobile data. (On a Mac: open in Preview → Tools → Adjust Size. On Windows:
   Photos app → … → Resize. Or drag them into squoosh.app.)
2. Use simple lowercase names with no spaces, e.g. `01-front.jpg`, `02-living-room.jpg`.
3. Add each one to the `photos:` list in `../content.js`, in the order you
   want them shown. The first one is the big one in the grid.

`heroPhoto` in content.js is the big photo at the top of the page. It can be
one of these photos too.
The arched frame crops the sides of a landscape photo; if it cuts off the
bit you want, set `heroFocus` (e.g. `"70% 50%"` shifts it right).
