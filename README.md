# Brook of Cherith, website

A fast, static, single-page website for Brook of Cherith apartments in Abeokuta.
Plain HTML, CSS and JavaScript. No build step, no framework.

## Project structure

```
index.html
css/style.css
js/script.js
assets/images/     
assets/videos/     
assets/icons/      empty, reserved for future icon assets
```

## Configuration

All property details live in one place, at the top of `js/script.js`:

```js
const PROPERTY_CONFIG = {
    name: "Brook of Cherith",
    location: "OGD Estate, Olokuta, Abeokuta, Ogun State, Nigeria",
    whatsapp: "2349063627628",
    phone: "+2349063627628",
    email: "brookofcherith1@gmail.com"
};
```

Changing a phone number, WhatsApp number or email only requires editing this object.

## Setting up EmailJS (Send via Email button)

The email button is fully wired up on the front end but needs three real values
from an EmailJS account before it will actually send mail. No backend is required.

1. Create a free account at https://www.emailjs.com
2. Add an Email Service (e.g. Gmail) connected to `brookofcherith1@gmail.com`. This gives you a **Service ID**.
3. Create an Email Template with variables matching the ones sent from this site:
   `property_name`, `to_email`, `guest_name`, `guest_phone`, `apartment`, `checkin`,
   `checkout`, `guests`, `message`. Set the template's "To email" field to `{{to_email}}`
   (or hard-code `brookofcherith1@gmail.com` in the template). This gives you a **Template ID**.
4. Copy your **Public Key** from Account > General.
5. Open `js/script.js` and fill in the three values here:

```js
const EMAILJS_CONFIG = {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID"
};
```

Until these three values are filled in, the "Send via Email" button will show a
message asking the guest to use WhatsApp or call instead, it will not fail silently
and it will not pretend to send anything.

No private API keys or secrets are stored anywhere in this project. The EmailJS
public key is meant to be public and is safe to ship in client-side code.

## Adding real photography and video

Replace the files in `assets/images/` with real photographs, keeping the same
filenames (all `.jpeg`), or update the `src` attributes in `index.html` if you use
different names. Recommended size: roughly 1600px on the longest edge, compressed
to keep each photo under ~250KB so the site stays fast on mobile data.

Add a compressed `tour.mp4` to `assets/videos/` for the video tour section. If the
file is missing, the section automatically hides the video player and shows a
"coming soon" message instead of a broken player.

## Adding Airbnb / Booking.com links and a map

Once real listing URLs are available, add them as links in the "Also available on
Airbnb and Booking.com" section of `index.html`. Once an exact map location or
embed is available, add it to the Location section. Neither has been invented in
this build.

## Mobile bug fixes applied

- **Floating WhatsApp button**: rendered as a direct child of `<body>` (not nested
  inside any transformed or `overflow: hidden` container), using
  `position: fixed`, a high `z-index`, and
  `bottom: calc(1rem + env(safe-area-inset-bottom))` so it clears the iOS/Android
  home indicator. It is intentionally hidden while the mobile menu is open so it
  never overlaps the menu panel.
- **Mobile menu / "zoom out" bug**: the panel is capped at `min(85%, 320px)` and
  uses `inset` positioning instead of `100vw`/`100vh`, which is what caused layout
  to exceed the viewport width and create a large white area. Body scroll is
  locked with a `position: fixed` + stored `scrollY` technique instead of a bare
  `overflow: hidden`, which is what prevents the iOS "rubber band" scroll and
  layout shift that looked like zooming.
- All form inputs use `font-size: 16px` or larger, which prevents iOS Safari from
  auto-zooming the page when a field is focused.
- `overflow-x: hidden` on `html`/`body` is kept only as a safety net; the actual
  fix is that no element in the layout uses `100vw` or an unconstrained width.

## Deploying to Vercel

This is a static site, no build command is required.

1. Push this project to a Git repository.
2. In Vercel, "Add New Project" and import the repository.
3. Framework preset: **Other** (or "Static").
4. Build command: none. Output directory: root (`.`).
5. Deploy.

Alternatively, install the Vercel CLI and run `vercel` from this folder.
