# Astoria Palawan Resort Study

An educational tourism website inspired by **Astoria Palawan**, a resort in Puerto Princesa, Palawan, Philippines (official site: <https://astoriapalawan.com/>).

> **Disclaimer:** This is a student project. It is **not** the official website and is not affiliated with Astoria Palawan. The layout, code and wording are original; facts were taken from the resort's public website. Photos are generic stock images from Unsplash, not the resort's photography.

Built with only HTML, CSS and vanilla JavaScript. No frameworks, no build step, no backend.

## Files

```
index.html          Single-page site (Home, About, Rooms & Amenities, Restaurant, Packages, Reservations, Contact)
css/style.css       All styles (responsive, reduced-motion aware)
js/script.js        Nav, tabs, booking buttons, form validation, review step, demo reference number
assets/images/      Local fallback image + favicon
```

## What is real and what is demo

| Content | Status |
|---|---|
| Address, phone, email, office hours, social links | Copied from astoriapalawan.com (checked when built). Confirm before relying on them. |
| Room names and bed counts, amenities and hours, outlet names, airport transfer fees | From the official Home, About and Amenities pages. Fees and schedules change, so confirm with the resort. |
| Room prices, package prices, package contents, sample dishes | **Illustrative**, marked "Demo" on the page. The official site publishes no room rates, menus or prices here. |
| Guest testimonials | Deliberately not invented. The page links to the official reviews and promos. |
| Reservation and contact forms | **Demo only.** Nothing is sent, saved or confirmed. The `DEMO-...` reference number is generated in the browser. |

## Run locally

Double-click `index.html`. It works from the file system. (The map and photos need an internet connection.)

Optional local server: `python -m http.server 8000`, then open <http://localhost:8000>.

## Publish (pick one)

### GitHub Pages
1. Create a GitHub repository and upload everything in this folder (keep `index.html` at the root).
2. Open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
3. After about a minute your URL appears at the top of that page: `https://<username>.github.io/<repository>/`.

### Netlify (fastest)
1. Go to <https://app.netlify.com/drop>.
2. Drag this whole folder onto the page.
3. Netlify gives you a URL like `https://random-name.netlify.app`. You can rename it in **Site configuration**.

### Cloudflare Pages
Create a project, choose **Direct Upload**, upload the folder, and copy the `*.pages.dev` URL.

## Generate a QR code for the live homepage

1. Copy your published URL (for example `https://<username>.github.io/<repository>/`).
2. Open a free generator such as <https://www.qr-code-generator.com/> or <https://qrcode.tec-it.com/>, choose **URL**, and paste the link.
3. Download the PNG or SVG and add it to your cover sheet or presentation.
4. Scan it with a phone to confirm it opens the live site. Test again after any rename.

(Chrome also has a built-in option: click the address bar's share icon > **Create QR Code**.)

## Business concept summary (for the cover sheet)

This project is a tourism website case study of Astoria Palawan, a family-centric, eco-minded resort on the Sulu Sea shore in Puerto Princesa, Palawan, set among forest, grassland and mountains about 90 minutes from the airport. The site follows the structure of a real resort website, including a hero banner, accommodations, amenities, dining, packages, reservation inquiry and contact information, but is rebuilt as an original design with HTML, CSS and vanilla JavaScript. It serves couples, families, groups and events clients, who can compare rooms, explore amenities and nearby attractions, and start a demonstration booking inquiry with validation and review. All forms are static demonstrations and do not make real reservations; prices marked "Demo" are illustrative. Official rates and bookings are available only through the resort.
