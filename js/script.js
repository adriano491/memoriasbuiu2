const grid = document.getElementById('essay-grid');
const search = document.getElementById('essay-search');
const count = document.getElementById('essay-count');
const empty = document.getElementById('empty-state');
const modal = document.getElementById('essay-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalNumber = document.getElementById('modal-number');
let activeEssay = null;

function renderEssays(term = '') {
  const normalized = term.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const filtered = window.ESSAYS.map((essay, index) => ({...essay, index}))
    .filter(essay => (essay.title + ' ' + essay.paragraphs.join(' ')).toLocaleLowerCase('pt-BR')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized));
  grid.innerHTML = filtered.map(essay => `
    <button class="essay-card" data-index="${essay.index}">
      <div class="essay-card-top"><span>REDAÇÃO ${(essay.index + 1).toString().padStart(2,'0')}</span><span>↗</span></div>
      <h3>${escapeHtml(essay.title)}</h3>
      <div class="essay-open"><span>ABRIR TEXTO</span><span>→</span></div>
    </button>`).join('');
  count.textContent = `${filtered.length} ${filtered.length === 1 ? 'REDAÇÃO' : 'REDAÇÕES'}`;
  empty.hidden = filtered.length !== 0;
}
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function openEssay(index) {
  activeEssay = window.ESSAYS[index];
  modalTitle.textContent = activeEssay.title;
  modalNumber.textContent = `REDAÇÃO ${(index + 1).toString().padStart(2,'0')} / 17`;
  modalContent.innerHTML = activeEssay.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
grid.addEventListener('click', event => {
  const card = event.target.closest('[data-index]');
  if (card) openEssay(Number(card.dataset.index));
});
search.addEventListener('input', () => renderEssays(search.value));
modal.addEventListener('click', event => { if (event.target.hasAttribute('data-close')) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.getElementById('copy-essay').addEventListener('click', async () => {
  if (!activeEssay) return;
  const text = activeEssay.title + '\n\n' + activeEssay.paragraphs.join('\n\n');
  const button = document.getElementById('copy-essay');
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copiado ✓';
    setTimeout(() => button.textContent = 'Copiar texto ↗', 1600);
  } catch {
    button.textContent = 'Não foi possível copiar';
  }
});
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
}));
renderEssays();
