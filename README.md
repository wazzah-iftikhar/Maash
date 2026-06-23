# Ma'aash — Talent Advisory & Human Capital Platform

A professional multi-page website for Ma'aash built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

---

## Project Structure

```
maaash/
├── components/
│   ├── Layout.tsx          # Wraps all pages with Navbar + Footer
│   ├── Navbar.tsx          # Fixed responsive navigation
│   ├── Footer.tsx          # Site footer
│   ├── JobCard.tsx         # Job listing card
│   ├── JobModal.tsx        # Job detail modal
│   ├── CVModal.tsx         # Free CV submission modal
│   └── FormSuccess.tsx     # Shared success message
├── data/
│   └── jobs.ts             # Job listings data (edit this to add/remove roles)
├── lib/
│   └── mailer.ts           # Nodemailer email utility
├── pages/
│   ├── _app.tsx            # App wrapper
│   ├── _document.tsx       # HTML head (fonts, meta)
│   ├── index.tsx           # Home page
│   ├── jobs.tsx            # Career Opportunities page
│   ├── assessment.tsx      # Assessment page
│   └── api/
│       ├── hire-inquiry.ts         # POST — hiring form → email
│       ├── cv-submit.ts            # POST — CV submission → email
│       ├── assessment-individual.ts # POST — individual assessment → email
│       └── assessment-corporate.ts  # POST — corporate inquiry → email
├── styles/
│   └── globals.css         # Global styles + Tailwind layers
├── .env.example            # Environment variable template
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## Quick Start (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your email credentials
```

### 3. Run dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Updating Job Listings

Edit `data/jobs.ts` — add, remove, or modify the `JOBS` array. No backend or database needed; changes go live on next build.

---

## Email Setup (Form Submissions)

All form submissions are emailed to you via SMTP. Set these in `.env.local`:

| Variable | Description |
|---|---|
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | Usually `587` |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASS` | App password (Gmail) or SMTP password |
| `EMAIL_TO`   | Where to deliver submissions |

**Gmail tip:** Enable 2FA → generate an App Password → use that as `EMAIL_PASS`.

---

## Deployment (Vercel — Recommended)

1. Push code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy — Vercel handles builds, SSL, and CDN automatically

**Custom domain:** Vercel Settings → Domains → Add `maaash.com`

---

## WhatsApp Integration

In `pages/assessment.tsx`, update these two constants at the top of the file:

```ts
const WA_NUMBER = '+92-XXX-XXX-XXXX'         // Display number
const WA_LINK   = 'https://wa.me/92XXXXXXXXXX' // Replace with real digits
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Email | Nodemailer (SMTP) |
| Hosting | Vercel (recommended) |
| Domain | Any registrar (Namecheap recommended) |

---

## Future Enhancements (Phase 2)

- **CMS** — Integrate Sanity.io or Contentful to manage jobs without code
- **WhatsApp API** — Twilio / Meta Business API for automated responses  
- **Candidate portal** — Authentication via Clerk.dev for saved profiles
- **Analytics** — Vercel Analytics or PostHog for visitor insights
- **Blog** — MDX-based articles on talent and performance topics
