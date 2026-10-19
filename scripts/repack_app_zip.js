const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const STAGE_DIR = path.join(ROOT, '.deploy_stage');
const ZIP_PATH = path.join(ROOT, 'aiscrubbers_hostinger_ready.zip');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

console.log('1. Cleaning old staging directory...');
if (fs.existsSync(STAGE_DIR)) {
  fs.rmSync(STAGE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STAGE_DIR, { recursive: true });
fs.mkdirSync(path.join(STAGE_DIR, 'nodejs'), { recursive: true });

console.log('2. Copying static export (out/), server.js, nodejs/server.js, and package.json...');
copyRecursiveSync(path.join(ROOT, 'out'), path.join(STAGE_DIR, 'out'));
fs.copyFileSync(path.join(ROOT, 'server.js'), path.join(STAGE_DIR, 'server.js'));
fs.copyFileSync(path.join(ROOT, 'server.js'), path.join(STAGE_DIR, 'nodejs', 'server.js'));

const minimalPkg = {
  name: 'aiscrubbers-studio',
  version: '1.0.0',
  private: true,
  scripts: {
    start: 'node server.js',
  },
};
fs.writeFileSync(path.join(STAGE_DIR, 'package.json'), JSON.stringify(minimalPkg, null, 2));

console.log('3. Creating flat root-level aiscrubbers_hostinger_ready.zip...');
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${STAGE_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`,
  { stdio: 'inherit' }
);

fs.rmSync(STAGE_DIR, { recursive: true, force: true });
console.log('✅ Hostinger Deployment Package Ready:', ZIP_PATH);
