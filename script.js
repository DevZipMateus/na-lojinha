// ============================================================
// NA LOJINHA — SCRIPT.JS
// ============================================================

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
const sections    = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.desktop-nav a');

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

// ============================================================
// BARRA DE PROGRESSO DE SCROLL
// ============================================================
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ============================================================
// SPARKLES NO HERO
// ============================================================
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
      top: ${cfg.top};
      left: ${cfg.left};
      --size: ${cfg.size};
      --dur: ${cfg.dur};
      --delay: ${cfg.delay};
      font-size: ${cfg.size};
    `;
    heroShapes.appendChild(el);
  });
}

criarSparkles();

// ============================================================
// REVEAL AO SCROLL (data-reveal)
// ============================================================
function configurarReveal() {
  // Mapear elementos para data-reveal automático
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
  ];

  mapeamento.forEach(({ seletor, dir }) => {
    document.querySelectorAll(seletor).forEach(el => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', dir);
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger por grupo: delay baseado na posição no DOM
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(c => c.hasAttribute('data-reveal'))
          : [];
        const pos = siblings.indexOf(entry.target);
        const delay = pos >= 0 ? pos * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

configurarReveal();

// ============================================================
// ANIMAÇÃO DOS NÚMEROS (contador)
// ============================================================
function animarContadores() {
  const numeros = document.querySelectorAll('.numero');
  if (!numeros.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);

      const el       = entry.target;
      const textoFim = el.textContent.trim();

      // Extrair número e sufixo
      const match = textoFim.match(/^(\d[\d.,]*)(.*)$/);
      if (!match) return; // Ex: "∞" não é número, pular

      const numFim  = parseFloat(match[1].replace(',', '.'));
      const sufixo  = match[2];
      const duracao = 1600; // ms
      const inicio  = performance.now();

      function tick(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const ease      = 1 - Math.pow(1 - progresso, 3); // easeOutCubic
        const atual     = Math.round(ease * numFim);

        // Formatar igual ao original
        if (match[1].includes('.') && numFim > 999) {
          el.textContent = atual.toLocaleString('pt-BR') + sufixo;
        } else {
          el.textContent = atual + sufixo;
        }

        if (progresso < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = textoFim; // garantir valor exato no final
        }
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  numeros.forEach(el => counterObserver.observe(el));
}

animarContadores();

// ============================================================
// SECTION TAGS — ANIMAÇÃO DE ENTRADA
// ============================================================
function animarSectionTags() {
  const tags = document.querySelectorAll('.section-tag');
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'tagPop 0.5s ease forwards';
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  tags.forEach(tag => {
    tag.style.opacity = '0';
    tagObserver.observe(tag);
  });
}

animarSectionTags();

// ============================================================
// VITRINE BANNER — PARALLAX LEVE AO MOUSE
// ============================================================
const vitrineBanner = document.querySelector('.vitrine-banner');
if (vitrineBanner) {
  vitrineBanner.addEventListener('mousemove', (e) => {
    const rect   = vitrineBanner.getBoundingClientRect();
    const cx     = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy     = (e.clientY - rect.top)  / rect.height - 0.5;
    const icons  = vitrineBanner.querySelectorAll('.vb-icon');

    icons.forEach((icon, i) => {
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

// ============================================================
// CURSOR GLOW SUAVE NO HERO
// ============================================================
const heroSection = document.querySelector('.hero');
if (heroSection && window.innerWidth >= 1024) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,20,114,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.4s ease, top 0.4s ease;
  `;
  heroSection.appendChild(glow);

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
  });
}

// ============================================================
// HERO CARDS — restaurar float após entrada
// ============================================================
setTimeout(() => {
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach((card, i) => {
    card.style.animation = '';
    card.style.opacity   = '1';
    card.style.transform = '';
  });
}, 1800);
