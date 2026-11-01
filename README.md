# SkyDentalClinic

Website and admin dashboard for SkyDentalClinic, built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, MongoDB and Cloudinary.

## How the content works

Every clinic fact lives in the database and is entered through the admin dashboard. Nothing factual is hardcoded, so the site cannot show an invented credential, review or phone number.

- **Blank fields stay hidden.** Sections such as Doctors, Testimonials, Facilities and opening hours do not appear until they have content.
- **Treatments start as drafts.** The seed script adds nine common treatments, unpublished, with general wording. Publish only the services the clinic offers. Publishing needs an image and an overview.
- **Consent is enforced.** Testimonials and before-and-after cases cannot be published until consent is confirmed.
- **Starter copy needs approval.** The hero, introduction, mission, vision, "why choose us" and FAQ wording is brand-voice starter text in [src/lib/defaults.ts](src/lib/defaults.ts). The clinic should review it in **Website content**.

## Local setup

You need Node.js 20.9 or newer, a MongoDB Atlas database and a Cloudinary account.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run seed                 # creates the first admin, settings and draft treatments
npm run dev
```

Open <http://localhost:3000> for the site and <http://localhost:3000/admin> for the dashboard. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then remove those two values from `.env.local`. They are only read by the seed script.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL, used for canonical links, the sitemap and Open Graph |
| `MONGODB_URI` | Yes | MongoDB connection string, including the database name |
| `AUTH_SECRET` | Yes | Signs admin sessions. At least 32 characters; the command to generate one is in `.env.example` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For uploads | Server only |
| `CLOUDINARY_API_SECRET` | For uploads | Server only |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seed only | First admin account |

### Previewing the design with demo data

To see every section before real content exists, point `MONGODB_URI` at a separate database whose name contains `demo`, `dev` or `test`, then run:

```bash
npm run seed:demo        # fictional records and stock photographs
npm run seed:demo:clear  # removes them
```

The script refuses to run against any other database name. Before launch, delete [public/demo](public/demo).

## Deploying to Vercel

1. **MongoDB Atlas:** create a cluster, a database user and a database named `skydentalclinic`. Under **Network Access**, allow Vercel to connect. Vercel's IP addresses change on most plans, so this usually means allowing `0.0.0.0/0` with a strong database password.
2. **Seed the database:** put the production `MONGODB_URI` and admin values in `.env.local` on your machine, run `npm run seed`, then remove them.
3. **Vercel:** import the repository and add the environment variables above, except the `ADMIN_*` values. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
4. **Deploy,** then add your domain. If you change `NEXT_PUBLIC_SITE_URL` or the Cloudinary cloud name later, redeploy, because those values are built into the site.
5. **Enter the clinic's details** in the dashboard using the checklist below.

Public pages are cached and refresh every 5 minutes. Saving in the dashboard refreshes them immediately.

## Launch checklist

- [ ] **Clinic settings:** address, phone, WhatsApp, email, hours, map links, clinic description
- [ ] **Website content:** approve the starter copy, add photographs, add verified trust indicators
- [ ] **Treatments:** review the wording with a dentist, add images, publish confirmed services
- [ ] **Doctors:** verified qualifications and experience, photographs
- [ ] **Gallery and Testimonials:** authentic images and consented testimonials only
- [ ] **Privacy:** add a privacy policy suitable for your jurisdiction, since the forms collect patient details
- [ ] Delete `public/demo` and confirm no demo records remain

## Project structure

```
src/
  app/(site)/        Public pages
  app/admin/         Login and the protected dashboard
  components/site/   Public components
  components/admin/  Dashboard components
  components/ui/     shadcn/ui primitives, themed to the brand palette
  lib/actions/       Server actions: every create, update and delete
  lib/data/          Database reads for public and admin pages
  lib/validations/   Zod schemas shared by forms and the server
  models/            Mongoose models
  proxy.ts           First-pass session check for /admin
scripts/             Seed scripts
```

## Security

- **Authorization** runs on the server at three levels: `proxy.ts` for every admin route, `requireAdmin()` in the dashboard layout and admin data loaders, and `adminMutation()` in every server action.
- **Sessions** are signed, httpOnly cookies lasting 8 hours. Changing a password revokes sessions on other devices.
- **Sign-in protection:** an account locks for 15 minutes after 5 failed attempts, with an IP rate limit as well.
- **Public forms** are validated on the server, rate limited to 5 submissions an hour and protected by a honeypot field.
- **Uploads** go directly from the browser to Cloudinary using a signature issued only to signed-in admins.

## Design notes

- **Palette:** only the five brand colours are used. Errors use navy text with an icon rather than an added red.
- **Contrast:** white on teal `#1C9AB7` is 3.3:1, which meets WCAG AA only for large text. Teal CTAs therefore use 19px bold labels, smaller buttons use navy, and text links are navy with a teal underline.
- **Motion:** entrance and scroll animations use CSS only, so they add no JavaScript and respect `prefers-reduced-motion`. Framer Motion was not needed.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run seed` | Prepare a database. Safe to run repeatedly |
| `npm run seed:demo` / `npm run seed:demo:clear` | Add or remove demo data |
