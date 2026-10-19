import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

export function downloadTextFile(content: string, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  saveAs(blob, filename);
}

// ============================================================================
// 1. C2PA, JUMBF, EXIF & AI METADATA FORENSIC INSPECTOR
// ============================================================================
export interface MetadataFinding {
  category: 'C2PA / Content Credentials' | 'AI Generator Signature' | 'EXIF / GPS / Device' | 'Embedded Prompt / Workflow';
  key: string;
  value: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ForensicReport {
  fileName: string;
  fileSize: number;
  mimeType: string;
  riskLevel: 'HIGH (Will Trigger Platform "Made with AI" Label)' | 'MEDIUM (Contains Metadata / Device Tags)' | 'CLEAN (0 AI or C2PA Provenance Tags)';
  riskColor: 'red' | 'amber' | 'emerald';
  c2paDetected: boolean;
  aiGeneratorDetected: string | null;
  findings: MetadataFinding[];
}

function readAsciiString(bytes: Uint8Array, maxBytes = 350000): string {
  const len = Math.min(bytes.length, maxBytes);
  let out = '';
  for (let i = 0; i < len; i++) {
    const c = bytes[i];
    if (c >= 32 && c <= 126) {
      out += String.fromCharCode(c);
    } else if (c === 10 || c === 13 || c === 9) {
      out += ' ';
    } else {
      out += ' ';
    }
  }
  return out;
}

function extractPngTextChunks(bytes: Uint8Array): { keyword: string; text: string }[] {
  const chunks: { keyword: string; text: string }[] = [];
  // Check PNG signature
  if (bytes.length < 8 || bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
    return chunks;
  }
  let offset = 8;
  const decoder = new TextDecoder('utf-8', { fatal: false });
  while (offset + 8 <= bytes.length) {
    const length =
      ((bytes[offset] << 24) |
        (bytes[offset + 1] << 16) |
        (bytes[offset + 2] << 8) |
        bytes[offset + 3]) >>>
      0;
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd > bytes.length) break;

    if (type === 'tEXt' || type === 'iTXt') {
      const sub = bytes.subarray(dataStart, Math.min(dataEnd, dataStart + 8000));
      const raw = decoder.decode(sub);
      const nullIdx = raw.indexOf('\0');
      if (nullIdx > 0) {
        const keyword = raw.slice(0, nullIdx).trim();
        const text = raw.slice(nullIdx + 1).replace(/\0+/g, ' ').trim();
        if (keyword || text) {
          chunks.push({ keyword: keyword || type, text: text.slice(0, 600) });
        }
      }
    } else if (type === 'caBX' || type === 'jumb') {
      chunks.push({
        keyword: `Binary ${type} Chunk`,
        text: `Embedded C2PA / JUMBF Provenance Container (${length} bytes)`,
      });
    }
    offset = dataEnd + 4; // skip CRC
    if (type === 'IEND') break;
  }
  return chunks;
}

export async function inspectFileMetadata(file: File): Promise<ForensicReport> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const ascii = readAsciiString(bytes);
  const findings: MetadataFinding[] = [];
  let c2paDetected = false;
  let aiGeneratorDetected: string | null = null;

  // 1. Check PNG chunks if PNG
  const pngChunks = extractPngTextChunks(bytes);
  for (const ch of pngChunks) {
    const lowerKey = ch.keyword.toLowerCase();
    const lowerVal = ch.text.toLowerCase();
    if (lowerKey.includes('cabx') || lowerKey.includes('jumb') || lowerVal.includes('c2pa')) {
      c2paDetected = true;
      findings.push({
        category: 'C2PA / Content Credentials',
        key: ch.keyword,
        value: ch.text,
        severity: 'high',
      });
    } else if (
      lowerKey.includes('parameters') ||
      lowerKey.includes('prompt') ||
      lowerKey.includes('workflow') ||
      lowerVal.includes('steps:') ||
      lowerVal.includes('sampler:') ||
      lowerVal.includes('comfyui') ||
      lowerVal.includes('midjourney')
    ) {
      aiGeneratorDetected = aiGeneratorDetected || 'Stable Diffusion / ComfyUI / Midjourney Prompt Chunk';
      findings.push({
        category: 'Embedded Prompt / Workflow',
        key: `PNG ${ch.keyword}`,
        value: ch.text,
        severity: 'high',
      });
    } else {
      findings.push({
        category: 'EXIF / GPS / Device',
        key: `PNG Chunk (${ch.keyword})`,
        value: ch.text.slice(0, 220),
        severity: 'medium',
      });
    }
  }

  // 2. Scan binary/ASCII markers for C2PA / JUMBF / IPTC AI signatures
  const c2paSignatures = [
    { pattern: /urn:c2pa|c2pa\.assertions|c2pa\.claim|c2pa\.signature/i, label: 'C2PA Cryptographic Claim Manifest (urn:c2pa)' },
    { pattern: /jumb|c2pa/i, label: 'JUMBF / C2PA Binary Box Container' },
    { pattern: /trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia|algorithmicMedia/i, label: 'IPTC DigitalSourceType: trainedAlgorithmicMedia (Triggers Meta/LinkedIn AI Badge)' },
    { pattern: /ContentCredentials|adobe:ns:meta.*c2pa/i, label: 'Adobe Content Credentials Manifest' },
  ];

  for (const sig of c2paSignatures) {
    if (sig.pattern.test(ascii)) {
      c2paDetected = true;
      findings.push({
        category: 'C2PA / Content Credentials',
        key: 'Provenance Flag',
        value: sig.label,
        severity: 'high',
      });
    }
  }

  // 3. Scan for specific AI Generator signatures
  const generatorPatterns = [
    { pattern: /OpenAI|DALL-E|DALL·E|Sora|ChatGPT/i, name: 'OpenAI (DALL-E / Sora / GPT-4o)' },
    { pattern: /Midjourney/i, name: 'Midjourney' },
    { pattern: /Adobe Firefly|Firefly|Generative Fill/i, name: 'Adobe Firefly / Photoshop Generative AI' },
    { pattern: /Stable Diffusion|Automatic1111|ComfyUI|InvokeAI/i, name: 'Stable Diffusion / ComfyUI' },
    { pattern: /Flux\.1|Black Forest Labs/i, name: 'Flux AI' },
    { pattern: /SynthID|Google DeepMind|Imagen/i, name: 'Google Imagen / SynthID Metadata' },
    { pattern: /RunwayML|Kling|Pika|Leonardo\.Ai/i, name: 'AI Creative Suite Metadata' },
  ];

  for (const gen of generatorPatterns) {
    if (gen.pattern.test(ascii)) {
      aiGeneratorDetected = aiGeneratorDetected || gen.name;
      findings.push({
        category: 'AI Generator Signature',
        key: 'Detected Generator',
        value: gen.name,
        severity: 'high',
      });
    }
  }

  // 4. Scan for EXIF / GPS / XMP / Camera metadata
  if (/Exif\s*II|Exif\s*MM|Exif/i.test(ascii)) {
    findings.push({
      category: 'EXIF / GPS / Device',
      key: 'EXIF Header',
      value: 'Present (Contains device/capture attributes)',
      severity: 'medium',
    });
  }
  if (/GPSLatitude|GPSLongitude|GPSInfo|GPSVersionID/i.test(ascii)) {
    findings.push({
      category: 'EXIF / GPS / Device',
      key: 'GPS Location Coordinates',
      value: 'Embedded GPS Latitude/Longitude tags detected',
      severity: 'high',
    });
  }
  if (/http:\/\/ns\.adobe\.com\/xap\/1\.0\/|<x:xmpmeta/i.test(ascii)) {
    findings.push({
      category: 'EXIF / GPS / Device',
      key: 'XMP Packet',
      value: 'Adobe Extensible Metadata Platform (XMP) XML block present',
      severity: 'medium',
    });
  }

  let riskLevel: ForensicReport['riskLevel'] = 'CLEAN (0 AI or C2PA Provenance Tags)';
  let riskColor: ForensicReport['riskColor'] = 'emerald';

  if (c2paDetected || aiGeneratorDetected) {
    riskLevel = 'HIGH (Will Trigger Platform "Made with AI" Label)';
    riskColor = 'red';
  } else if (findings.length > 0) {
    riskLevel = 'MEDIUM (Contains Metadata / Device Tags)';
    riskColor = 'amber';
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    riskLevel,
    riskColor,
    c2paDetected,
    aiGeneratorDetected,
    findings,
  };
}

// ============================================================================
// 2. C2PA / EXIF PIXEL RECONSTRUCTOR + 300 DPI BINARY HEADER INJECTOR
// ============================================================================

// Helper: Compute CRC32 for PNG chunk injection
function crc32(buf: Uint8Array): number {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function injectJpeg300Dpi(jpegBytes: Uint8Array): Uint8Array {
  // Standard JPEG starts with FF D8 FF E0 (JFIF APP0)
  const copy = new Uint8Array(jpegBytes);
  if (
    copy.length > 20 &&
    copy[0] === 0xff &&
    copy[1] === 0xd8 &&
    copy[2] === 0xff &&
    copy[3] === 0xe0 &&
    copy[6] === 0x4a && // 'J'
    copy[7] === 0x46 && // 'F'
    copy[8] === 0x49 && // 'I'
    copy[9] === 0x46    // 'F'
  ) {
    copy[13] = 1; // Density units = 1 (pixels per inch)
    copy[14] = 0x01; // Xdensity high byte (300 = 0x012C)
    copy[15] = 0x2c; // Xdensity low byte
    copy[16] = 0x01; // Ydensity high byte
    copy[17] = 0x2c; // Ydensity low byte
  }
  return copy;
}

function injectPng300Dpi(pngBytes: Uint8Array): Uint8Array {
  // Insert pHYs chunk right after IHDR (offset 33 in standard PNG)
  // 300 DPI = 11811 pixels per meter (0x00002E23)
  if (pngBytes.length < 33) return pngBytes;
  const physChunk = new Uint8Array(21);
  // Length = 9
  physChunk[0] = 0;
  physChunk[1] = 0;
  physChunk[2] = 0;
  physChunk[3] = 9;
  // Type = 'pHYs'
  physChunk[4] = 0x70;
  physChunk[5] = 0x48;
  physChunk[6] = 0x59;
  physChunk[7] = 0x73;
  // X pixels per unit = 11811 (0x00002E23)
  physChunk[8] = 0x00;
  physChunk[9] = 0x00;
  physChunk[10] = 0x2e;
  physChunk[11] = 0x23;
  // Y pixels per unit = 11811
  physChunk[12] = 0x00;
  physChunk[13] = 0x00;
  physChunk[14] = 0x2e;
  physChunk[15] = 0x23;
  // Unit = 1 (meter)
  physChunk[16] = 1;

  const crc = crc32(physChunk.subarray(4, 17));
  physChunk[17] = (crc >>> 24) & 0xff;
  physChunk[18] = (crc >>> 16) & 0xff;
  physChunk[19] = (crc >>> 8) & 0xff;
  physChunk[20] = crc & 0xff;

  const out = new Uint8Array(pngBytes.length + physChunk.length);
  out.set(pngBytes.subarray(0, 33), 0);
  out.set(physChunk, 33);
  out.set(pngBytes.subarray(33), 33 + physChunk.length);
  return out;
}

export async function sanitizeSingleImage(
  file: File,
  options: { inject300Dpi?: boolean; outputFormat?: 'keep' | 'jpeg' | 'png' } = {}
): Promise<{ blob: Blob; cleanName: string; reportBefore: ForensicReport }> {
  const reportBefore = await inspectFileMetadata(file);
  const bitmapUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`Could not decode image: ${file.name}`));
      el.src = bitmapUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Browser HTML5 Canvas context unavailable.');

    const isPng =
      options.outputFormat === 'png' ||
      (options.outputFormat !== 'jpeg' && file.type === 'image/png');
    const targetMime = isPng ? 'image/png' : 'image/jpeg';

    if (!isPng) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const rawBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode clean pixel buffer'))),
        targetMime,
        0.96
      );
    });

    let finalBlob = rawBlob;
    if (options.inject300Dpi) {
      const arr = new Uint8Array(await rawBlob.arrayBuffer());
      const modified = isPng ? injectPng300Dpi(arr) : injectJpeg300Dpi(arr);
      finalBlob = new Blob([modified.buffer as ArrayBuffer], { type: targetMime });
    }

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const ext = isPng ? 'png' : 'jpg';
    const suffix = options.inject300Dpi ? '_300dpi_clean' : '_clean';
    return {
      blob: finalBlob,
      cleanName: `${baseName}${suffix}.${ext}`,
      reportBefore,
    };
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}

export async function sanitizeImageBatch(
  files: File[],
  options: { inject300Dpi?: boolean; outputFormat?: 'keep' | 'jpeg' | 'png' },
  onProgress?: (pct: number) => void
): Promise<{ blob: Blob; filename: string; reports: ForensicReport[] }> {
  const reports: ForensicReport[] = [];
  if (files.length === 1) {
    onProgress?.(35);
    const res = await sanitizeSingleImage(files[0], options);
    reports.push(res.reportBefore);
    onProgress?.(100);
    return { blob: res.blob, filename: res.cleanName, reports };
  }

  const zip = new JSZip();
  for (let i = 0; i < files.length; i++) {
    const res = await sanitizeSingleImage(files[i], options);
    reports.push(res.reportBefore);
    zip.file(res.cleanName, res.blob);
    onProgress?.(Math.round(((i + 1) / files.length) * 90));
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.(100);
  return {
    blob: zipBlob,
    filename: options.inject300Dpi ? 'aiscrubbers_300dpi_batch.zip' : 'aiscrubbers_sanitized_images.zip',
    reports,
  };
}

// ============================================================================
// 3. CHATGPT INVISIBLE WATERMARK & ZERO-WIDTH UNICODE CLEANER
// ============================================================================
export interface WatermarkCleanResult {
  cleanedText: string;
  zeroWidthCount: number;
  nbspCount: number;
  smartQuoteCount: number;
  emDashCount: number;
  totalRemoved: number;
  detectedBreakdown: { label: string; count: number }[];
}

export function cleanInvisibleWatermarks(
  input: string,
  options: { replaceEmDashes?: boolean; normalizeQuotes?: boolean } = {
    replaceEmDashes: true,
    normalizeQuotes: true,
  }
): WatermarkCleanResult {
  const zeroWidthRegex = /[\u200B\u200C\u200D\u2060\uFEFF\u200E\u200F\u00AD\u034F\u061C\u180E]/g;
  const nbspRegex = /[\u00A0\u202F\u2007\u2002\u2003\u2009\u200A]/g;
  const smartDoubleRegex = /[“”„‟«»]/g;
  const smartSingleRegex = /[‘’‚‛‹›]/g;
  const emDashRegex = /—/g;

  const zeroWidthMatches = input.match(zeroWidthRegex) || [];
  const nbspMatches = input.match(nbspRegex) || [];
  const smartQuoteMatches = [
    ...(input.match(smartDoubleRegex) || []),
    ...(input.match(smartSingleRegex) || []),
  ];
  const emDashMatches = input.match(emDashRegex) || [];

  let cleaned = input.replace(zeroWidthRegex, '').replace(nbspRegex, ' ');

  if (options.normalizeQuotes !== false) {
    cleaned = cleaned.replace(smartDoubleRegex, '"').replace(smartSingleRegex, "'");
  }
  if (options.replaceEmDashes !== false) {
    cleaned = cleaned.replace(/\s*—\s*/g, ' - ');
  }

  // Collapse accidental multiple spaces inside lines
  cleaned = cleaned.replace(/[^\S\r\n]{2,}/g, ' ');

  const detectedBreakdown = [
    { label: 'Zero-Width Invisible Marks (U+200B / U+FEFF / U+200D)', count: zeroWidthMatches.length },
    { label: 'Non-Breaking & Narrow AI Spaces (U+202F / U+00A0)', count: nbspMatches.length },
    { label: 'Curly Typographic Smart Quotes (“ ” ‘ ’)', count: smartQuoteMatches.length },
    { label: 'AI Em-Dash Punctuation Spikes (—)', count: emDashMatches.length },
  ];

  const totalRemoved =
    zeroWidthMatches.length +
    nbspMatches.length +
    (options.normalizeQuotes !== false ? smartQuoteMatches.length : 0) +
    (options.replaceEmDashes !== false ? emDashMatches.length : 0);

  return {
    cleanedText: cleaned.trim(),
    zeroWidthCount: zeroWidthMatches.length,
    nbspCount: nbspMatches.length,
    smartQuoteCount: smartQuoteMatches.length,
    emDashCount: emDashMatches.length,
    totalRemoved,
    detectedBreakdown,
  };
}

// ============================================================================
// 4. CHATGPT / CLAUDE MARKDOWN TO CLEAN WORD / DOCS / PDF CONVERTER
// ============================================================================
export function cleanMarkdownForWord(markdown: string): {
  plainText: string;
  cleanHtml: string;
  removedArtifactsCount: number;
} {
  const artifactMatches = markdown.match(/(\*\*|__|###|##|#|```|`|^>\s)/gm) || [];
  const watermarkRes = cleanInvisibleWatermarks(markdown, {
    replaceEmDashes: false,
    normalizeQuotes: true,
  });

  const lines = watermarkRes.cleanedText.split(/\r?\n/);
  const plainLines: string[] = [];
  const htmlLines: string[] = [];
  let inCodeBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      plainLines.push('    ' + line);
      htmlLines.push(
        `<pre style="font-family:Consolas,monospace;background:#f8fafc;padding:8px;border:1px solid #e2e8f0;margin:6px 0;">${escapeHtml(line)}</pre>`
      );
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const level = Math.min(hMatch[1].length, 4);
      const cleanHeading = stripInlineMd(hMatch[2]);
      plainLines.push(cleanHeading.toUpperCase());
      const sizes: Record<number, string> = { 1: '20pt', 2: '16pt', 3: '13.5pt', 4: '12pt' };
      htmlLines.push(
        `<h${level} style="font-family:Calibri,Arial,sans-serif;font-size:${sizes[level]};font-weight:bold;color:#0f172a;margin:14px 0 6px 0;">${formatInlineHtml(hMatch[2])}</h${level}>`
      );
      continue;
    }

    // Bullet points
    const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ulMatch) {
      plainLines.push(`• ${stripInlineMd(ulMatch[1])}`);
      htmlLines.push(
        `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1e293b;margin:4px 0 4px 18px;">• ${formatInlineHtml(ulMatch[1])}</p>`
      );
      continue;
    }

    // Horizontal rule
    if (/^([-*_]){3,}\s*$/.test(line)) {
      plainLines.push('');
      htmlLines.push('<hr style="border:none;border-top:1px solid #cbd5e1;margin:12px 0;" />');
      continue;
    }

    if (!line.trim()) {
      plainLines.push('');
      htmlLines.push('<p style="margin:6px 0;"></p>');
      continue;
    }

    plainLines.push(stripInlineMd(line));
    htmlLines.push(
      `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;color:#1e293b;margin:6px 0;">${formatInlineHtml(line)}</p>`
    );
  }

  return {
    plainText: plainLines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    cleanHtml: `<div style="background:transparent;color:#0f172a;">${htmlLines.join('\n')}</div>`,
    removedArtifactsCount: artifactMatches.length + watermarkRes.totalRemoved,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripInlineMd(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)');
}

function formatInlineHtml(str: string): string {
  return escapeHtml(str)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="font-family:Consolas,monospace;">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#4f46e5;text-decoration:underline;">$1</a>');
}

export async function exportCleanedTextToDocx(plainText: string, filename = 'cleaned_document.docx') {
  const paragraphs = plainText.split(/\r?\n/).map((line) => {
    const isHeader = line.length > 0 && line.length < 80 && line === line.toUpperCase() && /[A-Z]/.test(line);
    return new Paragraph({
      heading: isHeader ? HeadingLevel.HEADING_2 : undefined,
      children: [
        new TextRun({
          text: line,
          bold: isHeader,
          size: isHeader ? 28 : 22,
          font: 'Calibri',
        }),
      ],
      spacing: { after: 140 },
    });
  });

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

export function exportTextToPdf(text: string, title = 'AIScrubbers Export', filename = 'aiscrubbers_document.pdf') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 45;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, margin, 45);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);

  const lines = doc.splitTextToSize(text, pageWidth);
  let y = 70;
  for (const line of lines) {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = 45;
    }
    doc.text(String(line), margin, y);
    y += 15;
  }
  doc.save(filename);
}

// ============================================================================
// 5. PROMPT PRIVACY SCRUBBER (REVERSIBLE PII REDACTOR & RESTORER)
// ============================================================================
export interface PiiScrubResult {
  redactedText: string;
  vaultMap: Record<string, string>;
  counts: Record<string, number>;
  totalRedacted: number;
}

export function redactPiiFromText(input: string, customTermsCsv = ''): PiiScrubResult {
  let text = input;
  const vaultMap: Record<string, string> = {};
  const reverseLookup: Record<string, string> = {};
  const counts: Record<string, number> = {
    EMAIL: 0,
    PHONE: 0,
    SSN: 0,
    CARD: 0,
    API_KEY: 0,
    IP: 0,
    CUSTOM: 0,
  };

  const replaceWithToken = (match: string, category: string) => {
    const trimmed = match.trim();
    if (!trimmed) return match;
    if (reverseLookup[trimmed]) {
      return reverseLookup[trimmed];
    }
    counts[category] = (counts[category] || 0) + 1;
    const token = `[${category}_${counts[category]}]`;
    vaultMap[token] = trimmed;
    reverseLookup[trimmed] = token;
    return token;
  };

  // 1. Custom client/company terms first
  if (customTermsCsv.trim()) {
    const terms = customTermsCsv
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length >= 2);
    for (const term of terms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      text = text.replace(new RegExp(escaped, 'gi'), (m) => replaceWithToken(m, 'CUSTOM'));
    }
  }

  // 2. API Keys & Secret Tokens (OpenAI, Anthropic, AWS, GitHub, Google, Stripe)
  text = text.replace(
    /\b(sk-[a-zA-Z0-9_-]{16,}|AIza[0-9A-Za-z_-]{30,}|ghp_[a-zA-Z0-9]{25,}|AKIA[0-9A-Z]{16}|xox[baprs]-[a-zA-Z0-9-]{10,})\b/g,
    (m) => replaceWithToken(m, 'API_KEY')
  );

  // 3. Emails
  text = text.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    (m) => replaceWithToken(m, 'EMAIL')
  );

  // 4. US SSN
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, (m) => replaceWithToken(m, 'SSN'));

  // 5. Credit Cards (13-16 digits with spaces/dashes)
  text = text.replace(
    /\b(?:\d[ -]*?){13,16}\b/g,
    (m) => {
      const digits = m.replace(/\D/g, '');
      if (digits.length >= 13 && digits.length <= 16) {
        return replaceWithToken(m, 'CARD');
      }
      return m;
    }
  );

  // 6. Phone Numbers
  text = text.replace(
    /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g,
    (m) => replaceWithToken(m, 'PHONE')
  );

  // 7. IPv4 Addresses
  text = text.replace(
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    (m) => replaceWithToken(m, 'IP')
  );

  const totalRedacted = Object.keys(vaultMap).length;
  return { redactedText: text, vaultMap, counts, totalRedacted };
}

export function restorePiiInText(aiResponse: string, vaultMap: Record<string, string>): string {
  let restored = aiResponse;
  for (const [token, originalValue] of Object.entries(vaultMap)) {
    const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    restored = restored.replace(new RegExp(escapedToken, 'g'), originalValue);
  }
  return restored;
}

// ============================================================================
// 6. AI CLICHÉ & BURSTINESS POLISHER
// ============================================================================
const AI_CLICHE_MAP: Record<string, string> = {
  'delve into': 'explore',
  'delves into': 'explores',
  'delve': 'dig',
  'vibrant tapestry': 'mix',
  'rich tapestry': 'combination',
  'tapestry': 'blend',
  'testament to': 'proof of',
  'underscores': 'highlights',
  'underscore': 'highlight',
  'moreover,': 'also,',
  'furthermore,': 'plus,',
  'it is important to note that': 'notably,',
  'it is worth noting that': 'note that',
  'in conclusion,': 'finally,',
  'in summary,': 'overall,',
  'pivotal': 'key',
  'crucial': 'essential',
  'foster': 'build',
  'fostering': 'building',
  'realm of': 'world of',
  'beacon of': 'example of',
  'synergy': 'teamwork',
  'leverage': 'use',
  'utilize': 'use',
  'game-changer': 'breakthrough',
  'seamlessly': 'smoothly',
  'meticulously': 'carefully',
  'navigating the complexities of': 'handling',
  'in today’s fast-paced world': 'today',
  "in today's fast-paced world": 'today',
};

export interface BurstinessReport {
  polishedText: string;
  clichesFound: { phrase: string; replacement: string; count: number }[];
  sentenceCount: number;
  avgWordsPerSentence: number;
  burstinessScore: number; // 0 to 100
  burstinessLabel: string;
}

export function analyzeAndPolishAiText(input: string): BurstinessReport {
  let text = cleanInvisibleWatermarks(input).cleanedText;
  const clichesFound: { phrase: string; replacement: string; count: number }[] = [];

  for (const [cliche, replacement] of Object.entries(AI_CLICHE_MAP)) {
    const regex = new RegExp(`\\b${cliche.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      clichesFound.push({ phrase: cliche, replacement, count: matches.length });
      text = text.replace(regex, (m) => {
        // preserve capitalization of first letter
        if (m[0] === m[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }
  }

  const sentences = input
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  const variance =
    lengths.length > 1
      ? lengths.reduce((acc, l) => acc + Math.pow(l - avg, 2), 0) / lengths.length
      : 0;
  const stdDev = Math.sqrt(variance);
  const burstinessScore = Math.min(100, Math.round((stdDev / Math.max(avg, 1)) * 140));

  let burstinessLabel = 'Natural Human Variation';
  if (burstinessScore < 35) burstinessLabel = 'Low Variation (Robotic / Uniform Sentence Lengths)';
  else if (burstinessScore < 55) burstinessLabel = 'Moderate Variation';

  return {
    polishedText: text,
    clichesFound,
    sentenceCount: sentences.length,
    avgWordsPerSentence: Math.round(avg * 10) / 10,
    burstinessScore,
    burstinessLabel,
  };
}

// ============================================================================
// 7. NOTEBOOKLM & CLAUDE 100+ FILE CONTEXT MERGER & DOC-TO-MARKDOWN
// ============================================================================
let pdfjsLibPromise: Promise<any> | null = null;

async function getPdfJs(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(lib);
        } else {
          reject(new Error('Failed to initialize pdf.js'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load pdf.js from CDN'));
      document.head.appendChild(script);
    });
  }
  return pdfjsLibPromise;
}

export async function extractTextFromSingleFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'pdf') {
    try {
      const pdfjs = await getPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        pages.push(strings.join(' ').replace(/\s{2,}/g, ' ').trim());
      }
      return pages.filter(Boolean).join('\n\n');
    } catch {
      return `[PDF File: ${file.name} (${Math.round(file.size / 1024)} KB)]`;
    }
  }

  if (ext === 'docx') {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const res = await mammoth.extractRawText({ arrayBuffer });
      return res.value.trim();
    } catch {
      return `[DOCX File: ${file.name}]`;
    }
  }

  const rawText = await file.text();

  if (ext === 'csv') {
    return convertCsvToMarkdownTable(rawText);
  }

  if (ext === 'html' || ext === 'htm') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawText, 'text/html');
    doc.querySelectorAll('script, style, nav, footer, noscript, svg').forEach((el) => el.remove());
    return (doc.body?.textContent || '').replace(/\s{3,}/g, '\n\n').trim();
  }

  return rawText.replace(/\r\n/g, '\n').trim();
}

function convertCsvToMarkdownTable(csv: string): string {
  const rows = csv
    .trim()
    .split(/\r?\n/)
    .filter((r) => r.trim().length > 0)
    .map((row) => row.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')));
  if (rows.length === 0) return '';
  const header = `| ${rows[0].join(' | ')} |`;
  const divider = `| ${rows[0].map(() => '---').join(' | ')} |`;
  const body = rows.slice(1).map((r) => `| ${r.join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

export async function mergeFilesForLlm(
  files: File[],
  format: 'xml-markdown' | 'notebooklm-md' | 'pdf',
  onProgress?: (pct: number) => void
): Promise<{
  masterText: string;
  wordCount: number;
  estimatedTokens: number;
  rawCharCount: number;
  compressedCharCount: number;
}> {
  const sections: string[] = [];
  const toc: string[] = [];
  let rawCharCount = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const extracted = await extractTextFromSingleFile(f);
    rawCharCount += Math.max(extracted.length, f.size);
    const cleaned = extracted
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    toc.push(`${i + 1}. \`${f.name}\` (~${ cleaned.split(/\s+/).filter(Boolean).length } words)`);

    if (format === 'xml-markdown') {
      sections.push(
        `<document index="${i + 1}">\n<source>${f.name}</source>\n<document_content>\n${cleaned}\n</document_content>\n</document>`
      );
    } else {
      sections.push(
        `## [SOURCE ${i + 1}] ${f.name}\n\n${cleaned}\n\n---`
      );
    }
    onProgress?.(Math.round(((i + 1) / files.length) * 95));
  }

  const headerBlock =
    format === 'xml-markdown'
      ? `# MASTER LLM CONTEXT BUNDLE (${files.length} Files)\n\n## Table of Contents\n${toc.join('\n')}\n\n<documents>\n\n${sections.join('\n\n')}\n\n</documents>`
      : `# MASTER NOTEBOOKLM SOURCE PACK (${files.length} Merged Sources)\n\n## Index of Included Documents\n${toc.join('\n')}\n\n---\n\n${sections.join('\n\n')}`;

  const wordCount = headerBlock.split(/\s+/).filter(Boolean).length;
  const estimatedTokens = Math.ceil(headerBlock.length / 4);
  onProgress?.(100);

  return {
    masterText: headerBlock,
    wordCount,
    estimatedTokens,
    rawCharCount,
    compressedCharCount: headerBlock.length,
  };
}

// ============================================================================
// 8. CHATGPT EXPORT (conversations.json / .zip) VIEWER & CONVERTER
// ============================================================================
export interface ParsedConversation {
  id: string;
  title: string;
  createTime: string;
  messageCount: number;
  messages: { role: 'USER' | 'ASSISTANT'; text: string }[];
}

export async function parseChatGptExportFile(file: File): Promise<ParsedConversation[]> {
  let jsonString = '';
  if (file.name.toLowerCase().endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file);
    const convFile =
      zip.file('conversations.json') ||
      Object.values(zip.files).find((f) => f.name.endsWith('conversations.json'));
    if (!convFile) {
      throw new Error('Could not find conversations.json inside the uploaded ZIP archive.');
    }
    jsonString = await convFile.async('string');
  } else {
    jsonString = await file.text();
  }

  const raw = JSON.parse(jsonString);
  const list = Array.isArray(raw) ? raw : raw.conversations || [raw];
  const parsed: ParsedConversation[] = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const title = item.title || `Conversation #${i + 1}`;
    const createTime = item.create_time
      ? new Date(item.create_time * 1000).toISOString().split('T')[0]
      : 'Unknown Date';
    const messages: { role: 'USER' | 'ASSISTANT'; text: string }[] = [];

    if (item.mapping && typeof item.mapping === 'object') {
      const nodes = Object.values(item.mapping) as any[];
      for (const node of nodes) {
        const msg = node?.message;
        const role = msg?.author?.role;
        if (role === 'user' || role === 'assistant') {
          const parts = msg?.content?.parts;
          if (Array.isArray(parts)) {
            const text = parts
              .filter((p: any) => typeof p === 'string')
              .join('\n')
              .trim();
            if (text) {
              messages.push({
                role: role === 'user' ? 'USER' : 'ASSISTANT',
                text,
              });
            }
          }
        }
      }
    } else if (Array.isArray(item.messages)) {
      for (const m of item.messages) {
        if (m.content) {
          messages.push({
            role: m.role === 'user' ? 'USER' : 'ASSISTANT',
            text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
          });
        }
      }
    }

    if (messages.length > 0) {
      parsed.push({
        id: item.id || `conv-${i}`,
        title,
        createTime,
        messageCount: messages.length,
        messages,
      });
    }
  }

  return parsed;
}

export function formatConversationsToMarkdown(convs: ParsedConversation[]): string {
  return convs
    .map((c) => {
      const body = c.messages
        .map((m) => `### ${m.role === 'USER' ? '👤 User' : '🤖 ChatGPT'}\n\n${m.text}`)
        .join('\n\n---\n\n');
      return `# ${c.title}\n*Date: ${c.createTime} • ${c.messageCount} messages*\n\n${body}`;
    })
    .join('\n\n========================================\n\n');
}

// ============================================================================
// 9. LLM TOKEN COUNTER, COST MATRIX & SEMANTIC CHUNKER
// ============================================================================
export interface ModelCostEstimate {
  model: string;
  provider: string;
  contextWindow: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  estimatedInputCost: string;
}

export function calculateTokensAndChunks(text: string, chunkTokenLimit = 4000) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const tokenCount = Math.ceil(charCount / 3.85);

  const models: Omit<ModelCostEstimate, 'estimatedInputCost'>[] = [
    { model: 'GPT-4o', provider: 'OpenAI', contextWindow: '128K', inputCostPer1M: 2.5, outputCostPer1M: 10.0 },
    { model: 'o3-mini', provider: 'OpenAI', contextWindow: '200K', inputCostPer1M: 1.1, outputCostPer1M: 4.4 },
    { model: 'Claude 3.7 Sonnet', provider: 'Anthropic', contextWindow: '200K', inputCostPer1M: 3.0, outputCostPer1M: 15.0 },
    { model: 'Claude 3.5 Haiku', provider: 'Anthropic', contextWindow: '200K', inputCostPer1M: 0.8, outputCostPer1M: 4.0 },
    { model: 'Gemini 2.5 Pro', provider: 'Google', contextWindow: '1M', inputCostPer1M: 1.25, outputCostPer1M: 10.0 },
    { model: 'Gemini 2.5 Flash', provider: 'Google', contextWindow: '1M', inputCostPer1M: 0.15, outputCostPer1M: 0.6 },
    { model: 'DeepSeek R1 / V3', provider: 'DeepSeek', contextWindow: '128K', inputCostPer1M: 0.27, outputCostPer1M: 1.1 },
  ];

  const costMatrix: ModelCostEstimate[] = models.map((m) => ({
    ...m,
    estimatedInputCost: `$${((tokenCount / 1_000_000) * m.inputCostPer1M).toFixed(5)}`,
  }));

  // Semantic chunking by paragraph
  const maxCharsPerChunk = chunkTokenLimit * 3.8;
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = '';

  for (const p of paragraphs) {
    if ((current + '\n\n' + p).length > maxCharsPerChunk && current.length > 0) {
      chunks.push(current.trim());
      current = p;
    } else {
      current = current ? `${current}\n\n${p}` : p;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return {
    charCount,
    wordCount,
    tokenCount,
    costMatrix,
    chunks,
  };
}

// ============================================================================
// 10. GEO & DEV BUILDERS (llms.txt, AI robots.txt, JSONL, MCP Config)
// ============================================================================
export function generateLlmsTxt(config: {
  siteName: string;
  siteUrl: string;
  summary: string;
  details: string;
  linksRaw: string;
}): string {
  const cleanUrl = config.siteUrl.replace(/\/+$/, '');
  const rawLines = config.linksRaw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const formattedLinks = rawLines.map((line) => {
    // Support pasting raw <loc>https://...</loc> from sitemap.xml
    const locMatch = line.match(/<loc>(.*?)<\/loc>/i);
    const urlStr = locMatch ? locMatch[1].trim() : line;
    if (urlStr.startsWith('- [')) return urlStr;
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
      const slug = urlStr.replace(cleanUrl, '').replace(/^\/+|\/+$/g, '') || 'Home';
      const title =
        slug === 'Home'
          ? 'Homepage'
          : slug
              .split(/[-/]/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
      return `- [${title}](${urlStr}): Official ${title} page on ${config.siteName}.`;
    }
    return `- [${urlStr}](${cleanUrl}/${urlStr.replace(/^\/+/, '')})`;
  });

  return `# ${config.siteName || 'My Website'}

> ${config.summary || 'Official website and documentation structured for AI Search Engines and LLMs.'}

${config.details || 'All pages listed below provide authoritative, up-to-date product and documentation details.'}

## Core Pages & Documentation

${formattedLinks.join('\n')}

## Citation & AI Indexing Guidelines

- **Canonical Domain**: ${cleanUrl}
- **Preferred Citation**: "${config.siteName} (${cleanUrl})"
`;
}

export function generateAiRobotsTxt(config: {
  siteUrl: string;
  allowSearchBots: boolean;
  blockTrainingBots: boolean;
}): string {
  const cleanUrl = config.siteUrl.replace(/\/+$/, '') || 'https://example.com';
  const lines: string[] = [
    '# Generated by AIScrubbers — AI Crawler & GEO robots.txt Configurator',
    'User-agent: *',
    'Allow: /',
    '',
  ];

  // AI Search Citation Bots (Bring Direct Clicks)
  const searchBots = ['OAI-SearchBot', 'PerplexityBot', 'Amzn-SearchBot', 'Applebot'];
  lines.push('# --- AI Search & Answer Engine Citation Crawlers ---');
  for (const bot of searchBots) {
    lines.push(`User-agent: ${bot}`);
    lines.push(config.allowSearchBots ? 'Allow: /' : 'Disallow: /');
    lines.push('');
  }

  // Foundation Model Training Scrapers
  const trainingBots = [
    'GPTBot',
    'ClaudeBot',
    'Google-Extended',
    'CCBot',
    'Bytespider',
    'Meta-ExternalAgent',
    'Cohere-ai',
    'omgili',
  ];
  lines.push('# --- LLM Foundation Model Training Scrapers ---');
  for (const bot of trainingBots) {
    lines.push(`User-agent: ${bot}`);
    lines.push(config.blockTrainingBots ? 'Disallow: /' : 'Allow: /');
    lines.push('');
  }

  lines.push(`Sitemap: ${cleanUrl}/sitemap.xml`);
  lines.push(`# AI Documentation Index: ${cleanUrl}/llms.txt`);
  return lines.join('\n');
}

export function convertCsvOrJsonToJsonl(
  rawInput: string,
  systemPrompt = 'You are a helpful, accurate assistant.'
): { jsonl: string; validRows: number; errors: string[] } {
  const trimmed = rawInput.trim();
  const errors: string[] = [];
  const outLines: string[] = [];

  if (!trimmed) return { jsonl: '', validRows: 0, errors: ['Input is empty.'] };

  // Check if JSON array
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) {
        arr.forEach((item, idx) => {
          const userMsg = item.user || item.prompt || item.input || item.question;
          const asstMsg = item.assistant || item.completion || item.output || item.answer;
          const sysMsg = item.system || systemPrompt;
          if (!userMsg || !asstMsg) {
            errors.push(`Row ${idx + 1}: Missing user/prompt or assistant/completion field.`);
          } else {
            outLines.push(
              JSON.stringify({
                messages: [
                  { role: 'system', content: String(sysMsg) },
                  { role: 'user', content: String(userMsg) },
                  { role: 'assistant', content: String(asstMsg) },
                ],
              })
            );
          }
        });
        return { jsonl: outLines.join('\n'), validRows: outLines.length, errors };
      }
    } catch (e: any) {
      errors.push(`JSON Parse Error: ${e.message}`);
    }
  }

  // Otherwise parse as CSV (user, assistant)
  const rows = trimmed.split(/\r?\n/).filter((r) => r.trim().length > 0);
  rows.forEach((row, idx) => {
    if (idx === 0 && /prompt|user|question/i.test(row) && /completion|assistant|answer/i.test(row)) {
      return; // skip header row
    }
    const parts = row.split(',');
    if (parts.length < 2) {
      errors.push(`Line ${idx + 1}: Expected at least 2 comma-separated columns (prompt, completion).`);
      return;
    }
    const userMsg = parts[0].trim().replace(/^"|"$/g, '');
    const asstMsg = parts.slice(1).join(',').trim().replace(/^"|"$/g, '');
    outLines.push(
      JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMsg },
          { role: 'assistant', content: asstMsg },
        ],
      })
    );
  });

  return { jsonl: outLines.join('\n'), validRows: outLines.length, errors };
}

export function generateMcpConfigJson(options: {
  os: 'windows' | 'mac-linux';
  enableFilesystem: boolean;
  allowedFolderPath: string;
  enableGithub: boolean;
  githubToken: string;
  enablePostgres: boolean;
  postgresUrl: string;
  enableMemory: boolean;
}): string {
  const npxCmd = options.os === 'windows' ? 'npx.cmd' : 'npx';
  const mcpServers: Record<string, any> = {};

  if (options.enableFilesystem) {
    mcpServers.filesystem = {
      command: npxCmd,
      args: [
        '-y',
        '@modelcontextprotocol/server-filesystem',
        options.allowedFolderPath || (options.os === 'windows' ? 'C:/Users/Public/Documents' : '/Users/username/Documents'),
      ],
    };
  }

  if (options.enableGithub) {
    mcpServers.github = {
      command: npxCmd,
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: options.githubToken || '<YOUR_GITHUB_PAT>',
      },
    };
  }

  if (options.enablePostgres) {
    mcpServers.postgres = {
      command: npxCmd,
      args: [
        '-y',
        '@modelcontextprotocol/server-postgres',
        options.postgresUrl || 'postgresql://localhost/mydb',
      ],
    };
  }

  if (options.enableMemory) {
    mcpServers.memory = {
      command: npxCmd,
      args: ['-y', '@modelcontextprotocol/server-memory'],
    };
  }

  return JSON.stringify({ mcpServers }, null, 2);
}
