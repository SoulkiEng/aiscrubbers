const https = require('https');
const fs = require('fs');
const path = require('path');

const SUBREDDITS = [
  'NotebookLM',
  'ClaudeAI',
  'ChatGPT',
  'AmazonKDP',
  'EtsySellers',
  'SEO',
  'privacy',
];

const INTENT_RULES = [
  {
    pattern: /notebooklm|source|limit|pdf|markdown|combine|merge|context|files|upload|doc|study|notes/i,
    toolName: 'NotebookLM & Claude 100+ File Merger',
    url: 'https://aiscrubbers.com/bypass-notebooklm-50-source-limit/',
    angle:
      'Since each single NotebookLM source accepts up to 500,000 words, you can bypass the 50-source cap by merging your smaller PDFs, Markdown notes, or Word docs into 1 XML-indexed Master File locally in your browser at https://aiscrubbers.com/bypass-notebooklm-50-source-limit/ — it wraps each file in `<document source="filename">` headers so NotebookLM still cites the exact original document.',
  },
  {
    pattern: /c2pa|metadata|made with ai|ai label|exif|comfyui|midjourney|png|image|photo|linkedin|instagram|etsy/i,
    toolName: 'C2PA & AI Metadata Remover',
    url: 'https://aiscrubbers.com/c2pa-remover/',
    angle:
      'Platforms scan for hidden JUMBF/C2PA manifests and PNG tEXt prompt chunks. You can inspect and strip C2PA Content Credentials 100% client-side in your browser (zero server upload) using https://aiscrubbers.com/c2pa-remover/ or inspect embedded tags at https://aiscrubbers.com/c2pa-viewer/.',
  },
  {
    pattern: /dpi|300|kdp|cover|print|bleed|book|illustrat/i,
    toolName: 'AI Image 300 DPI Print Normalizer',
    url: 'https://aiscrubbers.com/prepare-ai-images-for-amazon-kdp/',
    angle:
      'AI image generators export with a 72 DPI binary header by default. You can inject a true 300 DPI JFIF/pHYs header and strip AI metadata locally in your browser at https://aiscrubbers.com/prepare-ai-images-for-amazon-kdp/.',
  },
  {
    pattern: /watermark|zero width|unicode|em dash|asterisk|word|docs|format|copy|paste|turnitin|ats|resume/i,
    toolName: 'ChatGPT Invisible Watermark & Word Cleaner',
    url: 'https://aiscrubbers.com/chatgpt-watermark-remover/',
    angle:
      'Copied LLM text often carries narrow no-break spaces (U+202F) and zero-width characters (U+200B). You can scan and strip them locally at https://aiscrubbers.com/chatgpt-watermark-remover/ or clean Markdown for MS Word at https://aiscrubbers.com/ai-text-to-word-cleaner/.',
  },
  {
    pattern: /redact|anonymize|pii|hipaa|gdpr|privacy|private|data|export|conversations\.json|backup/i,
    toolName: 'Prompt PII Redactor & ChatGPT Export Converter',
    url: 'https://aiscrubbers.com/prompt-pii-redactor/',
    angle:
      'Before pasting confidential text into an LLM, you can tokenize names, emails, SSNs, and API keys locally in your browser with 1-click restore at https://aiscrubbers.com/prompt-pii-redactor/ (or convert OpenAI conversations.json exports to PDF at https://aiscrubbers.com/chatgpt-export-converter/).',
  },
  {
    pattern: /llms\.txt|searchbot|gptbot|robots\.txt|perplexity|crawl|index|ranking|ai overview/i,
    toolName: 'Official llms.txt & AI robots.txt Generator',
    url: 'https://aiscrubbers.com/llms-txt-generator/',
    angle:
      'Make sure your `/llms.txt` follows the llmstxt.org spec and that `OAI-SearchBot` / `PerplexityBot` are allowed in `robots.txt`. There is a free client-side generator for both at https://aiscrubbers.com/llms-txt-generator/.',
  },
];

function fetchSubredditRss(sub) {
  return new Promise((resolve) => {
    const req = https.get(
      `https://www.reddit.com/r/${sub}/new.rss?limit=15`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
          Accept: 'application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 7000,
      },
      (res) => {
        let xml = '';
        res.on('data', (chunk) => (xml += chunk));
        res.on('end', () => {
          const entries = [];
          const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
          let m;
          while ((m = entryRegex.exec(xml)) !== null) {
            const block = m[1];
            const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = block.match(/<link href="([^"]+)"/);
            const contentMatch = block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
            if (titleMatch && linkMatch) {
              entries.push({
                title: titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
                link: linkMatch[1],
                content: contentMatch ? contentMatch[1] : '',
              });
            }
          }
          resolve(entries);
        });
      }
    );
    req.on('error', () => resolve([]));
  });
}

async function runSniper() {
  console.log('🔍 Scanning Tier-1 AI, KDP, Etsy & SEO Subreddits via RSS for High-Intent Leads...');
  const leads = [];

  for (const sub of SUBREDDITS) {
    const posts = await fetchSubredditRss(sub);
    for (const p of posts) {
      const text = `${p.title} ${p.content}`;
      for (const rule of INTENT_RULES) {
        if (rule.pattern.test(text)) {
          leads.push({
            subreddit: `r/${sub}`,
            title: p.title,
            permalink: p.link,
            matchedTool: rule.toolName,
            targetUrl: rule.url,
            suggestedReply: rule.angle,
          });
          break;
        }
      }
    }
  }

  const outPath = path.join(__dirname, 'HOT_REDDIT_LEADS.md');
  const mdLines = [
    '# 🔥 AIScrubbers.com — Live High-Intent Reddit Co-Pilot Leads',
    `Generated: ${new Date().toISOString()}`,
    '',
    ...leads.slice(0, 18).map(
      (l, idx) =>
        `## ${idx + 1}. [${l.subreddit}] ${l.title}\n- **Live Thread**: ${l.permalink}\n- **Matched Tool**: ${l.matchedTool}\n- **Ready-to-Paste Helpful Reply**:\n> ${l.suggestedReply}\n`
    ),
  ];

  fs.writeFileSync(outPath, mdLines.join('\n'), 'utf8');
  console.log(`✅ Found ${leads.length} high-intent leads! Saved top 18 to ${outPath}`);
}

runSniper();
