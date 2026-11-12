# RideMate — Peer-to-Peer Bike Rental UI

A responsive React + Vite frontend prototype for a South India peer-to-peer bike rental platform.

## Features in this prototype

- Premium dark UI with electric-lime accents
- Responsive desktop, tablet and mobile layouts
- Home, Explore, Bike Details, Bookings, List Bike and Profile screens
- City selection for Bengaluru, Mysuru, Mangaluru, Chennai, Hyderabad, Kochi, Coimbatore and Vijayawada
- Bike category filters and sample listings
- Rental duration and estimated cost calculation
- Demo booking request flow
- Demo bike-listing form
- English, Kannada, Tamil, Telugu and Malayalam language choices in profile

## Important prototype limitations

This repository contains the **frontend prototype only**. Bike listings are sample data stored in the frontend code. Booking requests are held in React state and disappear when the page is refreshed.

The following are **not connected**:
- Real user accounts, OTP login or KYC
- Aadhaar / driving licence verification
- Backend database or owner dashboard
- Live maps, GPS or location-based inventory
- UPI, Razorpay, cards, deposits or refunds
- SMS, push notifications, chat or emergency services
- Legal, insurance or vehicle document verification

Do not use this prototype to accept real rentals or payments. Before launch, obtain legal and insurance advice for the intended peer-to-peer rental model and implement secure verification, privacy, safety and dispute processes.

## Run locally

Install Node.js (LTS), then:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

Create a production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a new GitHub repository named `ridemate`.
2. Upload all files and folders from this project to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Add the workflow below at `.github/workflows/deploy.yml` (create the folders if needed).
6. Push to the `main` branch. GitHub Actions will build and publish the site.

### GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy RideMate to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

After deployment, the site will be available at:

`https://YOUR-GITHUB-USERNAME.github.io/ridemate/`

## Suggested next development phase

For a real Android app, use Flutter or React Native and build a secured API/backend. A practical architecture could use:
- Android client: Flutter
- API: Node.js + Express
- Database: PostgreSQL or MongoDB
- Authentication: Firebase Phone Auth or another compliant provider
- Maps: Google Maps Platform
- Payments: Razorpay (subject to merchant onboarding and compliance)
- Notifications: Firebase Cloud Messaging
- File storage: Firebase Storage or S3

Keep secrets and payment keys on the server; never commit API secrets to GitHub.
