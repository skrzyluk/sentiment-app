function getTexts() {
  return JSON.parse(sessionStorage.getItem('sentimentTexts') || '[]');
}

function saveTexts(texts) {
  sessionStorage.setItem('sentimentTexts', JSON.stringify(texts));
}

function renderTable() {
  const texts = getTexts();
  const table = document.getElementById('textsTable');
  table.innerHTML = '';

  texts.forEach(({ id, content, sentiment }, index) => {
    const tr = document.createElement('tr');
    tr.dataset.id = id;
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${content}</td>
      <td class="${sentiment || 'UNKNOWN'}">${sentiment || '–'}</td>
      <td><button onclick="deleteEntry(${id})">Usuń</button></td>
    `;
    table.appendChild(tr);
  });
}

function deleteEntry(id) {
  const texts = getTexts().filter(t => t.id !== id);
  saveTexts(texts);
  renderTable();
}

function saveAsMarkdown() {
  const texts = getTexts();
  if (!texts.length) {
    alert('Brak danych do eksportu.');
    return;
  }

  const rows = texts.map((t, i) =>
    `| ${i + 1} | ${t.content.replace(/\|/g, '\\|')} | ${t.sentiment || '–'} |`
  ).join('\n');

  const md = `# Wyniki analizy sentymentu\n\n| # | Tekst | Sentyment |\n|---|---|---|\n${rows}`;

  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sentiment-results.md';
  a.click();
  URL.revokeObjectURL(a.href);
}

document.getElementById('addTextForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('newText');
  const text = input.value.trim();
  if (!text) return;

  const id = Date.now();
  const texts = getTexts();
  texts.push({ id, content: text, sentiment: null });
  saveTexts(texts);
  renderTable();
  input.value = '';

  try {
    const res = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    const updated = getTexts().map(t =>
      t.id === id ? { ...t, sentiment: data.sentiment || 'UNKNOWN' } : t
    );
    saveTexts(updated);
    renderTable();
  } catch (err) {
    console.error('Błąd analizy:', err);
    const updated = getTexts().map(t =>
      t.id === id ? { ...t, sentiment: 'UNKNOWN' } : t
    );
    saveTexts(updated);
    renderTable();
  }
});

renderTable();
