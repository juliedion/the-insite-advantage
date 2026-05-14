/* ============================================================
   InSite Advantage — Main JS
   ============================================================ */

// ---------- Mobile Nav ----------
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

// ---------- Active Nav Link ----------
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ---------- Star Rating ----------
function initStarRating(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const stars = container.querySelectorAll('span');
  let selected = 0;

  stars.forEach((star, i) => {
    star.addEventListener('mouseover', () => {
      stars.forEach((s, j) => s.classList.toggle('active', j <= i));
    });
    star.addEventListener('mouseout', () => {
      stars.forEach((s, j) => s.classList.toggle('active', j < selected));
    });
    star.addEventListener('click', () => {
      selected = i + 1;
      stars.forEach((s, j) => s.classList.toggle('active', j < selected));
      container.dataset.value = selected;
    });
  });
}
initStarRating('starRating');

// ---------- Reviews (localStorage) ----------
const REVIEWS_KEY = 'insiteadvantage_reviews';

function getReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; }
  catch(e) { return []; }
}

function saveReview(review) {
  const reviews = getReviews();
  reviews.unshift(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

function renderStars(n) {
  return Array.from({length: 5}, (_, i) =>
    `<span>${i < n ? '★' : '☆'}</span>`
  ).join('');
}

function renderReviews() {
  const feed = document.getElementById('reviewsFeed');
  if (!feed) return;
  const reviews = getReviews();
  if (reviews.length === 0) {
    feed.innerHTML = `<div class="no-reviews">
      <p>No reviews yet — be the first to share your experience!</p>
    </div>`;
    return;
  }
  feed.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-card__header">
        <span class="review-card__name">${escapeHtml(r.name)}${r.location ? ` &mdash; <span style="font-weight:500;color:var(--gray-500)">${escapeHtml(r.location)}</span>` : ''}</span>
        <span class="review-card__date">${r.date}</span>
      </div>
      <div class="review-card__stars">${renderStars(r.rating)}</div>
      <p class="review-card__text">${escapeHtml(r.text)}</p>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Review form submission
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const starContainer = document.getElementById('starRating');
    const rating = parseInt(starContainer?.dataset.value || '0');
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    const name     = document.getElementById('reviewName').value.trim();
    const location = document.getElementById('reviewLocation').value.trim();
    const text     = document.getElementById('reviewText').value.trim();
    if (!name || !text) {
      alert('Please fill in your name and review.');
      return;
    }
    const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
    saveReview({ name, location, rating, text, date });
    reviewForm.reset();
    starContainer.dataset.value = '0';
    starContainer.querySelectorAll('span').forEach(s => s.classList.remove('active'));
    renderReviews();
    document.getElementById('reviewSuccess').style.display = 'block';
    setTimeout(() => { document.getElementById('reviewSuccess').style.display = 'none'; }, 4000);
  });
}

renderReviews();

// ---------- Contact Form ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display = 'none';
    document.getElementById('contactSuccess').style.display = 'block';
  });
}

// ---------- Smooth scroll for anchor links ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---------- Animate on scroll ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.why-card, .service-card, .testimonial-card, .plan-card, .partner-badge, .service-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
