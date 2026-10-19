export interface ToolFAQ {
  q: string;
  a: string;
}

export interface ToolMetadata {
  id: string;
  title: string;
  shortDesc: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  iconName: string;
  color: string;
  bgLight: string;
  borderLight: string;
  href: string;
  category: 'c2pa' | 'text' | 'rag' | 'geo';
  inputMode: 'file' | 'text' | 'builder';
  acceptedFiles?: Record<string, string[]>;
  multipleFiles?: boolean;
  howToSteps: { title: string; desc: string }[];
  features: { title: string; desc: string }[];
  faqs: ToolFAQ[];
}

export const TOOLS: ToolMetadata[] = [
  // ==========================================
  // CATEGORY 1: C2PA & AI IMAGE METADATA PRIVACY
  // ==========================================
  {
    id: 'c2pa-remover',
    title: 'C2PA & AI Metadata Remover',
    shortDesc: 'Strip C2PA Content Credentials, SynthID tags, DALL-E/Midjourney chunks, and EXIF data from images 100% locally.',
    seoTitle: 'C2PA Metadata Remover — Strip AI Content Credentials & Tags Free | AIScrubbers',
    seoDescription: 'Remove C2PA Content Credentials, JUMBF boxes, IPTC AI tags, Midjourney/DALL-E metadata, and EXIF data from JPG, PNG, and WebP images 100% locally in your browser.',
    keywords: [
      'c2pa metadata remover',
      'remove content credentials from image',
      'strip ai metadata from png',
      'remove made with ai label linkedin instagram',
      'clean midjourney dalle metadata',
      'client side c2pa scrubber'
    ],
    iconName: 'ShieldOff',
    color: 'from-indigo-600 to-violet-600',
    bgLight: 'bg-indigo-50 text-indigo-700',
    borderLight: 'border-indigo-200',
    href: '/c2pa-remover',
    category: 'c2pa',
    inputMode: 'file',
    acceptedFiles: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multipleFiles: true,
    howToSteps: [
      { title: 'Drop Your AI or Camera Images', desc: 'Select one or multiple JPG, PNG, or WebP images directly in your browser. Zero bytes are uploaded to any server.' },
      { title: 'Inspect & Scrub C2PA / JUMBF Chunks', desc: 'Our local binary scanner detects C2PA manifests, IPTC trainedAlgorithmicMedia flags, and PNG tEXt/iTXt chunks, then reconstructs a clean pixel buffer.' },
      { title: 'Download Sanitized Images', desc: 'Save your 100% metadata-free image (or batch ZIP) ready for LinkedIn, Instagram, Etsy, or Amazon KDP.' }
    ],
    features: [
      { title: '100% Client-Side Pixel Reconstruction', desc: 'Re-encodes raw pixel arrays through HTML5 Canvas so every JUMBF, C2PA, XMP, and EXIF block is permanently eradicated.' },
      { title: 'Forensic Pre-Scan Report', desc: 'Shows you exactly which hidden AI tags (OpenAI, Adobe Firefly, Midjourney, ComfyUI, Apple C2PA) were found before removal.' },
      { title: 'Batch ZIP Processing', desc: 'Sanitize 20+ product photos or social graphics simultaneously with zero server latency.' }
    ],
    faqs: [
      { q: 'Why do LinkedIn, Instagram, and TikTok add a "Made with AI" badge to my images?', a: 'Social platforms automatically scan uploaded images for C2PA (Coalition for Content Provenance and Authenticity) JUMBF boxes, IPTC DigitalSourceType tags, and Adobe/OpenAI XMP metadata. Even minor edits in Photoshop AI can trigger the label.' },
      { q: 'Does C2PA Metadata Remover reduce my image resolution?', a: 'No. AIScrubbers preserves your exact pixel width and height while generating a fresh, unencumbered image file at 98% studio quality.' },
      { q: 'Are my images uploaded to a cloud server?', a: 'Never. All binary inspection and canvas re-encoding execute 100% inside your device RAM.' }
    ]
  },
  {
    id: 'c2pa-viewer',
    title: 'C2PA & AI Provenance Inspector',
    shortDesc: 'Forensically inspect images & PDFs for hidden C2PA manifests, AI generator signatures, XMP, and PNG parameters.',
    seoTitle: 'C2PA Metadata Viewer & AI Image Provenance Checker Online | AIScrubbers',
    seoDescription: 'Check if an image or PDF contains hidden C2PA Content Credentials, DALL-E, Midjourney, Stable Diffusion, ComfyUI, or Adobe Firefly AI metadata in 1 click.',
    keywords: [
      'c2pa viewer online',
      'check if image has ai metadata',
      'content credentials inspector',
      'view midjourney prompt metadata png',
      'c2pa jumbf parser browser'
    ],
    iconName: 'ScanSearch',
    color: 'from-violet-600 to-purple-600',
    bgLight: 'bg-violet-50 text-violet-700',
    borderLight: 'border-violet-200',
    href: '/c2pa-viewer',
    category: 'c2pa',
    inputMode: 'file',
    acceptedFiles: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'], 'application/pdf': ['.pdf'] },
    multipleFiles: false,
    howToSteps: [
      { title: 'Select an Image or PDF File', desc: 'Drop any JPG, PNG, WebP, or PDF file into the local forensic scanner.' },
      { title: 'Run Binary Chunk Analysis', desc: 'Our engine parses JPEG APP1/APP11 segments, PNG tEXt/iTXt/caBX chunks, and XMP/C2PA manifests in milliseconds.' },
      { title: 'View AI Provenance Risk Report', desc: 'See whether the file will trigger platform AI badges and export the full JSON forensic audit.' }
    ],
    features: [
      { title: 'Detects C2PA, JUMBF & XMP Signatures', desc: 'Identifies OpenAI DALL-E/Sora, Adobe Firefly, Midjourney, ComfyUI workflow JSON, and Leica/Sony C2PA camera signatures.' },
      { title: 'Platform Flag Predictor', desc: 'Instantly tells you if LinkedIn, Meta, TikTok, or Amazon KDP will flag the file as AI-generated.' },
      { title: 'Downloadable JSON Audit', desc: 'Export a complete timestamped forensic report for compliance or client verification.' }
    ],
    faqs: [
      { q: 'What is a C2PA JUMBF box?', a: 'JUMBF (JPEG Universal Metadata Box Format) is the binary container used by the C2PA standard to embed cryptographically signed Content Credentials inside JPEG, PNG, and WebP files.' },
      { q: 'Can this tool detect ComfyUI and Stable Diffusion prompts inside PNGs?', a: 'Yes! Stable Diffusion and ComfyUI store full prompt graphs inside uncompressed PNG tEXt and iTXt chunks, which our inspector extracts and displays.' }
    ]
  },
  {
    id: 'exif-scrubber',
    title: 'Deep EXIF, GPS & Serial Stripper',
    shortDesc: 'Remove GPS location coordinates, iPhone/Camera serial numbers, and hidden XMP tags from photos in bulk.',
    seoTitle: 'Remove EXIF & GPS Metadata from Photos Online (100% Private) | AIScrubbers',
    seoDescription: 'Strip GPS coordinates, device serial numbers, timestamps, and camera EXIF data from JPG, PNG, and WebP photos locally in your browser without uploading.',
    keywords: [
      'remove exif data online private',
      'strip gps location from photo',
      'clean iphone photo metadata',
      'bulk exif remover browser'
    ],
    iconName: 'MapPinOff',
    color: 'from-emerald-600 to-teal-600',
    bgLight: 'bg-emerald-50 text-emerald-700',
    borderLight: 'border-emerald-200',
    href: '/exif-scrubber',
    category: 'c2pa',
    inputMode: 'file',
    acceptedFiles: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multipleFiles: true,
    howToSteps: [
      { title: 'Select Smartphone or Camera Photos', desc: 'Choose one or more photos containing GPS coordinates or camera EXIF tags.' },
      { title: 'Execute Zero-Metadata Rebuild', desc: 'AIScrubbers strips all EXIF, IPTC, GPS, and thumbnail segments inside your browser.' },
      { title: 'Download Privacy-Safe Photos', desc: 'Save individual clean images or a single ZIP archive.' }
    ],
    features: [
      { title: 'GPS Coordinate Eradication', desc: 'Prevents home or office address leaks when sharing photos on marketplaces, Reddit, or classifieds.' },
      { title: 'Zero Cloud Upload', desc: 'Your personal photos never touch an external server.' },
      { title: 'Batch ZIP Support', desc: 'Clean entire folders of images in seconds.' }
    ],
    faqs: [
      { q: 'What hidden data do iPhone and Android photos contain?', a: 'Smartphone photos embed exact GPS latitude/longitude, altitude, compass direction, lens serial numbers, and exact capture timestamps.' },
      { q: 'Is EXIF removal permanent?', a: 'Yes, the downloaded image contains only raw pixel data and zero EXIF/GPS headers.' }
    ]
  },
  {
    id: 'ai-image-normalizer',
    title: 'AI Image 300 DPI Print Normalizer',
    shortDesc: 'Convert 72 DPI Midjourney/DALL-E images into clean, C2PA-free 300 DPI sRGB files for Amazon KDP & Etsy.',
    seoTitle: 'Convert AI Images to 300 DPI for Amazon KDP & Etsy (Strip C2PA) | AIScrubbers',
    seoDescription: 'Convert 72 DPI Midjourney, DALL-E, and Flux images into true 300 DPI print-ready JPG/PNG files while stripping all C2PA and AI metadata locally.',
    keywords: [
      'convert midjourney to 300 dpi',
      'ai image to 300 dpi amazon kdp',
      'prepare ai art for etsy printables',
      'change image dpi to 300 online free'
    ],
    iconName: 'Printer',
    color: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-50 text-blue-700',
    borderLight: 'border-blue-200',
    href: '/ai-image-normalizer',
    category: 'c2pa',
    inputMode: 'file',
    acceptedFiles: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multipleFiles: true,
    howToSteps: [
      { title: 'Upload Your 72 DPI AI Artwork', desc: 'Select your Midjourney, DALL-E, or Stable Diffusion image files.' },
      { title: 'Inject 300 DPI Header & Strip AI Tags', desc: 'We rewrite the binary JFIF density / PNG pHYs chunk to exact 300 DPI (11811 pixels per meter) and remove all C2PA/AI chunks.' },
      { title: 'Download Print-Ready 300 DPI File', desc: 'Upload directly to Amazon KDP, IngramSpark, Printful, or Etsy without DPI warnings.' }
    ],
    features: [
      { title: 'True Binary 300 DPI Header Injection', desc: 'Writes standard 300 DPI metadata into JPEG JFIF and PNG pHYs headers so print portals accept your artwork immediately.' },
      { title: 'Simultaneous C2PA & AI Tag Removal', desc: 'Cleans out generator strings while normalizing print density.' },
      { title: 'KDP & Printful Ready', desc: 'Built specifically for self-publishers and digital printable sellers.' }
    ],
    faqs: [
      { q: 'Why do Midjourney and DALL-E images fail Amazon KDP DPI checks?', a: 'AI generators export images at 72 or 96 DPI by default. Even if pixel dimensions are high, print portals check the binary JFIF/pHYs DPI header and reject 72 DPI files.' },
      { q: 'Does this rewrite the actual binary DPI header?', a: 'Yes! Our browser engine injects exact 300 DPI density bytes into both JPEG JFIF headers and PNG pHYs chunks.' }
    ]
  },

  // ==========================================
  // CATEGORY 2: AI TEXT, WATERMARK & PRIVACY SANITIZER
  // ==========================================
  {
    id: 'chatgpt-watermark-remover',
    title: 'ChatGPT Invisible Watermark Cleaner',
    shortDesc: 'Detect and strip hidden zero-width Unicode characters (U+200B, U+202F), non-breaking spaces, and AI punctuation markers.',
    seoTitle: 'Remove Hidden ChatGPT Watermarks & Zero-Width Characters Free | AIScrubbers',
    seoDescription: 'Scan and remove invisible Unicode watermarks (U+200B, U+FEFF, U+202F), non-breaking spaces, smart quotes, and em-dash patterns from ChatGPT, Claude, and Gemini text.',
    keywords: [
      'remove chatgpt watermark',
      'invisible unicode character remover',
      'zero width space remover ai text',
      'clean chatgpt text for turnitin ats',
      'detect hidden characters in chatgpt'
    ],
    iconName: 'Sparkles',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 text-amber-700',
    borderLight: 'border-amber-200',
    href: '/chatgpt-watermark-remover',
    category: 'text',
    inputMode: 'text',
    howToSteps: [
      { title: 'Paste Your AI-Generated Text', desc: 'Paste any text from ChatGPT, Claude, Gemini, or DeepSeek into the local scanner.' },
      { title: 'Inspect Detected Hidden Characters', desc: 'Instantly see the exact count of zero-width spaces, narrow no-break spaces, smart quotes, and AI em-dash spikes.' },
      { title: 'Copy 100% Sanitized ASCII/UTF-8 Text', desc: 'Click Copy or Download to get clean, natural keyboard-standard text.' }
    ],
    features: [
      { title: 'Zero-Width Unicode Eradicator', desc: 'Strips U+200B, U+200C, U+200D, U+2060, U+FEFF, U+00A0, and U+202F markers that flag automated text filters.' },
      { title: 'Smart Quote & Em-Dash Normalizer', desc: 'Converts curly typographic quotes and excessive AI em-dashes (—) into natural human keyboard punctuation.' },
      { title: 'Live Forensic Counter', desc: 'Shows you every hidden byte removed in real time.' }
    ],
    faqs: [
      { q: 'Does ChatGPT really put invisible characters in text?', a: 'LLM interfaces and rich-text clipboard handlers frequently insert narrow no-break spaces (U+202F), zero-width joiners (U+200B/U+200D), and typographic curly quotes that never come from a standard human keyboard.' },
      { q: 'Will cleaning Unicode characters break my formatting?', a: 'No. Paragraphs, line breaks, and standard punctuation remain 100% intact.' }
    ]
  },
  {
    id: 'ai-text-to-word-cleaner',
    title: 'Clean ChatGPT Formatting for Word & Docs',
    shortDesc: 'Strip Markdown asterisks (**), hash headers (###), and grey backgrounds for 1-click clean paste into MS Word & Gmail.',
    seoTitle: 'Clean ChatGPT Formatting for Word, Google Docs & Gmail | AIScrubbers',
    seoDescription: 'Remove Markdown asterisks (**), hashtags (###), code fences, and grey background shading when copying from ChatGPT or Claude into Microsoft Word and Google Docs.',
    keywords: [
      'copy chatgpt to word without background',
      'remove asterisks from chatgpt text',
      'clean markdown formatting for word',
      'chatgpt to google docs formatter'
    ],
    iconName: 'FileCheck2',
    color: 'from-sky-500 to-blue-600',
    bgLight: 'bg-sky-50 text-sky-700',
    borderLight: 'border-sky-200',
    href: '/ai-text-to-word-cleaner',
    category: 'text',
    inputMode: 'text',
    howToSteps: [
      { title: 'Paste Raw ChatGPT or Claude Output', desc: 'Paste text containing **bold** asterisks, ### headings, bullet lists, or markdown tables.' },
      { title: 'Auto-Convert to Clean Document Structure', desc: 'Our parser strips raw Markdown symbols and builds both clean plain text and rich Word-compatible formatting.' },
      { title: 'Copy Rich Text or Download DOCX / PDF', desc: 'Paste directly into MS Word, Google Docs, or Gmail with zero grey backgrounds or stray asterisks.' }
    ],
    features: [
      { title: 'Eliminates Grey Clipboard Shading', desc: 'Strips dark-mode and inline CSS background spans so pasted text matches your Word document automatically.' },
      { title: 'Converts ** and ### Properly', desc: 'Choose between clean Plain Text or formatted Word DOCX/PDF output.' },
      { title: 'Instant DOCX & PDF Export', desc: 'Download a ready-to-send `.docx` or `.pdf` document in 1 click.' }
    ],
    faqs: [
      { q: 'Why does copying from ChatGPT into Word leave a grey background or asterisks?', a: 'Either you copy with rich HTML styles (which brings ChatGPTs dark/grey div background) or you copy raw Markdown (which leaves ** and ### symbols everywhere). AIScrubbers fixes both instantly.' }
    ]
  },
  {
    id: 'prompt-pii-redactor',
    title: 'Prompt Privacy Scrubber (PII Anonymizer)',
    shortDesc: 'Automatically redact Names, Emails, SSNs, Phone Numbers & API Keys into reversible tokens before pasting into ChatGPT.',
    seoTitle: 'ChatGPT Prompt PII Redactor & Anonymizer (HIPAA / GDPR Safe) | AIScrubbers',
    seoDescription: 'Sanitize sensitive prompts locally before sending to ChatGPT or Claude. Automatically replace emails, phones, SSNs, credit cards, and API keys with reversible tokens.',
    keywords: [
      'anonymize text before chatgpt',
      'pii redactor for llm prompts',
      'sanitize data for chatgpt hipaa gdpr',
      'reversible pii scrubber browser'
    ],
    iconName: 'LockKeyhole',
    color: 'from-rose-600 to-red-600',
    bgLight: 'bg-rose-50 text-rose-700',
    borderLight: 'border-rose-200',
    href: '/prompt-pii-redactor',
    category: 'text',
    inputMode: 'text',
    howToSteps: [
      { title: 'Paste Sensitive Email, Contract, or Code', desc: 'Paste text containing client names, emails, phone numbers, SSNs, IBANs, or secret API keys.' },
      { title: 'Auto-Tokenize Sensitive Entities', desc: 'AIScrubbers replaces sensitive values with placeholders like [EMAIL_1], [PHONE_1], and [API_KEY_1] while keeping the mapping in your browser memory.' },
      { title: 'Send to AI & 1-Click Restore', desc: 'Paste the safe prompt into ChatGPT/Claude, then paste the AI response back here to restore the real client details automatically!' }
    ],
    features: [
      { title: 'Reversible 2-Way Vault Mapping', desc: 'The only browser tool that lets you de-anonymize the LLM reply back to real names and emails in 1 click.' },
      { title: 'Detects 10+ Sensitive Entity Types', desc: 'Catches Emails, Phones, US SSNs, Credit Cards, API Keys (OpenAI, AWS, GitHub, Stripe), IPv4/v6, and custom client names.' },
      { title: 'HIPAA, GDPR & Corporate Policy Friendly', desc: 'Zero data ever leaves your browser tab.' }
    ],
    faqs: [
      { q: 'How does the 1-Click Restore feature work?', a: 'When AIScrubbers replaces "john@acme.com" with "[EMAIL_1]", it stores that pair locally in your browser RAM. When ChatGPT replies using "[EMAIL_1]", you click Restore and it swaps "john@acme.com" right back in!' },
      { q: 'Is my mapping table saved on any server?', a: 'Never. It lives strictly in your browser state and vanishes the moment you close the tab.' }
    ]
  },
  {
    id: 'ai-burstiness-polisher',
    title: 'AI Cliché & Footprint Polisher',
    shortDesc: 'Highlight and replace robotic AI words ("delve", "tapestry", "moreover", "testament") and em-dash overuse.',
    seoTitle: 'AI Cliché Finder & Footprint Polisher — Fix Robotic AI Phrasing | AIScrubbers',
    seoDescription: 'Detect and replace overused AI vocabulary ("delve", "tapestry", "testament", "crucial", "underscore"), repetitive sentence lengths, and em-dash clusters.',
    keywords: [
      'remove ai buzzwords from text',
      'chatgpt cliche finder delve tapestry',
      'ai sentence burstiness analyzer',
      'humanize ai phrasing vocabulary'
    ],
    iconName: 'Wand2',
    color: 'from-fuchsia-600 to-pink-600',
    bgLight: 'bg-fuchsia-50 text-fuchsia-700',
    borderLight: 'border-fuchsia-200',
    href: '/ai-burstiness-polisher',
    category: 'text',
    inputMode: 'text',
    howToSteps: [
      { title: 'Paste Your Draft or Article', desc: 'Drop in your essay, blog post, LinkedIn post, or cover letter.' },
      { title: 'Audit AI Vocabulary & Burstiness Score', desc: 'See every overused LLM cliché ("delve", "testament", "vibrant tapestry", "it is important to note") and sentence length uniformity.' },
      { title: '1-Click Natural Replacement', desc: 'Automatically swap robotic transitions and em-dash clusters for natural, direct English.' }
    ],
    features: [
      { title: '50+ LLM Signature Phrase Dictionary', desc: 'Flags the exact words statistically over-represented in GPT-4o, Claude, and Gemini outputs.' },
      { title: 'Sentence Burstiness Meter', desc: 'Measures standard deviation of sentence lengths so you can spot monotonous rhythms.' },
      { title: '1-Click Natural Polish', desc: 'Replaces stiff transitions with concise, human-grade alternatives.' }
    ],
    faqs: [
      { q: 'Why do editors immediately recognize ChatGPT writing?', a: 'LLMs heavily overuse specific vocabulary ("delve", "testament", "tapestry", "foster", "underscore", "moreover") and write sentences of nearly identical length (low burstiness).' }
    ]
  },

  // ==========================================
  // CATEGORY 3: NOTEBOOKLM, CLAUDE & RAG FILE PREP
  // ==========================================
  {
    id: 'notebooklm-file-merger',
    title: 'NotebookLM & Claude 100+ File Merger',
    shortDesc: 'Combine 100+ PDFs, Word docs, Markdown, CSV & code files into 1 indexed Master Context File to bypass upload limits.',
    seoTitle: 'Merge 100+ Files for Google NotebookLM & Claude Projects | AIScrubbers',
    seoDescription: 'Bypass Google NotebookLM 50-source limit and Claude/ChatGPT 20-file upload limits. Combine 100+ PDFs, DOCX, Markdown, CSV, and code files into one XML-indexed Master File.',
    keywords: [
      'bypass notebooklm 50 source limit',
      'merge files for notebooklm',
      'combine files for claude projects',
      'merge code files for chatgpt context',
      'llm context bundler online'
    ],
    iconName: 'Layers',
    color: 'from-indigo-600 to-blue-600',
    bgLight: 'bg-indigo-50 text-indigo-700',
    borderLight: 'border-indigo-200',
    href: '/notebooklm-file-merger',
    category: 'rag',
    inputMode: 'file',
    acceptedFiles: {
      'text/*': ['.txt', '.md', '.csv', '.json', '.js', '.ts', '.tsx', '.py', '.html', '.css', '.xml', '.yaml'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multipleFiles: true,
    howToSteps: [
      { title: 'Select Up to 100+ Documents or Code Files', desc: 'Drop PDFs, Word (.docx), Markdown (.md), TXT, CSV, JSON, or source code files.' },
      { title: 'Build XML-Indexed Master Knowledge Pack', desc: 'AIScrubbers extracts text from every file, adds a Table of Contents, and wraps each file in clear <document source="..."> boundaries.' },
      { title: 'Download Master .MD, .TXT, or .PDF', desc: 'Upload the single combined file into Google NotebookLM, Claude Projects, or ChatGPT.' }
    ],
    features: [
      { title: 'Turn 100 Sources into 1 Slot', desc: 'Instantly overcomes NotebookLM’s 50-source limit and Claude/ChatGPT’s 20-file attachment cap.' },
      { title: 'Anthropic & Google Recommended XML Tags', desc: 'Wraps each file in structured `<document index="1" source="file.pdf">` tags so the AI cites the exact original filename!' },
      { title: 'Supports PDF + DOCX + Code Together', desc: 'Mix PDFs, Word files, spreadsheets, and code into a single unified context file.' }
    ],
    faqs: [
      { q: 'Does NotebookLM still know which individual file a quote came from after merging?', a: 'Yes! Because we insert a structured Table of Contents and explicit `<document source="filename">` headers before every file section, NotebookLM and Claude accurately cite the exact sub-document.' },
      { q: 'What is the maximum file size NotebookLM accepts per source?', a: 'NotebookLM accepts up to 500,000 words (or 200MB) per single source! Combining 50 small files into 1 Master Markdown or PDF file uses only 1 source slot.' }
    ]
  },
  {
    id: 'chatgpt-export-converter',
    title: 'ChatGPT Export (conversations.json) Viewer & PDF',
    shortDesc: 'Open OpenAI conversations.json data exports locally, search your chat history, and convert chats to PDF or Markdown.',
    seoTitle: 'ChatGPT conversations.json Viewer to PDF & Markdown Converter | AIScrubbers',
    seoDescription: 'Open and read your OpenAI ChatGPT data export (conversations.json) 100% locally in your browser. Search all chats and export to clean PDF or Markdown files.',
    keywords: [
      'chatgpt conversations.json viewer',
      'convert chatgpt export to pdf',
      'open conversations.json file online',
      'chatgpt history export to markdown'
    ],
    iconName: 'MessageSquareText',
    color: 'from-emerald-600 to-green-600',
    bgLight: 'bg-emerald-50 text-emerald-700',
    borderLight: 'border-emerald-200',
    href: '/chatgpt-export-converter',
    category: 'rag',
    inputMode: 'file',
    acceptedFiles: { 'application/json': ['.json'], 'application/zip': ['.zip'] },
    multipleFiles: false,
    howToSteps: [
      { title: 'Select Your conversations.json or Export ZIP', desc: 'Drop the `conversations.json` file (or the full `.zip` archive from OpenAI Settings -> Data Controls -> Export Data).' },
      { title: 'Browse & Search Your Entire Chat History', desc: 'Our browser parser reconstructs your message trees, timestamps, and titles locally in seconds.' },
      { title: 'Export to Clean Markdown or PDF', desc: 'Download your archive as formatted Markdown notes (for Obsidian/Notion/NotebookLM) or a readable PDF book.' }
    ],
    features: [
      { title: 'Handles Both .JSON and OpenAI .ZIP Exports', desc: 'No need to even unzip—drop the raw OpenAI export archive and read it immediately.' },
      { title: '100% Private Local Parsing', desc: 'Your private ChatGPT history never leaves your computer.' },
      { title: 'Ready for Obsidian, Notion & NotebookLM', desc: 'Exports clean Markdown with conversation dates and role headers.' }
    ],
    faqs: [
      { q: 'Why cant I open conversations.json in Word or Notepad easily?', a: 'OpenAI exports your entire chat history as a deeply nested JSON tree structure (`mapping` nodes) on a single giant line. AIScrubbers parses that tree into clean chronological conversations.' }
    ]
  },
  {
    id: 'doc-to-llm-markdown',
    title: 'PDF & Word to Clean LLM Markdown',
    shortDesc: 'Convert noisy PDFs, DOCX, HTML & CSV files into token-compressed Markdown (.md) that saves 60% of LLM context tokens.',
    seoTitle: 'PDF & DOCX to Clean LLM Markdown Converter (Token Optimizer) | AIScrubbers',
    seoDescription: 'Convert PDF, Word (.docx), HTML, and CSV files into clean, token-optimized Markdown (.md) for Claude, ChatGPT, Cursor, and RAG pipelines 100% in your browser.',
    keywords: [
      'pdf to markdown for llm',
      'convert docx to clean markdown',
      'optimize pdf for claude context window',
      'html to llm markdown converter'
    ],
    iconName: 'FileCode2',
    color: 'from-cyan-600 to-blue-600',
    bgLight: 'bg-cyan-50 text-cyan-700',
    borderLight: 'border-cyan-200',
    href: '/doc-to-llm-markdown',
    category: 'rag',
    inputMode: 'file',
    acceptedFiles: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/*': ['.html', '.htm', '.csv', '.txt']
    },
    multipleFiles: true,
    howToSteps: [
      { title: 'Upload PDF, Word (.docx), HTML, or CSV', desc: 'Select one or multiple documents to convert into LLM-optimized Markdown.' },
      { title: 'Strip Boilerplate & Compress Whitespace', desc: 'We extract semantic headings, lists, and tables while removing repeated page numbers and DOM noise.' },
      { title: 'See Token Savings & Download .MD', desc: 'View your exact token reduction percentage and download the clean `.md` file.' }
    ],
    features: [
      { title: 'Saves 45% to 65% of Context Tokens', desc: 'Removes redundant formatting overhead so you can fit 2x more documents into Claude or GPT-4o.' },
      { title: 'CSV to Markdown Table Converter', desc: 'Automatically turns spreadsheet data into clean Markdown tables that LLMs reason over accurately.' },
      { title: 'Zero API Keys Required', desc: 'Runs locally using WebAssembly & browser parsers.' }
    ],
    faqs: [
      { q: 'Why do LLMs perform better on Markdown than raw PDFs?', a: 'Raw PDFs scatter text across coordinate boxes with repeating headers and footers. Clean Markdown preserves heading hierarchy (`#`, `##`) and tables while cutting token usage in half.' }
    ]
  },
  {
    id: 'llm-token-calculator',
    title: 'LLM Token Counter, Chunker & Cost Calculator',
    shortDesc: 'Calculate exact token counts & API costs for GPT-4o, Claude 3.7/4, Gemini 2.5 & DeepSeek, plus auto-chunk long texts.',
    seoTitle: 'LLM Token Counter, Context Chunker & API Cost Calculator | AIScrubbers',
    seoDescription: 'Count tokens, estimate API costs across OpenAI GPT-4o/o3, Anthropic Claude, Google Gemini, and DeepSeek, and split large documents into exact token chunks.',
    keywords: [
      'llm token counter online',
      'claude vs gpt4o token cost calculator',
      'split text into token chunks for rag',
      'prompt token estimator'
    ],
    iconName: 'Calculator',
    color: 'from-purple-600 to-indigo-600',
    bgLight: 'bg-purple-50 text-purple-700',
    borderLight: 'border-purple-200',
    href: '/llm-token-calculator',
    category: 'rag',
    inputMode: 'text',
    howToSteps: [
      { title: 'Paste Your Prompt or Document Text', desc: 'Enter any text, codebase snippet, or book chapter.' },
      { title: 'Compare Token Counts & Live API Pricing', desc: 'See exact token estimates and dollar costs across GPT-4o, o3-mini, Claude Sonnet/Opus, Gemini 2.5 Pro/Flash, and DeepSeek R1.' },
      { title: 'Auto-Chunk for RAG or Prompting', desc: 'Split oversized text into clean 2K, 4K, 8K, or 16K token chunks with customizable overlap.' }
    ],
    features: [
      { title: 'Multi-Model Cost Matrix', desc: 'Compare input and output API costs side-by-side for 1, 100, or 10,000 API calls.' },
      { title: 'Smart Semantic Text Chunker', desc: 'Splits huge texts on paragraph boundaries so sentences are never cut in half.' },
      { title: 'Context Window Fill Bar', desc: 'Visualizes how much of 128K, 200K, or 1M context windows your prompt consumes.' }
    ],
    faqs: [
      { q: 'How many words is 1,000 LLM tokens?', a: 'In standard English prose, 1,000 tokens is approximately 750 words (or ~4,000 characters). Source code and JSON use slightly more tokens per word due to punctuation.' }
    ]
  },

  // ==========================================
  // CATEGORY 4: GEO (AI SEARCH SEO) & AI DEV UTILITIES
  // ==========================================
  {
    id: 'llms-txt-generator',
    title: 'llms.txt & llms-full.txt Generator',
    shortDesc: 'Generate official llmstxt.org compliant llms.txt files so ChatGPT Search, Perplexity & Claude cite your website.',
    seoTitle: 'Free llms.txt Generator & Validator for AI Search SEO (GEO) | AIScrubbers',
    seoDescription: 'Create a standard-compliant llms.txt and llms-full.txt file for your website, Shopify store, or SaaS docs so ChatGPT Search, Perplexity, and Claude index and cite you.',
    keywords: [
      'llms.txt generator',
      'how to create llms.txt file',
      'llms.txt validator online',
      'generative engine optimization geo tool',
      'rank on chatgpt search perplexity'
    ],
    iconName: 'Bot',
    color: 'from-teal-600 to-emerald-600',
    bgLight: 'bg-teal-50 text-teal-700',
    borderLight: 'border-teal-200',
    href: '/llms-txt-generator',
    category: 'geo',
    inputMode: 'builder',
    howToSteps: [
      { title: 'Enter Your Brand Details or Paste Sitemap URLs', desc: 'Provide your website name, core value proposition, and key pages (or paste URLs from your sitemap.xml).' },
      { title: 'Auto-Format to Official llmstxt.org Spec', desc: 'Our builder structures your H1 title, blockquote summary, categorized Markdown links, and AI citation rules.' },
      { title: 'Download llms.txt for Your /public Folder', desc: 'Place `llms.txt` in your root domain (`yourdomain.com/llms.txt`) for instant AI crawler discovery.' }
    ],
    features: [
      { title: '100% Compliant with llmstxt.org Spec', desc: 'Follows the exact H1 + Blockquote + H2 Link List syntax expected by Anthropic, Perplexity, and Cursor.' },
      { title: 'Sitemap XML to llms.txt Importer', desc: 'Paste raw `<loc>` tags from your `sitemap.xml` and convert them into human-readable Markdown links automatically.' },
      { title: 'Built-In Spec Validator', desc: 'Verifies heading order and link syntax before you deploy.' }
    ],
    faqs: [
      { q: 'What is an llms.txt file and why does my website need one in 2026?', a: 'Just like `sitemap.xml` tells Google where your pages are, `llms.txt` is a concise Markdown file at `/llms.txt` that tells AI search engines (ChatGPT Search, Perplexity, Claude, Gemini) what your business does and which pages to cite.' }
    ]
  },
  {
    id: 'ai-robots-txt-generator',
    title: 'AI Crawler robots.txt Configurator',
    shortDesc: 'Allow AI Search bots (OAI-SearchBot, PerplexityBot) for free traffic while blocking model training scrapers (CCBot, Bytespider).',
    seoTitle: 'AI robots.txt Generator — Control GPTBot, ClaudeBot & OAI-SearchBot | AIScrubbers',
    seoDescription: 'Generate a precision robots.txt file for AI crawlers. Allow OAI-SearchBot and PerplexityBot for AI search citations while blocking CCBot and training scrapers.',
    keywords: [
      'ai robots.txt generator',
      'allow oai-searchbot block gptbot',
      'block ai scrapers robots.txt',
      'perplexitybot claudebot robots txt'
    ],
    iconName: 'ShieldCheck',
    color: 'from-slate-700 to-slate-900',
    bgLight: 'bg-slate-100 text-slate-800',
    borderLight: 'border-slate-300',
    href: '/ai-robots-txt-generator',
    category: 'geo',
    inputMode: 'builder',
    howToSteps: [
      { title: 'Choose Your AI Traffic vs. Training Strategy', desc: 'Select from presets like "Maximum AI Search Traffic (Allow Search, Block Scrapers)" or customize each bot.' },
      { title: 'Set Sitemap & llms.txt Directives', desc: 'Enter your domain so crawlers find both your XML sitemap and `llms.txt`.' },
      { title: 'Copy or Download robots.txt', desc: 'Deploy to your website root in seconds.' }
    ],
    features: [
      { title: 'Separates AI Search Bots from Training Bots', desc: 'Knows the crucial difference between `OAI-SearchBot` (brings live ChatGPT Search clicks!) and `GPTBot` / `CCBot` (scrapes for training).' },
      { title: 'Covers 15+ Modern AI User-Agents', desc: 'Includes OpenAI, Anthropic, Perplexity, Google-Extended, Applebot-Extended, Meta-ExternalAgent, Cohere, and Bytespider.' },
      { title: '1-Click Preset Profiles', desc: 'Switch between Publisher Protection, Full GEO Growth, or Strict Lockdown.' }
    ],
    faqs: [
      { q: 'If I block GPTBot, will I disappear from ChatGPT Search?', a: 'OpenAI uses two separate user-agents: `OAI-SearchBot` is used to surface and link websites in ChatGPT Search results, while `GPTBot` crawls content to train future foundation models. Our tool lets you allow `OAI-SearchBot` while blocking `GPTBot`!' }
    ]
  },
  {
    id: 'jsonl-dataset-converter',
    title: 'CSV / JSON to AI Fine-Tuning (.jsonl) Builder',
    shortDesc: 'Convert CSV spreadsheets or JSON arrays into validated OpenAI & Anthropic chat fine-tuning .jsonl datasets.',
    seoTitle: 'CSV & JSON to JSONL Converter & OpenAI Fine-Tuning Validator | AIScrubbers',
    seoDescription: 'Convert CSV spreadsheets and JSON files into validated OpenAI and Claude fine-tuning JSONL datasets (`messages` format) locally in your browser.',
    keywords: [
      'csv to jsonl converter online',
      'openai fine tuning jsonl generator',
      'jsonl dataset validator browser',
      'convert excel csv to chatgpt jsonl'
    ],
    iconName: 'Database',
    color: 'from-orange-600 to-amber-600',
    bgLight: 'bg-orange-50 text-orange-700',
    borderLight: 'border-orange-200',
    href: '/jsonl-dataset-converter',
    category: 'geo',
    inputMode: 'text',
    howToSteps: [
      { title: 'Paste CSV Data or Upload a Spreadsheet', desc: 'Provide two columns (prompt, completion) or three columns (system, user, assistant).' },
      { title: 'Auto-Validate ChatML JSONL Schema', desc: 'AIScrubbers converts every row into a strict single-line JSON object with `messages: [{role, content}]` and checks for syntax errors.' },
      { title: 'Download Ready-to-Train .jsonl File', desc: 'Upload directly to OpenAI Fine-Tuning, Together AI, Fireworks, or Vertex AI.' }
    ],
    features: [
      { title: 'OpenAI ChatML & Raw Completion Formats', desc: 'Supports both modern `messages` arrays and `prompt/completion` pairs.' },
      { title: 'Built-In Linter & Token Estimator', desc: 'Verifies that every line is valid JSON and meets OpenAI’s minimum 10-example requirement.' },
      { title: '100% Local Data Security', desc: 'Proprietary training datasets never leave your browser.' }
    ],
    faqs: [
      { q: 'Why does OpenAI reject my JSONL file during fine-tuning upload?', a: 'The most common errors are trailing commas, multi-line JSON objects, missing `assistant` roles, or unescaped quotes. Our converter guarantees strict single-line RFC 8259 JSONL compliance.' }
    ]
  },
  {
    id: 'mcp-config-generator',
    title: 'MCP Server Config (mcp.json) Builder',
    shortDesc: 'Visual generator & syntax validator for Claude Desktop, Cursor & Antigravity Model Context Protocol (mcp.json) configs.',
    seoTitle: 'MCP Config Generator & Validator (claude_desktop_config.json / Cursor) | AIScrubbers',
    seoDescription: 'Build and validate Model Context Protocol (mcp.json / claude_desktop_config.json) server configurations for Claude Desktop, Cursor, and Windsurf without JSON syntax errors.',
    keywords: [
      'mcp.json generator',
      'claude_desktop_config.json builder',
      'cursor mcp config validator',
      'model context protocol config tool'
    ],
    iconName: 'Cpu',
    color: 'from-blue-700 to-cyan-600',
    bgLight: 'bg-blue-50 text-blue-700',
    borderLight: 'border-blue-200',
    href: '/mcp-config-generator',
    category: 'geo',
    inputMode: 'builder',
    howToSteps: [
      { title: 'Select Popular MCP Servers or Add Custom', desc: 'Toggle pre-configured MCP servers (Filesystem, GitHub, Postgres, Brave Search, Memory, Puppeteer, Slack) or add your own `npx`/`uvx` command.' },
      { title: 'Configure OS Path & Environment Keys', desc: 'Automatically formats Windows (`npx.cmd` / escaped backslashes) vs. macOS/Linux paths so Claude Desktop never fails to spawn.' },
      { title: 'Copy or Download Validated mcp.json', desc: 'Paste directly into `claude_desktop_config.json` or `.cursor/mcp.json`.' }
    ],
    features: [
      { title: 'Fixes Windows npx.cmd & Path Escaping Bugs', desc: 'Solves the #1 error Windows users face (`spawn npx ENOENT`) by generating OS-accurate command strings.' },
      { title: '1-Click Prebuilt MCP Catalog', desc: 'Includes official `@modelcontextprotocol` servers ready to toggle on.' },
      { title: 'Live JSON Schema Validator', desc: 'Prevents trailing commas and broken env blocks.' }
    ],
    faqs: [
      { q: 'Why does Claude Desktop say "Server disconnected" or "spawn npx ENOENT" on Windows?', a: 'On Windows, GUI apps like Claude Desktop often cannot resolve bare `npx` or unescaped `C:\\Users\\...` paths. Our builder formats Windows paths with forward slashes or properly escaped backslashes and `npx.cmd`.' }
    ]
  }
];

export interface SpecializedSolution {
  slug: string;
  baseToolId: string;
  presetConfig?: Record<string, any>;
  badge: string;
  h1: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  portalSpecs: {
    portalName: string;
    maxSize: string;
    format: string;
    rule: string;
  };
  whyItFails: string;
  stepByStep: { title: string; desc: string }[];
  proTips: string[];
  faqs: ToolFAQ[];
}

export const SPECIALIZED_SOLUTIONS: SpecializedSolution[] = [
  {
    slug: 'remove-c2pa-for-linkedin-instagram',
    baseToolId: 'c2pa-remover',
    badge: 'SOCIAL MEDIA COMPLIANCE',
    h1: 'Remove "Made with AI" C2PA Label for LinkedIn, Instagram & TikTok',
    subtitle: 'Strip hidden C2PA Content Credentials, JUMBF boxes, and Adobe Firefly / OpenAI XMP tags so social platforms don’t slap an AI badge on your brand graphics.',
    seoTitle: 'Remove "Made with AI" Label on LinkedIn & Instagram (C2PA Stripper) | AIScrubbers',
    seoDescription: 'Stop LinkedIn, Instagram, Facebook, and TikTok from auto-labeling your edited photos as "Made with AI". Strip C2PA Content Credentials and IPTC AI tags 100% locally.',
    keywords: [
      'remove made with ai label instagram',
      'linkedin c2pa ai info badge remove',
      'strip content credentials photoshop generative fill',
      'remove c2pa metadata for tiktok'
    ],
    portalSpecs: {
      portalName: 'LinkedIn / Meta / TikTok',
      maxSize: 'Zero C2PA / JUMBF Chunks',
      format: 'Clean JPG / PNG / WebP',
      rule: 'No c2pa:manifest or trainedAlgorithmicMedia IPTC tags'
    },
    whyItFails: 'Even if you take a real camera photo and use Photoshop Generative Fill to remove a small blemish in the corner, Adobe embeds a C2PA JUMBF manifest and an IPTC "trainedAlgorithmicMedia" tag. LinkedIn, Instagram, and TikTok parse this binary block on upload and permanently attach an "AI Info / Made with AI" label to your post.',
    stepByStep: [
      { title: 'Drop Your Edited Photo or Graphic', desc: 'Select the JPG, PNG, or WebP file exported from Photoshop, Canva, Midjourney, or DALL-E.' },
      { title: 'Verify & Strip C2PA Provenance Chunks', desc: 'Our local engine scans for JUMBF/C2PA manifests and reconstructs a pure pixel buffer with zero metadata.' },
      { title: 'Upload to LinkedIn, Instagram, or TikTok', desc: 'Post your clean file with zero automated C2PA flags.' }
    ],
    proTips: [
      'Always sanitize images AFTER your final export from Photoshop or Lightroom, as saving again in Adobe apps will re-inject Content Credentials.',
      'Use our C2PA Inspector tool if you want to verify the file shows "0 AI Tags" before posting.'
    ],
    faqs: [
      { q: 'Why did Instagram put "AI Info" on my real photography?', a: 'Using any AI-powered healing brush, sky replacement, or generative expand in modern photo editors embeds a C2PA Content Credential tag into the exported JPEG/PNG header.' },
      { q: 'Does stripping C2PA metadata affect image sharpness on Instagram?', a: 'Not at all. Your exact pixel dimensions and color accuracy remain 100% preserved.' }
    ]
  },
  {
    slug: 'prepare-ai-images-for-amazon-kdp',
    baseToolId: 'ai-image-normalizer',
    badge: 'AMAZON KDP PUBLISHING',
    h1: 'Prepare AI Book Covers & Illustrations for Amazon KDP (300 DPI + Clean Metadata)',
    subtitle: 'Convert 72 DPI Midjourney, DALL-E, and Flux artwork into true 300 DPI print-ready files while stripping hidden C2PA & generator chunks.',
    seoTitle: 'Convert AI Art to 300 DPI for Amazon KDP & Strip AI Metadata | AIScrubbers',
    seoDescription: 'Fix Amazon KDP "Low DPI" rejections for Midjourney and DALL-E illustrations. Convert 72 DPI images to binary 300 DPI and strip hidden AI metadata in 1 click.',
    keywords: [
      'midjourney to amazon kdp 300 dpi',
      'fix low dpi error amazon kdp cover',
      'clean ai metadata for kdp publishing',
      'convert 72 dpi ai art to 300 dpi'
    ],
    portalSpecs: {
      portalName: 'Amazon KDP Print Previewer',
      maxSize: '300 DPI Binary Density',
      format: '300 DPI sRGB JPG / PNG',
      rule: 'Minimum 300 DPI JFIF/pHYs header + clean metadata'
    },
    whyItFails: 'Midjourney, DALL-E 3, and Flux export images with a 72 DPI header by default, and embed generator strings inside PNG chunks. When you upload to Amazon KDP Print Previewer or IngramSpark, the portal reads the 72 DPI header and triggers a quality warning.',
    stepByStep: [
      { title: 'Upload Your AI Cover or Interior Illustrations', desc: 'Select one or multiple 72 DPI images generated in Midjourney, DALL-E, or Stable Diffusion.' },
      { title: 'Inject 300 DPI Density & Scrub Metadata', desc: 'AIScrubbers writes exact 300 DPI binary headers (11,811 pixels/meter) and removes all C2PA/tEXt chunks.' },
      { title: 'Download KDP-Ready 300 DPI Files', desc: 'Insert into your KDP manuscript or cover template with zero DPI warnings.' }
    ],
    proTips: [
      'For an 8.5" x 11" full-bleed KDP page at 300 DPI, ensure your upscaled image is at least 2588 x 3338 pixels before normalizing DPI.',
      'Need to combine your finished KDP pages into a single print PDF? Use our sister platform PDFArenaArc.com!'
    ],
    faqs: [
      { q: 'Does changing 72 DPI to 300 DPI change the pixel dimensions?', a: 'No—it updates the physical print density metadata (JFIF/pHYs) from 72 dots per inch to 300 dots per inch so publishing portals recognize the file as print-grade.' }
    ]
  },
  {
    slug: 'clean-ai-art-metadata-for-etsy',
    baseToolId: 'c2pa-remover',
    badge: 'ETSY DIGITAL SELLERS',
    h1: 'Clean Midjourney, DALL-E & ComfyUI Metadata for Etsy Digital Downloads',
    subtitle: 'Remove embedded prompt text, ComfyUI workflow graphs, C2PA tags, and software signatures before delivering digital prints to buyers.',
    seoTitle: 'Strip Midjourney & ComfyUI Prompt Metadata for Etsy Sellers | AIScrubbers',
    seoDescription: 'Protect your secret prompts and workflows! Strip embedded PNG tEXt prompts, ComfyUI JSON graphs, and C2PA metadata from digital art before uploading to Etsy.',
    keywords: [
      'remove midjourney prompt from png metadata',
      'strip comfyui workflow from png',
      'clean ai art metadata for etsy sellers',
      'batch remove png text chunks'
    ],
    portalSpecs: {
      portalName: 'Etsy Digital Downloads',
      maxSize: '20 MB per file limit',
      format: 'Clean 300 DPI JPG / PNG',
      rule: 'Zero embedded prompt/workflow chunks (tEXt / iTXt / EXIF)'
    },
    whyItFails: 'PNG files generated by Midjourney, Stable Diffusion (A1111/Forge), and ComfyUI secretly store your entire prompt, seed, LoRA names, and node workflow inside uncompressed PNG `tEXt` and `iTXt` chunks. Any buyer or competitor who downloads your PNG can drag it into an inspector and steal your exact prompt!',
    stepByStep: [
      { title: 'Select Your Digital Printable Files', desc: 'Drop up to 20 PNG, JPG, or WebP artwork files at once.' },
      { title: 'Eradicate Hidden Prompt & Workflow Chunks', desc: 'Our local scrubber strips all PNG `tEXt`, `iTXt`, `zTXt`, EXIF, and C2PA chunks.' },
      { title: 'Download Clean Customer-Ready ZIP', desc: 'Upload to your Etsy listing knowing your proprietary prompts and workflows are 100% protected.' }
    ],
    proTips: [
      'Always run a quick check with our C2PA & Provenance Inspector on your raw ComfyUI or Midjourney PNGs—you will be shocked at how much prompt data is hidden inside!'
    ],
    faqs: [
      { q: 'Do Midjourney and ComfyUI really embed my exact prompt inside the PNG file?', a: 'Yes! By default, ComfyUI embeds the entire JSON node graph and prompt text inside the PNG header, and Midjourney embeds the prompt description and job ID.' }
    ]
  },
  {
    slug: 'bypass-notebooklm-50-source-limit',
    baseToolId: 'notebooklm-file-merger',
    badge: 'GOOGLE NOTEBOOKLM HACK',
    h1: 'How to Bypass Google NotebookLM’s 50-Source Limit (Combine 100+ Files into 1)',
    subtitle: 'Merge dozens of PDFs, Word docs, lecture notes, and Markdown files into a single XML-indexed Master Source that uses only 1 NotebookLM slot.',
    seoTitle: 'Bypass Google NotebookLM 50 Source Limit — Merge 100+ Files Free | AIScrubbers',
    seoDescription: 'Hit the 50-source limit in Google NotebookLM? Combine 100+ PDFs, DOCX, Markdown, and TXT files into 1 structured Master File (up to 500,000 words per source) locally.',
    keywords: [
      'bypass notebooklm 50 source limit',
      'combine pdfs for notebooklm',
      'notebooklm more than 50 sources workaround',
      'merge markdown files for notebooklm'
    ],
    portalSpecs: {
      portalName: 'Google NotebookLM',
      maxSize: '500,000 Words / 200 MB per Source',
      format: 'Master .MD, .TXT, or .PDF',
      rule: 'Max 50 sources per notebook (Combine files to fit 1,000+ docs!)'
    },
    whyItFails: 'Google NotebookLM caps standard notebooks at 50 sources, even though each individual source can hold up to 500,000 words! When researchers, students, or lawyers upload 50 short 3-page PDFs or Markdown notes, they run out of slots despite using less than 5% of NotebookLM’s true capacity.',
    stepByStep: [
      { title: 'Drop 10 to 100+ Small PDFs, Word Docs, or Notes', desc: 'Select all your research papers, lecture slides, or Markdown notes in one batch.' },
      { title: 'Compile Indexed Master Source File', desc: 'AIScrubbers extracts the text and wraps every document in clear `<document index="1" source="filename">` headers.' },
      { title: 'Upload 1 File to NotebookLM', desc: 'Upload the combined file as a single source in NotebookLM—freeing up 49 source slots!' }
    ],
    proTips: [
      'Because each merged file has a clear `=== DOCUMENT: filename ===` header, you can still ask NotebookLM: "What did Lecture_04.pdf say?" and get pinpoint citations!'
    ],
    faqs: [
      { q: 'How many words can a single combined source hold in NotebookLM?', a: 'Google NotebookLM allows up to 500,000 words (or 200 MB) per single uploaded source. Our tool shows you the exact word count of your combined file before you download.' }
    ]
  },
  {
    slug: 'combine-files-for-claude-projects',
    baseToolId: 'notebooklm-file-merger',
    badge: 'CLAUDE & CHATGPT CONTEXT',
    h1: 'Combine Code & Documents into XML-Tagged Context for Claude Projects',
    subtitle: 'Bundle entire repositories, docs, and PDFs into Anthropic’s recommended <documents> XML structure to bypass the 20-file attachment cap.',
    seoTitle: 'Combine Files into XML Context for Claude Projects & ChatGPT | AIScrubbers',
    seoDescription: 'Bypass the 20-file upload limit in Claude messages and ChatGPT. Merge code files, Markdown, and PDFs into Anthropic-recommended <document> XML blocks locally.',
    keywords: [
      'combine files for claude projects',
      'bypass claude 20 file upload limit',
      'anthropic xml document tag generator',
      'bundle codebase into single file for llm'
    ],
    portalSpecs: {
      portalName: 'Anthropic Claude / ChatGPT',
      maxSize: '200K Tokens Context Window',
      format: 'XML-Tagged .MD or .TXT',
      rule: 'Max 20 files per chat attachment (Solved via 1 XML bundle)'
    },
    whyItFails: 'Claude and ChatGPT restrict each chat message to 10–20 attached files. If you want an LLM to review 45 TypeScript/Python files or 30 contract exhibits, uploading them individually fails immediately.',
    stepByStep: [
      { title: 'Select Your Codebase Files or Documents', desc: 'Drop `.ts`, `.js`, `.py`, `.md`, `.json`, `.pdf`, or `.docx` files.' },
      { title: 'Format with Anthropic <documents> XML Schema', desc: 'Our bundler wraps each file in `<document index="n"><source>filename</source><document_content>...</document_content></document>`.' },
      { title: 'Attach 1 Master File to Claude or ChatGPT', desc: 'Get superior multi-file reasoning while using only 1 attachment slot.' }
    ],
    proTips: [
      'Anthropic’s official prompt engineering documentation specifically recommends wrapping multi-document context in `<documents>` and `<document_content>` XML tags for highest recall.'
    ],
    faqs: [
      { q: 'Why does Claude perform better with XML tags than random file uploads?', a: 'Claude models are explicitly trained to recognize `<documents>`, `<source>`, and `<document_content>` tags, preventing context bleeding between separate files.' }
    ]
  },
  {
    slug: 'clean-chatgpt-text-for-turnitin-ats',
    baseToolId: 'chatgpt-watermark-remover',
    badge: 'ATS & PORTAL SANITIZER',
    h1: 'Remove Invisible ChatGPT Unicode Watermarks for Job ATS & Academic Portals',
    subtitle: 'Scan and strip hidden zero-width characters (U+200B), narrow no-break spaces (U+202F), and robotic em-dash patterns before submitting resumes or essays.',
    seoTitle: 'Clean ChatGPT Invisible Characters for Job ATS & Portals | AIScrubbers',
    seoDescription: 'Remove hidden zero-width Unicode characters (U+200B, U+202F, U+FEFF), curly quotes, and AI em-dash patterns that break Workday/Greenhouse ATS parsers.',
    keywords: [
      'clean chatgpt text for ats resume',
      'remove zero width spaces chatgpt',
      'fix workday greenhouse resume unicode characters',
      'strip hidden ai watermarks text'
    ],
    portalSpecs: {
      portalName: 'Workday / Greenhouse / iCIMS / Portals',
      maxSize: 'Standard UTF-8 / ASCII Keyboard Characters',
      format: 'Zero Hidden Control Bytes',
      rule: 'No U+200B, U+202F, U+FEFF, or non-standard ligatures'
    },
    whyItFails: 'When job seekers or students polish their writing in ChatGPT or Claude and copy-paste it into resumes or submission portals, hidden narrow no-break spaces (`U+202F`) and zero-width characters (`U+200B`) get pasted along with it—causing legacy ATS parsers (like Workday and Taleo) to garble keywords or flag the submission.',
    stepByStep: [
      { title: 'Paste Your Resume Bullet Points or Draft', desc: 'Drop your text into the local forensic Unicode scanner.' },
      { title: 'Review & Strip Hidden Non-Keyboard Bytes', desc: 'See every invisible character highlighted and removed automatically.' },
      { title: 'Copy Clean Standard Keyboard Text', desc: 'Paste safely into your resume, cover letter, or online application portal.' }
    ],
    proTips: [
      'After sanitizing your resume text here, use our sister site PDFArenaArc.com to export or compress your final PDF resume under 200KB for Workday portals!'
    ],
    faqs: [
      { q: 'Can invisible Unicode characters really break ATS keyword matching?', a: 'Yes! If a zero-width space (`U+200B`) sits inside a skill keyword like `React\u200B.js`, older ATS regex matchers fail to match the word `React.js`.' }
    ]
  },
  {
    slug: 'hipaa-gdpr-chatgpt-prompt-redactor',
    baseToolId: 'prompt-pii-redactor',
    badge: 'HEALTHCARE, LEGAL & ENTERPRISE',
    h1: '100% Client-Side HIPAA & GDPR Prompt Scrubber for ChatGPT & Claude',
    subtitle: 'Redact patient names, client emails, SSNs, phone numbers, and secret API keys in your browser before pasting into public LLMs.',
    seoTitle: 'HIPAA & GDPR ChatGPT Prompt Redactor — Anonymize PII Locally | AIScrubbers',
    seoDescription: 'Prevent corporate data leaks when using ChatGPT or Claude. Automatically anonymize patient/client names, emails, SSNs, phones, and API keys 100% in your browser.',
    keywords: [
      'hipaa compliant chatgpt prompt scrubber',
      'gdpr anonymize text before llm',
      'redact client names for chatgpt legal',
      'remove api keys before pasting to claude'
    ],
    portalSpecs: {
      portalName: 'HIPAA Safe Harbor / GDPR Art. 4',
      maxSize: 'Zero Cloud Transmission',
      format: 'Reversible Tokenized Prompt ([PERSON_1], [SSN_1])',
      rule: 'All 18 HIPAA identifiers / PII removed prior to external LLM call'
    },
    whyItFails: 'Pasting unredacted client contracts, medical notes, financial statements, or `.env` code into consumer ChatGPT or Claude violates HIPAA, GDPR, and corporate NDAs because the raw prompt leaves your network.',
    stepByStep: [
      { title: 'Paste Confidential Notes, Contract, or Code', desc: 'Enter your raw text locally—zero network requests are made.' },
      { title: 'Auto-Scrub PII into Reversible Tokens', desc: 'Names, emails, SSNs, phones, and keys become `[EMAIL_1]`, `[SSN_1]`, `[SECRET_1]`.' },
      { title: 'Prompt the AI & Restore Locally', desc: 'Send the anonymized prompt to any LLM, then paste its response back here to restore the real names in 1 click.' }
    ],
    proTips: [
      'You can add custom client or patient names in the Custom Words box to ensure proprietary company names are also tokenized as `[CUSTOM_1]`.'
    ],
    faqs: [
      { q: 'How can I verify that this page sends zero network traffic?', a: 'Open Chrome DevTools (F12) -> Network tab, or turn off your Wi-Fi completely after loading the page. The PII scrubber and restorer work 100% offline!' }
    ]
  },
  {
    slug: 'convert-chatgpt-conversations-json-to-pdf',
    baseToolId: 'chatgpt-export-converter',
    badge: 'OPENAI DATA EXPORT',
    h1: 'Convert OpenAI ChatGPT `conversations.json` Export to Readable PDF & Markdown',
    subtitle: 'Turn the unreadable giant `conversations.json` file from your OpenAI data export into a clean, searchable PDF book or Markdown archive.',
    seoTitle: 'Convert ChatGPT conversations.json to PDF & Markdown Free | AIScrubbers',
    seoDescription: 'Downloaded your ChatGPT data export and cant open conversations.json? View, search, and convert your entire ChatGPT history into clean PDF or Markdown locally.',
    keywords: [
      'convert conversations.json to pdf',
      'how to read chatgpt data export json',
      'chatgpt backup to obsidian markdown',
      'openai export zip viewer online'
    ],
    portalSpecs: {
      portalName: 'OpenAI Data Export Archive',
      maxSize: 'Supports 100MB+ conversations.json',
      format: 'Searchable PDF & Clean Markdown (.md)',
      rule: '100% Local Browser Parsing (Zero Upload)'
    },
    whyItFails: 'When you request a data export from OpenAI, they email you a `.zip` containing `conversations.json`—a massive, unformatted JSON tree with thousands of nested node IDs that crashes Notepad and cannot be read by humans.',
    stepByStep: [
      { title: 'Drop Your conversations.json or OpenAI .ZIP File', desc: 'Select the file directly from your Downloads folder.' },
      { title: 'Filter or Select Conversations', desc: 'Search across all your past prompts and responses instantly.' },
      { title: 'Download PDF Book or Markdown Archive', desc: 'Save a formatted PDF for archiving or `.md` files for Notion, Obsidian, or NotebookLM.' }
    ],
    proTips: [
      'Exporting your best ChatGPT threads to Markdown lets you upload them into Google NotebookLM or Claude Projects as permanent personal knowledge!'
    ],
    faqs: [
      { q: 'Is it safe to load my private ChatGPT history here?', a: 'Yes—100% of the JSON parsing and PDF/Markdown generation happens inside your own browser tab using client-side JavaScript.' }
    ]
  },
  {
    slug: 'llms-txt-generator-for-shopify-nextjs',
    baseToolId: 'llms-txt-generator',
    badge: 'AI SEARCH SEO (GEO)',
    h1: 'Free `llms.txt` Generator for Shopify, WordPress, Next.js & SaaS Websites',
    subtitle: 'Get your store or SaaS cited by ChatGPT Search, Perplexity, Claude, and Google AI Overviews with a compliant `/llms.txt` file.',
    seoTitle: 'llms.txt Generator for Shopify, WordPress & Next.js (Rank in ChatGPT) | AIScrubbers',
    seoDescription: 'Generate a compliant llms.txt file for Shopify, WordPress, or Next.js websites in 60 seconds. Help ChatGPT Search, Perplexity, and Claude recommend your products.',
    keywords: [
      'llms.txt generator shopify',
      'wordpress llms.txt creator free',
      'nextjs llms.txt seo',
      'how to rank on perplexity and chatgpt search'
    ],
    portalSpecs: {
      portalName: 'llmstxt.org / AI Search Crawlers',
      maxSize: 'Clean UTF-8 Markdown (<100KB)',
      format: '/llms.txt & /llms-full.txt',
      rule: 'H1 Brand Name + > Summary Blockquote + H2 Markdown Link Lists'
    },
    whyItFails: 'Traditional HTML pages are packed with hundreds of kilobytes of JavaScript bundles, navigation menus, and CSS classes. AI search engines like Perplexity, ChatGPT Search, and Claude look for a clean `/llms.txt` file to quickly understand your product catalog, pricing, and documentation.',
    stepByStep: [
      { title: 'Enter Your Store/SaaS Summary & Key URLs', desc: 'Add your brand name, 1-sentence elevator pitch, and paste your top product/doc URLs (or sitemap XML).' },
      { title: 'Generate Standard llmstxt.org Markdown', desc: 'Preview the validated `llms.txt` structure in real time.' },
      { title: 'Publish to Your Root Domain', desc: 'Drop `llms.txt` into your Next.js `/public` folder, WordPress root, or Shopify theme assets.' }
    ],
    proTips: [
      'Pair your new `/llms.txt` file with our AI Crawler `robots.txt` Configurator to explicitly allow `OAI-SearchBot` and `PerplexityBot`!'
    ],
    faqs: [
      { q: 'Where do I put llms.txt in a Next.js or React app?', a: 'Simply place the downloaded `llms.txt` file inside your project’s `public/` directory (`public/llms.txt`) so it is served at `https://yourdomain.com/llms.txt`.' }
    ]
  }
];
