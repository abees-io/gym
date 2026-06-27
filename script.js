/* ═══════════════════════════════════════════════════════════════
   Odessy Gym — PREMIUM FITNESS CENTER  |  script.js
   Scroll animations · Counter · Nav · Particles · Form handling
   ═══════════════════════════════════════════════════════════════ */

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initParticles();
  initScrollReveal();
  initCounters();
  initContactForm();
  initNewsletterForm();
  initActiveNavLinks();
  initWhatsAppFAB();
});

/* ══════════════════════════════════════
   NAVBAR — scroll shrink + active state
══════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════
   HAMBURGER MOBILE MENU
══════════════════════════════════════ */
function initHamburger() {
  const btn  = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('.mob-link, .mob-cta').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }
  });
}

/* ══════════════════════════════════════
   PARTICLE FIELD
══════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 18 : 36;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 3 + 1;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 12;
    const dur    = Math.random() * 12 + 10;
    const isGreen = Math.random() > 0.5;

    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${left}%;
      bottom: -10px;
      background: ${isGreen ? 'var(--accent)' : 'var(--cyan)'};
      animation-duration:  ${dur}s;
      animation-delay:     ${delay}s;
      filter: blur(${Math.random() > 0.7 ? '1px' : '0px'});
    `;
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   ANIMATED COUNTERS (Hero Stats)
══════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();

      const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        el.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const label   = document.getElementById('submit-label');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ff4d6d';
        valid = false;
      }
    });
    if (!valid) return;

    // Simulate submit
    label.textContent = 'Sending…';
    const btn = document.getElementById('contact-submit-btn');
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      label.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.opacity = '';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1400);
  });

  // Real-time border reset on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

/* ══════════════════════════════════════
   NEWSLETTER FORM
══════════════════════════════════════ */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const btn  = document.getElementById('newsletter-submit-btn');
  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput.value || !emailInput.value.includes('@')) {
      emailInput.style.borderColor = '#ff4d6d';
      return;
    }
    btn.textContent = '✓';
    btn.style.background = '#25D366';
    setTimeout(() => {
      btn.textContent = '→';
      btn.style.background = '';
      emailInput.value = '';
      emailInput.style.borderColor = '';
    }, 3000);
  });
}

/* ══════════════════════════════════════
   WHATSAPP FAB — tooltip on mobile tap
══════════════════════════════════════ */
function initWhatsAppFAB() {
  const fab = document.getElementById('whatsapp-fab');
  if (!fab) return;

  // On mobile, first tap shows tooltip; second tap navigates
  let tapped = false;
  fab.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !tapped) {
      e.preventDefault();
      tapped = true;
      fab.querySelector('.whatsapp-tooltip').style.opacity = '1';
      fab.querySelector('.whatsapp-tooltip').style.transform = 'translateX(0)';
      setTimeout(() => { tapped = false; }, 2500);
    }
  });
}
