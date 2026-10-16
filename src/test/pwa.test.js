test('PWA assets are present', () => {
  expect(require('fs').existsSync('public/manifest.webmanifest')).toBe(true);
  expect(require('fs').existsSync('public/sw.js')).toBe(true);
});
