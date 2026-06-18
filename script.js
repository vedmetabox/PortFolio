// ── NAVBAR scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── ACTIVE nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
});

// ── FOOTER year
document.getElementById('year').textContent = new Date().getFullYear();

// ── FADE-UP on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── TYPED text effect
const words = ['beautiful UIs.', 'fast websites.', 'creative apps.', 'cool things.'];
let wi = 0, ci = 0, deleting = false;
const typed = document.getElementById('typed');
function typeLoop() {
  if (!typed) return;
  const word = words[wi];
  typed.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci > word.length)      { deleting = true; setTimeout(typeLoop, 1200); return; }
  if (deleting && ci < 0)                 { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
  setTimeout(typeLoop, deleting ? 60 : 110);
}
typeLoop();

// ── CLOSE mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    const bs = bootstrap.Collapse.getInstance(menu);
    if (bs) bs.hide();
  });
});
