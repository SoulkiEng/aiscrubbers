document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('quickText');
  const cleanBtn = document.getElementById('cleanWatermarkBtn');
  const redactBtn = document.getElementById('redactPiiBtn');
  const statusMsg = document.getElementById('statusMsg');

  cleanBtn.addEventListener('click', async () => {
    const raw = textarea.value || '';
    if (!raw.trim()) {
      statusMsg.textContent = 'Paste some text first.';
      return;
    }
    const zeroWidthRegex = /[\u200B\u200C\u200D\u2060\uFEFF\u00A0\u202F]/g;
    const matches = raw.match(zeroWidthRegex) || [];
    const cleaned = raw
      .replace(zeroWidthRegex, ' ')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\s*—\s*/g, ' - ')
      .replace(/[^\S\r\n]{2,}/g, ' ')
      .trim();

    textarea.value = cleaned;
    await navigator.clipboard.writeText(cleaned);
    statusMsg.textContent = `✓ Cleaned (${matches.length} hidden marks) & copied!`;
  });

  redactBtn.addEventListener('click', async () => {
    const raw = textarea.value || '';
    if (!raw.trim()) {
      statusMsg.textContent = 'Paste a prompt first.';
      return;
    }
    let count = 0;
    const scrubbed = raw
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, () => {
        count++;
        return `[EMAIL_${count}]`;
      })
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, () => {
        count++;
        return `[SSN_${count}]`;
      })
      .replace(/\b(sk-[a-zA-Z0-9_-]{16,}|AIza[0-9A-Za-z_-]{30,})\b/g, () => {
        count++;
        return `[API_KEY_${count}]`;
      });

    textarea.value = scrubbed;
    await navigator.clipboard.writeText(scrubbed);
    statusMsg.textContent = `✓ Redacted ${count} PII items & copied!`;
  });
});
