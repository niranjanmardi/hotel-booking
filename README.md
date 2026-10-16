# Staywise Hotel Booking App

A beautiful, beginner-friendly React hotel booking application for Scenario 4. It demonstrates both the REST/API experiments in the prompt and the React Hooks, Context API, Router, authentication, and validation requirements from the assignment attachment.

## Run it

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Demo flow

1. Explore stays on the home page.
2. Search and filter hotels by location, rating, and price.
3. Open a dynamic hotel route such as `/hotel/101`.
4. Choose a room, enter guest details, review the summary, and complete the demo payment.
5. Sign in when asked. Demo login: `demo@staywise.com` / `travel123`.
6. View reservation history and cancel a reservation from **My bookings**.

## How every experiment is represented

- **Experiment 1 – REST API:** `src/services/api.js` provides asynchronous `GET`, `POST`, `PATCH`, and `DELETE` REST-style functions. The UI uses loading and error states. The service uses browser storage as a small local API database so the project needs no backend setup.
- **Experiment 2 – State management:** Redux Toolkit lives in `src/store/store.js`. It manages the hotel, room, dates, guests, customer details, payment method, totals, and persistence middleware.
- **Experiment 3 – CRUD:** reservations are created, retrieved, updated by PATCH-capable API code, and cancelled with DELETE. The reservation history page uses GET.
- **Experiment 4 – Authentication:** `AuthContext` creates a demo token, persists the signed-in user, protects booking/checkout/history routes, supports logout, and redirects back after login.
- **Hooks:** `useState`, `useEffect`, `useMemo`, `useRef`, and reusable components are used across the pages.
- **Router:** React Router includes `/`, `/hotels`, `/hotel/:id`, `/booking/room`, `/booking/guest`, `/booking/summary`, `/checkout`, `/login`, and `/bookings`.
- **Validation:** email, password length, phone number, room selection, guest details, and date controls are demonstrated.

## Easy teacher explanation

> “The app uses a local asynchronous REST-style service to keep the project self-contained. Redux Toolkit is the single source of truth for the booking process, while Context handles authentication. React Router protects the booking pages and enables dynamic hotel URLs. The booking middleware saves every Redux state change to localStorage, so refreshing the browser does not lose the booking.”

The Unsplash image URLs are remote demo images; the app itself has no secret keys and does not make real payments.


## Additional experiments

- **Component testing:** Jest and React Testing Library tests live beside the source modules. Run `npm test` or `npm run test:coverage`. Tests cover HotelCard rendering and accessibility, hotel detail GET requests, search/filtering, reservation POST/PATCH/GET/DELETE, and Redux booking cost calculations.
- **Performance and quality:** route-level pages use `React.lazy` and `Suspense` for code splitting; GET API responses use a small in-memory cache; images use remote responsive-friendly URLs already defined in the seed data; `public/manifest.webmanifest` and `public/sw.js` provide the basic PWA shell; loading and error regions use ARIA live announcements; booking buttons expose accessible names; and the demo token is kept in `sessionStorage` rather than long-lived localStorage.

> This is an educational browser-only demo. A production app should move authentication tokens to secure, HttpOnly cookies and use a server-side API.

## Experiment 3 – Deployment

- `npm run deploy:build` creates the production bundle in `dist/`.
- `.github/workflows/deploy.yml` builds and deploys the app to GitHub Pages on pushes to `main`.
- `netlify.toml` configures Netlify to run `npm run build` and publish `dist/`.
- `vercel.json` configures Vercel with the Vite build command and `dist` output directory.
- `npm run verify:deployment -- https://your-deployed-site.example` checks the deployed page response and Staywise HTML.
- `vite.config.js` automatically applies the repository base path during GitHub Actions builds.
