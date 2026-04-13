// ============================================================
// NA LOJINHA — SCRIPT.JS v4
// ============================================================

// ===== LOADING SCREEN =====
(function iniciarLoadingScreen() {
  const screen = document.getElementById('loadingScreen');
  if (!screen) return;

  // Verificar barra de anúncio no início (antes do loading sumir)
  if (sessionStorage.getItem('barDismissed')) {
    document.body.classList.remove('has-bar');
    const bar = document.getElementById('announcementBar');
    if (bar) bar.style.display = 'none';
  }

  // Verificar dark mode salvo
  if (localStorage.getItem('darkMode') === 'on') {
    document.documentElement.classList.add('dark');
    const icon = document.getElementById('darkIcon');
    if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('oculto');
      screen.addEventListener('transitionend', () => screen.remove(), { once: true });
    }, 800);
  });
})();

// ===== ANNOUNCEMENT BAR =====
(function iniciarAnnouncementBar() {
  const bar   = document.getElementById('announcementBar');
  const close = document.getElementById('announcementClose');
  if (!bar || !close) return;

  close.addEventListener('click', () => {
    bar.classList.add('dismissing');
    setTimeout(() => {
      bar.style.display = 'none';
      document.body.classList.remove('has-bar');
    }, 360);
    sessionStorage.setItem('barDismissed', '1');
  });
})();

// ===== DARK MODE =====
(function iniciarDarkMode() {
  const btn  = document.getElementById('darkToggle');
  const icon = document.getElementById('darkIcon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun',  isDark);
    localStorage.setItem('darkMode', isDark ? 'on' : 'off');
  });
})();

// ===== MENU MOBILE =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    mobileNav.setAttribute('aria-hidden', !mobileNav.classList.contains('active'));
  });

  document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== NAV LINK ATIVO =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 110) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('ativo', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== BARRA DE PROGRESSO =====
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ===== BACK TO TOP =====
(function iniciarBtnTopo() {
  const btn = document.getElementById('btnTopo');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visivel', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== POPUP BOAS-VINDAS =====
(function iniciarPopup() {
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const skipBtn  = document.getElementById('popupSkip');
  if (!overlay) return;

  if (sessionStorage.getItem('popupVisto')) return;

  const fechar = () => {
    overlay.classList.remove('ativo');
    sessionStorage.setItem('popupVisto', '1');
  };

  setTimeout(() => { overlay.classList.add('ativo'); }, 4000);

  if (closeBtn) closeBtn.addEventListener('click', fechar);
  if (skipBtn)  skipBtn.addEventListener('click', fechar);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fechar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('ativo')) fechar();
  });
})();

// ===== LIGHTBOX =====
(function iniciarLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  const content = document.getElementById('lightboxContent');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');
  if (!overlay || !content) return;

  const itens = [...document.querySelectorAll('.galeria-item[data-lb-icon]')];
  let atual = 0;

  const renderItem = (idx) => {
    const item   = itens[idx];
    const icon   = item.dataset.lbIcon   || 'fas fa-image';
    const label  = item.dataset.lbLabel  || '';
    const sub    = `Item ${idx + 1} de ${itens.length}`;
    content.innerHTML = `
      <div class="lb-icon"><i class="${icon}"></i></div>
      <div class="lb-label">${label}</div>
      <div class="lb-sub">${sub}</div>
    `;
  };

  const abrir = (idx) => {
    atual = ((idx % itens.length) + itens.length) % itens.length;
    renderItem(atual);
    overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
  };

  const fechar = () => {
    overlay.classList.remove('ativo');
    document.body.style.overflow = '';
  };

  itens.forEach((item, idx) => {
    item.addEventListener('click', () => abrir(idx));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') abrir(idx); });
  });

  if (closeBtn) closeBtn.addEventListener('click', fechar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { atual--; abrir(atual); });
  if (nextBtn) nextBtn.addEventListener('click', () => { atual++; abrir(atual); });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('ativo')) return;
    if (e.key === 'Escape')      fechar();
    if (e.key === 'ArrowLeft')   { atual--; abrir(atual); }
    if (e.key === 'ArrowRight')  { atual++; abrir(atual); }
  });
})();

// ===== FAQ ACCORDION =====
(function iniciarFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const aberto  = item.classList.contains('ativo');

      // Fechar todos
      document.querySelectorAll('.faq-item.ativo').forEach(i => {
        i.classList.remove('ativo');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
      });

      // Abrir clicado (se estava fechado)
      if (!aberto) {
        item.classList.add('ativo');
        btn.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-answer').setAttribute('aria-hidden', 'false');
      }
    });
  });
})();

// ===== FORMULÁRIO DE CONTATO (envia via WhatsApp) =====
function enviarFormulario(e) {
  e.preventDefault();
  const nome     = document.getElementById('fNome')?.value.trim()     || '';
  const whatsapp = document.getElementById('fWhatsapp')?.value.trim() || '';
  const email    = document.getElementById('fEmail')?.value.trim()    || '';
  const assunto  = document.getElementById('fAssunto')?.value         || 'Contato';
  const mensagem = document.getElementById('fMensagem')?.value.trim() || '';

  if (!nome || !mensagem) {
    alert('Por favor, preencha seu nome e a mensagem.');
    return;
  }

  const linhas = [
    `Olá! Vim pelo site da Na Lojinha 🎁`,
    ``,
    `*Nome:* ${nome}`,
    whatsapp ? `*WhatsApp:* ${whatsapp}` : '',
    email    ? `*E-mail:* ${email}`      : '',
    `*Assunto:* ${assunto}`,
    ``,
    `*Mensagem:*`,
    mensagem,
  ].filter(l => l !== undefined && !(l === '' && !whatsapp && !email));

  const texto = encodeURIComponent(linhas.join('\n'));
  window.open(`https://wa.me/5515997333376?text=${texto}`, '_blank', 'noopener,noreferrer');
}

// Vincular o form ao submit
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', enviarFormulario);
});

// ===== SPARKLES NO HERO =====
function criarSparkles() {
  const heroShapes = document.querySelector('.hero-shapes');
  if (!heroShapes) return;

  const sparklesConfig = [
    { top: '15%', left: '65%',  size: '1.1rem', dur: '3.2s', delay: '0s',    cor: 'rosa'  },
    { top: '55%', left: '80%',  size: '0.75rem',dur: '4.1s', delay: '0.8s',  cor: 'teal'  },
    { top: '30%', left: '55%',  size: '0.9rem', dur: '2.8s', delay: '1.4s',  cor: 'rosa'  },
    { top: '70%', left: '70%',  size: '1.2rem', dur: '3.8s', delay: '0.4s',  cor: 'teal'  },
    { top: '20%', left: '90%',  size: '0.7rem', dur: '5s',   delay: '2s',    cor: 'rosa'  },
    { top: '80%', left: '60%',  size: '0.85rem',dur: '3.5s', delay: '1s',    cor: 'teal'  },
    { top: '42%', left: '92%',  size: '1rem',   dur: '4.4s', delay: '1.8s',  cor: 'rosa'  },
  ];

  sparklesConfig.forEach(cfg => {
    const el = document.createElement('span');
    el.className   = 'sparkle' + (cfg.cor === 'teal' ? ' sparkle-teal' : '');
    el.textContent = '✦';
    el.style.cssText = `
      top: ${cfg.top}; left: ${cfg.left};
      --size: ${cfg.size}; --dur: ${cfg.dur}; --delay: ${cfg.delay};
      font-size: ${cfg.size};
    `;
    heroShapes.appendChild(el);
  });
}
criarSparkles();

// ===== REVEAL AO SCROLL =====
function configurarReveal() {
  const mapeamento = [
    { seletor: '.section-header',     dir: 'up'    },
    { seletor: '.mvv-card',           dir: 'up'    },
    { seletor: '.historia-block',     dir: 'up'    },
    { seletor: '.produto-card',       dir: 'up'    },
    { seletor: '.vitrine-banner',     dir: 'up'    },
    { seletor: '.step-card',          dir: 'up'    },
    { seletor: '.personalizacao-cta', dir: 'up'    },
    { seletor: '.galeria-item',       dir: 'scale' },
    { seletor: '.depoimento-card',    dir: 'up'    },
    { seletor: '.contato-info',       dir: 'left'  },
    { seletor: '.contato-mapa',       dir: 'right' },
    { seletor: '.info-item',          dir: 'left'  },
    { seletor: '.categoria-card',     dir: 'up'    },
    { seletor: '.faq-item',           dir: 'up'    },
    { seletor: '.insta-post',         dir: 'scale' },
    { seletor: '.contato-form-wrap',  dir: 'up'    },
  ];

  mapeamento.forEach(({ seletor, dir }) => {
    document.querySelectorAll(seletor).forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', dir);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(c => c.hasAttribute('data-reveal'))
          : [];
        const pos   = siblings.indexOf(entry.target);
        const delay = pos >= 0 ? pos * 80 : 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}
configurarReveal();

// ===== CONTADORES =====
function animarContadores() {
  const numeros = document.querySelectorAll('.numero');
  if (!numeros.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);

      const el      = entry.target;
      const textoFim = el.textContent.trim();
      const match   = textoFim.match(/^(\d[\d.,]*)(.*)$/);
      if (!match) return;

      const numFim  = parseFloat(match[1].replace(',', '.'));
      const sufixo  = match[2];
      const duracao = 1600;
      const inicio  = performance.now();

      function tick(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const ease      = 1 - Math.pow(1 - progresso, 3);
        const atual     = Math.round(ease * numFim);
        el.textContent  = (match[1].includes('.') && numFim > 999)
          ? atual.toLocaleString('pt-BR') + sufixo
          : atual + sufixo;
        if (progresso < 1) requestAnimationFrame(tick);
        else el.textContent = textoFim;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  numeros.forEach(el => counterObserver.observe(el));
}
animarContadores();

// ===== SECTION TAGS =====
function animarSectionTags() {
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'tagPop 0.5s ease forwards';
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.section-tag').forEach(tag => {
    tag.style.opacity = '0';
    tagObserver.observe(tag);
  });
}
animarSectionTags();

// ===== VITRINE BANNER — PARALLAX =====
const vitrineBanner = document.querySelector('.vitrine-banner');
if (vitrineBanner) {
  vitrineBanner.addEventListener('mousemove', (e) => {
    const rect  = vitrineBanner.getBoundingClientRect();
    const cx    = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy    = (e.clientY - rect.top)  / rect.height - 0.5;
    vitrineBanner.querySelectorAll('.vb-icon').forEach((icon, i) => {
      const fator = (i % 2 === 0) ? 10 : -8;
      icon.style.transform = `translate(${cx * fator}px, ${cy * fator}px) scale(1.05)`;
    });
  });

  vitrineBanner.addEventListener('mouseleave', () => {
    vitrineBanner.querySelectorAll('.vb-icon').forEach(icon => {
      icon.style.transform = '';
    });
  });
}

// ===== CURSOR GLOW NO HERO =====
const heroSection = document.querySelector('.hero');
if (heroSection && window.innerWidth >= 1024) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:absolute; width:400px; height:400px; border-radius:50%;
    background:radial-gradient(circle,rgba(212,20,114,0.07) 0%,transparent 70%);
    pointer-events:none; z-index:0; transform:translate(-50%,-50%);
    transition:left 0.4s ease,top 0.4s ease;
  `;
  heroSection.appendChild(glow);

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
  });
}

// ===== HERO CARDS — restaurar float =====
setTimeout(() => {
  document.querySelectorAll('.hero-card').forEach(card => {
    card.style.animation = '';
    card.style.opacity   = '1';
    card.style.transform = '';
  });
}, 1800);
