/* ═══════════════════════════════════════════════════════
   APEX POST STUDIO v2 — app.js
   Full logic: State · History · Formats · Themes · Render
═══════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════════
let currentSlideIndex = 0;
let currentTemplate   = 'dark-gold';
let currentAccent     = '#c9a84c';
let mainFontSize      = 38;
let currentFormat     = 'post'; // 'post' | 'portrait' | 'story'

// History
let history      = [];
let historyIndex = -1;
const MAX_HISTORY = 40;

// Image crop store: key → { src, scale, x, y, rotate }
const imgStore = {};
function imgKey(slideIdx, field) { return `s${slideIdx}_i${field}`; }

// ════════════════════════════════════════════════
//  FORMAT CONFIG
// ════════════════════════════════════════════════
const FORMAT_CONFIG = {
  post:     { w: 1080, h: 1080, label: '1080 × 1080 · Square Post'    },
  portrait: { w: 1080, h: 1350, label: '1080 × 1350 · Portrait 4:5'   },
  story:    { w: 1080, h: 1920, label: '1080 × 1920 · Story / Reel 9:16' }
};

// ════════════════════════════════════════════════
//  TEMPLATE ACCENTS
// ════════════════════════════════════════════════
const TEMPLATE_ACCENTS = {
  'dark-gold':  '#c9a84c',
  'light-warm': '#a07830',
  'obsidian':   '#a078dc',
  'ivory':      '#b03030',
  'slate':      '#50a0dc',
  'matte-rose': '#e080a0',
  'forest':     '#60c878',
  'midnight':   '#7090e8',
  'charcoal':   '#e8e8e8',
  'deep-wine':  '#c0305a',
  'sand':       '#8b6340',
  'noir':       '#ffffff'
};

const TEMPLATE_BG = {
  'dark-gold':  '#0a0a0a',
  'light-warm': '#faf5ec',
  'obsidian':   '#0d0d14',
  'ivory':      '#f5f0e4',
  'slate':      '#1a1f2e',
  'matte-rose': '#1a1015',
  'forest':     '#0d140f',
  'midnight':   '#080810',
  'charcoal':   '#1c1c1c',
  'deep-wine':  '#110008',
  'sand':       '#e8ddc8',
  'noir':       '#050505'
};

const LIGHT_TEMPLATES = ['light-warm', 'ivory', 'sand'];

// ════════════════════════════════════════════════
//  DEFAULT CARD DATA
// ════════════════════════════════════════════════
const defaultCardData = {
  hook: {
    label: 'Hook',
    category: 'Pro Tip',
    hook: 'Stop overpaying for standard tech.',
    accent: 'overpaying',
    sub: 'We source the best gear so you never have to compromise.',
    brand: 'YOUR BRAND'
  },
  quote: {
    label: 'Quote',
    quote: 'Quality is remembered long after the price is forgotten.',
    author: 'Aldo Gucci',
    brand: 'YOUR BRAND'
  },
  compare: {
    label: 'Compare',
    category: 'Standard vs Premium',
    avg: 'Buys unbranded tech. No warranty. Hidden repair costs.',
    elite: 'Invests in trusted brands. Extended warranty. Total peace of mind.',
    bottom: 'Value is what you get, not just what you pay.',
    brand: 'YOUR BRAND'
  },
  framework: {
    label: 'Steps',
    category: 'How To Choose A TV',
    steps: 'Measure your room viewing distance.\nChoose OLED for dark rooms or QLED for bright.\nCheck HDMI 2.1 for gaming.',
    closing: 'Visit our store for a live demo.',
    brand: 'YOUR BRAND'
  },
  list: {
    label: 'List',
    eyebrow: 'Top Picks',
    title: 'Top Tech Upgrades',
    items: '4K Smart LED Displays\nHigh-Efficiency Inverter ACs\nNext-Gen Gaming Laptops\nNoise-Cancelling Audio',
    brand: 'YOUR BRAND'
  },
  closing: {
    label: 'Closing',
    closing: '"Your trusted tech partner."',
    brand: 'YOUR BRAND',
    handle: '@yourbrand'
  },
  caption: {
    label: 'Caption',
    caption: 'Drop by today to check out our latest arrivals. Zero-cost EMI on all major cards.',
    tags: '#YourBrand #TechUpgrade #Gadgets #NewArrival',
    brand: 'YOUR BRAND'
  },
  stat: {
    label: 'Stat',
    eyebrow: 'Did You Know',
    number: '94%',
    unit: 'Customer Satisfaction Rate',
    desc: 'Based on 10,000+ verified reviews from customers across India.',
    source: 'Source: Internal Survey 2024',
    brand: 'YOUR BRAND'
  },
  timeline: {
    label: 'Timeline',
    eyebrow: 'Our Journey',
    title: 'Built Over Years of Trust',
    items: '2018: Founded with a single store in Mumbai.\n2020: Expanded to 5 cities across India.\n2022: Crossed 1 lakh happy customers.\n2024: Launched online delivery pan-India.',
    brand: 'YOUR BRAND'
  },
  manifesto: {
    label: 'Manifesto',
    tag: 'Our Philosophy',
    body: 'We don\'t just sell products. We build relationships that last a lifetime.',
    sub: 'Every product we carry is tested, trusted, and backed by our promise.',
    brand: 'YOUR BRAND'
  },
  media: {
    label: 'Media',
    badge: 'New Arrival',
    title: 'The Ultimate Setup.',
    text: 'Upgrade your workspace with our latest high-performance displays.',
    img1: '',
    brand: 'YOUR BRAND'
  },
  product: {
    label: 'Product',
    img1: '',
    title: 'Sony Alpha A7 IV',
    price: '₹2,50,000',
    specs: '• 33MP Full-Frame Sensor\n• 4K 60p Video\n• Real-time Eye AF\n• 10-bit 4:2:2 Color',
    cta: 'Tap to Buy',
    brand: 'YOUR BRAND'
  },
  split: {
    label: 'Split',
    img1: '',
    textTop: 'OLED TV',
    img2: '',
    textBottom: 'QLED TV',
    centerTag: 'VS',
    brand: 'YOUR BRAND'
  },
  review: {
    label: 'Review',
    img1: '',
    rating: '★★★★★',
    quote: 'Absolutely the best store! Fast delivery and perfect packaging.',
    author: 'Rahul D.',
    role: 'Verified Buyer',
    brand: 'YOUR BRAND'
  },
  expert: {
    label: 'Expert',
    img1: '',
    name: 'Store Manager',
    title: 'Your Brand Name',
    quote: 'We personally test every device before recommending it to our customers.',
    brand: 'YOUR BRAND'
  },
  promo: {
    label: 'Promo',
    eyebrow: 'Limited Time Offer',
    title: 'Summer Tech Sale',
    price: 'Up to 40% Off',
    detail: 'On all Smart TVs & Audio',
    cta: 'Tap To Shop Now',
    brand: 'YOUR BRAND'
  },
  carousel: {
    label: 'Carousel',
    img1: '',
    number: '01',
    title: 'Unbox the Future.',
    desc: 'Our latest arrivals redefine what premium technology feels like.',
    dots: '5',
    activeDot: '1',
    brand: 'YOUR BRAND'
  },
  announcement: {
    label: 'Announce',
    flash: '🔥 Just Announced',
    headline: 'Grand\nOpening',
    desc: 'We\'re launching our biggest store yet in Connaught Place, New Delhi.',
    cta: 'Save the Date →',
    brand: 'YOUR BRAND'
  }
};

// ════════════════════════════════════════════════
//  INITIAL SLIDES
// ════════════════════════════════════════════════
let slides = [
  { type: 'hook',         ...defaultCardData.hook },
  { type: 'product',      ...defaultCardData.product },
  { type: 'compare',      ...defaultCardData.compare },
  { type: 'stat',         ...defaultCardData.stat },
  { type: 'quote',        ...defaultCardData.quote },
  { type: 'closing',      ...defaultCardData.closing }
];

// ════════════════════════════════════════════════
//  HISTORY / UNDO / REDO
// ════════════════════════════════════════════════
function saveHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push({
    slides: JSON.parse(JSON.stringify(slides)),
    currentSlideIndex,
    currentTemplate,
    currentAccent,
    mainFontSize,
    currentFormat
  });
  if (history.length > MAX_HISTORY) history.shift();
  historyIndex = history.length - 1;
  updateHistoryButtons();
}

function undoAction() {
  if (historyIndex <= 0) return;
  historyIndex--;
  applyHistoryState(history[historyIndex]);
}

function redoAction() {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  applyHistoryState(history[historyIndex]);
}

function applyHistoryState(state) {
  slides             = JSON.parse(JSON.stringify(state.slides));
  currentSlideIndex  = state.currentSlideIndex;
  currentTemplate    = state.currentTemplate;
  currentAccent      = state.currentAccent;
  mainFontSize       = state.mainFontSize;
  currentFormat      = state.currentFormat || 'post';

  document.getElementById('rng-hooksize').value = mainFontSize;
  document.getElementById('rng-val').textContent = mainFontSize;

  // Sync theme chips
  document.querySelectorAll('.chip').forEach(c => {
    const m = c.getAttribute('onclick')?.match(/'([^']+)'/);
    c.classList.toggle('active', m && m[1] === currentTemplate);
  });
  // Sync swatches
  document.querySelectorAll('.swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.color === currentAccent));

  // Sync format buttons
  document.querySelectorAll('.fmt-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.fmt === currentFormat));

  // Update card format
  document.getElementById('ig-card').dataset.format = currentFormat;
  document.getElementById('canvas-size-label').textContent = FORMAT_CONFIG[currentFormat].label;

  refreshAll();
  updateHistoryButtons();
}

function updateHistoryButtons() {
  const u = document.getElementById('undo-btn');
  const r = document.getElementById('redo-btn');
  if (u) u.style.opacity = historyIndex <= 0 ? '0.32' : '1';
  if (r) r.style.opacity = historyIndex >= history.length - 1 ? '0.32' : '1';
}

// ════════════════════════════════════════════════
//  FORMAT SWITCHING
// ════════════════════════════════════════════════
function setFormat(fmt, btn) {
  saveHistory();
  currentFormat = fmt;
  document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const card = document.getElementById('ig-card');
  card.dataset.format = fmt;
  document.getElementById('canvas-size-label').textContent = FORMAT_CONFIG[fmt].label;
  showToast(`Format: ${FORMAT_CONFIG[fmt].label}`);
  requestAnimationFrame(() => requestAnimationFrame(scaleCanvasToFit));
}

// ════════════════════════════════════════════════
//  MOBILE SIDEBAR
// ════════════════════════════════════════════════
function toggleSidebar() {
  const s    = document.getElementById('sidebar');
  const b    = document.getElementById('backdrop');
  const btn  = document.getElementById('mobile-toggle-btn');
  const open = s.classList.toggle('open');
  b.classList.toggle('visible', open);
  btn.textContent = open ? '✕ Close' : '✦ Edit';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('backdrop').classList.remove('visible');
  document.getElementById('mobile-toggle-btn').textContent = '✦ Edit';
}

// ════════════════════════════════════════════════
//  IMAGE HANDLING
// ════════════════════════════════════════════════
function handleImageUpload(input, imgField, slideIdx) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    slides[slideIdx][imgField] = e.target.result;
    const k = imgKey(slideIdx, imgField);
    imgStore[k] = { src: e.target.result, scale: 1, x: 50, y: 50, rotate: 0 };
    saveHistory();
    updatePost();
    const zone = input.closest('.img-upload-zone');
    if (zone) {
      zone.classList.add('has-img');
      zone.querySelector('.upload-label').textContent = '✓ Image loaded — tap to change';
    }
    const controls = document.getElementById('crop-' + imgField + '-' + slideIdx);
    if (controls) controls.classList.add('visible');
  };
  reader.readAsDataURL(input.files[0]);
}

function removeImage(imgField, slideIdx) {
  slides[slideIdx][imgField] = '';
  delete imgStore[imgKey(slideIdx, imgField)];
  saveHistory();
  updatePost();
  renderSidebar();
}

function getCropImg(slideIdx, imgField) {
  const src = slides[slideIdx]?.[imgField];
  if (!src) return `<div class="img-placeholder">[ TAP SIDEBAR TO UPLOAD ]</div>`;
  const k = imgStore[imgKey(slideIdx, imgField)] || { scale: 1, x: 50, y: 50, rotate: 0 };
  return `<div style="width:100%;height:100%;overflow:hidden;transform:scale(${k.scale}) rotate(${k.rotate || 0}deg);transform-origin:${k.x}% ${k.y}%;transition:transform 0.1s;">
    <img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${k.x}% ${k.y}%;display:block;">
  </div>`;
}

function updateCrop(slideIdx, imgField, prop, val) {
  const k = imgKey(slideIdx, imgField);
  if (!imgStore[k]) {
    imgStore[k] = { src: slides[slideIdx][imgField] || '', scale: 1, x: 50, y: 50, rotate: 0 };
  }
  imgStore[k][prop] = parseFloat(val);
  const valEl = document.getElementById(`cv-${prop}-${imgField}-${slideIdx}`);
  if (valEl) {
    if (prop === 'scale')  valEl.textContent = parseFloat(val).toFixed(2) + '×';
    else if (prop === 'rotate') valEl.textContent = val + '°';
    else valEl.textContent = val + '%';
  }
  updatePost();
}

function resetCrop(slideIdx, imgField) {
  const k = imgKey(slideIdx, imgField);
  const src = imgStore[k]?.src || slides[slideIdx]?.[imgField] || '';
  imgStore[k] = { src, scale: 1, x: 50, y: 50, rotate: 0 };
  ['scale','x','y','rotate'].forEach(p => {
    const defaults = { scale: 1, x: 50, y: 50, rotate: 0 };
    const inp = document.querySelector(`input[oninput*="updateCrop(${slideIdx},'${imgField}','${p}'"]`);
    if (inp) inp.value = defaults[p];
    const valEl = document.getElementById(`cv-${p}-${imgField}-${slideIdx}`);
    if (valEl) {
      if (p === 'scale')  valEl.textContent = '1.00×';
      else if (p === 'rotate') valEl.textContent = '0°';
      else valEl.textContent = '50%';
    }
  });
  updatePost();
}

// ════════════════════════════════════════════════
//  SIDEBAR EDITOR
// ════════════════════════════════════════════════
function renderSidebar() {
  const el  = document.getElementById('dynamic-editor');
  const d   = slides[currentSlideIndex];
  const idx = currentSlideIndex;
  let html  = `<div class="section-label">Edit: ${d.label || d.type}</div>`;

  const inp = (key, label) =>
    `<div class="field"><label>${label}</label>
     <input type="text" value="${esc(d[key] || '')}" oninput="updateSlideData('${key}', this.value)">
     </div>`;

  const ta = (key, label) =>
    `<div class="field"><label>${label}</label>
     <textarea oninput="updateSlideData('${key}', this.value)">${esc(d[key] || '')}</textarea>
     </div>`;

  const imgUpload = (imgField, label) => {
    const hasImg = !!d[imgField];
    const cropId = `crop-${imgField}-${idx}`;
    const k = imgStore[imgKey(idx, imgField)] || { scale: 1, x: 50, y: 50, rotate: 0 };
    return `
    <div class="field">
      <label>${label}</label>
      <div class="img-upload-zone ${hasImg ? 'has-img' : ''}" id="zone-${imgField}-${idx}">
        <input type="file" accept="image/*" onchange="handleImageUpload(this,'${imgField}',${idx})">
        <div class="upload-icon">🖼</div>
        <div class="upload-label">${hasImg ? '✓ Image loaded — tap to change' : 'Tap to upload image'}</div>
      </div>
      ${hasImg ? `
        <button class="open-crop-btn" onclick="openCropModal(${idx},'${imgField}')">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="10" height="10" rx="1"/><path d="M4 1v3H1M8 11V8h3"/></svg>
          ✂ Visual Crop &amp; Adjust
        </button>
        <button class="remove-img-btn" onclick="removeImage('${imgField}',${idx})">✕ Remove Image</button>
      ` : ''}
      <div class="crop-controls ${hasImg ? 'visible' : ''}" id="${cropId}">
        <div class="crop-row">
          <label>Zoom</label>
          <input type="range" min="0.5" max="3.5" step="0.02" value="${k.scale}"
            oninput="updateCrop(${idx},'${imgField}','scale',this.value)">
          <span class="crop-val" id="cv-scale-${imgField}-${idx}">${k.scale.toFixed(2)}×</span>
        </div>
        <div class="crop-row">
          <label>X Pan</label>
          <input type="range" min="0" max="100" step="1" value="${k.x}"
            oninput="updateCrop(${idx},'${imgField}','x',this.value)">
          <span class="crop-val" id="cv-x-${imgField}-${idx}">${k.x}%</span>
        </div>
        <div class="crop-row">
          <label>Y Pan</label>
          <input type="range" min="0" max="100" step="1" value="${k.y}"
            oninput="updateCrop(${idx},'${imgField}','y',this.value)">
          <span class="crop-val" id="cv-y-${imgField}-${idx}">${k.y}%</span>
        </div>
        <div class="crop-row">
          <label>Rotate</label>
          <input type="range" min="-180" max="180" step="1" value="${k.rotate || 0}"
            oninput="updateCrop(${idx},'${imgField}','rotate',this.value)">
          <span class="crop-val" id="cv-rotate-${imgField}-${idx}">${k.rotate || 0}°</span>
        </div>
        <button class="crop-reset-btn" onclick="resetCrop(${idx},'${imgField}')">↺ Reset Crop</button>
      </div>
    </div>`;
  };

  // Per-type editor fields
  switch (d.type) {
    case 'hook':
      html += inp('category','Top Tag') + ta('hook','Main Hook Text') + inp('accent','Word to Highlight') + ta('sub','Sub Text');
      break;
    case 'quote':
      html += ta('quote','Quote Text') + inp('author','Author / Source');
      break;
    case 'compare':
      html += inp('category','Title') + ta('avg','Standard Box') + ta('elite','Premium Box') + ta('bottom','Bottom Quote');
      break;
    case 'framework':
      html += inp('category','Heading') + ta('steps','Steps (one per line)') + inp('closing','Closing Note');
      break;
    case 'list':
      html += inp('eyebrow','Eyebrow') + inp('title','Title') + ta('items','Items (one per line)');
      break;
    case 'closing':
      html += ta('closing','Main Text') + inp('handle','Social Handle');
      break;
    case 'caption':
      html += ta('caption','Caption Text') + inp('tags','Hashtags (space-separated)');
      break;
    case 'stat':
      html += inp('eyebrow','Eyebrow') + inp('number','Big Number / Stat') + inp('unit','Unit Label') + ta('desc','Description') + inp('source','Source (small)');
      break;
    case 'timeline':
      html += inp('eyebrow','Eyebrow') + inp('title','Title') + ta('items','Items: YEAR: Text (one per line)');
      break;
    case 'manifesto':
      html += inp('tag','Top Tag') + ta('body','Main Body Text') + ta('sub','Sub Text');
      break;
    case 'media':
      html += imgUpload('img1','Background Image') + inp('badge','Top Badge') + ta('title','Headline') + ta('text','Description');
      break;
    case 'product':
      html += imgUpload('img1','Product Image') + inp('title','Product Name') + inp('price','Price') + ta('specs','Specs (one per line)') + inp('cta','Button Text');
      break;
    case 'split':
      html += imgUpload('img1','Top Image') + inp('textTop','Top Label');
      html += imgUpload('img2','Bottom Image') + inp('textBottom','Bottom Label') + inp('centerTag','Center Tag');
      break;
    case 'review':
      html += imgUpload('img1','Customer Photo') + inp('rating','Stars') + ta('quote','Review Text') + inp('author','Customer Name') + inp('role','Subtitle / Role');
      break;
    case 'expert':
      html += imgUpload('img1','Person Photo') + inp('name','Name') + inp('title','Subtitle') + ta('quote','Quote / Message');
      break;
    case 'promo':
      html += inp('eyebrow','Eyebrow') + ta('title','Main Title') + inp('price','Price / Offer') + inp('detail','Detail Text') + inp('cta','CTA Button');
      break;
    case 'carousel':
      html += imgUpload('img1','Background Image') + inp('number','Slide Number e.g. 01') + ta('title','Title') + ta('desc','Description') + inp('dots','Total Dots') + inp('activeDot','Active Dot #');
      break;
    case 'announcement':
      html += inp('flash','Flash Badge') + ta('headline','Big Headline (use \\n for break)') + ta('desc','Description') + inp('cta','CTA Text');
      break;
  }

  html += `<div style="margin-top:4px;">${inp('brand','Brand Watermark')}</div>`;
  el.innerHTML = html;
}

function updateSlideData(key, value) {
  slides[currentSlideIndex][key] = value;
  updatePost();
  clearTimeout(updateSlideData._timer);
  updateSlideData._timer = setTimeout(saveHistory, 800);
}

// ════════════════════════════════════════════════
//  HTML ESCAPE & HIGHLIGHT
// ════════════════════════════════════════════════
function esc(s) {
  return (s || '').toString()
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function highlight(text, word) {
  if (!word || !word.trim()) return esc(text);
  const escaped = esc(text);
  const e = esc(word.trim());
  const re = new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return escaped.replace(re, `<span class="accent">$&</span>`);
}

// ════════════════════════════════════════════════
//  SLIDE HTML RENDERING
// ════════════════════════════════════════════════
function renderSlideHTML(d, idx) {
  const fs = mainFontSize;
  let html = '';

  switch (d.type) {

    case 'hook':
      html = `<div class="card-layout card-hook">
        <span class="badge">${esc(d.category)}</span>
        <div class="hook-text" style="font-size:${fs}px">${highlight(d.hook, d.accent)}</div>
        <div class="rule"></div>
        <div class="sub-text">${esc(d.sub)}</div>
      </div>`;
      break;

    case 'quote':
      html = `<div class="card-layout card-quote">
        <div class="quote-mark">"</div>
        <div class="quote-text" style="font-size:${fs - 12}px">${esc(d.quote)}</div>
        <div class="quote-author">— ${esc(d.author)}</div>
      </div>`;
      break;

    case 'compare':
      html = `<div class="card-layout card-compare">
        <div class="compare-label">Comparison</div>
        <div class="compare-title" style="font-size:${fs - 12}px">${esc(d.category)}</div>
        <div class="compare-cols">
          <div class="col-avg"><div class="col-label">Standard</div><div class="col-text">${esc(d.avg)}</div></div>
          <div class="col-elite"><div class="col-label">Premium ✦</div><div class="col-text">${esc(d.elite)}</div></div>
        </div>
        <div class="compare-bottom">${esc(d.bottom)}</div>
      </div>`;
      break;

    case 'framework': {
      const steps = (d.steps || '').split('\n').filter(Boolean).map((s, i) =>
        `<div class="fw-step">
          <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="step-text">${esc(s)}</span>
        </div>`).join('');
      html = `<div class="card-layout card-framework">
        <div class="fw-title">↳ Process</div>
        <div class="fw-heading" style="font-size:${fs - 10}px">${esc(d.category)}</div>
        <div class="fw-steps">${steps}</div>
        <div class="fw-closing">${esc(d.closing)}</div>
      </div>`;
      break;
    }

    case 'list': {
      const items = (d.items || '').split('\n').filter(Boolean).map((s, i) =>
        `<div class="list-item">
          <div class="list-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="list-text">${esc(s)}</div>
        </div>`).join('');
      html = `<div class="card-layout card-list">
        <div class="list-eyebrow">↳ ${esc(d.eyebrow)}</div>
        <div class="list-header" style="font-size:${fs - 12}px">${esc(d.title)}</div>
        <div class="list-items">${items}</div>
      </div>`;
      break;
    }

    case 'closing':
      html = `<div class="card-layout card-closing">
        <div class="closing-rule"></div>
        <div class="closing-main" style="font-size:${fs - 10}px">${esc(d.closing)}</div>
        <div class="closing-rule2"></div>
        <div class="closing-brand">${esc(d.brand)}</div>
        <div class="closing-handle">${esc(d.handle)}</div>
      </div>`;
      break;

    case 'caption': {
      const tags = (d.tags || '').split(' ').filter(Boolean).map(t =>
        `<span class="cap-tag">${esc(t)}</span>`).join('');
      html = `<div class="card-layout card-caption">
        <div class="cap-eyebrow">↳ Information</div>
        <div class="cap-text">${esc(d.caption)}</div>
        <div class="cap-tags">${tags}</div>
      </div>`;
      break;
    }

    case 'stat':
      html = `<div class="card-layout card-stat">
        <div class="stat-eyebrow">↳ ${esc(d.eyebrow)}</div>
        <div class="stat-number" style="font-size:${fs + 28}px">${esc(d.number)}</div>
        <div class="stat-unit">${esc(d.unit)}</div>
        <div class="stat-rule"></div>
        <div class="stat-desc">${esc(d.desc)}</div>
        <div class="stat-source">${esc(d.source)}</div>
      </div>`;
      break;

    case 'timeline': {
      const tlItems = (d.items || '').split('\n').filter(Boolean).map(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return `<div class="tl-item"><div class="tl-dot"></div><div class="tl-year">—</div><div class="tl-text">${esc(line)}</div></div>`;
        const year = line.substring(0, colonIdx).trim();
        const text = line.substring(colonIdx + 1).trim();
        return `<div class="tl-item"><div class="tl-dot"></div><div class="tl-year">${esc(year)}</div><div class="tl-text">${esc(text)}</div></div>`;
      }).join('');
      html = `<div class="card-layout card-timeline">
        <div class="tl-eyebrow">↳ ${esc(d.eyebrow)}</div>
        <div class="tl-title" style="font-size:${fs - 12}px">${esc(d.title)}</div>
        <div class="tl-items">
          <div class="tl-line"></div>
          ${tlItems}
        </div>
      </div>`;
      break;
    }

    case 'manifesto':
      html = `<div class="card-layout card-manifesto">
        <div class="mf-tag">${esc(d.tag)}</div>
        <div class="mf-body" style="font-size:${fs - 4}px">${esc(d.body)}</div>
        <div class="mf-rule"></div>
        <div class="mf-sub">${esc(d.sub)}</div>
      </div>`;
      break;

    case 'media':
      html = `<div class="card-media-bg">${getCropImg(idx, 'img1')}</div>
      <div class="card-media-overlay"></div>
      <div class="card-layout card-media">
        <div class="media-badge">${esc(d.badge)}</div>
        <div class="media-title" style="font-size:${fs - 6}px">${esc(d.title)}</div>
        <div class="media-desc">${esc(d.text)}</div>
      </div>`;
      break;

    case 'product':
      html = `<div class="card-product-wrap">
        <div class="card-product-img">${getCropImg(idx, 'img1')}</div>
        <div class="card-product-info">
          <div class="p-title" style="font-size:${fs - 10}px">${esc(d.title)}</div>
          <div class="p-price">${esc(d.price)}</div>
          <div class="p-specs">${(d.specs || '').split('\n').filter(Boolean).map(s => `<div>${esc(s)}</div>`).join('')}</div>
          <div class="p-cta">${esc(d.cta)}</div>
        </div>
      </div>`;
      break;

    case 'split':
      html = `<div class="card-split-wrap">
        <div class="split-half">
          ${getCropImg(idx, 'img1')}
          <div class="split-overlay"><div class="split-text">${esc(d.textTop)}</div></div>
        </div>
        <div class="split-center">${esc(d.centerTag)}</div>
        <div class="split-half">
          ${getCropImg(idx, 'img2')}
          <div class="split-overlay"><div class="split-text">${esc(d.textBottom)}</div></div>
        </div>
      </div>`;
      break;

    case 'review':
      html = `<div class="card-layout card-review">
        <div class="stars">${esc(d.rating)}</div>
        <div class="r-quote" style="font-size:${fs - 14}px">"${esc(d.quote)}"</div>
        <div class="r-avatar">${getCropImg(idx, 'img1')}</div>
        <div class="r-name">${esc(d.author)}</div>
        <div class="r-role">${esc(d.role)}</div>
      </div>`;
      break;

    case 'expert':
      html = `<div class="card-layout card-expert">
        <div class="e-img">${getCropImg(idx, 'img1')}</div>
        <div class="e-name">${esc(d.name)}</div>
        <div class="e-title">${esc(d.title)}</div>
        <div class="e-quote" style="font-size:${fs - 12}px">"${esc(d.quote)}"</div>
      </div>`;
      break;

    case 'promo':
      html = `<div class="card-layout card-promo">
        <div class="promo-eyebrow">${esc(d.eyebrow)}</div>
        <div class="promo-title" style="font-size:${fs + 10}px">${esc(d.title).replace(/\n/g, '<br>')}</div>
        <div class="promo-price-box">
          <div class="promo-price">${esc(d.price)}</div>
          <div class="promo-detail">${esc(d.detail)}</div>
        </div>
        <div class="promo-cta">${esc(d.cta)}</div>
      </div>`;
      break;

    case 'carousel': {
      const totalDots = Math.max(1, Math.min(parseInt(d.dots) || 5, 10));
      const activeDot = Math.max(1, Math.min(parseInt(d.activeDot) || 1, totalDots));
      const dotsHtml = Array.from({ length: totalDots }, (_, i) =>
        `<div class="cr-dot ${i + 1 === activeDot ? 'active' : ''}"></div>`).join('');
      html = `<div class="card-carousel">
        <div class="cr-bg">${getCropImg(idx, 'img1')}</div>
        <div class="cr-overlay"></div>
        <div class="card-layout cr-content">
          <div class="cr-number">${esc(d.number)}</div>
          <div class="cr-title" style="font-size:${fs - 10}px">${esc(d.title)}</div>
          <div class="cr-desc">${esc(d.desc)}</div>
          <div class="cr-dot-row">${dotsHtml}</div>
        </div>
      </div>`;
      break;
    }

    case 'announcement':
      html = `<div class="card-layout card-announcement">
        <div class="ann-flash">${esc(d.flash)}</div>
        <div class="ann-headline" style="font-size:${fs + 14}px">${esc(d.headline).replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</div>
        <div class="ann-desc">${esc(d.desc)}</div>
        <div class="ann-cta">${esc(d.cta)}</div>
      </div>`;
      break;

    default:
      html = `<div class="card-layout"><div style="opacity:0.4;font-family:'IBM Plex Mono',monospace;font-size:11px;">Unknown slide type</div></div>`;
  }

  html += `<div class="brand-watermark">${esc(d.brand)}</div>`;
  return html;
}

// ════════════════════════════════════════════════
//  CORE UPDATE
// ════════════════════════════════════════════════
function updatePost() {
  const card = document.getElementById('ig-card');
  const d    = slides[currentSlideIndex];

  card.innerHTML = renderSlideHTML(d, currentSlideIndex);
  card.style.setProperty('--gold', currentAccent);
  card.setAttribute('data-template', currentTemplate);

  const total = slides.length;
  const cur   = currentSlideIndex + 1;
  document.getElementById('slide-counter').textContent = `${cur} / ${total}`;

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
  if (nextBtn) nextBtn.disabled = currentSlideIndex === slides.length - 1;

  updateStrip();
  // Re-scale after render so card never gets clipped on mobile
  requestAnimationFrame(scaleCanvasToFit);
}

function updateStyle(val) {
  mainFontSize = parseInt(val);
  document.getElementById('rng-val').textContent = val;
  updatePost();
}

function updateStrip() {
  const strip = document.getElementById('slide-strip');
  let html = slides.map((s, i) => {
    const typeLabel = (s.label || s.type).substring(0, 5).toUpperCase();
    const active = i === currentSlideIndex ? 'active' : '';
    return `<div class="strip-thumb ${active}" onclick="goToSlide(${i})" title="${s.label || s.type}">
      <span class="strip-num">${i + 1}</span>
      <span class="strip-type">${typeLabel}</span>
    </div>`;
  }).join('');
  html += `<div class="strip-add" onclick="addSlide()" title="Add slide"><span style="font-size:1.2rem">+</span><span>Add</span></div>`;
  strip.innerHTML = html;

  requestAnimationFrame(() => {
    const active = strip.querySelector('.strip-thumb.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
}

// ════════════════════════════════════════════════
//  NAVIGATION & MANAGEMENT
// ════════════════════════════════════════════════
function prevSlide() {
  if (currentSlideIndex > 0) { currentSlideIndex--; refreshAll(); }
}
function nextSlide() {
  if (currentSlideIndex < slides.length - 1) { currentSlideIndex++; refreshAll(); }
}
function goToSlide(idx) {
  currentSlideIndex = idx;
  refreshAll();
}
function refreshAll() {
  renderSidebar();
  updatePost();
}

function addSlide() {
  const t = document.getElementById('new-slide-type').value;
  saveHistory();
  slides.splice(currentSlideIndex + 1, 0, { type: t, ...defaultCardData[t] });
  currentSlideIndex++;
  refreshAll();
  showToast(`Added ${defaultCardData[t]?.label || t} card`);
}

function duplicateSlide() {
  saveHistory();
  const copy   = JSON.parse(JSON.stringify(slides[currentSlideIndex]));
  const oldIdx = currentSlideIndex;
  const newIdx = currentSlideIndex + 1;
  slides.splice(newIdx, 0, copy);
  // Copy image store for duplicated slide
  ['img1', 'img2'].forEach(f => {
    const oldKey = imgKey(oldIdx, f);
    if (imgStore[oldKey]) imgStore[imgKey(newIdx, f)] = { ...imgStore[oldKey] };
  });
  currentSlideIndex++;
  refreshAll();
  showToast('Card duplicated');
}

function deleteSlide() {
  if (slides.length <= 1) { showToast('Need at least one card!', true); return; }
  saveHistory();
  slides.splice(currentSlideIndex, 1);
  if (currentSlideIndex >= slides.length) currentSlideIndex = slides.length - 1;
  refreshAll();
  showToast('Card removed');
}

// ════════════════════════════════════════════════
//  THEME & ACCENT
// ════════════════════════════════════════════════
function setTemplate(tpl, btn) {
  saveHistory();
  currentTemplate = tpl;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  currentAccent = TEMPLATE_ACCENTS[tpl] || '#c9a84c';
  document.querySelectorAll('.swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.color === currentAccent));
  document.getElementById('custom-color-picker').value = currentAccent;
  updatePost();
}

function setAccent(swatch) {
  saveHistory();
  currentAccent = swatch.dataset.color;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  document.getElementById('custom-color-picker').value = currentAccent;
  updatePost();
}

function setCustomAccent(color) {
  currentAccent = color;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  updatePost();
  clearTimeout(setCustomAccent._timer);
  setCustomAccent._timer = setTimeout(saveHistory, 600);
}

function toggleAppTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('theme-btn').textContent = next === 'dark' ? '☀' : '☾';
}

// ════════════════════════════════════════════════
//  LOADING / TOAST
// ════════════════════════════════════════════════
function showLoading(text) {
  document.getElementById('loading').classList.add('active');
  document.getElementById('loading-text').textContent = text || 'Preparing export...';
}
function hideLoading() {
  document.getElementById('loading').classList.remove('active');
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '') + ' show';
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ════════════════════════════════════════════════
//  EXPORT — pixel-perfect: clone live card, scale up
// ════════════════════════════════════════════════
async function renderToCanvas(slideIdx) {
  const fmt = FORMAT_CONFIG[currentFormat];
  const bg  = TEMPLATE_BG[currentTemplate] || '#0a0a0a';

  // --- Step 1: temporarily render the target slide into the live card ---
  const liveCard  = document.getElementById('ig-card');
  const savedIdx  = currentSlideIndex;
  const savedHTML = liveCard.innerHTML;

  // If exporting a different slide, swap content temporarily
  if (slideIdx !== currentSlideIndex) {
    liveCard.innerHTML = renderSlideHTML(slides[slideIdx], slideIdx);
    liveCard.style.setProperty('--gold', currentAccent);
  }

  // --- Step 2: measure the live card's rendered size ---
  const rect   = liveCard.getBoundingClientRect();
  const cardW  = rect.width;
  const cardH  = rect.height;

  // --- Step 3: compute upscale factor so output = target resolution ---
  const targetW = fmt.w;
  const targetH = fmt.h;
  // Use width as the base scale axis; height follows the same ratio
  const scale   = targetW / cardW;

  // --- Step 4: capture using html2canvas at that scale ---
  await new Promise(r => setTimeout(r, 80)); // allow repaint

  const canvas = await html2canvas(liveCard, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: bg,
    width:  cardW,
    height: cardH,
    logging: false
  });

  // --- Step 5: restore original slide if we swapped ---
  if (slideIdx !== savedIdx) {
    liveCard.innerHTML = savedHTML;
    liveCard.style.setProperty('--gold', currentAccent);
  }

  return canvas;
}

async function downloadCurrentSlide() {
  showLoading('Rendering card...');
  try {
    const canvas = await renderToCanvas(currentSlideIndex);
    const link   = document.createElement('a');
    const fmt    = FORMAT_CONFIG[currentFormat];
    link.download = `apex-card-${currentSlideIndex + 1}-${slides[currentSlideIndex].type}-${currentFormat}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`✓ Exported at ${fmt.w}×${fmt.h}px!`);
  } catch (e) {
    showToast('Export failed: ' + e.message, true);
    console.error(e);
  }
  hideLoading();
}

async function downloadAllSlides() {
  if (typeof JSZip === 'undefined') {
    showToast('ZIP library loading, please retry...', true);
    return;
  }
  showLoading(`Preparing ${slides.length} cards...`);
  const zip    = new JSZip();
  const folder = zip.folder('apex-cards');
  const fmt    = FORMAT_CONFIG[currentFormat];
  try {
    for (let i = 0; i < slides.length; i++) {
      document.getElementById('loading-text').textContent = `Rendering ${i + 1} / ${slides.length}...`;
      const canvas = await renderToCanvas(i);
      const blob   = await new Promise(res => canvas.toBlob(res, 'image/png'));
      folder.file(`card-${i + 1}-${slides[i].type}-${currentFormat}.png`, blob);
      await new Promise(r => setTimeout(r, 80));
    }
    document.getElementById('loading-text').textContent = 'Creating ZIP...';
    const content = await zip.generateAsync({ type: 'blob' });
    const link    = document.createElement('a');
    link.href     = URL.createObjectURL(content);
    link.download = `apex-${slides.length}cards-${currentFormat}-${fmt.w}x${fmt.h}.zip`;
    link.click();
    showToast(`✓ ${slides.length} cards saved as ZIP!`);
  } catch (e) {
    showToast('Export failed: ' + e.message, true);
    console.error(e);
  }
  hideLoading();
}

// ════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

  if (e.key === 'ArrowLeft')  { e.preventDefault(); prevSlide(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undoAction(); }
  else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redoAction(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicateSlide(); }
  // Format shortcuts
  else if (e.key === '1' && !e.ctrlKey) setFormat('post',     document.querySelector('[data-fmt="post"]'));
  else if (e.key === '2' && !e.ctrlKey) setFormat('portrait', document.querySelector('[data-fmt="portrait"]'));
  else if (e.key === '3' && !e.ctrlKey) setFormat('story',    document.querySelector('[data-fmt="story"]'));
});

// ════════════════════════════════════════════════
//  CANVAS AUTO-SCALE (prevents right-side clipping on mobile)
// ════════════════════════════════════════════════
function scaleCanvasToFit() {
  const wrap  = document.getElementById('preview-wrap');
  const frame = document.getElementById('canvas-frame');
  const card  = document.getElementById('ig-card');
  if (!wrap || !frame || !card) return;

  // Reset scale so we can measure natural size
  frame.style.transform = '';
  frame.style.transformOrigin = 'center center';

  const wrapW = wrap.clientWidth  - 32; // subtract padding
  const wrapH = wrap.clientHeight - 32;
  const cardW = card.offsetWidth;
  const cardH = card.offsetHeight;

  if (cardW <= 0 || cardH <= 0) return;

  const scaleX = wrapW / cardW;
  const scaleY = wrapH / cardH;
  const scale  = Math.min(scaleX, scaleY, 1); // never upscale

  frame.style.transform = scale < 1 ? `scale(${scale.toFixed(4)})` : '';
}

// Run on resize, and patch the existing setFormat to re-scale after layout settles
window.addEventListener('resize', scaleCanvasToFit);

// ════════════════════════════════════════════════
//  VISUAL CROP MODAL
// ════════════════════════════════════════════════

// State for the crop modal session
let _cm = {
  slideIdx: 0,
  imgField: '',
  // Working copy of adjustments
  scale: 1,
  x: 50,       // percentage position (maps to object-position)
  y: 50,
  rotate: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  flipH: false,
  flipV: false,
  // Drag state
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  imgStartLeft: 0,
  imgStartTop: 0,
  // Stage size cache
  stageW: 0,
  stageH: 0,
  imgNatW: 0,
  imgNatH: 0,
  // Current pixel offset for drag
  offsetX: 0,
  offsetY: 0,
};

function openCropModal(slideIdx, imgField) {
  const src = slides[slideIdx]?.[imgField];
  if (!src) return;

  _cm.slideIdx  = slideIdx;
  _cm.imgField  = imgField;

  // Load existing values
  const k = imgStore[imgKey(slideIdx, imgField)] || { scale: 1, x: 50, y: 50, rotate: 0 };
  _cm.scale      = k.scale      || 1;
  _cm.x          = k.x          ?? 50;
  _cm.y          = k.y          ?? 50;
  _cm.rotate     = k.rotate     || 0;
  _cm.brightness = k.brightness || 100;
  _cm.contrast   = k.contrast   || 100;
  _cm.saturation = k.saturation || 100;
  _cm.flipH      = k.flipH      || false;
  _cm.flipV      = k.flipV      || false;

  // Set slider values
  document.getElementById('cm-scale').value      = _cm.scale;
  document.getElementById('cm-rotate').value     = _cm.rotate;
  document.getElementById('cm-brightness').value = _cm.brightness;
  document.getElementById('cm-contrast').value   = _cm.contrast;
  document.getElementById('cm-saturation').value = _cm.saturation;
  document.getElementById('cm-val-scale').textContent      = _cm.scale.toFixed(2) + '×';
  document.getElementById('cm-val-rotate').textContent     = _cm.rotate + '°';
  document.getElementById('cm-val-brightness').textContent = _cm.brightness + '%';
  document.getElementById('cm-val-contrast').textContent   = _cm.contrast + '%';
  document.getElementById('cm-val-saturation').textContent = _cm.saturation + '%';

  // Load image into stage
  const stageImg = document.getElementById('crop-stage-img');
  stageImg.onload = () => {
    _cm.imgNatW = stageImg.naturalWidth;
    _cm.imgNatH = stageImg.naturalHeight;
    const stage = document.getElementById('crop-stage');
    _cm.stageW = stage.clientWidth;
    _cm.stageH = stage.clientHeight;
    // Convert stored % position to pixel offset
    _cm.offsetX = (_cm.x / 100 - 0.5) * -(_cm.stageW * (_cm.scale - 1));
    _cm.offsetY = (_cm.y / 100 - 0.5) * -(_cm.stageH * (_cm.scale - 1));
    updateCropStage();
  };
  stageImg.src = src;

  // Show hint briefly
  const hint = document.getElementById('crop-drag-hint');
  if (hint) { hint.style.opacity = '1'; setTimeout(() => { hint.style.opacity = '0'; }, 2500); }

  document.getElementById('crop-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCropModal() {
  document.getElementById('crop-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleCropOverlayClick(e) {
  if (e.target === document.getElementById('crop-modal-overlay')) closeCropModal();
}

function applyCropModal() {
  const k = imgKey(_cm.slideIdx, _cm.imgField);
  if (!imgStore[k]) imgStore[k] = { src: slides[_cm.slideIdx][_cm.imgField] };

  // Convert pixel offset back to percentage
  const stage = document.getElementById('crop-stage');
  const sw = stage.clientWidth  || 300;
  const sh = stage.clientHeight || 300;
  const range = sw * (_cm.scale - 1);
  const xPct = range > 0 ? 50 - (_cm.offsetX / range) * 50 : 50;
  const yPct = range > 0 ? 50 - (_cm.offsetY / (sh * (_cm.scale - 1) || 1)) * 50 : 50;

  imgStore[k].scale      = _cm.scale;
  imgStore[k].x          = Math.max(0, Math.min(100, xPct));
  imgStore[k].y          = Math.max(0, Math.min(100, yPct));
  imgStore[k].rotate     = _cm.rotate;
  imgStore[k].brightness = _cm.brightness;
  imgStore[k].contrast   = _cm.contrast;
  imgStore[k].saturation = _cm.saturation;
  imgStore[k].flipH      = _cm.flipH;
  imgStore[k].flipV      = _cm.flipV;

  saveHistory();
  updatePost();
  closeCropModal();
  showToast('✓ Crop applied!');
}

function cropModalUpdate(prop, val) {
  _cm[prop] = parseFloat(val);
  const labels = { scale: v => v.toFixed(2)+'×', rotate: v => v+'°' };
  const label = labels[prop] ? labels[prop](_cm[prop]) : _cm[prop]+'%';
  document.getElementById(`cm-val-${prop}`).textContent = label;
  updateCropStage();
}

function cropModalReset() {
  _cm.scale = 1; _cm.x = 50; _cm.y = 50; _cm.rotate = 0;
  _cm.brightness = 100; _cm.contrast = 100; _cm.saturation = 100;
  _cm.flipH = false; _cm.flipV = false;
  _cm.offsetX = 0; _cm.offsetY = 0;
  document.getElementById('cm-scale').value      = 1;
  document.getElementById('cm-rotate').value     = 0;
  document.getElementById('cm-brightness').value = 100;
  document.getElementById('cm-contrast').value   = 100;
  document.getElementById('cm-saturation').value = 100;
  document.getElementById('cm-val-scale').textContent      = '1.00×';
  document.getElementById('cm-val-rotate').textContent     = '0°';
  document.getElementById('cm-val-brightness').textContent = '100%';
  document.getElementById('cm-val-contrast').textContent   = '100%';
  document.getElementById('cm-val-saturation').textContent = '100%';
  updateCropStage();
}

function cropFlip(axis) {
  if (axis === 'H') _cm.flipH = !_cm.flipH;
  else _cm.flipV = !_cm.flipV;
  updateCropStage();
}

function cropRotate90(deg) {
  _cm.rotate = (_cm.rotate + deg + 360) % 360;
  if (_cm.rotate > 180) _cm.rotate -= 360;
  document.getElementById('cm-rotate').value = _cm.rotate;
  document.getElementById('cm-val-rotate').textContent = _cm.rotate + '°';
  updateCropStage();
}

function updateCropStage() {
  const img = document.getElementById('crop-stage-img');
  if (!img) return;

  const stage = document.getElementById('crop-stage');
  const sw = stage.clientWidth;
  const sh = stage.clientHeight;

  // Size the image to fill the stage at scale
  const scaledW = sw * _cm.scale;
  const scaledH = sh * _cm.scale;

  // Position: center + offset
  const left = (sw - scaledW) / 2 + _cm.offsetX;
  const top  = (sh - scaledH) / 2 + _cm.offsetY;

  const scaleX = _cm.flipH ? -_cm.scale : _cm.scale;
  const scaleY = _cm.flipV ? -_cm.scale : _cm.scale;

  img.style.width  = sw + 'px';
  img.style.height = sh + 'px';
  img.style.left   = left + 'px';
  img.style.top    = top + 'px';
  img.style.transform = `scale(${scaleX}, ${scaleY}) rotate(${_cm.rotate}deg)`;
  img.style.transformOrigin = 'center center';
  img.style.filter = `brightness(${_cm.brightness}%) contrast(${_cm.contrast}%) saturate(${_cm.saturation}%)`;
  img.style.objectFit = 'cover';
}

// ─── Drag to pan ─────────────────────────────────
function cropDragStart(e) {
  e.preventDefault();
  _cm.dragging = true;
  const pt = e.touches ? e.touches[0] : e;
  _cm.dragStartX = pt.clientX;
  _cm.dragStartY = pt.clientY;
  _cm.imgStartLeft = _cm.offsetX;
  _cm.imgStartTop  = _cm.offsetY;

  const onMove = ev => {
    if (!_cm.dragging) return;
    const p = ev.touches ? ev.touches[0] : ev;
    const dx = p.clientX - _cm.dragStartX;
    const dy = p.clientY - _cm.dragStartY;

    const stage = document.getElementById('crop-stage');
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    // Clamp so image can't move fully out of frame
    const maxX = sw  * (_cm.scale - 1) / 2;
    const maxY = sh  * (_cm.scale - 1) / 2;
    _cm.offsetX = Math.max(-maxX, Math.min(maxX, _cm.imgStartLeft + dx));
    _cm.offsetY = Math.max(-maxY, Math.min(maxY, _cm.imgStartTop  + dy));
    updateCropStage();
  };

  const onUp = () => {
    _cm.dragging = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend',  onUp);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend',  onUp);
}

// ─── getCropImg — supports brightness/contrast/saturation/flip ─
function getCropImg(slideIdx, imgField) {
  const src = slides[slideIdx]?.[imgField];
  if (!src) return `<div class="img-placeholder">[ TAP SIDEBAR TO UPLOAD ]</div>`;
  const k = imgStore[imgKey(slideIdx, imgField)] || { scale: 1, x: 50, y: 50, rotate: 0 };

  const br  = k.brightness || 100;
  const con = k.contrast   || 100;
  const sat = k.saturation || 100;
  const fH  = k.flipH ? -1 : 1;
  const fV  = k.flipV ? -1 : 1;
  const filter = `brightness(${br}%) contrast(${con}%) saturate(${sat}%)`;

  return `<div style="width:100%;height:100%;overflow:hidden;">
    <img src="${src}" style="
      width:100%;height:100%;
      object-fit:cover;
      object-position:${k.x}% ${k.y}%;
      display:block;
      transform: scale(${fH * k.scale}, ${fV * k.scale}) rotate(${k.rotate || 0}deg);
      transform-origin: center center;
      filter:${filter};
      transition: transform 0.1s, filter 0.1s;
    ">
  </div>`;
}

// ════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════
refreshAll();
saveHistory();
updateHistoryButtons();
requestAnimationFrame(() => requestAnimationFrame(scaleCanvasToFit));
