// ════════════════════════════════════════════════════════════════
//  YANGON LOVE JOURNEY — script.js
//  Yangon / Myanmar city theme
// ════════════════════════════════════════════════════════════════
//
//  HOW TO PERSONALISE:
//    • Edit the MEMORIES array to change the popup messages
//    • Change BIRTHDAY_NAME to the recipient's name
//    • Adjust BUS_SPEED if you want faster / slower driving
//
// ════════════════════════════════════════════════════════════════

const BIRTHDAY_NAME = 'My Love';
const BUS_SPEED     = 0.18;
const ROAD_LENGTH   = 195;

// ─────────────────────────────────────────────────────────────
// 1.  MEMORY DATA
// ─────────────────────────────────────────────────────────────
// 📸  To add your own photos:
//     1. Create an  images/  folder next to index.html
//     2. Drop your photos in it  (jpg / png / webp)
//     3. Set the  image  field below to  'images/yourfilename.jpg'
//     If a file is missing the romantic gradient shows instead.
const MEMORIES = [
  {
    position: 22,
    title:    'First Date (26-5-2024) ✨',
    message:  'First Time We Met — that magical day changed everything.',
    emoji:    '☕',
    image:    'images/memo1.jpg',
    gradient: ['#C96B3A', '#7A3010'],
  },
  {
    position: 58,
    title:    'Shwedagon Pagoda🌸',
    message:  'Walking together near Shwedagon, hand in hand for the first time in pagoda.',
    emoji:    '🌸',
    image:    'images/memo2.jpg',
    gradient: ['#D4A000', '#884400'],
  },
  {
    position: 92,
    title:    'Our Souls 𓍯∞',
    message:  'My Soul and your soul are forever tangled.',
    emoji:    '🌅',
    image:    'images/memo3.jpg',
    gradient: ['#FF6633', '#AA1144'],
  },
  {
    position: 128,
    title:    'My Love Language for YOU 💖✨',
    message:  'I Love you. All ways. Always',
    emoji:    '💖✨',
    image:    'images/memo4.jpg',
    gradient: ['#CC5500', '#881100'],
  },
  {
    position: 162,
    title:    'Me & You — Forever 💝',
    message:  'Every ordinary day with you becomes my favourite day. Always.',
    emoji:    '💝',
    image:    'images/memo5.jpg',
    gradient: ['#AA2288', '#550055'],
  },
];

// ─────────────────────────────────────────────────────────────
// 2.  SCENE, CAMERA, RENDERER
// ─────────────────────────────────────────────────────────────
let lakeMesh = null;
const birdGroups = [];
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 800);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
scene.fog = new THREE.FogExp2(0x88BBDD, 0.0035);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ─────────────────────────────────────────────────────────────
// 3.  SKY — clear tropical blue sky
//     Pale sky-blue at horizon, bright mid-blue, deep blue at top
// ─────────────────────────────────────────────────────────────
(function buildSky() {
  const geo     = new THREE.SphereGeometry(380, 32, 16);
  const posAttr = geo.getAttribute('position');
  const data    = [];
  const cBot = new THREE.Color(0xAADDFF); // pale horizon blue
  const cMid = new THREE.Color(0x4499EE); // bright sky blue
  const cTop = new THREE.Color(0x1155BB); // deep blue zenith

  for (let i = 0; i < posAttr.count; i++) {
    const t = Math.max(0, Math.min(1, (posAttr.getY(i) + 50) / 280));
    const c = new THREE.Color();
    c.lerpColors(t < 0.5 ? cBot : cMid, t < 0.5 ? cMid : cTop, t < 0.5 ? t * 2 : (t - 0.5) * 2);
    data.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(data, 3));
  scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
})();

// Sun disc — bright white-yellow midday sun
const sunMesh = new THREE.Mesh(
  new THREE.CircleGeometry(10, 32),
  new THREE.MeshBasicMaterial({ color: 0xFFFFCC })
);
sunMesh.position.set(ROAD_LENGTH * 0.5, 60, -120);
scene.add(sunMesh);

// ─────────────────────────────────────────────────────────────
// 4.  LIGHTING
// ─────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xCCDDFF, 0.75)); // cool daylight ambient

const dirLight = new THREE.DirectionalLight(0xFFFFEE, 1.15);
dirLight.position.set(60, 80, 30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width  = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left    = -100;
dirLight.shadow.camera.right   = 100;
dirLight.shadow.camera.top     = 50;
dirLight.shadow.camera.bottom  = -50;
dirLight.shadow.camera.far     = 400;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xAABBFF, 0.3);
fillLight.position.set(-30, 15, -20);
scene.add(fillLight);

// ─────────────────────────────────────────────────────────────
// 5.  ROAD  (Yangon cracked tarmac — slightly worn dark grey)
// ─────────────────────────────────────────────────────────────
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(ROAD_LENGTH + 50, 8),
  new THREE.MeshLambertMaterial({ color: 0x36364A })
);
road.rotation.x = -Math.PI / 2;
road.position.set(ROAD_LENGTH / 2, 0, 0);
road.receiveShadow = true;
scene.add(road);

// Narrow concrete pavements each side
[-4.4, 4.4].forEach(z => {
  const pave = new THREE.Mesh(
    new THREE.PlaneGeometry(ROAD_LENGTH + 50, 3.8),
    new THREE.MeshLambertMaterial({ color: 0xAA9988 })
  );
  pave.rotation.x = -Math.PI / 2;
  pave.position.set(ROAD_LENGTH / 2, 0.01, z);
  scene.add(pave);
});

// Faded white centre-line dashes (old road — gaps are wider)
for (let x = 4; x < ROAD_LENGTH + 8; x += 9) {
  const dash = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 0.2),
    new THREE.MeshLambertMaterial({ color: 0xDDDD88 })
  );
  dash.rotation.x = -Math.PI / 2;
  dash.position.set(x, 0.02, 0);
  scene.add(dash);
}

// Green grass ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(ROAD_LENGTH + 120, 130),
  new THREE.MeshLambertMaterial({ color: 0x4A8A2A })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(ROAD_LENGTH / 2, -0.05, 0);
ground.receiveShadow = true;
scene.add(ground);

// ─────────────────────────────────────────────────────────────
// 6.  BUS  — classic old Yangon yellow bus
// ─────────────────────────────────────────────────────────────
const busGroup  = new THREE.Group();
const busWheels = [];

// Body — iconic yellow
const busBody = new THREE.Mesh(
  new THREE.BoxGeometry(3.4, 1.65, 1.7),
  new THREE.MeshLambertMaterial({ color: 0xFFCC00 })
);
busBody.position.y = 1.05;
busBody.castShadow = true;
busGroup.add(busBody);

// Roof cap — white stripe (Yangon buses had white roofs)
const busRoof = new THREE.Mesh(
  new THREE.BoxGeometry(3.1, 0.28, 1.55),
  new THREE.MeshLambertMaterial({ color: 0xEEEEDD })
);
busRoof.position.y = 2.02;
busGroup.add(busRoof);

// Front windscreen
const windscreen = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.95, 1.05),
  new THREE.MeshLambertMaterial({ color: 0x88CCEE, transparent: true, opacity: 0.6 })
);
windscreen.position.set(1.76, 1.08, 0);
busGroup.add(windscreen);

// Side windows (3)
const winMat = new THREE.MeshLambertMaterial({ color: 0x88CCEE, transparent: true, opacity: 0.6 });
[[-0.95, 1.12, 0.87], [0.05, 1.12, 0.87], [0.95, 1.12, 0.87]].forEach(([x, y, z]) => {
  const w = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.46, 0.06), winMat);
  w.position.set(x, y, z);
  busGroup.add(w);
});

// Red accent stripe along the side (typical Yangon bus detail)
const stripe = new THREE.Mesh(
  new THREE.BoxGeometry(3.42, 0.22, 0.06),
  new THREE.MeshLambertMaterial({ color: 0xDD2211 })
);
stripe.position.set(0, 0.62, 0.88);
busGroup.add(stripe);

// Headlights
const lampMat = new THREE.MeshLambertMaterial({ color: 0xFFFFAA, emissive: 0xFFFF44, emissiveIntensity: 0.8 });
[0.58, -0.58].forEach(z => {
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.22), lampMat);
  lamp.position.set(1.76, 0.88, z);
  busGroup.add(lamp);
});

// Wheels
const wGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.27, 10);
const wMat = new THREE.MeshLambertMaterial({ color: 0x1A1A28 });
const hGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.29, 8);
const hMat = new THREE.MeshLambertMaterial({ color: 0xBBBBCC });
[[-1.15, 0.36, 0.96], [1.15, 0.36, 0.96], [-1.15, 0.36, -0.96], [1.15, 0.36, -0.96]].forEach(p => {
  const wh = new THREE.Mesh(wGeo, wMat);
  wh.rotation.x = Math.PI / 2;
  wh.position.set(...p);
  busGroup.add(wh);
  busWheels.push(wh);
  const hub = new THREE.Mesh(hGeo, hMat);
  hub.rotation.x = Math.PI / 2;
  hub.position.set(...p);
  busGroup.add(hub);
});

busGroup.position.set(0, 0, 0);
scene.add(busGroup);

// ─────────────────────────────────────────────────────────────
// 7.  SHWEDAGON PAGODA
//     The most iconic landmark of Yangon — tall golden stupa
//     with tiered terraces, bell-shaped dome, and htis crown.
//     Placed far right of the road so it towers over the city.
// ─────────────────────────────────────────────────────────────
function makeShwedagon(x, z) {
  const grp    = new THREE.Group();
  const goldM  = (shade) => new THREE.MeshLambertMaterial({ color: shade });
  const whiteM = new THREE.MeshLambertMaterial({ color: 0xF2EDE0 });

  // Wide marble terrace platform (3 levels)
  [[22, 2.0, 22], [18, 1.5, 18], [14, 1.2, 14]].forEach(([w, h, d], i) => {
    const plat = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), whiteM);
    plat.position.y = i === 0 ? 1.0 : (i === 1 ? 2.75 : 4.15);
    grp.add(plat);
  });

  // Circular base drum (octagonal with CylinderGeometry 8 sides)
  const drum = new THREE.Mesh(
    new THREE.CylinderGeometry(5.5, 6.2, 2.5, 8),
    goldM(0xD4A800)
  );
  drum.position.y = 6.5;
  grp.add(drum);

  // Bell-shaped dome — sphere scaled taller than wide
  const bell = new THREE.Mesh(
    new THREE.SphereGeometry(5.0, 16, 16),
    goldM(0xFFCC00)
  );
  bell.scale.y = 2.0; // stretch into pagoda-bell shape
  bell.position.y = 14.5;
  grp.add(bell);

  // Tapering inverted-cone neck above bell
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 3.8, 5, 10),
    goldM(0xFFD700)
  );
  neck.position.y = 24.5;
  grp.add(neck);

  // Banana-bud (khaung laung) — tapered cylinder
  const bud = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 1.6, 4.5, 10),
    goldM(0xFFE033)
  );
  bud.position.y = 29.5;
  grp.add(bud);

  // Htis — decorative umbrella tiers (stacked torus rings + sphere)
  [32.8, 34.2, 35.4, 36.4].forEach((y, i) => {
    const r = 1.1 - i * 0.22;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.12, 6, 18),
      goldM(0xFFEE55)
    );
    ring.position.y = y;
    grp.add(ring);
  });

  // Diamond orb + vane at very top
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 10, 10),
    new THREE.MeshLambertMaterial({ color: 0xFFFFAA, emissive: 0xFFFF55, emissiveIntensity: 0.6 })
  );
  orb.position.y = 37.8;
  grp.add(orb);

  // Four cardinal corner stupas on the terrace
  [[-7, -7], [7, -7], [-7, 7], [7, 7]].forEach(([sx, sz]) => {
    const sg = new THREE.Group();
    // Small white platform
    const sp = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 2.2), whiteM);
    sp.position.y = 0.4;
    sg.add(sp);
    // Small gold bell
    const sb = new THREE.Mesh(new THREE.SphereGeometry(1.0, 8, 8), goldM(0xFFCC00));
    sb.scale.y = 1.6;
    sb.position.y = 2.5;
    sg.add(sb);
    // Small spire
    const ss = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.4, 2.4, 8), goldM(0xFFDD33));
    ss.position.y = 5.0;
    sg.add(ss);
    sg.position.set(sx, 5.2, sz);
    grp.add(sg);
  });

  // Eight planetary shrine posts (small golden pillars around terrace)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.3, 3, 6),
      goldM(0xFFBB00)
    );
    post.position.set(Math.cos(angle) * 9, 5.7, Math.sin(angle) * 9);
    grp.add(post);
  }

  grp.position.set(x, 0, z);
  scene.add(grp);
}

makeShwedagon(48, 28);  // Placed prominently — right side of road

// ─────────────────────────────────────────────────────────────
// 8.  SULE PAGODA
//     Octagonal golden pagoda in the heart of the city.
//     Smaller than Shwedagon, distinctive for its octagonal plan.
// ─────────────────────────────────────────────────────────────
function makeSulePagoda(x, z) {
  const grp  = new THREE.Group();
  const gMat = (c) => new THREE.MeshLambertMaterial({ color: c });

  // Octagonal base terraces (each tier slightly narrower)
  [[9, 1.2, 0xEDE0C8], [7.8, 1.0, 0xFFCC44], [6.5, 0.9, 0xFFBB22],
   [5.2, 0.8, 0xFFCC44], [4.0, 0.75, 0xFFBB22], [3.0, 0.65, 0xFFCC44]].forEach(([r, h, c], i) => {
    const tier = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r + 0.6, h, 8), // 8-sided = octagonal
      gMat(c)
    );
    tier.position.y = i * 0.95 + 0.6;
    grp.add(tier);
  });

  // Bell-shaped dome
  const bell = new THREE.Mesh(new THREE.SphereGeometry(3.0, 10, 10), gMat(0xFFD700));
  bell.scale.y = 1.65;
  bell.position.y = 9.0;
  grp.add(bell);

  // Upper spire tiers
  [[1.4, 3.5, 0xFFCC00], [0.7, 2.8, 0xFFDD33], [0.2, 2.2, 0xFFEE55]].forEach(([r, h, c], i) => {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.5, r, h, 8), gMat(c));
    s.position.y = 14.5 + i * 2.8;
    grp.add(s);
  });

  // Htis rings
  [22, 23.2, 24.2].forEach((y, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.65 - i * 0.15, 0.1, 6, 14),
      gMat(0xFFEE66)
    );
    ring.position.y = y;
    grp.add(ring);
  });

  // Top orb
  const topOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xFFFFBB, emissive: 0xFFFF66, emissiveIntensity: 0.7 })
  );
  topOrb.position.y = 25.2;
  grp.add(topOrb);

  grp.position.set(x, 0, z);
  scene.add(grp);
}

makeSulePagoda(105, -22); // Left side, city-centre zone

// ─────────────────────────────────────────────────────────────
// 9.  COLONIAL BUILDINGS
//     Yangon is famous for its British-era colonial architecture:
//     cream / yellow ochre plaster, brick base, arched windows,
//     wide verandas, ornate cornices.
// ─────────────────────────────────────────────────────────────
const COLONIAL_COLORS = [0xF2E2B0, 0xEAD48A, 0xF0D8A0, 0xE6CC88, 0xF5E4B8];

function makeColonialBuilding(x, z, w, h, d, ci) {
  const grp    = new THREE.Group();
  const mainC  = COLONIAL_COLORS[ci % COLONIAL_COLORS.length];
  const mainM  = new THREE.MeshLambertMaterial({ color: mainC });
  const brickM = new THREE.MeshLambertMaterial({ color: 0x8B3A22 });

  // Main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mainM);
  body.position.y = h / 2;
  body.castShadow = true;
  grp.add(body);

  // Brick base course (typical of colonial buildings in Yangon)
  const base = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 1.6, d + 0.2), brickM);
  base.position.y = 0.8;
  grp.add(base);

  // Veranda / arcade on ground floor
  const veranda = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.5, 0.18, d * 0.5),
    new THREE.MeshLambertMaterial({ color: 0xDDCC99 })
  );
  veranda.position.set(0, 2.0, z > 0 ? d * 0.45 : -d * 0.45);
  grp.add(veranda);

  // Ornate cornice ledge at top
  const cornice = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.55, 0.45, d + 0.55),
    new THREE.MeshLambertMaterial({ color: 0xCCBB88 })
  );
  cornice.position.y = h + 0.22;
  grp.add(cornice);

  // Arched window details along the face closest to road
  const faceZ  = z > 0 ? d / 2 + 0.05 : -(d / 2 + 0.05);
  const winMat = new THREE.MeshLambertMaterial({ color: 0x558899 });
  const colM   = new THREE.MeshLambertMaterial({ color: 0xCCBB88 });
  let wx = -w / 2 + 1.0;
  while (wx < w / 2 - 0.5) {
    // Window rectangle
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), winMat);
    win.position.set(wx, h * 0.55, faceZ);
    grp.add(win);
    // Window arch cap (small box above to simulate arch)
    const arch = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 0.1), mainM);
    arch.position.set(wx, h * 0.55 + 0.51, faceZ);
    grp.add(arch);
    // Narrow column between windows
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, h - 1.8, 0.1), colM);
    col.position.set(wx + 0.5, h * 0.5, faceZ);
    grp.add(col);
    wx += 1.25;
  }

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// ─────────────────────────────────────────────────────────────
// 10. TRADITIONAL SHOP-HOUSES
//     Narrow 2-3 storey buildings with ground-floor shops,
//     balconies, and colourful painted facades — very Yangon.
// ─────────────────────────────────────────────────────────────
const SHOPHOUSE_COLORS = [0xFF9966, 0x66AABB, 0xBBAA55, 0x88BB66, 0xCC7777, 0x9977BB];

function makeShophouse(x, z, w, h, d, ci) {
  const grp = new THREE.Group();
  const col = SHOPHOUSE_COLORS[ci % SHOPHOUSE_COLORS.length];

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color: col })
  );
  body.position.y = h / 2;
  body.castShadow = true;
  grp.add(body);

  // Dark trim at each floor level
  for (let floor = 1; floor < Math.round(h / 2.5); floor++) {
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.1, 0.14, d + 0.1),
      new THREE.MeshLambertMaterial({ color: 0x443333 })
    );
    trim.position.y = floor * 2.5;
    grp.add(trim);
  }

  // Flat roof parapet
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.3, 0.45, d + 0.3),
    new THREE.MeshLambertMaterial({ color: 0xDDCCAA })
  );
  parapet.position.y = h + 0.22;
  grp.add(parapet);

  // Ground floor shop opening (dark recess)
  const shop = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.6, 1.8, 0.1),
    new THREE.MeshLambertMaterial({ color: 0x221A11 })
  );
  const fz = z > 0 ? d / 2 + 0.06 : -(d / 2 + 0.06);
  shop.position.set(0, 0.95, fz);
  grp.add(shop);

  // Sign board above shop
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.7, 0.55, 0.12),
    new THREE.MeshLambertMaterial({ color: 0xFF3333 })
  );
  sign.position.set(0, 2.0, fz);
  grp.add(sign);

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// ─────────────────────────────────────────────────────────────
// 11. TEAHOUSE (La Phet Yay Saing)
//     Open-fronted wooden tea stalls are everywhere in Yangon —
//     low tables outside, bright awnings, hand-painted signs.
// ─────────────────────────────────────────────────────────────
function makeTeahouse(x, z) {
  const grp = new THREE.Group();
  const faceSide = z > 0 ? 1 : -1;

  // Main hut body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 2.6, 3.2),
    new THREE.MeshLambertMaterial({ color: 0xE8D8A0 })
  );
  body.position.y = 1.3;
  grp.add(body);

  // Gabled roof (two sloped halves using boxes)
  [-0.4, 0.4].forEach(side => {
    const half = new THREE.Mesh(
      new THREE.BoxGeometry(4.7, 0.15, 1.7),
      new THREE.MeshLambertMaterial({ color: 0xCC4411 })
    );
    half.rotation.z = side > 0 ? 0.35 : -0.35;
    half.position.set(0, 2.85, side * 1.55);
    grp.add(half);
  });

  // Ridge pole
  const ridge = new THREE.Mesh(
    new THREE.BoxGeometry(4.7, 0.18, 0.18),
    new THREE.MeshLambertMaterial({ color: 0x884422 })
  );
  ridge.position.y = 3.15;
  grp.add(ridge);

  // Colourful awning extending toward road
  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.1, 2.0),
    new THREE.MeshLambertMaterial({ color: 0xFF6633 })
  );
  awning.position.set(0, 2.4, faceSide * 2.6);
  awning.rotation.x = -faceSide * 0.22;
  grp.add(awning);

  // Hand-painted sign
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.7, 0.12),
    new THREE.MeshLambertMaterial({ color: 0xEE2222 })
  );
  sign.position.set(0, 2.9, faceSide * 1.66);
  grp.add(sign);

  // Small outdoor tables + stools
  [-1.2, 0, 1.2].forEach(tx => {
    const tbl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.08, 8),
      new THREE.MeshLambertMaterial({ color: 0x7A5528 })
    );
    tbl.position.set(tx, 0.56, faceSide * 2.8);
    grp.add(tbl);
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.56, 6),
      new THREE.MeshLambertMaterial({ color: 0x5A3A18 })
    );
    leg.position.set(tx, 0.28, faceSide * 2.8);
    grp.add(leg);
  });

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// ─────────────────────────────────────────────────────────────
// 12. MARKET STALLS (Zay)
//     A row of covered stalls with colourful canopies —
//     common at Bogyoke (Scott) Market and every local zay.
// ─────────────────────────────────────────────────────────────
const CANOPY_COLORS = [0xFF4444, 0x44AA55, 0x4466DD, 0xFFAA22, 0xAA44CC, 0xFF4499];

function makeMarketRow(startX, z, count) {
  const faceSide = z > 0 ? 1 : -1;

  for (let i = 0; i < count; i++) {
    const grp = new THREE.Group();
    const col = CANOPY_COLORS[i % CANOPY_COLORS.length];

    // Counter / table
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.85, 1.6),
      new THREE.MeshLambertMaterial({ color: 0x6B4820 })
    );
    counter.position.y = 0.42;
    grp.add(counter);

    // Goods on counter (coloured block stand-ins)
    [-0.6, 0, 0.6].forEach((gx, gi) => {
      const good = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.28, 0.38),
        new THREE.MeshLambertMaterial({ color: CANOPY_COLORS[(i + gi + 3) % CANOPY_COLORS.length] })
      );
      good.position.set(gx, 1.0, 0);
      grp.add(good);
    });

    // Two support poles
    [-0.95, 0.95].forEach(px => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 2.2, 6),
        new THREE.MeshLambertMaterial({ color: 0x5A3A18 })
      );
      pole.position.set(px, 1.1, 0);
      grp.add(pole);
    });

    // Canopy (slightly angled toward road)
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.14, 2.4),
      new THREE.MeshLambertMaterial({ color: col })
    );
    canopy.position.set(0, 2.25, faceSide * 0.2);
    canopy.rotation.x = faceSide * 0.12;
    grp.add(canopy);

    // Hanging fringe strip
    const fringe = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.35, 0.06),
      new THREE.MeshLambertMaterial({ color: col })
    );
    fringe.position.set(0, 2.0, faceSide * 1.35);
    grp.add(fringe);

    grp.position.set(startX + i * 3.0, 0, z);
    scene.add(grp);
  }
}

// ─────────────────────────────────────────────────────────────
// 13. BUDDHIST MONASTERY (Kyaung)
//     Long low building, steep multi-tiered red roof, gold trim,
//     ornate finials at roof ends — characteristic Myanmar style.
// ─────────────────────────────────────────────────────────────
function makeMonastery(x, z) {
  const grp     = new THREE.Group();
  const wallM   = new THREE.MeshLambertMaterial({ color: 0xC8A84A }); // golden yellow walls
  const roofM   = new THREE.MeshLambertMaterial({ color: 0xBB2200 }); // deep red roof
  const goldTrimM = new THREE.MeshLambertMaterial({ color: 0xFFCC22 });

  // Foundation plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(14, 0.7, 6.5), new THREE.MeshLambertMaterial({ color: 0xCCBB99 }));
  plinth.position.y = 0.35;
  grp.add(plinth);

  // Main hall body
  const hall = new THREE.Mesh(new THREE.BoxGeometry(12, 3.5, 5.5), wallM);
  hall.position.y = 2.45;
  grp.add(hall);

  // Multi-tiered roof (each layer wider and lower than the one above)
  [[14.5, 0.55, 7.5, 5.2], [12.8, 0.55, 6.8, 6.1], [10.5, 0.55, 6.0, 7.0]].forEach(([w, h, d, y]) => {
    const rLayer = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), roofM);
    rLayer.position.y = y;
    grp.add(rLayer);
  });

  // Gold ridge beam along the top
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(13, 0.3, 0.3), goldTrimM);
  ridge.position.y = 7.35;
  grp.add(ridge);

  // Pyatthat (tiered finials) at each end of ridge
  [-5.5, 5.5].forEach(ex => {
    [[0.9, 1.0], [0.6, 0.8], [0.35, 0.7]].forEach(([r, h], ti) => {
      const fin = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), goldTrimM);
      fin.position.set(ex, 7.8 + ti * 0.75, 0);
      grp.add(fin);
    });
  });

  // Ornate front entrance portico
  const portico = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 1.2), wallM);
  const pz = z > 0 ? -3.7 : 3.7;
  portico.position.set(0, 1.75, pz);
  grp.add(portico);
  const porticoRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 2.0), roofM);
  porticoRoof.position.set(0, 3.7, pz);
  grp.add(porticoRoof);

  // Buddha image inside (simplified silhouette visible through entrance)
  const buddha = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xFFDD44, emissive: 0xFFAA00, emissiveIntensity: 0.35 })
  );
  buddha.position.set(0, 2.5, 0);
  grp.add(buddha);

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// ─────────────────────────────────────────────────────────────
// 14. BANYAN TREE  (Nyaung in Burmese)
//     Wide spreading canopy, aerial prop-roots hanging down —
//     a signature tree lining Yangon streets and temple grounds.
// ─────────────────────────────────────────────────────────────
function makeBanyanTree(x, z) {
  const grp    = new THREE.Group();
  const trunkM = new THREE.MeshLambertMaterial({ color: 0x5C3A1A });
  const leafM  = new THREE.MeshLambertMaterial({ color: 0x2A7A35 });
  const rootM  = new THREE.MeshLambertMaterial({ color: 0x7A5533 });

  // Thick trunk
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 2.8, 8), trunkM);
  trunk.position.y = 1.4;
  grp.add(trunk);

  // Wide central canopy (flattened sphere)
  const main = new THREE.Mesh(new THREE.SphereGeometry(3.0, 9, 7), leafM);
  main.scale.set(1, 0.6, 1);
  main.position.y = 5.0;
  grp.add(main);

  // Sprawling side canopy blobs
  [
    [-2.8, 4.2, 0.4],  [2.8, 4.2, 0.4],
    [0.4, 4.2, -2.6],  [0.4, 4.2, 2.6],
    [-2.0, 4.6, 1.8],  [2.0, 4.6, 1.8],
    [-2.0, 4.6, -1.8], [2.0, 4.6, -1.8]
  ].forEach(([bx, by, bz]) => {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(1.55, 7, 5), leafM);
    blob.scale.y = 0.55;
    blob.position.set(bx, by, bz);
    grp.add(blob);
  });

  // Hanging aerial roots (characteristic of banyan trees)
  [
    [-0.9, -0.6], [0.7, 0.5], [-0.4, 1.2], [1.3, -0.2],
    [-1.5, 0.3],  [0.2, -0.9]
  ].forEach(([rx, rz]) => {
    const root = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.05, 2.0, 5),
      rootM
    );
    root.position.set(rx, 2.2, rz);
    grp.add(root);
  });

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// ─────────────────────────────────────────────────────────────
// 15. PALM TREE
//     Coconut palms and toddy palms (Tan-Bin) are everywhere
//     on Yangon's outskirts and along canals.
// ─────────────────────────────────────────────────────────────
function makePalmTree(x, z) {
  const grp    = new THREE.Group();
  const trunkM = new THREE.MeshLambertMaterial({ color: 0x7A6040 });
  const frondM = new THREE.MeshLambertMaterial({ color: 0x3A8840 });

  // Slightly leaning trunk
  const lean   = (Math.random() - 0.5) * 0.18;
  const trunk  = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 5.5, 7), trunkM);
  trunk.position.y = 2.75;
  trunk.rotation.z = lean;
  grp.add(trunk);

  // Palm fronds fanning outward from the crown
  for (let f = 0; f < 8; f++) {
    const angle = (f / 8) * Math.PI * 2;
    const frond = new THREE.Mesh(new THREE.SphereGeometry(1.1, 5, 3), frondM);
    frond.scale.set(0.28, 0.1, 1.25);
    frond.position.set(
      Math.cos(angle) * 1.5,
      5.3 - Math.abs(Math.sin(angle * 2)) * 0.3,
      Math.sin(angle) * 1.5
    );
    frond.rotation.y  = angle;
    frond.rotation.x  = 0.35;
    grp.add(frond);
  }

  // Coconuts (small spheres at crown)
  for (let c = 0; c < 4; c++) {
    const a   = (c / 4) * Math.PI * 2;
    const nut = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 6, 6),
      new THREE.MeshLambertMaterial({ color: 0x886633 })
    );
    nut.position.set(Math.cos(a) * 0.4, 5.0, Math.sin(a) * 0.4);
    grp.add(nut);
  }

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// ─────────────────────────────────────────────────────────────
// 16. PLACE ALL BUILDINGS
//     District layout along the road:
//       x 0-50   — City entry: colonial + shophouses
//       x 50-100 — Shwedagon area: market stalls, teahouses, monastery
//       x 100-150 — City centre: Sule area, colonial, shophouses
//       x 150-195 — Outskirts: mixed, palm trees, finale approach
// ─────────────────────────────────────────────────────────────

// ── Colonial buildings (Yangon downtown style) ────────────────
const COLONIALS = [
  // [x, z, w, h, d, colorIdx]
  // Positive Z (right side)
  [6,   10,  5, 9, 3.5, 0], [16,  11, 4, 11, 3,  1], [26,  10, 5, 8,  3.5, 2],
  [72,  10,  6,12, 4,   3], [82,  11, 4, 10, 3,  4], [92,  10, 5, 9,  3.5, 0],
  [108, 10,  5,11, 4,   1], [118, 11, 4, 13, 3,  2], [128, 10, 6, 10, 4,   3],
  [172, 10,  5, 9, 3.5, 4], [182, 11, 4, 11, 3,  0],
  // Negative Z (left side)
  [8,  -10, 4, 10, 3.5, 2], [18, -11, 5, 8,  3,  3], [28, -10, 4, 11, 3.5, 4],
  [74, -10, 5,12, 4,   0], [84, -11, 4, 10, 3,  1], [94, -10, 6,  9, 4,   2],
  [110,-10, 4,11, 3.5, 3], [120,-11, 5, 13, 3,  4], [130,-10, 5, 10, 4,   0],
  [174,-10, 4, 9, 3.5, 1], [184,-11, 5, 11, 3,  2],
];
COLONIALS.forEach(b => makeColonialBuilding(...b));

// ── Shophouses (traditional narrow buildings) ─────────────────
const SHOPHOUSES = [
  [36,  10, 3, 6, 2.5, 0], [40, 10, 2.5, 8, 2, 1], [44,  10, 3, 7, 2.5, 2],
  [138, 10, 3, 7, 2.5, 3], [142,10, 2.5,9, 2, 4], [146, 10, 3, 6, 2.5, 5],
  [160, 10, 3, 8, 2.5, 0], [164,10, 2.5,6, 2, 1], [168, 10, 3, 9, 2.5, 2],
  [36, -10, 3, 7, 2.5, 4], [40,-10, 2.5,9, 2, 5], [44, -10, 3, 6, 2.5, 0],
  [138,-10, 3, 8, 2.5, 1], [142,-10,2.5,7, 2, 2], [146,-10, 3, 9, 2.5, 3],
  [160,-10, 3, 6, 2.5, 4], [164,-10,2.5,8, 2, 5], [168,-10, 3, 7, 2.5, 0],
];
SHOPHOUSES.forEach(b => makeShophouse(...b));

// ── Teahouses ─────────────────────────────────────────────────
[[18, 7], [62, 7], [98, -7], [148, 7], [178, -7]].forEach(([x, z]) => makeTeahouse(x, z));

// ── Market stalls (Zay) ───────────────────────────────────────
makeMarketRow(55,   7.5, 6);  // near Shwedagon
makeMarketRow(102, -7.5, 5);  // city centre

// ── Monastery (Kyaung) ────────────────────────────────────────
makeMonastery(76,  18);
makeMonastery(155, -18);

// ─────────────────────────────────────────────────────────────
// 17. TREES — banyan trees near temples, palms on outskirts
// ─────────────────────────────────────────────────────────────

// Banyan trees (near pagodas and monastery areas)
const BANYANS = [
  [10, 8.5], [20, -8.5], [30, 8.5], [50, -8.5],
  [66, 8.5], [78, -8.5], [88, 8.5], [98, -8.5],
  [116, 8.5],[124, -8.5],[134, 8.5],[144, -8.5],
];
BANYANS.forEach(([x, z]) => makeBanyanTree(x, z));

// Palm trees (outskirts zone)
const PALMS = [
  [155, 8.5], [162, -8.5], [170, 8.5], [177, -8.5],
  [185, 8.5], [190, -8.5],
];
PALMS.forEach(([x, z]) => makePalmTree(x, z));

// ─────────────────────────────────────────────────────────────
// 18. STREET LIGHTS
//     Yangon old-style lamp posts — grey pole, curved arm, warm glow
// ─────────────────────────────────────────────────────────────
function makeStreetLight(x, z) {
  const grp = new THREE.Group();
  const dir = z > 0 ? -1 : 1; // arm points toward road

  // Main pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.08, 5.0, 7),
    new THREE.MeshLambertMaterial({ color: 0x777788 })
  );
  pole.position.y = 2.5;
  grp.add(pole);

  // Horizontal arm
  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6),
    new THREE.MeshLambertMaterial({ color: 0x777788 })
  );
  arm.rotation.z = Math.PI / 2;
  arm.position.set(dir * 0.7, 5.0, 0);
  grp.add(arm);

  // Lamp shade (flattened cylinder)
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.22, 0.22, 8),
    new THREE.MeshLambertMaterial({ color: 0x555566 })
  );
  shade.position.set(dir * 1.4, 5.0, 0);
  grp.add(shade);

  // Glowing bulb underneath shade
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xFFEE99, emissive: 0xFFDD44, emissiveIntensity: 0.9 })
  );
  bulb.position.set(dir * 1.4, 4.82, 0);
  grp.add(bulb);

  // Decorative finial ball on top of pole
  const finial = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 7, 7),
    new THREE.MeshLambertMaterial({ color: 0xAAAAAABB })
  );
  finial.position.y = 5.08;
  grp.add(finial);

  grp.position.set(x, 0, z);
  scene.add(grp);
}

for (let x = 4; x < ROAD_LENGTH + 8; x += 14) {
  makeStreetLight(x,  5.6);
  makeStreetLight(x, -5.6);
}

// ─────────────────────────────────────────────────────────────
// 19. CLOUDS  (heat-haze fluffy clouds over Yangon)
// ─────────────────────────────────────────────────────────────
const cloudGroups = [];

function makeCloud(x, y, z) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0xFFEEDD, transparent: true, opacity: 0.85 });
  [
    [0, 0, 0, 1.8], [-1.5, -0.3, 0, 1.2], [1.5, -0.3, 0, 1.2],
    [0.8, 0.4, 0, 1.1], [-0.8, 0.4, 0, 1.0]
  ].forEach(([cx, cy, cz, r]) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 7), mat);
    b.position.set(cx, cy, cz);
    grp.add(b);
  });
  grp.position.set(x, y, z);
  scene.add(grp);
  cloudGroups.push(grp);
}

for (let i = 0; i < 12; i++) {
  makeCloud(
    Math.random() * (ROAD_LENGTH + 40),
    10 + Math.random() * 8,
    (Math.random() - 0.5) * 42
  );
}

// ─────────────────────────────────────────────────────────────
// 19b. ATMOSPHERE — grass patches, water, landscape
// ─────────────────────────────────────────────────────────────

// Grass ground overlay patches
[
  [45, 25, 32, 18], [62, 30, 28, 16], [90, 20, 22, 14],
  [130, 24, 26, 12], [155, -18, 20, 18], [35, -22, 18, 14],
  [75, -24, 24, 16], [105, 26, 20, 14], [150, 28, 18, 12],
].forEach(([x, z, w, d]) => {
  const patch = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshLambertMaterial({ color: 0x3D7A1A })
  );
  patch.rotation.x = -Math.PI / 2;
  patch.position.set(x, 0.03, z);
  scene.add(patch);
});

// Dirt path forks off the main road
[[55, 12, 30, 3], [100, -12, 25, 3], [140, 14, 20, 3]].forEach(([x, z, l, w]) => {
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(w, l),
    new THREE.MeshLambertMaterial({ color: 0x9A7050 })
  );
  path.rotation.x  = -Math.PI / 2;
  path.rotation.z  = Math.PI / 2;
  path.position.set(x, 0.025, z);
  scene.add(path);
});

// ─────────────────────────────────────────────────────────────
// 19c. KANDAWGYI LAKE  (beside Shwedagon, +z side)
// ─────────────────────────────────────────────────────────────
// Sandy shore
const lakeShore = new THREE.Mesh(
  new THREE.PlaneGeometry(58, 26),
  new THREE.MeshLambertMaterial({ color: 0xAA9266 })
);
lakeShore.rotation.x = -Math.PI / 2;
lakeShore.position.set(60, -0.02, 34);
scene.add(lakeShore);

// Water surface
lakeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(52, 20),
  new THREE.MeshLambertMaterial({ color: 0x1A6090, transparent: true, opacity: 0.88 })
);
lakeMesh.rotation.x = -Math.PI / 2;
lakeMesh.position.set(60, 0.05, 34);
scene.add(lakeMesh);

// Water-lily pads (small ellipses)
const lilyMat = new THREE.MeshLambertMaterial({ color: 0x3A8A2A });
const flowerMat = new THREE.MeshLambertMaterial({ color: 0xFFFFCC });
[[52, 30], [66, 38], [58, 41], [70, 33], [45, 36], [75, 40]].forEach(([lx, lz]) => {
  const pad = new THREE.Mesh(new THREE.CircleGeometry(0.6, 8), lilyMat);
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(lx, 0.07, lz);
  scene.add(pad);
  const flower = new THREE.Mesh(new THREE.CircleGeometry(0.2, 6), flowerMat);
  flower.rotation.x = -Math.PI / 2;
  flower.position.set(lx, 0.09, lz);
  scene.add(flower);
});

// Rocks along the shore
const rockMat = new THREE.MeshLambertMaterial({ color: 0x887766 });
[[43, 26], [78, 27], [44, 39], [79, 40], [55, 24], [68, 43]].forEach(([rx, rz]) => {
  const rock = new THREE.Mesh(
    new THREE.SphereGeometry(0.4 + Math.random() * 0.4, 6, 5),
    rockMat
  );
  rock.scale.y = 0.55;
  rock.position.set(rx, 0.2, rz);
  scene.add(rock);
});

// Kandawgyi Pavilion (floating gazebo on the lake)
(function makeLakePavilion() {
  const grp   = new THREE.Group();
  const goldM = new THREE.MeshLambertMaterial({ color: 0xCC9900 });
  const redM  = new THREE.MeshLambertMaterial({ color: 0xBB2200 });
  const platM = new THREE.MeshLambertMaterial({ color: 0xDDCC99 });

  // Raised platform
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.5, 8), platM);
  plat.position.y = 0.25;
  grp.add(plat);

  // Support pillars
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 2.8, 7), goldM);
    col.position.set(Math.cos(a) * 2.8, 1.9, Math.sin(a) * 2.8);
    grp.add(col);
  }

  // Tiered roof (3 levels)
  [[5.0, 0.5, 0, 4.8], [3.8, 0.45, 1.2, 3.6], [2.4, 0.4, 2.2, 2.2]].forEach(([r, h, y, rr]) => {
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.5, r, h, 12), redM);
    tier.position.y = 3.5 + y;
    grp.add(tier);
  });

  // Golden spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.2, 8), goldM);
  spire.position.y = 7.0;
  grp.add(spire);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xFFEE55, emissive: 0xFFDD00, emissiveIntensity: 0.7 }));
  orb.position.y = 8.3;
  grp.add(orb);

  grp.position.set(62, 0.05, 34);
  scene.add(grp);
})();

// Wooden walkway / jetty from shore to pavilion
(function makeJetty() {
  const deckM = new THREE.MeshLambertMaterial({ color: 0x7A5030 });
  const deck  = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 1.6), deckM);
  deck.position.set(54, 0.15, 27);
  deck.rotation.y = -0.45;
  scene.add(deck);
  // Railings
  [-0.7, 0.7].forEach(offset => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 0.1), deckM);
    rail.position.set(54, 0.55, 27 + offset * 1.4);
    rail.rotation.y = -0.45;
    scene.add(rail);
  });
})();

// ─────────────────────────────────────────────────────────────
// 19d. FLAME TREES  (Delonix regia — Yangon's iconic red tree)
// ─────────────────────────────────────────────────────────────
function makeFlameTree(x, z) {
  const grp    = new THREE.Group();
  const trunkM = new THREE.MeshLambertMaterial({ color: 0x5C2E0E });
  const fire1  = new THREE.MeshLambertMaterial({ color: 0xFF3A00 });
  const fire2  = new THREE.MeshLambertMaterial({ color: 0xFF6B00 });
  const fire3  = new THREE.MeshLambertMaterial({ color: 0xDD2200 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.34, 3.5, 8), trunkM);
  trunk.position.y = 1.75;
  grp.add(trunk);

  // Wide umbrella shape — multiple flame-colored blobs
  [
    [0,    5.8, 0,    2.8, fire1],
    [-2.4, 4.6, 0,    1.7, fire2],
    [ 2.4, 4.6, 0,    1.7, fire3],
    [0,    4.8,-2.3,  1.6, fire2],
    [0,    4.8, 2.3,  1.6, fire1],
    [-1.6, 5.0, 1.6,  1.3, fire3],
    [ 1.6, 5.0, 1.6,  1.3, fire1],
    [-1.6, 5.0,-1.6,  1.3, fire2],
    [ 1.6, 5.0,-1.6,  1.3, fire3],
    [0,    6.6, 0,    1.0, fire2],
  ].forEach(([cx, cy, cz, r, mat]) => {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 5), mat);
    blob.scale.y = 0.5;
    blob.position.set(cx, cy, cz);
    grp.add(blob);
  });

  grp.position.set(x, 0, z);
  scene.add(grp);
}

// Flame tree placement — line both sides of the main road
[
  [5, 7.5], [14, -7.5], [24, 7.5], [32, -7.5], [46, 7.5],
  [58, -7.5], [68, 7.5], [80, -7.5], [96, 7.5], [104, -7.5],
  [115, 7.5], [125, -7.5], [140, 7.5], [152, -7.5], [165, 7.5],
  [176, -7.5], [185, 7.5],
].forEach(([x, z]) => makeFlameTree(x, z));

// Extra flame trees in the park areas
[[50, 20], [64, 22], [56, 26], [72, 24], [42, 22]].forEach(([x, z]) => makeFlameTree(x, z));

// ─────────────────────────────────────────────────────────────
// 19e. YANGON CITY HALL  (grand colonial government building)
// ─────────────────────────────────────────────────────────────
(function makeYangonCityHall() {
  const x = 100, z = 18;
  const grp    = new THREE.Group();
  const whiteM = new THREE.MeshLambertMaterial({ color: 0xF5EFE0 });
  const creamM = new THREE.MeshLambertMaterial({ color: 0xE8DDB8 });
  const redM   = new THREE.MeshLambertMaterial({ color: 0xBB2200 });
  const goldM  = new THREE.MeshLambertMaterial({ color: 0xFFCC22 });

  // Wide wing sections
  [-1, 1].forEach(side => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 5.5), creamM);
    wing.position.set(side * 10, 3.5, 0);
    wing.castShadow = true;
    grp.add(wing);
    const wc = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.5, 6), new THREE.MeshLambertMaterial({ color: 0xCCBB88 }));
    wc.position.set(side * 10, 7.25, 0);
    grp.add(wc);
    [-1.2, 1.2].forEach(cx => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 6.8, 10), whiteM);
      col.position.set(side * 10 + cx, 3.4, -3.2);
      grp.add(col);
    });
  });

  // Main central body
  const body = new THREE.Mesh(new THREE.BoxGeometry(10, 9, 6), whiteM);
  body.position.y = 4.5;
  body.castShadow = true;
  grp.add(body);

  // Grand front columns (6)
  for (let i = -2.5; i <= 2.5; i++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 8.5, 10), whiteM);
    col.position.set(i * 1.45, 4.25, -3.2);
    grp.add(col);
  }

  // Grand steps
  for (let s = 0; s < 4; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(11 - s * 0.6, 0.28, 2.4 - s * 0.25),
      new THREE.MeshLambertMaterial({ color: 0xDDCCAA })
    );
    step.position.set(0, s * 0.28, -3.0 - s * 0.3);
    grp.add(step);
  }

  // Pediment (triangular roofline)
  const pediment = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.6, 6.5), new THREE.MeshLambertMaterial({ color: 0xCCBB88 }));
  pediment.position.y = 9.3;
  grp.add(pediment);

  // Central raised tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6.2), whiteM);
  tower.position.y = 13.0;
  grp.add(tower);

  // Myanmar-style tiered roof on tower
  [[8, 0.7, 8, 15.5], [6.8, 0.65, 7, 16.2], [5.4, 0.6, 5.8, 16.8]].forEach(([w, h, d, y]) => {
    const tier = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), redM);
    tier.position.y = y;
    grp.add(tier);
  });

  // Golden spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.6, 4.5, 8), goldM);
  spire.position.y = 20.0;
  grp.add(spire);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xFFEE55, emissive: 0xFFDD00, emissiveIntensity: 0.6 }));
  orb.position.y = 22.5;
  grp.add(orb);

  // Arched windows on main body
  const winMat = new THREE.MeshLambertMaterial({ color: 0x5599AA });
  for (let f = 0; f < 2; f++) {
    for (let i = -1; i <= 1; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.12), winMat);
      win.position.set(i * 2.0, 2.5 + f * 3.2, -3.06);
      grp.add(win);
    }
  }

  grp.position.set(x, 0, z);
  scene.add(grp);
})();

// ─────────────────────────────────────────────────────────────
// 19f. BOGYOKE (SCOTT) MARKET
// ─────────────────────────────────────────────────────────────
(function makeBogyokeMarket() {
  const x = 82, z = -17;
  const grp    = new THREE.Group();
  const creamM = new THREE.MeshLambertMaterial({ color: 0xEDD898 });
  const redM   = new THREE.MeshLambertMaterial({ color: 0xBB2200 });
  const whiteM = new THREE.MeshLambertMaterial({ color: 0xF0EAD6 });
  const darkM  = new THREE.MeshLambertMaterial({ color: 0x221A11 });

  // Main long market hall
  const hall = new THREE.Mesh(new THREE.BoxGeometry(24, 5.5, 7.5), creamM);
  hall.position.y = 2.75;
  hall.castShadow = true;
  grp.add(hall);

  // Red layered roof
  [[26, 0.65, 9, 5.5], [24.5, 0.6, 8.2, 6.15], [23, 0.55, 7.5, 6.7]].forEach(([w, h, d, y]) => {
    grp.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), redM)).position.y = y;
  });

  // Front arcade (6 bays)
  for (let i = -2.5; i <= 2.5; i++) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.2, 0.55), creamM);
    frame.position.set(i * 3.5, 2.1, 4.28);
    grp.add(frame);
    // Arch opening
    const opening = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.0, 0.6), darkM);
    opening.position.set(i * 3.5, 1.6, 4.28);
    grp.add(opening);
    // Arch pillar pairs
    [-0.85, 0.85].forEach(cx => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.0, 8), whiteM);
      col.position.set(i * 3.5 + cx, 2.0, 4.28);
      grp.add(col);
    });
  }

  // Grand central entrance
  const entry = new THREE.Mesh(new THREE.BoxGeometry(5.5, 8.5, 2.5), creamM);
  entry.position.set(0, 4.25, 5.25);
  grp.add(entry);
  const entryRoof = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.65, 3.5), redM);
  entryRoof.position.set(0, 8.75, 5.25);
  grp.add(entryRoof);
  // Sign
  const sign = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.9, 0.2),
    new THREE.MeshLambertMaterial({ color: 0xFFCC22 }));
  sign.position.set(0, 7.2, 7.05);
  grp.add(sign);

  // Inside stalls (visible from entrance)
  const stallColors = [0xFF8844, 0x44AA66, 0x4488CC, 0xFFAA22, 0xCC66AA, 0x66BBAA];
  for (let i = -4; i <= 4; i++) {
    const stall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 2.0),
      new THREE.MeshLambertMaterial({ color: stallColors[Math.abs(i) % stallColors.length] }));
    stall.position.set(i * 2.5, 0.8, 0);
    grp.add(stall);
  }

  grp.position.set(x, 0, z);
  scene.add(grp);
})();

// ─────────────────────────────────────────────────────────────
// 19g. FOOD VENDOR CARTS  (scattered near teahouses & markets)
// ─────────────────────────────────────────────────────────────
function makeFoodCart(x, z) {
  const grp     = new THREE.Group();
  const cartM   = new THREE.MeshLambertMaterial({ color: 0xBB7722 });
  const wheelM  = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const poleM   = new THREE.MeshLambertMaterial({ color: 0x885522 });
  const umbrellaColors = [0xFF4433, 0xFF8800, 0x3388CC, 0x44AA44];
  const umbM = new THREE.MeshLambertMaterial({ color: umbrellaColors[Math.floor(Math.random() * 4)] });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 0.9), cartM);
  body.position.y = 0.72;
  grp.add(body);

  // Wheels
  [[-0.55, 0], [0.55, 0]].forEach(([wx]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 10), wheelM);
    w.rotation.z = Math.PI / 2;
    w.position.set(wx, 0.24, 0);
    grp.add(w);
  });

  // Umbrella pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 6), poleM);
  pole.position.y = 1.45;
  grp.add(pole);

  // Umbrella canopy (flat disc + fringe)
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.55, 12), umbM);
  canopy.position.y = 2.8;
  grp.add(canopy);
  const fringe = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.18, 12), umbM);
  fringe.position.y = 2.56;
  grp.add(fringe);

  // Food items on cart
  [0xFF8833, 0xFF4444, 0xFFDD44, 0x44AA33].forEach((col, i) => {
    const food = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4),
      new THREE.MeshLambertMaterial({ color: col }));
    food.position.set(-0.35 + i * 0.24, 1.1, 0);
    grp.add(food);
  });

  grp.position.set(x, 0, z);
  scene.add(grp);
}

[
  [20, 9], [25, -9], [40, 9], [64, -9], [75, 9],
  [95, -9], [120, 9], [145, -9], [170, 9],
].forEach(([x, z]) => makeFoodCart(x, z));

// ─────────────────────────────────────────────────────────────
// 19h. PAGODA PERIMETER WALLS  (white low walls around Shwedagon)
// ─────────────────────────────────────────────────────────────
(function makePageWalls() {
  const wallM = new THREE.MeshLambertMaterial({ color: 0xF0EAD6 });
  const capM  = new THREE.MeshLambertMaterial({ color: 0xDDCCBB });
  // Wall segments around Shwedagon terrace area
  const segments = [
    // [x, z, length, isXAligned]
    [33, 15, 32, true], [33, 40, 32, true],  // north & south walls
    [33, 15, 25, false], [65, 15, 25, false], // east & west walls
  ];
  segments.forEach(([sx, sz, len, alongX]) => {
    for (let i = 0; i < len; i += 2.8) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.4, 0.28), wallM);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.2, 0.38), capM);
      if (alongX) {
        seg.position.set(sx + i, 0.7, sz);
        cap.position.set(sx + i, 1.5, sz);
      } else {
        seg.position.set(sx, 0.7, sz + i);
        cap.position.set(sx, 1.5, sz + i);
        seg.rotation.y = Math.PI / 2;
        cap.rotation.y = Math.PI / 2;
      }
      scene.add(seg);
      scene.add(cap);
    }
  });

  // Entrance gate pillars (4 cardinal directions)
  [[48, 15], [48, 40], [33, 27], [65, 27]].forEach(([gx, gz]) => {
    [-0.9, 0.9].forEach(offset => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.5, 0.6),
        new THREE.MeshLambertMaterial({ color: 0xFFCC44 }));
      const isX = (gx === 48);
      pillar.position.set(gx + (isX ? 0 : offset), 1.75, gz + (isX ? offset : 0));
      scene.add(pillar);
      // Pillar cap
      const pc = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 8),
        new THREE.MeshLambertMaterial({ color: 0xFFCC44 }));
      pc.position.set(gx + (isX ? 0 : offset), 3.9, gz + (isX ? offset : 0));
      scene.add(pc);
    });
  });
})();

// ─────────────────────────────────────────────────────────────
// 19i. PRAYER / PENNANT FLAGS  (near temples and monasteries)
// ─────────────────────────────────────────────────────────────
const FLAG_COLORS = [0xFF4444, 0xFFCC22, 0x4488DD, 0x44AA44, 0xFFFFFF, 0xAA44CC];
function makePrayerFlags(x, z, spread) {
  const poleM = new THREE.MeshLambertMaterial({ color: 0x885522 });
  // Two anchor poles
  const poles = [[-spread/2, 0], [spread/2, 0]];
  poles.forEach(([px]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 4.5, 6), poleM);
    pole.position.set(x + px, 2.25, z);
    scene.add(pole);
  });
  // Flags strung between poles
  for (let i = 0; i <= 8; i++) {
    const t    = i / 8;
    const fx   = x - spread/2 + t * spread;
    const fy   = 4.2 - Math.sin(t * Math.PI) * 0.5; // slight sag
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.4, 0.04),
      new THREE.MeshLambertMaterial({ color: FLAG_COLORS[i % FLAG_COLORS.length] })
    );
    flag.position.set(fx, fy, z);
    scene.add(flag);
  }
}

makePrayerFlags(48, 16, 14);
makePrayerFlags(48, 40, 14);
makePrayerFlags(76, 15, 10);
makePrayerFlags(105, -14, 10);
makePrayerFlags(155, -15, 10);

// ─────────────────────────────────────────────────────────────
// 19j. GRASS TUFTS  (scattered organic ground detail)
// ─────────────────────────────────────────────────────────────
function makeGrassTuft(x, z) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0x3D7A22 });
  for (let i = 0; i < 7; i++) {
    const ox = (Math.random() - 0.5) * 1.4;
    const oz = (Math.random() - 0.5) * 1.4;
    const h  = 0.28 + Math.random() * 0.45;
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, h, 4), mat);
    blade.position.set(ox, h / 2, oz);
    blade.rotation.y = Math.random() * Math.PI;
    blade.rotation.z = (Math.random() - 0.5) * 0.3;
    grp.add(blade);
  }
  grp.position.set(x, 0, z);
  scene.add(grp);
}

// Scatter grass tufts across the world
for (let x = 8; x < 190; x += 6) {
  makeGrassTuft(x, 6.2 + (Math.random() - 0.5));
  makeGrassTuft(x, -6.2 + (Math.random() - 0.5));
  if (x % 12 === 0) {
    makeGrassTuft(x + 2, 14 + Math.random() * 4);
    makeGrassTuft(x - 2, -(14 + Math.random() * 4));
  }
}
// Dense grass near lake
for (let i = 0; i < 20; i++) {
  makeGrassTuft(38 + Math.random() * 30, 20 + Math.random() * 6);
}

// ─────────────────────────────────────────────────────────────
// 19k. POWER / TELEPHONE POLES  (along the road — very Yangon)
// ─────────────────────────────────────────────────────────────
(function makePowerPoles() {
  const poleM = new THREE.MeshLambertMaterial({ color: 0x6B4A2A });
  const wireM = new THREE.MeshLambertMaterial({ color: 0x222222 });
  for (let px = 12; px < ROAD_LENGTH; px += 18) {
    [-6.5, 6.5].forEach(pz => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 6.5, 7), poleM);
      pole.position.set(px, 3.25, pz);
      scene.add(pole);
      // Cross arm
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.1), poleM);
      arm.position.set(px, 6.2, pz);
      scene.add(arm);
      // Insulators (small sphere blobs)
      [-0.8, 0.8].forEach(ix => {
        const ins = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4),
          new THREE.MeshLambertMaterial({ color: 0x886644 }));
        ins.position.set(px + ix, 6.2, pz);
        scene.add(ins);
      });
    });
  }
})();

// ─────────────────────────────────────────────────────────────
// 19l. BIRDS  (flying in arcs above the city)
// ─────────────────────────────────────────────────────────────
const birdMat = new THREE.MeshLambertMaterial({ color: 0x1A1A22 });
[
  [30,  18, 8],  [60, 22, -5], [90, 20, 12],
  [120, 17, -8], [55, 24, 30], [80, 19, -15],
].forEach(([bx, by, bz]) => {
  const grp = new THREE.Group();
  // Two wings
  [-1, 1].forEach(side => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.07, 0.22), birdMat);
    wing.position.set(side * 0.4, 0, 0);
    wing.rotation.z = side * 0.25;
    grp.add(wing);
  });
  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), birdMat);
  grp.add(body);

  grp.position.set(bx, by, bz);
  grp.userData.phase   = Math.random() * Math.PI * 2;
  grp.userData.speed   = 0.5 + Math.random() * 0.4;
  grp.userData.radius  = 18 + Math.random() * 22;
  grp.userData.centerX = bx;
  grp.userData.centerZ = bz;
  grp.userData.baseY   = by;
  birdGroups.push(grp);
  scene.add(grp);
});

// ─────────────────────────────────────────────────────────────
// 20. FLOATING 3D HEARTS
// ─────────────────────────────────────────────────────────────
const heartMeshes = [];
const HEART_SPAWN_X = [10, 24, 38, 52, 68, 82, 98, 112, 130, 148, 164, 180];

function makeHeart3D(x) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0xFF1155 });
  // Two bumps
  [[-0.24, 0.2, 0], [0.24, 0.2, 0]].forEach(p => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), mat);
    b.position.set(...p);
    grp.add(b);
  });
  // Point
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.6, 8), mat);
  tip.rotation.z = Math.PI;
  tip.position.y = -0.08;
  grp.add(tip);

  grp.position.set(x, 1.7 + Math.random() * 0.6, (Math.random() - 0.5) * 3);
  grp.userData.collected = false;
  grp.userData.baseY     = grp.position.y;
  grp.userData.phase     = Math.random() * Math.PI * 2;
  scene.add(grp);
  heartMeshes.push(grp);
}

HEART_SPAWN_X.forEach(x => makeHeart3D(x));

// ─────────────────────────────────────────────────────────────
// 21. FINISH ARCH  (decorated Myanmar-style gateway)
// ─────────────────────────────────────────────────────────────
(function makeFinishGate() {
  const archM = new THREE.MeshLambertMaterial({ color: 0xFFCC22 });
  const redM  = new THREE.MeshLambertMaterial({ color: 0xCC2200 });

  // Pillars
  [-3.8, 3.8].forEach(z => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 0.6), archM);
    pillar.position.set(ROAD_LENGTH + 3, 3, z);
    scene.add(pillar);
    // Tiered cap on each pillar
    [[1.0, 6.3], [0.7, 7.0], [0.4, 7.6]].forEach(([r, y]) => {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.5, r, 0.35, 8), archM);
      cap.position.set(ROAD_LENGTH + 3, y, z);
      scene.add(cap);
    });
  });

  // Top bar
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 8.2), archM);
  bar.position.set(ROAD_LENGTH + 3, 6.0, 0);
  scene.add(bar);

  // Decorative red roof on the bar
  const roofBar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 8.6), redM);
  roofBar.position.set(ROAD_LENGTH + 3, 6.42, 0);
  scene.add(roofBar);

  // Central golden finial
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.4, 8), archM);
  fin.position.set(ROAD_LENGTH + 3, 7.3, 0);
  scene.add(fin);

  // Golden orbs on finials
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xFFEE55, emissive: 0xFFDD00, emissiveIntensity: 0.5 })
  );
  orb.position.set(ROAD_LENGTH + 3, 8.1, 0);
  scene.add(orb);
})();

// ─────────────────────────────────────────────────────────────
// 22. GAME STATE
// ─────────────────────────────────────────────────────────────
let busX             = 2;    // world X position
let busZ             = 0;    // world Z position
let busAngle         = 0;    // heading (radians, 0 = facing +X)
let busVel           = 0;    // forward speed (units/s)
let score            = 0;
let gameStarted      = false;
let celebrationShown = false;
const keys           = {};
const memoryTriggered = new Set();

// Movement tuning
const MAX_SPD  = 14;
const ACCEL    = 22;
const DECEL    = 28;
const TURN_SPD = 2.0;   // rad/s

// ─────────────────────────────────────────────────────────────
// 23. INITIAL CAMERA  (Bruno Simon style: high behind-right)
// ─────────────────────────────────────────────────────────────
camera.position.set(-10, 16, 20);
camera.lookAt(4, 1.5, 0);

// ─────────────────────────────────────────────────────────────
// 24. KEYBOARD CONTROLS
// ─────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key.startsWith('Arrow')) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

// ─────────────────────────────────────────────────────────────
// 25. MOBILE BUTTON CONTROLS  (D-pad — all 4 directions)
// ─────────────────────────────────────────────────────────────
const dpadMap = {
  'btn-up':    'ArrowUp',
  'btn-down':  'ArrowDown',
  'btn-left':  'ArrowLeft',
  'btn-right': 'ArrowRight',
};
Object.entries(dpadMap).forEach(([id, key]) => {
  const btn = document.getElementById(id);
  ['mousedown', 'touchstart'].forEach(ev =>
    btn.addEventListener(ev, e => { e.preventDefault(); keys[key] = true; }, { passive: false })
  );
  ['mouseup', 'touchend', 'mouseleave', 'touchcancel'].forEach(ev =>
    btn.addEventListener(ev, () => { keys[key] = false; })
  );
});

// ─────────────────────────────────────────────────────────────
// 26. UI DOM REFERENCES
// ─────────────────────────────────────────────────────────────
const scoreEl        = document.getElementById('score');
const progressFill   = document.getElementById('progress-fill');
const progressLabel  = document.getElementById('progress-label');
const memoryPopup    = document.getElementById('memory-popup');
const memoryTitle    = document.getElementById('memory-title');
const memoryMessage  = document.getElementById('memory-message');
const memoryEmojiBig = document.getElementById('memory-emoji-big');
const memoryImg      = document.getElementById('memory-img');
const memoryImgBg    = document.getElementById('memory-img-bg');
const startScreen    = document.getElementById('start-screen');
const celebrationEl  = document.getElementById('celebration');
const finalScoreEl   = document.getElementById('final-score');

// ─────────────────────────────────────────────────────────────
// 27. START BUTTON
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// MUSIC SETUP
// ─────────────────────────────────────────────────────────────
const bgMusic  = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let musicMuted = false;

bgMusic.volume = 0.55;

musicBtn.addEventListener('click', () => {
  musicMuted = !musicMuted;
  bgMusic.muted  = musicMuted;
  musicBtn.textContent = musicMuted ? '🔇' : '🎵';
  musicBtn.classList.toggle('muted', musicMuted);
});

function startMusic() {
  bgMusic.play().catch(() => {});   // browsers may block autoplay — silently ignored
  musicBtn.style.display = 'flex';
}

document.getElementById('start-btn').addEventListener('click', () => {
  startScreen.style.opacity       = '0';
  startScreen.style.pointerEvents = 'none';
  setTimeout(() => { startScreen.style.display = 'none'; }, 750);
  gameStarted = true;
  startMusic();
});

// ─────────────────────────────────────────────────────────────
// 28. MEMORY POPUP LOGIC
// ─────────────────────────────────────────────────────────────
let memoryTimer = null;

function showMemoryPopup(memory) {
  if (memoryTimer) clearTimeout(memoryTimer);

  // Gradient fallback always set first (shown while image loads or on error)
  const [g1, g2] = memory.gradient || ['#FF6B9D', '#AA1144'];
  memoryImgBg.style.background = `linear-gradient(135deg, ${g1}, ${g2})`;
  memoryImgBg.textContent      = memory.emoji;
  memoryImgBg.style.display    = 'flex';

  if (memory.image) {
    memoryImg.src = '';                        // reset so onload fires reliably
    memoryImg.style.display = 'none';
    memoryImg.onload = () => {
      memoryImg.style.display  = 'block';
      memoryImgBg.style.display = 'none';      // hide gradient once photo loads
    };
    memoryImg.onerror = () => {
      memoryImg.style.display  = 'none';
      memoryImgBg.style.display = 'flex';      // stay on gradient if file missing
    };
    memoryImg.src = memory.image;
  } else {
    memoryImg.style.display = 'none';
  }

  memoryEmojiBig.textContent = memory.emoji;
  memoryTitle.textContent    = memory.title;
  memoryMessage.textContent  = memory.message;
  memoryPopup.classList.add('visible');
  memoryTimer = setTimeout(() => memoryPopup.classList.remove('visible'), 3500);
}

// ─────────────────────────────────────────────────────────────
// 29. HEART COLLECTION
// ─────────────────────────────────────────────────────────────
function checkHeartPickups() {
  heartMeshes.forEach(heart => {
    if (heart.userData.collected) return;
    const dx   = heart.position.x - busX;
    const dz   = heart.position.z - busZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 1.9) {
      heart.userData.collected = true;
      scene.remove(heart);
      score++;
      scoreEl.textContent = score;
      const hud = document.getElementById('score-display');
      hud.classList.remove('pulse');
      void hud.offsetWidth;
      hud.classList.add('pulse');
      spawnFloatingHTMLHeart();
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 30. FLOATING HTML HEART FEEDBACK
// ─────────────────────────────────────────────────────────────
function spawnFloatingHTMLHeart() {
  const el = document.createElement('div');
  el.className   = 'float-heart';
  el.textContent = '❤️';
  el.style.left   = (25 + Math.random() * 50) + 'vw';
  el.style.bottom = '25vh';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─────────────────────────────────────────────────────────────
// 31. PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function updateProgress() {
  const pct = Math.min(100, (busX / ROAD_LENGTH) * 100);
  progressFill.style.width = pct + '%';
  progressLabel.textContent = 'Our Journey: ' + Math.round(pct) + '%';
}

// ─────────────────────────────────────────────────────────────
// 32. CELEBRATION
// ─────────────────────────────────────────────────────────────
function triggerCelebration() {
  if (celebrationShown) return;
  celebrationShown = true;
  setTimeout(() => {
    finalScoreEl.textContent = score;
    celebrationEl.classList.add('visible');
    launchConfetti();
    startCelebrationHearts();
  }, 700);
}

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors    = ['#FF6B8A','#FF9966','#FFD700','#FF69B4','#CC66FF','#FF4488','#FFE066'];
  for (let i = 0; i < 100; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const size  = 5 + Math.random() * 9;
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[i % colors.length]};
      width: ${size}px; height: ${size}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      animation-duration: ${2 + Math.random() * 3.5}s;
      animation-delay: ${Math.random() * 2.5}s;
      --drift: ${(Math.random() - 0.5) * 2};
    `;
    container.appendChild(p);
  }
}

function startCelebrationHearts() {
  const id = setInterval(() => {
    if (!celebrationEl.classList.contains('visible')) { clearInterval(id); return; }
    for (let i = 0; i < 4; i++) spawnFloatingHTMLHeart();
  }, 700);
}

// ─────────────────────────────────────────────────────────────
// 33. ANIMATION LOOP
// ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const time  = clock.getElapsedTime();

  if (gameStarted && !celebrationShown) {
    // ── Acceleration / braking ──────────────────────────────
    if (keys['ArrowUp'])
      busVel = Math.min(MAX_SPD, busVel + ACCEL * delta);
    else if (keys['ArrowDown'])
      busVel = Math.max(-MAX_SPD * 0.55, busVel - DECEL * delta);
    else
      busVel *= Math.exp(-6 * delta);   // natural friction decay

    if (Math.abs(busVel) < 0.04) busVel = 0;

    // ── Steering (scales with speed so it feels car-like) ──
    if (Math.abs(busVel) > 0.1) {
      const dir = Math.sign(busVel);
      if (keys['ArrowLeft'])  busAngle += TURN_SPD * delta * dir;
      if (keys['ArrowRight']) busAngle -= TURN_SPD * delta * dir;
    }

    // ── Move bus ──────────────────────────────────────────
    const fwdX = Math.cos(busAngle);
    const fwdZ = -Math.sin(busAngle);
    busX += fwdX * busVel * delta;
    busZ += fwdZ * busVel * delta;

    // World bounds
    busX = Math.max(-5, Math.min(ROAD_LENGTH + 5, busX));
    busZ = Math.max(-38, Math.min(38, busZ));

    // Update bus mesh
    busGroup.position.x = busX;
    busGroup.position.z = busZ;
    busGroup.rotation.y = busAngle;

    // Spin wheels proportional to speed
    if (Math.abs(busVel) > 0.05) {
      const spin = Math.sign(busVel) * 0.12;
      busWheels.forEach(w => { w.rotation.z -= spin; });
    }

    // Subtle body rock while moving
    if (Math.abs(busVel) > 0.3)
      busBody.rotation.z = Math.sin(time * 12) * 0.012;
    else
      busBody.rotation.z *= 0.88;

    // Fire memory popups when bus passes X position
    MEMORIES.forEach((mem, idx) => {
      if (!memoryTriggered.has(idx) && busX >= mem.position) {
        memoryTriggered.add(idx);
        showMemoryPopup(mem);
      }
    });

    checkHeartPickups();
    updateProgress();
    if (busX >= ROAD_LENGTH) triggerCelebration();
  }

  // Animate hearts
  heartMeshes.forEach(h => {
    if (!h.userData.collected) {
      h.position.y  = h.userData.baseY + Math.sin(time * 2.2 + h.userData.phase) * 0.24;
      h.rotation.y += delta * 2.0;
    }
  });

  // Animate birds — circle lazily in the sky
  birdGroups.forEach(b => {
    b.userData.phase += delta * b.userData.speed;
    const a = b.userData.phase;
    b.position.x = b.userData.centerX + Math.cos(a) * b.userData.radius;
    b.position.z = b.userData.centerZ + Math.sin(a) * b.userData.radius * 0.45;
    b.position.y = b.userData.baseY + Math.sin(a * 2.5) * 1.2;
    b.rotation.y = -a - Math.PI / 2;
    // Wing flap
    b.children.forEach((part, pi) => {
      if (pi < 2) part.rotation.z = (pi === 0 ? -1 : 1) * (0.15 + Math.abs(Math.sin(time * 6 + b.userData.phase * 3)) * 0.35);
    });
  });

  // Animate lake water — subtle hue ripple
  if (lakeMesh) {
    const hue = 0.56 + Math.sin(time * 0.4) * 0.018;
    lakeMesh.material.color.setHSL(hue, 0.72, 0.32 + Math.sin(time * 0.7) * 0.03);
  }

  // Drift clouds
  cloudGroups.forEach(c => {
    c.position.x -= delta * 2.0;
    if (c.position.x < -30) c.position.x = ROAD_LENGTH + 30;
  });

  // Sun pulse
  sunMesh.scale.setScalar(1 + Math.sin(time * 0.4) * 0.04);

  // ── Bruno Simon-style camera: always behind-above the bus ──
  if (gameStarted) {
    const fwdX = Math.cos(busAngle);
    const fwdZ = -Math.sin(busAngle);
    // Right-perpendicular vector for diagonal offset
    const rgtX =  Math.sin(busAngle);
    const rgtZ =  Math.cos(busAngle);

    const CAM_BACK   = 14;
    const CAM_HEIGHT = 15;
    const CAM_RIGHT  = 7;   // slight right offset for Bruno Simon diagonal

    const tgtCamX = busX - fwdX * CAM_BACK + rgtX * CAM_RIGHT;
    const tgtCamY = CAM_HEIGHT;
    const tgtCamZ = busZ - fwdZ * CAM_BACK + rgtZ * CAM_RIGHT;

    const ct = 1 - Math.exp(-4.5 * delta);
    camera.position.x += (tgtCamX - camera.position.x) * ct;
    camera.position.y += (tgtCamY - camera.position.y) * ct;
    camera.position.z += (tgtCamZ - camera.position.z) * ct;

    // Look slightly ahead of the bus
    camera.lookAt(busX + fwdX * 5, 1.5, busZ + fwdZ * 5);
  }

  renderer.render(scene, camera);
}

// ─────────────────────────────────────────────────────────────
// 34. RESIZE
// ─────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────
animate();
