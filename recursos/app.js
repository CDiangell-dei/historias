// CDiangell - Web Application Logic (Mobile & Desktop)
document.addEventListener('DOMContentLoaded', () => {
  const data = window.STORIES_DATA;
  if (!data) return;

  // DOM Elements
  const chapterNavContainer = document.getElementById('chapterNavContainer');
  const mainContent = document.getElementById('mainContent');
  const toastMsg = document.getElementById('toastMsg');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const fontDecBtn = document.getElementById('fontDecBtn');
  const fontIncBtn = document.getElementById('fontIncBtn');
  const fontDecBtnMobile = document.getElementById('fontDecBtnMobile');
  const fontIncBtnMobile = document.getElementById('fontIncBtnMobile');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const btnBrandHome = document.getElementById('btnBrandHome');

  // State
  let currentStoryId = 'reencontro';
  let currentChapterId = 'reencontro-cap1';
  let currentViewMode = 'reader'; // 'reader' | 'ao3'
  let currentMainView = 'story'; // 'story' | 'map' | 'glossary' | 'rpg'
  let currentTheme = localStorage.getItem('cdiangell_theme') || 'theme-night';
  let currentFontSize = localStorage.getItem('cdiangell_font_size') || 'font-md';

  // Apply saved settings
  applyTheme(currentTheme);
  applyFontSize(currentFontSize);

  // Build Sidebar Nav
  buildSidebar();

  // Load Initial Chapter
  renderView();

  // Mobile Drawer Events
  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
  }

    const floatingMenuBtn = document.getElementById('floatingMenuBtn');
  if (floatingMenuBtn) {
    floatingMenuBtn.addEventListener('click', openMobileSidebar);
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (btnBrandHome) {
    btnBrandHome.addEventListener('click', () => {
      currentMainView = 'story';
      currentStoryId = 'reencontro';
      currentChapterId = 'reencontro-cap1';
      updateSidebarActive();
      renderView();
      closeMobileSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (currentTheme === 'theme-night') currentTheme = 'theme-void';
      else if (currentTheme === 'theme-void') currentTheme = 'theme-grimoire';
      else currentTheme = 'theme-night';
      applyTheme(currentTheme);
    });
  }

  // Font Size
  const fontSizes = ['font-sm', 'font-md', 'font-lg', 'font-xl'];
  if (fontDecBtn) {
    fontDecBtn.addEventListener('click', () => {
      let idx = fontSizes.indexOf(currentFontSize);
      if (idx > 0) {
        currentFontSize = fontSizes[idx - 1];
        applyFontSize(currentFontSize);
      }
    });
  }
  if (fontDecBtnMobile) {
    fontDecBtnMobile.addEventListener('click', () => {
      let idx = fontSizes.indexOf(currentFontSize);
      if (idx > 0) {
        currentFontSize = fontSizes[idx - 1];
        applyFontSize(currentFontSize);
      }
    });
  }
  if (fontIncBtnMobile) {
    fontIncBtnMobile.addEventListener('click', () => {
      let idx = fontSizes.indexOf(currentFontSize);
      if (idx < fontSizes.length - 1) {
        currentFontSize = fontSizes[idx + 1];
        applyFontSize(currentFontSize);
      }
    });
  }

  if (fontIncBtn) {
    fontIncBtn.addEventListener('click', () => {
      let idx = fontSizes.indexOf(currentFontSize);
      if (idx < fontSizes.length - 1) {
        currentFontSize = fontSizes[idx + 1];
        applyFontSize(currentFontSize);
      }
    });
  }

  function applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-[a-z]+/g, '').trim();
    document.body.classList.add(theme);
    localStorage.setItem('cdiangell_theme', theme);
  }

  function applyFontSize(fSize) {
    document.body.className = document.body.className.replace(/font-[a-z]+/g, '').trim();
    document.body.classList.add(fSize);
    localStorage.setItem('cdiangell_font_size', fSize);
  }

  function showToast(text) {
    if (!toastMsg) return;
    toastMsg.innerHTML = `<span>📋</span> ${text}`;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3200);
  }

  function buildSidebar() {
    if (!chapterNavContainer) return;
    chapterNavContainer.innerHTML = '';

    // Stories Group
    const storiesSec = document.createElement('div');
    storiesSec.className = 'sidebar-section';
    storiesSec.innerHTML = `
      <div class="sidebar-heading">
        <span>🌌 Re:Zero Fanfictions</span>
        <span class="badge-count">${data.stories.length}</span>
      </div>
    `;

    data.stories.forEach(s => {
      const group = document.createElement('div');
      group.className = 'nav-story-group';
      
      const headerBtn = document.createElement('button');
      headerBtn.className = 'story-header-btn';
      headerBtn.innerHTML = `
        <span>${s.title}</span>
        <span style="font-size:0.75rem;opacity:0.6">${s.chapters.length} cap</span>
      `;
      group.appendChild(headerBtn);

      const chList = document.createElement('div');
      chList.className = 'story-chapter-list';

      s.chapters.forEach(ch => {
        const chBtn = document.createElement('button');
        chBtn.className = `chapter-btn ${ch.id === currentChapterId ? 'active' : ''}`;
        chBtn.innerHTML = `✦ ${ch.title}`;
        chBtn.addEventListener('click', () => {
          currentMainView = 'story';
          currentStoryId = s.id;
          currentChapterId = ch.id;
          updateSidebarActive();
          renderView();
          closeMobileSidebar();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        chList.appendChild(chBtn);
      });

      group.appendChild(chList);
      storiesSec.appendChild(group);
    });
    chapterNavContainer.appendChild(storiesSec);

    // Resources Group
    const resSec = document.createElement('div');
    resSec.className = 'sidebar-section';
    resSec.innerHTML = `
      <div class="sidebar-heading">
        <span>📚 Recursos & Grimório</span>
      </div>
      <button class="nav-link-btn" id="btnNavMap">
        <span>🗺️</span> Mapa dos Quatro Reinos
      </button>
      <button class="nav-link-btn" id="btnNavGlossary">
        <span>🍎</span> Glossário Alimentar
      </button>
      <button class="nav-link-btn" id="btnNavRpg">
        <span>🎲</span> RPG: Bellum Egrégora
      </button>
    `;
    chapterNavContainer.appendChild(resSec);

    // Bind Resources Links
    setTimeout(() => {
      const bMap = document.getElementById('btnNavMap');
      const bGlo = document.getElementById('btnNavGlossary');
      const bRpg = document.getElementById('btnNavRpg');

      if (bMap) bMap.addEventListener('click', () => {
        currentMainView = 'map';
        updateSidebarActive();
        renderView();
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      if (bGlo) bGlo.addEventListener('click', () => {
        currentMainView = 'glossary';
        updateSidebarActive();
        renderView();
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      if (bRpg) bRpg.addEventListener('click', () => {
        currentMainView = 'rpg';
        updateSidebarActive();
        renderView();
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }, 50);
  }

  function updateSidebarActive() {
    document.querySelectorAll('.chapter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    if (currentMainView === 'story') {
      document.querySelectorAll('.chapter-btn').forEach(btn => {
        const ch = findChapter(currentChapterId);
        if (ch && btn.textContent.includes(ch.title)) {
          btn.classList.add('active');
        }
      });
    } else if (currentMainView === 'map') {
      const b = document.getElementById('btnNavMap');
      if (b) b.classList.add('active');
    } else if (currentMainView === 'glossary') {
      const b = document.getElementById('btnNavGlossary');
      if (b) b.classList.add('active');
    } else if (currentMainView === 'rpg') {
      const b = document.getElementById('btnNavRpg');
      if (b) b.classList.add('active');
    }
  }

  function findChapter(chId) {
    for (const s of data.stories) {
      for (const ch of s.chapters) {
        if (ch.id === chId) return ch;
      }
    }
    return data.stories[0].chapters[0];
  }

  function findStory(sId) {
    return data.stories.find(s => s.id === sId) || data.stories[0];
  }

  function renderView() {
    if (!mainContent) return;

    if (currentMainView === 'story') {
      renderStoryView();
    } else if (currentMainView === 'map') {
      renderMapView();
    } else if (currentMainView === 'glossary') {
      renderGlossaryView();
    } else if (currentMainView === 'rpg') {
      renderRpgView();
    }
  }

  function renderStoryView() {
    const story = findStory(currentStoryId);
    const chapter = findChapter(currentChapterId);
    const meta = chapter.meta || {};

    let badgesHtml = '';
    if (meta.universe) badgesHtml += `<span class="badge badge-fandom">🌍 ${meta.universe}</span>`;
    if (meta.pair) badgesHtml += `<span class="badge badge-pair">💖 ${meta.pair}</span>`;
    if (meta.characters) badgesHtml += `<span class="badge badge-characters">👥 ${meta.characters}</span>`;

    mainContent.innerHTML = `
      <div class="reader-header">
        <div class="story-badge-row">${badgesHtml}</div>
        <div class="reader-title-area">
          <h1>${story.title}</h1>
          <h2>${chapter.title}</h2>
        </div>

        <div class="action-toolbar">
          <div class="view-tabs">
            <button class="view-tab ${currentViewMode === 'reader' ? 'active' : ''}" id="tabReader">📖 Modo Leitura</button>
            <button class="view-tab ${currentViewMode === 'ao3' ? 'active' : ''}" id="tabAo3">💻 Código AO3</button>
          </div>
          
          <button class="ao3-copy-button" id="btnCopyAo3">
            <span>📋</span> Copiar HTML para AO3
          </button>
        </div>
      </div>

      <div id="readerContainer">
        ${currentViewMode === 'reader' 
          ? `<div class="reader-body">${chapter.readerHtml}</div>`
          : `<div class="ao3-code-view">${escapeHtml(chapter.ao3Html)}</div>`
        }
      </div>
    `;

    // Bind toolbar buttons
    const tabReader = document.getElementById('tabReader');
    const tabAo3 = document.getElementById('tabAo3');
    const btnCopy = document.getElementById('btnCopyAo3');

    if (tabReader) {
      tabReader.addEventListener('click', () => {
        currentViewMode = 'reader';
        renderStoryView();
      });
    }
    if (tabAo3) {
      tabAo3.addEventListener('click', () => {
        currentViewMode = 'ao3';
        renderStoryView();
      });
    }
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(chapter.ao3Html).then(() => {
          showToast('Código HTML copiado! Pronto para colar no AO3.');
        }).catch(() => {
          showToast('Erro ao copiar automaticamente.');
        });
      });
    }
  }

  function renderMapView() {
    mainContent.innerHTML = `
      <div class="reader-header">
        <div class="reader-title-area">
          <h1>Mapa dos Quatro Reinos</h1>
          <h2>O Mundo de Re:Zero Starting Life in Another World</h2>
        </div>
      </div>

      <div class="map-view-container">
        <div class="map-card">
          <div class="map-image-wrapper" id="mapWrapper" title="Toque para abrir a imagem completa">
            <img src="recursos/mapa_rezero.jpg" alt="Mapa Oficial dos Quatro Reinos de Re:Zero" />
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.75rem;text-align:center;">
            🔍 Dica: em celulares, use o gesto de pinça na imagem ou abra em nova guia para ler os nomes das províncias em alta resolução.
          </p>
        </div>

        <div class="map-legend-grid">
          <div class="legend-box">
            <h4>🏰 Reino de Lugunica</h4>
            <p>O Reino do Dragão a Leste. Inclui a Capital Real, a Planície de Lifaus e os <strong>Campos Costuul (Mansão Miload)</strong>.</p>
          </div>
          <div class="legend-box">
            <h4>❄️ Reino Sagrado de Gusteko</h4>
            <p>A terra gélida ao Norte, governada pela Igreja dos Espíritos e delimitada pelas Montanhas do Éter.</p>
          </div>
          <div class="legend-box">
            <h4>⚔️ Sacro Império de Vollachia</h4>
            <p>A nação militar ao Sul governada pela lei do mais forte, com sua capital Lupugana e a Cordilheira Garkla.</p>
          </div>
          <div class="legend-box">
            <h4>🏮 Cidades-Estado de Kararagi</h4>
            <p>A federação mercantil a Oeste inspirada na cultura tradicional japonesa trazida pelo lendário Hoshin.</p>
          </div>
        </div>
      </div>
    `;

    const mapWrapper = document.getElementById('mapWrapper');
    if (mapWrapper) {
      mapWrapper.addEventListener('click', () => {
        window.open('recursos/mapa_rezero.jpg', '_blank');
      });
    }
  }

  function renderGlossaryView() {
    const items = data.glossary || [];

    mainContent.innerHTML = `
      <div class="reader-header">
        <div class="reader-title-area">
          <h1>Glossário Alimentar & Termos</h1>
          <h2>Equivalência Oficial: Mundo de Re:Zero vs. Terra</h2>
        </div>
      </div>

      <input type="text" id="glossarySearch" class="glossary-search-bar" placeholder="🔍 Pesquisar por termo em Re:Zero ou tradução na Terra (ex: solte, maçã, bokko)..." />

      <div class="glossary-grid" id="glossaryGrid">
        ${renderGlossaryCards(items)}
      </div>
    `;

    const searchInput = document.getElementById('glossarySearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = items.filter(it => 
          it.rezero.toLowerCase().includes(query) || 
          it.terra.toLowerCase().includes(query)
        );
        const grid = document.getElementById('glossaryGrid');
        if (grid) grid.innerHTML = renderGlossaryCards(filtered);
      });
    }
  }

  function renderGlossaryCards(items) {
    if (!items.length) {
      return `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">Nenhum ingrediente ou termo encontrado.</div>`;
    }
    return items.map(it => `
      <div class="glossary-card">
        <div class="rezero-term">${it.rezero}</div>
        <div class="terra-term">${it.terra}</div>
      </div>
    `).join('');
  }

  function renderRpgView() {
    mainContent.innerHTML = `
      <div class="reader-header">
        <div class="reader-title-area">
          <h1>Bellum Egrégora: O Flagelo de Metus</h1>
          <h2>Sistema de RPG Medieval Sombrio • Mesa Diangell</h2>
        </div>
      </div>

      <div class="reader-body" style="text-indent:0;">
        <p><strong>Bellum Egrégora: O Flagelo de Metus</strong> é uma adaptação de RPG medieval dark desenvolvida por <strong>CDiangell</strong> sobre a base mecânica de <em>Ordem Paranormal RPG</em> com elementos enriquecidos de <em>Tormenta20</em> e <em>Sobrevivendo ao Horror</em>.</p>

        <div class="scene-tag"><span class="scene-badge">DESTAQUES MECÂNICOS</span> Inovações do Sistema</div>
        <ul style="list-style:disc;margin-left:1.75rem;margin-bottom:1.5rem;color:var(--text-book);line-height:1.9;">
          <li><strong>23 Origens Medievais:</strong> De Herdeiros Decadentes a Flagelados, Mercenários de Fronteira e Escribas Reclusos.</li>
          <li><strong>Defesa Ativa:</strong> O defensor rola dados para aparar, bloquear com escudo ou esquivar, tornando o combate visceral.</li>
          <li><strong>Magia Canalizada por Sanidade:</strong> Não há pontos de mana triviais; dobrar as leis do mundo consome a sanidade e a alma do conjurador.</li>
          <li><strong>Sobrevivência & Ferimentos Críticos:</strong> Mecânicas de sangramento, membros dilacerados e horror psicológico.</li>
        </ul>

        <div class="scene-break"><span class="star-icon">✦ ✦ ✦</span></div>

        <div class="action-toolbar" style="margin-top:2rem;">
          <div>
            <h4 style="font-family:var(--font-display);color:var(--accent-gold);margin-bottom:0.2rem;">Complemento Oficial de Regras</h4>
            <p style="font-size:0.82rem;color:var(--text-muted);">PDF oficial diagramado com todas as tabelas e regras da Mesa Diangell.</p>
          </div>
          <a href="RPG/Complemento de Regras - Mesa Diangell.pdf" target="_blank" class="ao3-copy-button" style="text-decoration:none;">
            <span>📥</span> Baixar Livro de Regras (PDF)
          </a>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
