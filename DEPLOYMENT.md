# RepairTrust — Production Deployment & Launch Guide

> **Find. Compare. Repair. Trust.**  
> India's premier verified doorstep appliance & electronics repair marketplace.

---

## 📋 Pre-Deployment Verification Status

All 36 routes and dynamic endpoints have been verified and built cleanly:
- `npx tsc --noEmit` ➔ **0 errors (100% type safe)**
- `npm run build` ➔ **Success (36 production routes compiled)**
- Local Dev Server ➔ **Active & Healthy**

---

## 🚀 Option A: Deploy to Vercel (Recommended — 3 Minutes)

Vercel provides native Next.js App Router support with global CDN caching, automatic SSL certificates, and zero-configuration serverless functions.

### Step 1: Push Repository to GitHub

If you haven't pushed to GitHub yet:
1. Create a new repository on [GitHub](https://github.com/new) named `repairtrust`.
2. In your terminal, run:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/repairtrust.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **"Import"** next to your `repairtrust` repository.
3. Keep default settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build --webpack` (or default `npm run build`)
   - **Output Directory**: `.next`

### Step 3: Configure Environment Variables

Under **Environment Variables**, add the following 3 variables:

| Variable Name | Description | Example / Location |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From your `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anonymous public key | From your `.env.local` |
| `NEXT_PUBLIC_APP_URL` | Your live deployment URL | `https://your-project.vercel.app` or `https://repairtrust.in` |

### Step 4: Click "Deploy"

Vercel will build and deploy the app in under 2 minutes. You will receive a live URL:
`https://repairtrust.vercel.app`

---

## 🔑 Step 5: Update Supabase Auth Redirect URLs

To ensure customer & technician email confirmation and magic links work on your live domain:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** ➔ **URL Configuration**.
3. Set **Site URL** to:
   ```text
   https://repairtrust.vercel.app
   ```
4. Under **Redirect URLs**, add:
   ```text
   https://repairtrust.vercel.app/**
   http://localhost:3000/**
   ```
5. Click **Save Changes**.

---

## 🌐 Step 6: Connect Custom Domain (e.g. `repairtrust.in`)

1. In Vercel, go to **Project Settings** ➔ **Domains**.
2. Enter your domain: `repairtrust.in` (and `www.repairtrust.in`).
3. Add the DNS records shown by Vercel in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   - **Type `A`**: `@` ➔ `76.76.21.21`
   - **Type `CNAME`**: `www` ➔ `cname.vercel-dns.com`
4. SSL certificates (HTTPS) will automatically be issued within 10 minutes.

---

## 🧪 Post-Launch Smoke Test Checklist

Once live on your production URL:
1. **Homepage**: Test location switcher (Bengaluru areas) and search.
2. **Customer Booking**: Submit a test repair request on `/services/ac-repair`.
3. **Quotation**: Check that instant quotes appear in `/dashboard`.
4. **Doorstep Tracking**: Progress through the 5-step stepper.
5. **Payment & Tax Invoice**: Verify doorstep UPI QR scan and printable GST tax invoice.
6. **Warranty Claim**: Open the "Digital Warranties" tab and verify the 60-day guarantee badge.
7. **Admin Console**: Navigate to `/admin` to verify real-time GMV, technician KYC, and bookings ledger.
8. **SEO & Crawlers**: Verify that `https://your-domain.com/sitemap.xml` and `robots.txt` load cleanly.

---

*RepairTrust — Find. Compare. Repair. Trust.*
