const https = require('https');

const HOST = 'aiscrubbers.com';
const KEY = 'c7e42d8a59f14068b92ea18dc302b5f7';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/c2pa-remover/`,
  `https://${HOST}/c2pa-viewer/`,
  `https://${HOST}/exif-scrubber/`,
  `https://${HOST}/ai-image-normalizer/`,
  `https://${HOST}/chatgpt-watermark-remover/`,
  `https://${HOST}/ai-text-to-word-cleaner/`,
  `https://${HOST}/prompt-pii-redactor/`,
  `https://${HOST}/ai-burstiness-polisher/`,
  `https://${HOST}/notebooklm-file-merger/`,
  `https://${HOST}/chatgpt-export-converter/`,
  `https://${HOST}/doc-to-llm-markdown/`,
  `https://${HOST}/llm-token-calculator/`,
  `https://${HOST}/llms-txt-generator/`,
  `https://${HOST}/ai-robots-txt-generator/`,
  `https://${HOST}/jsonl-dataset-converter/`,
  `https://${HOST}/mcp-config-generator/`,
  `https://${HOST}/remove-c2pa-for-linkedin-instagram/`,
  `https://${HOST}/prepare-ai-images-for-amazon-kdp/`,
  `https://${HOST}/clean-ai-art-metadata-for-etsy/`,
  `https://${HOST}/bypass-notebooklm-50-source-limit/`,
  `https://${HOST}/combine-files-for-claude-projects/`,
  `https://${HOST}/clean-chatgpt-text-for-turnitin-ats/`,
  `https://${HOST}/hipaa-gdpr-chatgpt-prompt-redactor/`,
  `https://${HOST}/convert-chatgpt-conversations-json-to-pdf/`,
  `https://${HOST}/llms-txt-generator-for-shopify-nextjs/`,
  `https://${HOST}/about-us/`,
  `https://${HOST}/contact-us/`,
  `https://${HOST}/privacy-policy/`,
  `https://${HOST}/terms-of-service/`,
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST,
});

const req = https.request(
  'https://api.indexnow.org/indexnow',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  },
  (res) => {
    console.log(`IndexNow Status Code: ${res.statusCode} (200/202 = Instant Indexing Accepted for ${URL_LIST.length} URLs!)`);
  }
);

req.on('error', (err) => console.error('IndexNow Error:', err.message));
req.write(payload);
req.end();
