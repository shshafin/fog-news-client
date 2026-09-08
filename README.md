# Fog News — Client

Next.js frontend for a multimedia news platform: category browsing, e-paper viewing, multimedia sections, share-market surfaces, and job circular flows — wired to the Fog News API.

| | |
| --- | --- |
| **Live demo** | [fog-news-client.vercel.app](https://fog-news-client.vercel.app) |
| **API repo** | [fog-news-server](https://github.com/shshafin/fog-news-server) |
| **Portfolio** | [shafinsadnan.com](https://shafinsadnan.com) |

---

## What this repo is

The public-facing client for Fog News. It focuses on readable content layouts, sectioned news surfaces, and admin/editor entry points that consume the backend API — not a marketing site with unverified traffic claims.

## Surfaces in the app

- News categories and article browsing (politics, sports, technology, lifestyle, and related sections)
- E-paper viewing
- Multimedia / video-oriented pages
- Share-market related UI
- Job circular browsing and application flows (API-backed)
- Auth-related pages (login, password reset)
- Role-oriented areas for editor / reporter / admin workflows

## Tech stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** + Radix/shadcn-style UI primitives
- React Hook Form for form flows

## Run locally

```bash
git clone https://github.com/shshafin/fog-news-client.git
cd fog-news-client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Point the client at a running [fog-news-server](https://github.com/shshafin/fog-news-server) instance via your local env configuration. Keep secrets out of git.

```bash
npm run build
npm start
```

## Related

- Backend API: https://github.com/shshafin/fog-news-server
- More work: https://shafinsadnan.com
