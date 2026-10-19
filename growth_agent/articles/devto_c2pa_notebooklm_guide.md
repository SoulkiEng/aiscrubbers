---
title: How We Built a 100% Client-Side C2PA Metadata Scrubber, Invisible Unicode Cleaner & NotebookLM Bundler in the Browser
published: true
tags: ai, webdev, javascript, opensource
---

As AI workflows matured in 2026, three technical bottlenecks hit developers, creators, and enterprise teams simultaneously:

1. **Binary C2PA & JUMBF Provenance Flags**: Even minor edits using Photoshop Generative Fill or Lightroom AI Denoise embed a cryptographic `urn:c2pa` JUMBF box and IPTC `trainedAlgorithmicMedia` tag—causing LinkedIn, Instagram, and TikTok to slap an automatic *"Made with AI"* badge on brand assets.
2. **Hidden Zero-Width Unicode Characters (`U+200B`, `U+202F`)**: Copying text from LLM chat interfaces injects narrow no-break spaces and zero-width joiners that break legacy ATS parsers (like Workday and Greenhouse).
3. **The 50-Source Limit in Google NotebookLM & 20-File Cap in Claude**: Even though a single NotebookLM source accepts up to **500,000 words**, uploading 50 short 3-page PDFs or Markdown files exhausts all 50 slots immediately.

To solve all three without ever uploading private files or confidential prompts to a cloud server, we built **[AIScrubbers.com](https://aiscrubbers.com/)** — a 100% client-side browser utility suite.

---

## 1. Parsing JPEG `APP11` JUMBF & PNG `tEXt`/`iTXt`/`caBX` Chunks in Pure JS

In PNG files, Stable Diffusion, ComfyUI, and Midjourney store entire prompt graphs inside uncompressed `tEXt` and `iTXt` chunks, while C2PA manifests reside inside `caBX` or `jumb` containers.

Our **[C2PA & AI Provenance Inspector](https://aiscrubbers.com/c2pa-viewer/)** reads the file's `ArrayBuffer` locally in browser RAM, parses chunk headers, and flags any C2PA or generator signatures. Then, our **[C2PA Metadata Remover](https://aiscrubbers.com/c2pa-remover/)** reconstructs a clean pixel buffer via HTML5 Canvas—and for print creators on Amazon KDP or Etsy, our **[300 DPI Print Normalizer](https://aiscrubbers.com/prepare-ai-images-for-amazon-kdp/)** injects an IEEE 802.3 CRC32-verified `pHYs` chunk (`11811` pixels/meter = `300 DPI`).

---

## 2. Bypassing Google NotebookLM's 50-Source Cap with XML Context Bundling

Anthropic's prompt engineering guide recommends wrapping multi-document context in structured `<documents>` and `<document index="n"><source>filename</source>` tags.

Using our **[NotebookLM & Claude 100+ File Merger](https://aiscrubbers.com/bypass-notebooklm-50-source-limit/)**, you can drop 100+ PDFs, `.docx` files, CSVs, and code files into your browser and compile a single indexed Master Markdown or PDF file—turning 100 files into **1 source slot** while keeping pinpoint source citations intact.

---

## 3. Reversible Client-Side PII Redaction & `llms.txt` Generation

* **[Prompt Privacy Scrubber (PII Redactor)](https://aiscrubbers.com/prompt-pii-redactor/)**: Tokenizes emails, SSNs, phones, and API keys (`[EMAIL_1]`, `[API_KEY_1]`) locally in browser RAM before you paste into ChatGPT, and restores the real values into the AI's reply in 1 click.
* **[ChatGPT Invisible Watermark Cleaner](https://aiscrubbers.com/chatgpt-watermark-remover/)**: Strips `U+200B`, `U+202F`, `U+FEFF`, and curly quotes.
* **[Official `llms.txt` Generator](https://aiscrubbers.com/llms-txt-generator/)** & **[AI Crawler `robots.txt` Configurator](https://aiscrubbers.com/ai-robots-txt-generator/)**: Allow `OAI-SearchBot` and `PerplexityBot` for AI search citations while blocking training scrapers.

Try the full 16-tool suite free (zero signups, zero server uploads) at **[https://aiscrubbers.com](https://aiscrubbers.com/)**.
