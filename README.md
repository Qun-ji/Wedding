# Wedding Website Template

## Quick Start
1) Install dependencies
```bash
npm install
```

2) Run locally
```bash
npm run dev
```

3) Build for production
```bash
npm run build
```

## Optional: Firebase Guestbook
- Copy `.env.example` to `.env.local` and fill values.
- In `App.jsx`, switch from `BlessingStatic` to `BlessingGuestbook`.

## Optional: Generate a QR code
```bash
node scripts/make-qr.mjs https://your-deployed-domain.com
# Output -> public/qr.png
```

## Images
- Put a background image at `public/hero.jpg` (optional).
- Put album images in `public/photos/` and list them in `src/components/Gallery.jsx`.
