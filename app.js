(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const img = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=78&auto=format&fit=crop`;

  /* ---------- data: published by the developer ---------- */
  const TYPES = {
    studio: {
      name: 'Studio', count: 80, internal: 41, external: null, total: 41, color: 'var(--studio)', photo: '1629042306558-7d1e15cc02fa', photoAlt: 'An open-plan studio with a sofa, dining table and kitchen',
      blurb: 'One 3.8 m-wide room that runs from a French balcony at the window, past the bed and living space, to an open kitchen, with the bath and a wardrobe by the door.',
      rooms: [['Bed space', '2.6 × 3.8 m'], ['Living space', '2.3 × 3.8 m'], ['Open kitchen', '2.4 × 3.8 m'], ['Bath', '2 × 2 m']]
    },
    one: {
      name: 'One bedroom', count: 80, internal: 65, external: 5, total: 70, color: 'var(--one)', photo: '1715985160053-d339e8b6eb94', photoAlt: 'An open kitchen with an island looking onto a living room',
      blurb: 'Lounge, dining and an open kitchen with a breakfast bar run front to back from the balcony. The bedroom sits beside the lounge with its own bath, and there is a separate utility room.',
      rooms: [['Balcony', '1.2 × 3.8 m'], ['Lounge', '2.8 × 3.8 m'], ['Dining', '1.8 × 3.8 m'], ['Open kitchen', '3.1 × 3.8 m'], ['Utility', '2.5 × 1.3 m'], ['Bedroom', '4.2 × 3.4 m'], ['Bath', '2.15 × 2.1 m']]
    },
    two: {
      name: 'Two bedroom', count: 40, internal: 85, external: 5, total: 90, color: 'var(--two)', photo: '1628592102751-ba83b0314276', photoAlt: 'A bright living room with a television wall, armchair and framed art',
      blurb: 'The same living strip as the one-bedroom, with a master bedroom, a second bedroom and two bathrooms along the end of the wing. Two per floor, one at each corner.',
      rooms: [['Balcony', '1.2 × 3.8 m'], ['Lounge', '2.8 × 3.8 m'], ['Dining', '1.8 × 3.8 m'], ['Open kitchen', '3.1 × 3.8 m'], ['Utility', '2.5 × 1.3 m'], ['Master bedroom', '4.2 × 3.4 m'], ['Bedroom 01', '3.6 × 3.4 m'], ['Baths (×2)', '1.4 × 3.0 m']]
    }
  };
  const TIMES = [[5, 'Sarit Centre'], [8, 'Westgate Mall'], [8, 'JW Marriott and Kempinski'], [9, 'MP Shah Hospital'], [10, 'Nairobi CBD'], [13, 'Nairobi Hospital'], [15, 'Aga Khan University Hospital'], [19, 'United Nations, Gigiri'], [20, 'Jomo Kenyatta International Airport'], [23, 'Wilson Airport'], [28, 'Brookhouse International School']];

  /* ---------- cards ---------- */
  $('#cards').innerHTML = Object.entries(TYPES).map(([k, t]) => `
    <article class="card">
      <div class="card-photo"><img loading="lazy" src="${img(t.photo, 900)}" alt="${t.photoAlt}"><small>Representative interior photo</small></div>
      <div class="card-body">
        <div class="card-top"><h3>${t.name}</h3><span class="area">${t.total} m²</span></div>
        <div class="count"><span class="swatch" style="background:${t.color}"></span>${t.count} homes · ${t.internal} m² inside${t.external ? ` + ${t.external} m² balcony` : ''}</div>
        <table class="dims"><tbody>${t.rooms.map(([r, d]) => `<tr><td>${r}</td><td>${d}</td></tr>`).join('')}</tbody></table>
        <a class="more" href="#plans" data-goto="${k}">View the ${t.name.toLowerCase()} plan →</a>
      </div>
    </article>`).join('');

  $('#times').innerHTML = TIMES.map(([m, p]) => `<tr><td>${m} min</td><td>${p}</td></tr>`).join('');

  /* ---------- plans (metres; redrawn from the brochure's printed sizes) ---------- */
  // room: [name, dims|null, x0, z0, x1, z1, kind]  kind: dry | wet | out | open (open-plan zone)
  const LOUNGE = [
    ['Balcony', '1.2 × 3.8 m', 0, -1.2, 3.8, 0, 'out'],
    ['Lounge', '2.8 × 3.8 m', 0, 0, 3.8, 2.8, 'dry'],
    ['Dining', '1.8 × 3.8 m', 0, 2.8, 3.8, 4.6, 'open'],
    ['Open kitchen', '3.1 × 3.8 m', 0, 4.6, 3.8, 7.7, 'open'],
    ['Utility', '2.5 × 1.3 m', 0, 7.7, 2.5, 9.0, 'wet'],
    ['Entry', null, 2.5, 7.7, 3.8, 9.0, 'dry']
  ];
  const PLANS = {
    studio: { rooms: [
      ['French balcony', null, .2, -.4, 3.6, 0, 'out'],
      ['Bed space', '2.6 × 3.8 m', 0, 0, 3.8, 2.6, 'dry'],
      ['Living space', '2.3 × 3.8 m', 0, 2.6, 3.8, 4.9, 'open'],
      ['Open kitchen', '2.4 × 3.8 m', 0, 4.9, 3.8, 7.3, 'open'],
      ['Wardrobe · entry', null, 0, 7.3, 1.8, 9.3, 'dry'],
      ['Bath', '2 × 2 m', 1.8, 7.3, 3.8, 9.3, 'wet']
    ], windows: [[.2, 0, 3.6, 0]] },
    one: { rooms: [...LOUNGE,
      ['Bedroom', '4.2 × 3.4 m', 3.9, 0, 7.3, 4.2, 'dry'],
      ['Lobby', null, 3.9, 4.2, 5.1, 6.3, 'dry'],
      ['Bath', '2.15 × 2.1 m', 5.15, 4.2, 7.3, 6.3, 'wet']
    ], windows: [[.15, 0, 3.65, 0], [4.4, 0, 6.8, 0]] },
    two: { rooms: [...LOUNGE,
      ['Master bedroom', '4.2 × 3.4 m', 3.9, -2.0, 7.5, 2.2, 'dry'],
      ['Hall', null, 3.9, 2.2, 5.3, 5.1, 'dry'],
      ['Bath', '1.4 × 3.0 m', 5.35, 2.2, 7.5, 3.65, 'wet'],
      ['Bath', '1.4 × 3.0 m', 5.35, 3.65, 7.5, 5.1, 'wet'],
      ['Bedroom 01', '3.6 × 3.4 m', 3.9, 5.1, 7.5, 8.7, 'dry']
    ], windows: [[.15, 0, 3.65, 0], [4.3, -2.0, 7.1, -2.0], [4.6, 8.7, 6.8, 8.7]] }
  };
  // typical floor (5th–24th): north wing in plan metres, south wing mirrored. Units: id, type, rects
  const PD = 25.5;
  const FLOOR_UNITS = [
    ['1', 'studio', [[0, .75, 4.075, 10.4]]],
    ['2', 'studio', [[4.075, .75, 8.025, 10.4]]],
    ['3', 'one', [[8.025, 0, 11.95, 10.4], [11.95, 1.2, 15.475, 7.6]]],
    ['4', 'one', [[19.0, 0, 22.925, 10.4], [15.475, 1.2, 19.0, 7.6]]],
    ['5', 'two', [[22.925, 0, 26.85, 10.4], [26.85, -.8, 30.7, 10.4]]]
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const hatch = () => { const d = el('defs'); const p = el('pattern', { id: 'hatch', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }); p.append(el('rect', { width: 8, height: 8, fill: '#f0f1ee' }), el('line', { x1: 0, y1: 0, x2: 0, y2: 8, stroke: '#c9ccc7', 'stroke-width': 1.2 })); d.append(p); return d; };
  function scaleBar(svg, x, y, S) { svg.append(el('line', { x1: x, y1: y, x2: x + 2 * S, y2: y, stroke: '#7c8286', 'stroke-width': 2 }), el('line', { x1: x, y1: y - 4, x2: x, y2: y + 4, stroke: '#7c8286' }), el('line', { x1: x + 2 * S, y1: y - 4, x2: x + 2 * S, y2: y + 4, stroke: '#7c8286' }), el('text', { x: x + 2 * S + 8, y: y + 4, class: 'scale' }, '2 m')); }

  const hoverBox = () => $('#hover-room');
  function drawUnit(key) {
    const P = PLANS[key], S = 58, pad = 40;
    const xs = P.rooms.flatMap(r => [r[2], r[4]]), zs = P.rooms.flatMap(r => [r[3], r[5]]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const W = (maxX - minX) * S + pad * 2, H = (maxZ - minZ) * S + pad * 2 + 30;
    const X = x => (x - minX) * S + pad, Y = z => (z - minZ) * S + pad;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${TYPES[key].name} floor plan, redrawn to the brochure's room sizes` });
    svg.append(hatch());
    const order = { out: 0, open: 1, dry: 2, wet: 3 };
    [...P.rooms].sort((a, b) => order[a[6]] - order[b[6]]).forEach(([name, dims, x0, z0, x1, z1, kind]) => {
      const r = el('rect', { x: X(x0), y: Y(z0), width: (x1 - x0) * S, height: (z1 - z0) * S, class: `room ${kind === 'open' ? 'dry' : kind}` });
      if (kind === 'open') r.setAttribute('style', 'stroke-dasharray:5 4;stroke-width:1.2');
      r.append(el('title', {}, dims ? `${name}: ${dims}` : name));
      const show = () => { svg.querySelectorAll('.hl').forEach(n => n.classList.remove('hl')); r.classList.add('hl'); hoverBox().textContent = dims ? `${name} · ${dims}` : name; };
      r.addEventListener('pointerenter', show); r.addEventListener('click', show);
      svg.append(r);
    });
    P.rooms.forEach(([name, dims, x0, z0, x1, z1]) => {
      const cx = X((x0 + x1) / 2), cy = Y((z0 + z1) / 2), small = (x1 - x0) < 1.5 || (z1 - z0) < 1.0;
      const label = name.length > 12 && (x1 - x0) < 2.6 ? name.split(' ') : [name];
      label.forEach((t, i) => svg.append(el('text', { x: cx, y: cy - (dims ? 4 : -4) + (i - (label.length - 1) / 2) * 13, class: 'rlabel', style: small ? 'font-size:9px' : '' }, t)));
      if (dims) svg.append(el('text', { x: cx, y: cy + 12 + (label.length - 1) * 6, class: 'rdim' }, dims));
    });
    P.windows.forEach(([x0, z0, x1, z1]) => svg.append(el('line', { x1: X(x0), y1: Y(z0), x2: X(x1), y2: Y(z1), class: 'win' })));
    scaleBar(svg, pad, H - 22, S);
    return svg;
  }
  function drawFloor() {
    const S = 24, pad = 30, minZ = -.8, maxZ = PD + .8;
    const W = 30.7 * S + pad * 2 + 20, H = (maxZ - minZ) * S + pad * 2 + 30;
    const X = x => x * S + pad, Y = z => (z - minZ) * S + pad;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Typical floor plan, floors 5 to 24: ten homes in two mirrored wings around a central core' });
    svg.append(hatch());
    const rect = (x0, z0, x1, z1, cls, fill) => { const r = el('rect', { x: X(x0), y: Y(Math.min(z0, z1)), width: (x1 - x0) * S, height: Math.abs(z1 - z0) * S, class: cls }); if (fill) r.setAttribute('fill', fill); svg.append(r); return r; };
    const mz = (z, sgn) => sgn > 0 ? z : PD - z;
    // light slots, passages, core
    [[0, 12], [18.95, 26.85]].forEach(([a, b]) => { rect(a, 11.7, b, 13.8, 'room slot'); rect(a, 10.4, b, 11.7, 'room core'); rect(a, 13.8, b, 15.1, 'room core'); });
    rect(26.85, 10.4, 30.7, 15.1, 'room slot');
    rect(12, 7.6, 18.95, 10.4, 'room core'); rect(12, 10.4, 18.95, 15.1, 'room core'); rect(12, 15.1, 18.95, 17.9, 'room core');
    const lbl = (x, z, t, cls = 'fp-sub') => svg.append(el('text', { x: X(x), y: Y(z), class: cls }, t));
    lbl(15.475, 9.2, 'Lifts ×3'); lbl(15.475, 12.95, 'Lobby'); lbl(15.475, 16.7, 'Stair · service lift'); lbl(6, 12.95, 'Light slot'); lbl(6, 11.25, 'Passage'); lbl(6, 14.65, 'Passage'); lbl(22.9, 11.25, 'Passage'); lbl(22.9, 14.65, 'Passage');
    [['N', 1], ['S', -1]].forEach(([w, sgn]) => FLOOR_UNITS.forEach(([n, type, rects]) => {
      const T = TYPES[type], g = el('g', { tabindex: 0, role: 'button', 'aria-label': `Home ${w}${n}: ${T.name}, ${T.total} m². Open plan.` });
      rects.forEach(([x0, z0, x1, z1]) => { const r = el('rect', { x: X(x0), y: Y(Math.min(mz(z0, sgn), mz(z1, sgn))), width: (x1 - x0) * S, height: Math.abs(z1 - z0) * S, class: 'unitblock', fill: getComputedStyle(document.documentElement).getPropertyValue(type === 'studio' ? '--studio' : type === 'one' ? '--one' : '--two') }); g.append(r); });
      const [x0, z0, x1, z1] = rects[0], cx = X((x0 + x1) / 2), cz = Y(mz(4.6, sgn));
      g.append(el('text', { x: cx, y: cz, class: 'fp-label' }, w + n), el('text', { x: cx, y: cz + 15, class: 'fp-sub' }, type === 'studio' ? 'Studio' : type === 'one' ? '1 bed' : '2 bed'), el('text', { x: cx, y: cz + 29, class: 'fp-sub' }, T.total + ' m²'));
      g.append(el('title', {}, `Home ${w}${n} · ${T.name} · ${T.total} m²`));
      const go = () => setPlan(type);
      g.addEventListener('click', go); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      g.addEventListener('pointerenter', () => { hoverBox().textContent = `Home ${w}${n} · ${T.name} · ${T.total} m² · click for the plan`; });
      svg.append(g);
    }));
    scaleBar(svg, pad, H - 18, S * 2.5); svg.lastChild.textContent = '5 m';
    return svg;
  }

  function setPlan(key) {
    document.querySelectorAll('[role="tab"]').forEach(b => b.setAttribute('aria-selected', b.dataset.plan === key));
    const fig = $('#plan'); fig.innerHTML = '';
    const info = $('#plan-info');
    if (key === 'floor') {
      fig.append(drawFloor(), Object.assign(document.createElement('figcaption'), { textContent: 'Floors 5–24, redrawn from the brochure. Each wing holds two studios, two one-bedrooms and a two-bedroom; the south wing mirrors the north.' }));
      info.innerHTML = `<h3>Typical floor</h3><p>Ten homes per floor, the same on all twenty residential floors. Three passenger lifts face the lobby; the stair and a service lift sit behind it. A light slot cuts into each side of the building between the wings.</p>
        <dl class="areas"><div><dt>Homes</dt><dd>10</dd></div><div><dt>Floors</dt><dd>5–24</dd></div><div><dt>Total</dt><dd>200</dd></div></dl>
        <div class="legend"><span><i class="swatch" style="background:var(--studio)"></i>Studio</span><span><i class="swatch" style="background:var(--one)"></i>One bed</span><span><i class="swatch" style="background:var(--two)"></i>Two bed</span></div>
        <div class="hover-room" id="hover-room">Hover or tap a home</div>`;
    } else {
      const T = TYPES[key];
      fig.append(drawUnit(key), Object.assign(document.createElement('figcaption'), { textContent: `${T.name}, floors 5–24. Dashed lines mark open-plan zones; blue lines are windows. Redrawn to the brochure's printed room sizes.` }));
      info.innerHTML = `<h3>${T.name}</h3><p>${T.blurb}</p>
        <dl class="areas"><div><dt>Internal</dt><dd>${T.internal} m²</dd></div><div><dt>Balcony</dt><dd>${T.external ? T.external + ' m²' : '—'}</dd></div><div><dt>Total</dt><dd>${T.total} m²</dd></div></dl>
        <div class="hover-room" id="hover-room">Hover or tap a room</div>
        <table class="dims"><tbody>${T.rooms.map(([r, d]) => `<tr><td>${r}</td><td>${d}</td></tr>`).join('')}</tbody></table>`;
    }
  }
  document.querySelectorAll('[role="tab"]').forEach(b => b.addEventListener('click', () => setPlan(b.dataset.plan)));
  document.addEventListener('click', e => { const a = e.target.closest('[data-goto]'); if (a) setPlan(a.dataset.goto); });
  setPlan('floor');

  /* ---------- nav ---------- */
  const nav = $('#nav'), menu = $('#menu'), mob = $('#mobile-nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 40 || !mob.hidden);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  menu.addEventListener('click', () => { mob.hidden = !mob.hidden; menu.setAttribute('aria-expanded', !mob.hidden); onScroll(); });
  mob.addEventListener('click', e => { if (e.target.tagName === 'A') { mob.hidden = true; menu.setAttribute('aria-expanded', 'false'); onScroll(); } });
})();
