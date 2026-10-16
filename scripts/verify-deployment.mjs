const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('Usage: npm run verify:deployment -- https://your-site.example');
  process.exit(1);
}
for (const url of urls) {
  const response = await fetch(url);
  const html = await response.text();
  const ok = response.ok && /Staywise|hotel booking/i.test(html);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${url} (${response.status})`);
  if (!ok) process.exitCode = 1;
}
