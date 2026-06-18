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
// ── DYNAMIC PROJECTS
async function loadProjects() {
  try {
    const res = await fetch('/api/projects')
    const projects = await res.json()

    const loading = document.getElementById('projects-loading')
    const featuredEl = document.getElementById('featured-project')
    const gridEl = document.getElementById('projects-grid')

    loading.style.display = 'none'

    if (projects.length === 0) {
      featuredEl.innerHTML = `<p style="color:var(--muted);text-align:center">No projects yet. Add some from the admin panel!</p>`
      return
    }

    const featured = projects.find(p => p.featured)
    const others = projects.filter(p => !p.featured)

    // Render featured project
    if (featured) {
      featuredEl.innerHTML = `
        <div class="featured-project fade-up">
          <div class="row g-0 align-items-center">
            <div class="col-lg-6">
              <div class="featured-img-wrap">
                <img src="${featured.image_url || 'https://placehold.co/600x380/ff6b6b/fff?text=' + encodeURIComponent(featured.title)}"
                     alt="${featured.title}" class="featured-img"/>
                <div class="featured-badge">⭐ Featured Project</div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="featured-body">
                <div class="project-tags mb-3">
                  ${(featured.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <h3 class="featured-title">${featured.title}</h3>
                <p class="featured-desc">${featured.description || ''}</p>
                <ul class="feature-list">
                  ${(featured.feature_list || []).map(f => `
                    <li><i class="bi bi-check-circle-fill"></i> ${f}</li>
                  `).join('')}
                </ul>
                <div class="d-flex gap-3 mt-3">
                  ${featured.live_url ? `<a href="${featured.live_url}" class="btn-primary-custom">View Project ↗</a>` : ''}
                  ${featured.github_url ? `<a href="${featured.github_url}" class="btn-outline-custom">GitHub</a>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>`
    }

    // Render other projects
    gridEl.innerHTML = others.map(p => `
      <div class="col-md-6 fade-up">
        <div class="project-card">
          <div class="project-img-wrap">
            <img src="${p.image_url || 'https://placehold.co/500x240/4d96ff/fff?text=' + encodeURIComponent(p.title)}"
                 alt="${p.title}" class="project-img"/>
            <div class="project-overlay">
              ${p.live_url ? `<a href="${p.live_url}" class="icon-btn" title="View project"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
              ${p.github_url ? `<a href="${p.github_url}" class="icon-btn" title="GitHub"><i class="bi bi-github"></i></a>` : ''}
            </div>
          </div>
          <div class="project-body">
            <div class="project-tags mb-2">
              ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description || ''}</p>
            <ul class="feature-list mt-2">
              ${(p.feature_list || []).map(f => `
                <li><i class="bi bi-check-circle-fill"></i> ${f}</li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>`
    ).join('')

    // Re-trigger fade animations
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))

  } catch (err) {
    console.error('Failed to load projects:', err)
  }
}
loadProjects()