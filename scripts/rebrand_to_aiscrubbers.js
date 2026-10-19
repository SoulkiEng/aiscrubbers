const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const filesToUpdate = [
  'package.json',
  'server.js',
  'lib/toolsConfig.ts',
  'lib/aiTools.ts',
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'components/SeoContent.tsx',
  'components/ToolWorkspace.tsx',
  'components/SpecializedSolutionView.tsx',
  'components/CookieConsent.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'app/[slug]/page.tsx',
  'app/about-us/page.tsx',
  'app/contact-us/page.tsx',
  'app/privacy-policy/page.tsx',
  'app/terms-of-service/page.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'public/llms.txt',
  'chrome_extension/manifest.json',
  'chrome_extension/popup.html',
  'CHROMEWEBSTORE.md',
  'scripts/repack_app_zip.js',
];

for (const rel of filesToUpdate) {
  const fullPath = path.join(ROOT, rel);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');

  content = content
    .replace(/https:\/\/cleanaiarc\.com/g, 'https://aiscrubbers.com')
    .replace(/cleanaiarc\.com/g, 'aiscrubbers.com')
    .replace(/CleanAI<span className="text-brand-600">Arc<\/span>/g, 'AI<span className="text-brand-600">Scrubbers</span>')
    .replace(/CleanAI<span className="text-brand-400">Arc<\/span>/g, 'AI<span className="text-brand-400">Scrubbers</span>')
    .replace(/CleanAI<span>Arc<\/span>/g, 'AI<span>Scrubbers</span>')
    .replace(/>CA</g, '>AS<')
    .replace(/CleanAIArc/g, 'AIScrubbers')
    .replace(/cleanaiarc/g, 'aiscrubbers');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated:', rel);
}
