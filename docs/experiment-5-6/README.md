# Experiments 5 and 6 evidence

## Experiment 1: Implement Hotel Booking Component Testing

- Jest configuration: `jest.config.cjs`
- Babel/Jest JSX support: `babel.config.cjs`
- Test setup: `src/test/setup.js`
- Hotel card and accessibility tests: `src/components/UI.test.jsx`
- API, hotel detail, reservation CRUD tests: `src/services/api.test.js`
- Search and filtering test: `src/services/search.test.js`
- Booking cost calculation tests: `src/store/store.test.js`
- PWA asset smoke test: `src/test/pwa.test.js`

Run the suite with:

```bash
npm test
```

## Experiment 2: Optimize Hotel Booking Application

- Lazy loading and route-level code splitting: `src/App.jsx`
- Cached GET API responses and cache invalidation: `src/services/api.js`
- Search/filter helper: `src/services/search.js`
- PWA manifest: `public/manifest.webmanifest`
- Service worker: `public/sw.js`
- Service-worker registration: `src/main.jsx`
- ARIA live loading/error states and accessible hotel action names: `src/App.jsx`, `src/components/UI.jsx`
- Session-scoped demo authentication storage: `src/context/AuthContext.jsx`
- Image optimization parameters: `src/data/hotels.js`

The screenshots in this folder show the running browser application. The text logs show the passing test suite and successful production build.

> This remains an educational browser-only demo. Production authentication should use secure HttpOnly cookies and a server-side API.
