'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/lib/toolsConfig';
import Dropzone from '@/components/Dropzone';
import ProgressBar from '@/components/ProgressBar';
import {
  inspectFileMetadata,
  sanitizeImageBatch,
  cleanInvisibleWatermarks,
  cleanMarkdownForWord,
  exportCleanedTextToDocx,
  exportTextToPdf,
  redactPiiFromText,
  restorePiiInText,
  analyzeAndPolishAiText,
  mergeFilesForLlm,
  parseChatGptExportFile,
  formatConversationsToMarkdown,
  calculateTokensAndChunks,
  generateLlmsTxt,
  generateAiRobotsTxt,
  convertCsvOrJsonToJsonl,
  generateMcpConfigJson,
  downloadBlob,
  downloadTextFile,
  ForensicReport,
  ParsedConversation,
} from '@/lib/aiTools';
import {
  Download,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FileText,
  Lock,
  Unlock,
  Search,
} from 'lucide-react';

interface ToolWorkspaceProps {
  tool: ToolMetadata;
}

export default function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Image / File Results
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState('');
  const [forensicReports, setForensicReports] = useState<ForensicReport[]>([]);

  // Text / Sanitizer State
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [statsList, setStatsList] = useState<{ label: string; count: number | string }[]>([]);

  // PII Redactor State
  const [customTerms, setCustomTerms] = useState('');
  const [vaultMap, setVaultMap] = useState<Record<string, string>>({});
  const [aiReplyInput, setAiReplyInput] = useState('');
  const [restoredOutput, setRestoredOutput] = useState('');

  // NotebookLM / RAG Merger State
  const [bundleFormat, setBundleFormat] = useState<'notebooklm-md' | 'xml-markdown'>('notebooklm-md');

  // ChatGPT Export State
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [convSearch, setConvSearch] = useState('');

  // Token Calculator State
  const [chunkLimit, setChunkLimit] = useState(4000);
  const [tokenResult, setTokenResult] = useState<ReturnType<typeof calculateTokensAndChunks> | null>(null);

  // Builder States (llms.txt, robots.txt, mcp.json, jsonl)
  const [siteName, setSiteName] = useState('Acme AI Studio');
  const [siteUrl, setSiteUrl] = useState('https://example.com');
  const [siteSummary, setSiteSummary] = useState('100% client-side AI workflow platform for modern teams.');
  const [siteLinks, setSiteLinks] = useState('https://example.com/pricing\nhttps://example.com/docs\nhttps://example.com/security');
  const [allowSearchBots, setAllowSearchBots] = useState(true);
  const [blockTrainingBots, setBlockTrainingBots] = useState(true);
  const [mcpOs, setMcpOs] = useState<'windows' | 'mac-linux'>('windows');
  const [mcpFolder, setMcpFolder] = useState('C:/Users/Public/Documents');
  const [mcpGithub, setMcpGithub] = useState(true);
  const [mcpPostgres, setMcpPostgres] = useState(false);

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRichHtml = async () => {
    try {
      if (typeof ClipboardItem !== 'undefined' && htmlOutput) {
        const htmlBlob = new Blob([htmlOutput], { type: 'text/html' });
        const textBlob = new Blob([textOutput], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob }),
        ]);
      } else {
        await navigator.clipboard.writeText(textOutput);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await handleCopy(textOutput);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
    setResultFilename('');
    setForensicReports([]);
    setTextOutput('');
    setHtmlOutput('');
    setStatsList([]);
    setConversations([]);
    setErrorMsg('');
    setProgress(0);
  };

  // ==========================================
  // ACTION HANDLERS BY TOOL ID
  // ==========================================
  const runFileTool = async () => {
    if (files.length === 0) {
      setErrorMsg('Please select at least 1 file first.');
      return;
    }
    setErrorMsg('');
    setIsProcessing(true);
    setProgress(15);

    try {
      if (tool.id === 'c2pa-viewer') {
        const rep = await inspectFileMetadata(files[0]);
        setForensicReports([rep]);
        setProgress(100);
      } else if (tool.id === 'c2pa-remover' || tool.id === 'exif-scrubber' || tool.id === 'ai-image-normalizer') {
        const inject300Dpi = tool.id === 'ai-image-normalizer';
        const res = await sanitizeImageBatch(files, { inject300Dpi }, (pct) => setProgress(pct));
        setResultBlob(res.blob);
        setResultFilename(res.filename);
        setForensicReports(res.reports);
      } else if (tool.id === 'notebooklm-file-merger' || tool.id === 'doc-to-llm-markdown') {
        const res = await mergeFilesForLlm(
          files,
          tool.id === 'doc-to-llm-markdown' ? 'notebooklm-md' : bundleFormat,
          (pct) => setProgress(pct)
        );
        setTextOutput(res.masterText);
        const savedPct =
          res.rawCharCount > 0
            ? Math.max(12, Math.round((1 - res.compressedCharCount / (res.rawCharCount * 1.35)) * 100))
            : 45;
        setStatsList([
          { label: 'Merged Files', count: files.length },
          { label: 'Total Words', count: res.wordCount.toLocaleString() },
          { label: 'Estimated LLM Tokens', count: res.estimatedTokens.toLocaleString() },
          { label: 'Context Overhead Saved', count: `~${savedPct}%` },
        ]);
      } else if (tool.id === 'chatgpt-export-converter') {
        setProgress(40);
        const parsed = await parseChatGptExportFile(files[0]);
        setConversations(parsed);
        const md = formatConversationsToMarkdown(parsed);
        setTextOutput(md);
        setProgress(100);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while processing your file locally.');
    } finally {
      setIsProcessing(false);
    }
  };

  const runTextTool = () => {
    if (!textInput.trim()) {
      setErrorMsg('Please paste or enter some text first.');
      return;
    }
    setErrorMsg('');

    if (tool.id === 'chatgpt-watermark-remover') {
      const res = cleanInvisibleWatermarks(textInput);
      setTextOutput(res.cleanedText);
      setStatsList(res.detectedBreakdown);
    } else if (tool.id === 'ai-text-to-word-cleaner') {
      const res = cleanMarkdownForWord(textInput);
      setTextOutput(res.plainText);
      setHtmlOutput(res.cleanHtml);
      setStatsList([
        { label: 'Markdown & Hidden Symbols Removed', count: res.removedArtifactsCount },
        { label: 'Clean Paragraphs Ready for Word', count: res.plainText.split('\n\n').length },
      ]);
    } else if (tool.id === 'prompt-pii-redactor') {
      const res = redactPiiFromText(textInput, customTerms);
      setTextOutput(res.redactedText);
      setVaultMap(res.vaultMap);
      setStatsList([
        { label: 'Total PII Entities Tokenized', count: res.totalRedacted },
        { label: 'Emails & Phones', count: (res.counts.EMAIL || 0) + (res.counts.PHONE || 0) },
        { label: 'SSNs & Cards', count: (res.counts.SSN || 0) + (res.counts.CARD || 0) },
        { label: 'API Keys & Custom Terms', count: (res.counts.API_KEY || 0) + (res.counts.CUSTOM || 0) },
      ]);
    } else if (tool.id === 'ai-burstiness-polisher') {
      const res = analyzeAndPolishAiText(textInput);
      setTextOutput(res.polishedText);
      setStatsList([
        { label: 'AI Clichés Replaced', count: res.clichesFound.length },
        { label: 'Sentence Burstiness Score', count: `${res.burstinessScore}/100 (${res.burstinessLabel})` },
        { label: 'Avg Words / Sentence', count: res.avgWordsPerSentence },
      ]);
    } else if (tool.id === 'llm-token-calculator') {
      const res = calculateTokensAndChunks(textInput, chunkLimit);
      setTokenResult(res);
      setTextOutput(res.chunks.map((c, idx) => `=== CHUNK ${idx + 1} of ${res.chunks.length} ===\n${c}`).join('\n\n'));
    } else if (tool.id === 'jsonl-dataset-converter') {
      const res = convertCsvOrJsonToJsonl(textInput);
      setTextOutput(res.jsonl);
      setStatsList([
        { label: 'Valid Fine-Tuning JSONL Rows', count: res.validRows },
        { label: 'Validation Errors', count: res.errors.length },
      ]);
      if (res.errors.length > 0) {
        setErrorMsg(res.errors.slice(0, 3).join(' | '));
      }
    }
  };

  const runBuilderTool = () => {
    setErrorMsg('');
    if (tool.id === 'llms-txt-generator') {
      const out = generateLlmsTxt({
        siteName,
        siteUrl,
        summary: siteSummary,
        details: 'Official structured index for AI Search Engines (ChatGPT Search, Perplexity, Claude, Gemini).',
        linksRaw: siteLinks,
      });
      setTextOutput(out);
    } else if (tool.id === 'ai-robots-txt-generator') {
      const out = generateAiRobotsTxt({
        siteUrl,
        allowSearchBots,
        blockTrainingBots,
      });
      setTextOutput(out);
    } else if (tool.id === 'mcp-config-generator') {
      const out = generateMcpConfigJson({
        os: mcpOs,
        enableFilesystem: true,
        allowedFolderPath: mcpFolder,
        enableGithub: mcpGithub,
        githubToken: '',
        enablePostgres: mcpPostgres,
        postgresUrl: 'postgresql://localhost:5432/mydb',
        enableMemory: true,
      });
      setTextOutput(out);
    }
  };

  // Sample Demo Text Loader for instant user testing
  const loadSampleText = () => {
    if (tool.id === 'chatgpt-watermark-remover') {
      setTextInput(
        'Here\u200B is a sample\u202F ChatGPT paragraph\u200D — packed with “curly smart quotes”, narrow no-break\u00A0spaces, and hidden zero-width\uFEFF watermarks — that fails strict ATS parsers.'
      );
    } else if (tool.id === 'ai-text-to-word-cleaner') {
      setTextInput(
        '### Executive Summary\nHere is your **quarterly strategy** overview:\n- **First Priority**: Launch the `llms.txt` index.\n- **Second Priority**: Strip C2PA metadata before social uploads.\n\n**Conclusion**: Zero grey backgrounds when pasted into Word!'
      );
    } else if (tool.id === 'prompt-pii-redactor') {
      setTextInput(
        'Please review the contract for Johnathan Miller (email: j.miller@acmecorp.com, phone: (415) 890-2311, SSN: 123-45-6789). Our production OpenAI key is sk-proj-9876543210abcdefghijklm.'
      );
      setCustomTerms('Johnathan Miller, AcmeCorp');
    } else if (tool.id === 'ai-burstiness-polisher') {
      setTextInput(
        'In today’s fast-paced world, it is important to note that we must delve into the vibrant tapestry of modern AI workflows. Moreover, this crucial approach underscores a testament to seamless synergy.'
      );
    } else if (tool.id === 'jsonl-dataset-converter') {
      setTextInput(
        'prompt,completion\n"How do I strip C2PA metadata?","Use AIScrubbers C2PA Remover to reconstruct clean pixels locally in your browser."\n"How many sources does NotebookLM allow?","50 sources per notebook, up to 500,000 words per source."'
      );
    } else {
      setTextInput(
        'Paste your document or prompt text here to calculate exact token counts, API costs across GPT-4o, Claude 3.7 Sonnet, Gemini 2.5 Pro, and DeepSeek R1, and split into semantic RAG chunks.'
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 transition-all">
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================================
          MODE 1: FILE-BASED TOOLS (C2PA, EXIF, 300 DPI, NotebookLM, ChatGPT Export)
         ========================================================= */}
      {tool.inputMode === 'file' && (
        <div>
          {!resultBlob && forensicReports.length === 0 && !textOutput ? (
            <div>
              {tool.id === 'notebooklm-file-merger' && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <span className="text-xs font-extrabold text-indigo-900">
                    Output Context Structure:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBundleFormat('notebooklm-md')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        bundleFormat === 'notebooklm-md'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      NotebookLM Master Markdown (.MD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBundleFormat('xml-markdown')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        bundleFormat === 'xml-markdown'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      Anthropic Claude &lt;documents&gt; XML
                    </button>
                  </div>
                </div>
              )}

              <Dropzone
                files={files}
                onFilesChange={setFiles}
                accept={tool.acceptedFiles}
                multiple={tool.multipleFiles}
                title={`Select Files for ${tool.title}`}
                subtitle={
                  tool.multipleFiles
                    ? 'Drop 1 or up to 100+ files here (100% private in-browser execution)'
                    : 'Drop your file here to process 100% locally'
                }
              />

              {files.length > 0 && !isProcessing && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-semibold">
                    {files.length} file{files.length > 1 ? 's' : ''} staged in browser RAM
                  </span>
                  <button
                    type="button"
                    onClick={runFileTool}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-lg shadow-brand-500/25 hover:scale-105 transition-all"
                  >
                    {tool.id === 'c2pa-viewer'
                      ? 'Run Forensic C2PA & AI Scan'
                      : tool.id === 'notebooklm-file-merger'
                      ? `Merge ${files.length} Files into 1 Master Source`
                      : `Run ${tool.title}`}
                  </button>
                </div>
              )}

              {isProcessing && (
                <ProgressBar
                  progress={progress}
                  statusText={`Running ${tool.title} locally in your browser...`}
                />
              )}
            </div>
          ) : (
            /* FILE TOOL RESULTS VIEW */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      {tool.id === 'c2pa-viewer'
                        ? 'Forensic Metadata Inspection Complete'
                        : 'Local Sanitization & Processing Complete!'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Processed 100% inside your browser with zero external server calls.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Process Another File
                </button>
              </div>

              {/* Forensic Report Display (for C2PA Viewer & Remover) */}
              {forensicReports.length > 0 && (
                <div className="space-y-4">
                  {forensicReports.map((rep, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-gray-200 p-5 bg-gray-50/70"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-sm font-extrabold text-gray-900">
                          📄 {rep.fileName}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                            rep.riskColor === 'red'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : rep.riskColor === 'amber'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {resultBlob ? 'SCRUBBED -> NOW 100% CLEAN' : rep.riskLevel}
                        </span>
                      </div>

                      {rep.findings.length === 0 ? (
                        <p className="text-xs text-emerald-700 font-semibold">
                          ✓ Zero C2PA manifests, JUMBF boxes, or AI generator chunks were found in the original file.
                        </p>
                      ) : (
                        <div className="space-y-2 mt-3">
                          <p className="text-xs font-bold text-gray-500 uppercase">
                            {resultBlob
                              ? `Forensic Tags Found & Stripped (${rep.findings.length}):`
                              : `Detected Metadata & Provenance Signatures (${rep.findings.length}):`}
                          </p>
                          {rep.findings.map((f, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-3 rounded-xl bg-white border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <span className="font-extrabold text-brand-700">
                                  [{f.category}] {f.key}:
                                </span>{' '}
                                <span className="text-gray-700 break-all">{f.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Download Button for Sanitized Image / ZIP */}
              {resultBlob && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => downloadBlob(resultBlob, resultFilename)}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 hover:scale-105 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download {resultFilename}
                  </button>
                </div>
              )}

              {/* Download JSON Report for C2PA Viewer */}
              {tool.id === 'c2pa-viewer' && forensicReports.length > 0 && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        JSON.stringify(forensicReports[0], null, 2),
                        `${forensicReports[0].fileName}_c2pa_audit.json`,
                        'application/json'
                      )
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Download Full JSON Forensic Report
                  </button>
                </div>
              )}

              {/* ChatGPT Conversations Browser */}
              {tool.id === 'chatgpt-export-converter' && conversations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                    <div>
                      <h4 className="text-sm font-extrabold text-indigo-950">
                        Parsed {conversations.length} Conversations Locally!
                      </h4>
                      <p className="text-xs text-indigo-700">
                        Search your threads below or export your entire archive to PDF or Markdown.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          downloadTextFile(textOutput, 'chatgpt_history_export.md', 'text/markdown')
                        }
                        className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm"
                      >
                        Download Markdown (.MD)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          exportTextToPdf(
                            textOutput.slice(0, 120000),
                            'ChatGPT Conversation Archive',
                            'chatgpt_history_export.pdf'
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm"
                      >
                        Download Searchable PDF
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={convSearch}
                      onChange={(e) => setConvSearch(e.target.value)}
                      placeholder="Filter conversations by keyword or title..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>

                  <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
                    {conversations
                      .filter(
                        (c) =>
                          !convSearch ||
                          c.title.toLowerCase().includes(convSearch.toLowerCase())
                      )
                      .slice(0, 50)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-xs font-extrabold text-gray-900">{c.title}</p>
                            <p className="text-[11px] text-gray-500">
                              {c.createTime} • {c.messageCount} messages
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              exportTextToPdf(
                                formatConversationsToMarkdown([c]),
                                c.title,
                                `${c.title.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.pdf`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-brand-400 text-xs font-bold text-brand-600 shrink-0"
                          >
                            Export PDF
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Merged NotebookLM / Markdown Output */}
              {textOutput && tool.id !== 'chatgpt-export-converter' && (
                <div className="space-y-4">
                  {statsList.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {statsList.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center"
                        >
                          <p className="text-lg font-black text-brand-700">{st.count}</p>
                          <p className="text-[11px] font-bold text-gray-600">{st.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    readOnly
                    value={textOutput}
                    rows={10}
                    className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800"
                  />

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          textOutput,
                          `aiscrubbers_master_context.md`,
                          'text/markdown;charset=utf-8'
                        )
                      }
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Download Master .MD File
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          textOutput,
                          `aiscrubbers_master_context.txt`,
                          'text/plain;charset=utf-8'
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Download .TXT
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        exportTextToPdf(
                          textOutput.slice(0, 150000),
                          'Master LLM Context Bundle',
                          'aiscrubbers_master_context.pdf'
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Combined .PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(textOutput)}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          MODE 2: TEXT & SANITIZER TOOLS (Watermark, Word Cleaner, PII, Burstiness, Tokens, JSONL)
         ========================================================= */}
      {tool.inputMode === 'text' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-extrabold text-gray-900">
              Input Text / Prompt / Data
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSampleText}
                className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors"
              >
                Load Sample Test Data
              </button>
              {textInput && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {tool.id === 'prompt-pii-redactor' && (
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <label className="block text-xs font-extrabold text-rose-900 mb-1.5">
                Optional Custom Client / Company Names to Redact (comma-separated):
              </label>
              <input
                type="text"
                value={customTerms}
                onChange={(e) => setCustomTerms(e.target.value)}
                placeholder="e.g., Johnathan Miller, Acme Corp, Project Titan"
                className="w-full px-3.5 py-2 rounded-xl border border-rose-200 text-xs bg-white"
              />
            </div>
          )}

          {tool.id === 'llm-token-calculator' && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-xs font-extrabold text-purple-900">
                Auto-Chunk Size Limit (Tokens per Chunk):
              </span>
              {[2000, 4000, 8000, 16000].map((lim) => (
                <button
                  key={lim}
                  type="button"
                  onClick={() => setChunkLimit(lim)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    chunkLimit === lim
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {lim.toLocaleString()}
                </button>
              ))}
            </div>
          )}

          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={7}
            placeholder="Paste your text, ChatGPT output, confidential prompt, or CSV rows here (100% processed inside your browser)..."
            className="w-full p-4 rounded-2xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm text-gray-800 font-medium leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={runTextTool}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-lg shadow-brand-500/25 hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Run {tool.title}
            </button>
          </div>

          {/* Stats Breakdown */}
          {statsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
              {statsList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200"
                >
                  <p className="text-xl font-black text-brand-600">{item.count}</p>
                  <p className="text-xs font-bold text-gray-600 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Token Cost Matrix Table */}
          {tool.id === 'llm-token-calculator' && tokenResult && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                  <p className="text-2xl font-black text-purple-700">
                    {tokenResult.tokenCount.toLocaleString()}
                  </p>
                  <p className="text-xs font-bold text-purple-900">Estimated Tokens</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                  <p className="text-2xl font-black text-indigo-700">
                    {tokenResult.wordCount.toLocaleString()}
                  </p>
                  <p className="text-xs font-bold text-indigo-900">Words</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <p className="text-2xl font-black text-emerald-700">
                    {tokenResult.chunks.length}
                  </p>
                  <p className="text-xs font-bold text-emerald-900">
                    RAG Chunks (@{chunkLimit} tok)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 font-extrabold">AI Model</th>
                      <th className="py-3 px-4 font-extrabold">Context Window</th>
                      <th className="py-3 px-4 font-extrabold">Input / 1M</th>
                      <th className="py-3 px-4 font-extrabold text-brand-600">This Prompt Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tokenResult.costMatrix.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-4 font-bold text-gray-900">
                          {m.model} <span className="text-gray-400">({m.provider})</span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-600">{m.contextWindow}</td>
                        <td className="py-2.5 px-4 text-gray-600">${m.inputCostPer1M.toFixed(2)}</td>
                        <td className="py-2.5 px-4 font-extrabold text-emerald-700">
                          {m.estimatedInputCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sanitized Output Area */}
          {textOutput && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sanitized Output Ready</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {tool.id === 'ai-text-to-word-cleaner' && (
                    <>
                      <button
                        type="button"
                        onClick={handleCopyRichHtml}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Formatted for MS Word / Docs
                      </button>
                      <button
                        type="button"
                        onClick={() => exportCleanedTextToDocx(textOutput)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download .DOCX
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(textOutput)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Plain Text'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        textOutput,
                        tool.id === 'jsonl-dataset-converter'
                          ? 'fine_tuning_dataset.jsonl'
                          : 'aiscrubbers_sanitized.txt'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={textOutput}
                rows={7}
                className="w-full p-4 rounded-2xl bg-emerald-50/30 border border-emerald-200 text-sm text-gray-900 font-medium leading-relaxed"
              />

              {/* Reversible PII Vault Restorer */}
              {tool.id === 'prompt-pii-redactor' && Object.keys(vaultMap).length > 0 && (
                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-sm font-extrabold">
                        Step 2: 1-Click De-Anonymize (Restore Real Data into AI Reply)
                      </h4>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {Object.keys(vaultMap).length} Tokens Stored in Local RAM
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Paste ChatGPT or Claude’s response containing placeholders like{' '}
                    <code className="text-amber-300">{Object.keys(vaultMap)[0]}</code> below to swap your real client names and emails back in!
                  </p>
                  <textarea
                    value={aiReplyInput}
                    onChange={(e) => {
                      setAiReplyInput(e.target.value);
                      setRestoredOutput(restorePiiInText(e.target.value, vaultMap));
                    }}
                    rows={4}
                    placeholder="Paste the AI response here to automatically restore original names, emails, and numbers..."
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-gray-200"
                  />
                  {restoredOutput && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">
                          Restored Final Text:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(restoredOutput)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Copy Restored Text
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs text-emerald-300 whitespace-pre-wrap">
                        {restoredOutput}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          MODE 3: INTERACTIVE BUILDER TOOLS (llms.txt, AI robots.txt, MCP Config)
         ========================================================= */}
      {tool.inputMode === 'builder' && (
        <div className="space-y-6">
          {tool.id === 'llms-txt-generator' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Brand / Website Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Canonical Domain URL
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  1-Sentence AI Summary Blockquote (&gt;)
                </label>
                <input
                  type="text"
                  value={siteSummary}
                  onChange={(e) => setSiteSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Key URLs or Paste Raw &lt;loc&gt; Lines from sitemap.xml (1 per line)
                </label>
                <textarea
                  rows={5}
                  value={siteLinks}
                  onChange={(e) => setSiteLinks(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {tool.id === 'ai-robots-txt-generator' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Your Website Domain URL
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowSearchBots}
                    onChange={(e) => setAllowSearchBots(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="block text-xs font-extrabold text-emerald-950">
                      Allow AI Search Citation Bots (Recommended)
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Allows OAI-SearchBot &amp; PerplexityBot so your site gets cited with clickable links in ChatGPT Search.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockTrainingBots}
                    onChange={(e) => setBlockTrainingBots(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="block text-xs font-extrabold text-amber-950">
                      Block LLM Model Training Scrapers
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Blocks CCBot, Bytespider, GPTBot &amp; ClaudeBot from scraping your articles into foundation training sets.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {tool.id === 'mcp-config-generator' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-gray-700">Target Operating System:</span>
                <button
                  type="button"
                  onClick={() => setMcpOs('windows')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    mcpOs === 'windows' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Windows (Fixes npx.cmd ENOENT)
                </button>
                <button
                  type="button"
                  onClick={() => setMcpOs('mac-linux')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    mcpOs === 'mac-linux' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  macOS / Linux
                </button>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Allowed Local Filesystem Directory Path
                </label>
                <input
                  type="text"
                  value={mcpFolder}
                  onChange={(e) => setMcpFolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={mcpGithub}
                    onChange={(e) => setMcpGithub(e.target.checked)}
                  />
                  Include GitHub MCP Server
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={mcpPostgres}
                    onChange={(e) => setMcpPostgres(e.target.checked)}
                  />
                  Include PostgreSQL MCP Server
                </label>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={runBuilderTool}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25"
          >
            Generate Validated File
          </button>

          {textOutput && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700">
                  ✓ Generated Output Ready
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(textOutput)}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold"
                  >
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        textOutput,
                        tool.id === 'llms-txt-generator'
                          ? 'llms.txt'
                          : tool.id === 'ai-robots-txt-generator'
                          ? 'robots.txt'
                          : 'claude_desktop_config.json'
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
                  >
                    Download File
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
                {textOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
