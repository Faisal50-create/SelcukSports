document.addEventListener('DOMContentLoaded', function () {

  /* =========================
     Mobile Menu
  ========================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('open');
      mainNav.classList.toggle('show');

      const isExpanded = this.classList.contains('open');
      this.setAttribute('aria-expanded', isExpanded);

      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
  } else {
    console.error('Mobile menu elements not found!');
  }

  /* =========================
     Theme Toggle
  ========================== */
  const toggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  if (toggle) {
    // Init theme
    const currentTheme = localStorage.getItem('theme') ||
      (prefersDark.matches ? 'dark' : 'light');
    applyTheme(currentTheme);

    // Toggle handler
    toggle.addEventListener('click', () => {
      const newTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });

    // System preference listener
    prefersDark.addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
    }
  }

  /* =========================
     Match API Placeholder
  ========================== */
  const matchContainer = document.getElementById('match-api-container');
  if (matchContainer) {
    matchContainer.innerHTML = `
      <div class="match-card">
        <h3>Match Data Loading...</h3>
        <p>Live match data will appear here</p>
      </div>
    `;
  }

  /* =========================
     Load More TV Channels
  ========================== */
  const loadMoreBtn = document.getElementById('loadMoreTv');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      document.querySelectorAll('.hidden-tv').forEach(el => {
        el.classList.remove('hidden-tv');
      });
      loadMoreBtn.remove();
    });
  }

  /* =========================
     Post Category Filter
  ========================== */
  const buttons = document.querySelectorAll('.filter-btn');
  const posts = Array.from(document.querySelectorAll('.post-card'));

  const normalize = s => String(s || '').trim().toLowerCase();

  function getPostCats(post) {
    const raw =
      post.dataset.category ||
      post.getAttribute('data-category') ||
      '';
    return raw
      .split(/[\s,;]+/)
      .map(c => normalize(c))
      .filter(Boolean);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = normalize(btn.getAttribute('data-category'));

      posts.forEach(post => {
        const postCats = getPostCats(post);
        post.style.display =
          category === 'all' || postCats.includes(category)
            ? ''
            : 'none';
      });
    });
  });

});
// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle active class on clicked question
            question.classList.toggle('active');
            
            // Close other open questions (optional)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                }
            });
        });
    });
});

