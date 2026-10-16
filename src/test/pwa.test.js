test('PWA assets are present', () => {
  expect(require('fs').existsSync('public/manifest.webmanifest')).toBe(true);
  expect(require('fs').existsSync('public/sw.js')).toBe(true);
  expect(require('fs').existsSync('public/icon-192.svg')).toBe(true);
  expect(require('fs').existsSync('public/icon-512.svg')).toBe(true);
});
