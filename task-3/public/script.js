document.documentElement.classList.add('js');

const root = document.documentElement;
const motionToggle = document.getElementById('motionToggle');
const motionLabel = document.getElementById('motionLabel');
const progress = document.getElementById('readingProgress');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reduceMotionQuery.matches;
let frameQueued = false;
let parallaxItems = [];

function syncMotionState() {
  root.classList.toggle('motion-paused', motionPaused);
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.title = motionPaused ? 'Turn on the parallax motion' : 'Pause the parallax motion';
  motionLabel.textContent = motionPaused ? 'Motion off' : 'Motion on';
}

function updateParallax() {
  frameQueued = false;
  const viewport = window.innerHeight || 1;
  for (const item of parallaxItems) {
    if (motionPaused) {
      item.element.style.setProperty('--parallax-y', '0px');
      continue;
    }
    const rect = item.element.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > viewport + 120) continue;
    const offset = -rect.top * item.speed;
    item.element.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
  }

  const maxScroll = document.documentElement.scrollHeight - viewport;
  const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progress.style.transform = `scaleX(${ratio.toFixed(4)})`;
}

function requestParallaxFrame() {
  if (!frameQueued) {
    frameQueued = true;
    window.requestAnimationFrame(updateParallax);
  }
}

function refreshParallaxItems() {
  parallaxItems = Array.from(document.querySelectorAll('[data-parallax]')).map((element) => ({
    element,
    speed: Number.parseFloat(element.dataset.parallax) || 0,
  }));
  requestParallaxFrame();
}

motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncMotionState();
  requestParallaxFrame();
});

reduceMotionQuery.addEventListener?.('change', (event) => {
  if (event.matches) {
    motionPaused = true;
    syncMotionState();
    requestParallaxFrame();
  }
});

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -32px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const wishButton = document.getElementById('wishButton');
const wishLabel = document.getElementById('wishLabel');
const wishNote = document.getElementById('wishNote');
wishButton.addEventListener('click', () => {
  const saved = wishButton.getAttribute('aria-pressed') !== 'true';
  wishButton.setAttribute('aria-pressed', String(saved));
  wishLabel.textContent = saved ? 'Feeling pocketed' : 'Pocket this feeling';
  wishNote.hidden = !saved;
});

syncMotionState();
refreshParallaxItems();
window.addEventListener('scroll', requestParallaxFrame, { passive: true });
window.addEventListener('resize', () => {
  refreshParallaxItems();
  requestParallaxFrame();
}, { passive: true });
