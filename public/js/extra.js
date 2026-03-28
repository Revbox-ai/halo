// ── MOBILE HAMBURGER ─────────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  // Dropdown toggle — desktop i mobile
  navLinks.querySelectorAll('.nav-dropdown > a').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = toggle.closest('.nav-dropdown');
      const isOpen = dropdown.classList.contains('open');
      // zamknij wszystkie inne
      navLinks.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
    });
  });

  // Zamknij dropdown po kliknięciu poza nim
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      navLinks.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

// ── FAQ ITEMS ────────────────────────────────────────────
// FAQ is handled inline via onclick="this.classList.toggle('open')"
// Already works from HTML

// ── CONTACT FORM AJAX (optional enhancement) ─────────────
const serviceForm = document.getElementById('service-contact-form');
if (serviceForm) {
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(serviceForm);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/kontakt-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        const success = document.getElementById('contact-success');
        if (success) { success.style.display = 'block'; }
        serviceForm.reset();
      }
    } catch (err) {
      serviceForm.submit(); // fallback to normal form submit
    }
  });
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── NAV SCROLL EFFECT ────────────────────────────────────
const mainNav = document.getElementById('main-nav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainNav.style.background = 'rgba(10,10,10,0.98)';
    } else {
      mainNav.style.background = 'rgba(10,10,10,0.92)';
    }
  }, { passive: true });
}
