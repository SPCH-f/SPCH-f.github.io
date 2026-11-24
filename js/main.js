import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.20/+esm';
import projects from './projects-data.js';
import experience from './experience-data.js';

const { gsap, ScrollTrigger } = window;

if (!gsap || !ScrollTrigger) {
  throw new Error('GSAP and ScrollTrigger must load before js/main.js.');
}

gsap.registerPlugin(ScrollTrigger);

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const hero = document.getElementById('home');
const roleEl = document.getElementById('roleText');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderExperience() {
  const container = document.getElementById('experienceTimeline');
  if (!container) return;

  container.innerHTML = experience.map((item) => `
    <div class="timeline-item reveal">
      <span class="timeline-period">${item.period}</span>
      <h3 class="timeline-position">${item.position}</h3>
      <p class="timeline-company">${item.company}</p>
      <p class="timeline-desc">${item.description}</p>
      <span class="timeline-stack">${item.stack.join(' / ')}</span>
    </div>
  `).join('');
}

function renderProjects() {
  const container = document.getElementById('projectsList');
  if (!container) return;

  container.innerHTML = projects.map((project, index) => {
    const links = [
      project.demoUrl && `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>`,
      project.githubUrl && `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> GitHub</a>`,
    ].filter(Boolean).join('');

    return `
      <article class="project-item">
        <div class="project-header">
          <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
          <h3 class="project-title">${project.title}</h3>
        </div>
        <p class="project-desc">${project.description}</p>
        <div class="project-meta">
          <span class="project-stack">${project.stack.join(' / ')}</span>
          ${links ? `<div class="project-links">${links}</div>` : ''}
        </div>
      </article>
    `;
  }).join('');
}

function createHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
  } catch (error) {
    console.error('Unable to initialize the Three.js hero canvas.', error);
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const globe = new THREE.Group();
  scene.add(globe);
  scene.add(new THREE.HemisphereLight(0x9cefff, 0x04111d, 0.9));

  const keyLight = new THREE.DirectionalLight(0x54dcff, 1.2);
  keyLight.position.set(-4, 3, 6);
  scene.add(keyLight);

  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = 2048;
  mapCanvas.height = 1024;
  const mapContext = mapCanvas.getContext('2d');
  const ocean = mapContext.createLinearGradient(0, 0, mapCanvas.width, mapCanvas.height);
  ocean.addColorStop(0, '#062034');
  ocean.addColorStop(0.5, '#071522');
  ocean.addColorStop(1, '#0a2940');
  mapContext.fillStyle = ocean;
  mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

  mapContext.strokeStyle = 'rgba(86, 211, 240, 0.18)';
  mapContext.lineWidth = 2;
  for (let longitude = 0; longitude <= 360; longitude += 30) {
    const x = (longitude / 360) * mapCanvas.width;
    mapContext.beginPath();
    mapContext.moveTo(x, 0);
    mapContext.lineTo(x, mapCanvas.height);
    mapContext.stroke();
  }
  for (let latitude = 0; latitude <= 180; latitude += 30) {
    const y = (latitude / 180) * mapCanvas.height;
    mapContext.beginPath();
    mapContext.moveTo(0, y);
    mapContext.lineTo(mapCanvas.width, y);
    mapContext.stroke();
  }

  const continents = [
    [[-168, 70], [-145, 72], [-125, 62], [-112, 52], [-98, 50], [-82, 25], [-98, 14], [-111, 28], [-128, 33], [-139, 53], [-158, 58]],
    [[-82, 12], [-68, 9], [-51, -2], [-46, -18], [-56, -36], [-70, -54], [-77, -34], [-81, -8]],
    [[-12, 36], [0, 52], [23, 60], [42, 52], [58, 60], [82, 52], [104, 57], [128, 48], [145, 39], [134, 22], [113, 8], [101, 2], [79, 8], [63, 24], [48, 30], [35, 36], [22, 38], [12, 34]],
    [[-17, 35], [8, 37], [31, 29], [43, 12], [36, -4], [28, -23], [15, -35], [3, -29], [-9, -5], [-16, 15]],
    [[112, -11], [130, -12], [153, -25], [145, -39], [124, -35], [114, -25]],
    [[-53, 60], [-43, 78], [-28, 83], [-20, 72], [-36, 60]],
  ];

  mapContext.shadowColor = '#54eaff';
  mapContext.shadowBlur = 4;
  mapContext.fillStyle = '#155a70';
  mapContext.strokeStyle = 'rgba(102, 230, 245, 0.85)';
  mapContext.lineWidth = 3;
  continents.forEach((coordinates) => {
    mapContext.beginPath();
    const points = coordinates.map(([longitude, latitude]) => {
      const x = ((longitude + 180) / 360) * mapCanvas.width;
      return { x, y: ((90 - latitude) / 180) * mapCanvas.height };
    });
    const firstMidpoint = {
      x: (points[points.length - 1].x + points[0].x) / 2,
      y: (points[points.length - 1].y + points[0].y) / 2,
    };
    mapContext.moveTo(firstMidpoint.x, firstMidpoint.y);
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      mapContext.quadraticCurveTo(
        point.x,
        point.y,
        (point.x + next.x) / 2,
        (point.y + next.y) / 2,
      );
    });
    mapContext.closePath();
    mapContext.fill();
    mapContext.stroke();
  });
  mapContext.shadowBlur = 0;

  const mapTexture = new THREE.CanvasTexture(mapCanvas);
  mapTexture.colorSpace = THREE.SRGBColorSpace;
  const radius = 2.45;
  const globeSurface = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 128, 96),
    new THREE.MeshPhongMaterial({
      map: mapTexture,
      color: 0x8caeb8,
      emissive: 0x06121b,
      emissiveIntensity: 0.08,
      specular: 0x267d91,
      shininess: 16,
    }),
  );
  globe.add(globeSurface);

  const globePoint = (longitude, latitude, pointRadius = radius * 1.012) => {
    const lon = THREE.MathUtils.degToRad(longitude);
    const lat = THREE.MathUtils.degToRad(latitude);
    return new THREE.Vector3(
      pointRadius * Math.sin(lon) * Math.cos(lat),
      pointRadius * Math.sin(lat),
      pointRadius * Math.cos(lon) * Math.cos(lat),
    );
  };

  const containsCoordinate = (longitude, latitude, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[j];
      const crossesLatitude = (y1 > latitude) !== (y2 > latitude);
      const crossingLongitude = ((x2 - x1) * (latitude - y1)) / (y2 - y1) + x1;
      if (crossesLatitude && longitude < crossingLongitude) inside = !inside;
    }
    return inside;
  };

  const landPositions = [];
  for (let latitude = -58; latitude <= 82; latitude += 2) {
    for (let longitude = -179; longitude < 180; longitude += 2) {
      const land = continents.some((polygon) => containsCoordinate(longitude, latitude, polygon));
      const variation = Math.sin(longitude * 127.1 + latitude * 311.7) * 43758.5453;
      if (land && variation - Math.floor(variation) > 0.34) {
        landPositions.push(...globePoint(longitude, latitude, radius * 1.008).toArray());
      }
    }
  }
  const landGeometry = new THREE.BufferGeometry();
  landGeometry.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
  globe.add(new THREE.Points(
    landGeometry,
    new THREE.PointsMaterial({
      color: 0x9af5ff,
      size: 0.023,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  ));

  const gridPositions = [];
  for (let longitude = 0; longitude < 360; longitude += 15) {
    for (let step = 0; step < 96; step += 1) {
      const latitudeA = -90 + (step / 96) * 180;
      const latitudeB = -90 + ((step + 1) / 96) * 180;
      gridPositions.push(...globePoint(longitude, latitudeA).toArray());
      gridPositions.push(...globePoint(longitude, latitudeB).toArray());
    }
  }
  for (let latitude = -80; latitude <= 80; latitude += 20) {
    for (let step = 0; step < 120; step += 1) {
      const longitudeA = (step / 120) * 360;
      const longitudeB = ((step + 1) / 120) * 360;
      gridPositions.push(...globePoint(longitudeA, latitude).toArray());
      gridPositions.push(...globePoint(longitudeB, latitude).toArray());
    }
  }
  const gridGeometry = new THREE.BufferGeometry();
  gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
  globe.add(new THREE.LineSegments(
    gridGeometry,
    new THREE.LineBasicMaterial({
      color: 0x70eaff,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }),
  ));

  const locations = [
    [-74, 40], [-0.1, 51.5], [13.4, 52.5], [31.2, 30], [77.2, 28.6],
    [103.8, 1.3], [121.5, 31.2], [151.2, -33.9], [-46.6, -23.5],
  ];
  const nodePositions = locations.flatMap(([longitude, latitude]) => (
    globePoint(longitude, latitude, radius * 1.025).toArray()
  ));
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
  globe.add(new THREE.Points(
    nodeGeometry,
    new THREE.PointsMaterial({
      color: 0xd4fbff,
      size: 0.12,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  ));

  const connectionPairs = [[0, 1], [1, 2], [1, 3], [2, 4], [4, 5], [5, 6], [5, 7], [0, 8]];
  const routes = [];
  connectionPairs.forEach(([start, end]) => {
    const startPoint = globePoint(...locations[start], radius * 1.03);
    const endPoint = globePoint(...locations[end], radius * 1.03);
    const middlePoint = startPoint.clone().add(endPoint).normalize().multiplyScalar(radius * 1.13);
    const arc = new THREE.QuadraticBezierCurve3(startPoint, middlePoint, endPoint);
    routes.push(arc);
    globe.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(arc.getPoints(32)),
      new THREE.LineBasicMaterial({
        color: 0x56e5ff,
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
      }),
    ));
  });

  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 32;
  glowCanvas.height = 32;
  const glowContext = glowCanvas.getContext('2d');
  const glow = glowContext.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, 'rgba(226, 255, 255, 1)');
  glow.addColorStop(0.18, 'rgba(95, 235, 255, 0.9)');
  glow.addColorStop(1, 'rgba(36, 200, 255, 0)');
  glowContext.fillStyle = glow;
  glowContext.fillRect(0, 0, 32, 32);
  const glowTexture = new THREE.CanvasTexture(glowCanvas);

  const pulsePositions = new Float32Array(routes.length * 3);
  const pulseGeometry = new THREE.BufferGeometry();
  pulseGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(pulsePositions, 3).setUsage(THREE.DynamicDrawUsage),
  );
  globe.add(new THREE.Points(
    pulseGeometry,
    new THREE.PointsMaterial({
      map: glowTexture,
      color: 0xaaf7ff,
      size: 0.24,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  ));

  const particleCount = Math.min(300, Math.max(140, Math.floor(
    (window.innerWidth * window.innerHeight) / 6000,
  )));
  const starPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    starPositions[i * 3] = (Math.random() - 0.5) * 12;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    starPositions[i * 3 + 2] = -1 - Math.random() * 7;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      map: glowTexture,
      color: 0x72bdff,
      size: 0.075,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  ));

  const twinklingStars = [];
  for (let i = 0; i < 20; i += 1) {
    const material = new THREE.SpriteMaterial({
      map: glowTexture,
      color: i % 4 === 0 ? 0xb7f7ff : 0x65baff,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const star = new THREE.Sprite(material);
    const scale = 0.08 + Math.random() * 0.1;
    star.scale.setScalar(scale);
    star.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      -1 - Math.random() * 6,
    );
    scene.add(star);
    twinklingStars.push({
      star,
      scale,
      phase: Math.random() * Math.PI * 2,
      intensity: 0.32 + Math.random() * 0.3,
    });
  }

  const orbit = new THREE.Group();
  orbit.rotation.set(0.9, 0.2, -0.35);
  globe.add(orbit);
  orbit.add(new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.19, 0.009, 4, 180),
    new THREE.MeshBasicMaterial({
      color: 0x49dff7,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
  ));
  orbit.add(new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.28, 0.005, 3, 180),
    new THREE.MeshBasicMaterial({
      color: 0x2588b5,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  ));

  const satellites = new THREE.Group();
  orbit.add(satellites);
  [-0.9, 1.5, 3.7].forEach((angle, index) => {
    const distance = radius * (index === 1 ? 1.28 : 1.19);
    const satellite = new THREE.Mesh(
      new THREE.SphereGeometry(index === 1 ? 0.045 : 0.032, 10, 8),
      new THREE.MeshBasicMaterial({
        color: index === 1 ? 0xe7fcff : 0x5be7ff,
      }),
    );
    satellite.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
    satellites.add(satellite);
  });

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.035, 48, 32),
    new THREE.MeshBasicMaterial({
      color: 0x29cfff,
      transparent: true,
      opacity: 0.075,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  globe.add(atmosphere);
  globe.rotation.y = -0.8;

  let pulseTime = 0;
  const update = (frameScale) => {
    orbit.rotation.z += 0.00018 * frameScale;
    pulseTime += 0.003 * frameScale;
    routes.forEach((route, index) => {
      const progress = (pulseTime * 0.12 + index / routes.length) % 1;
      const position = route.getPoint(progress);
      pulsePositions[index * 3] = position.x;
      pulsePositions[index * 3 + 1] = position.y;
      pulsePositions[index * 3 + 2] = position.z;
    });
    pulseGeometry.attributes.position.needsUpdate = true;
    twinklingStars.forEach(({ star, scale, phase, intensity }) => {
      const shimmer = (Math.sin(pulseTime * 2.4 + phase) + 1) * 0.5;
      star.material.opacity = intensity * (0.62 + shimmer * 0.38);
      star.scale.setScalar(scale * (0.9 + shimmer * 0.15));
    });
  };
  update(0);

  function resize() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    globe.position.x = width < 600 ? 0 : width < 900 ? 1.4 : 3.1;
    globe.scale.setScalar(width < 600 ? 0.64 : width < 900 ? 0.78 : 0.9);
    renderer.setSize(width, height, false);
    if (reduceMotion) renderer.render(scene, camera);
  }

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  window.addEventListener('resize', resize, { passive: true });

  return { scene, camera, network: globe, renderer, update };
}

renderExperience();
renderProjects();

const lenis = new Lenis({
  autoRaf: false,
  smoothWheel: !reduceMotion,
  anchors: !reduceMotion,
});

lenis.on('scroll', ScrollTrigger.update);
lenis.on('scroll', ({ scroll }) => {
  navbar?.classList.toggle('scrolled', scroll > 50);
});

function closeMenu() {
  hamburger?.classList.remove('active');
  navLinks?.classList.remove('open');
  navOverlay?.classList.remove('active');
  document.body.classList.remove('menu-open');
  lenis.start();
}

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  hamburger.classList.toggle('active', isOpen);
  navOverlay?.classList.toggle('active', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  if (isOpen) lenis.stop();
  else lenis.start();
});

navOverlay?.addEventListener('click', closeMenu);
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

const roles = [
  'Building useful things with data',
  'Python · FastAPI · AI RAG',
  'Automation · Full Stack',
];
let roleIndex = 0;

function rotateRole() {
  if (!roleEl) return;
  gsap.to(roleEl, {
    autoAlpha: 0,
    duration: 0.25,
    delay: 2.4,
    onComplete: () => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.textContent = roles[roleIndex];
      gsap.to(roleEl, {
        autoAlpha: 1,
        duration: 0.3,
        onComplete: rotateRole,
      });
    },
  });
}

rotateRole();

const heroScene = createHeroScene();
let heroIsVisible = true;

if (heroScene) {
  heroScene.renderer.render(heroScene.scene, heroScene.camera);
}

if (heroScene && hero) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroIsVisible = entry.isIntersecting;
  });
  heroObserver.observe(hero);
}

gsap.ticker.add((time, deltaTime = 1000 / 60) => {
  lenis.raf(time * 1000);
  if (heroScene && heroIsVisible && !reduceMotion) {
    const frameScale = Math.min(deltaTime / (1000 / 60), 2);
    heroScene.network.rotation.y += 0.0007 * frameScale;
    heroScene.network.rotation.x += 0.00025 * frameScale;
    heroScene.update(frameScale);
    heroScene.renderer.render(heroScene.scene, heroScene.camera);
  }
});
gsap.ticker.lagSmoothing(0);

if (!reduceMotion) {
  const revealItems = gsap.utils.toArray('.reveal').filter((element) => (
    !element.classList.contains('skill-category')
    && !element.classList.contains('about-highlights')
  ));

  revealItems.forEach((element) => {
    gsap.fromTo(element, {
      autoAlpha: 0,
      y: 28,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true,
      },
    });
  });

  gsap.utils.toArray('.about-highlights, .skills-grid').forEach((group) => {
    gsap.fromTo(group.children, {
      autoAlpha: 0,
      y: 24,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
    });
  });

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=100%',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    },
  });

  if (heroScene) {
    heroTimeline.to(heroScene.camera.position, {
      x: 1.2,
      y: -0.55,
      z: 6.4,
      ease: 'none',
    }, 0);
    heroTimeline.to(heroScene.network.rotation, {
      y: Math.PI * 0.65,
      x: 0.3,
      ease: 'none',
    }, 0);
  }
  heroTimeline.to('.hero-content', {
    y: -70,
    autoAlpha: 0.25,
    ease: 'none',
  }, 0);

  const media = gsap.matchMedia();
  media.add('(min-width: 769px)', () => {
    const section = document.getElementById('projects');
    const viewport = section?.querySelector('.projects-viewport');
    const track = document.getElementById('projectsList');
    if (!section || !viewport || !track) return undefined;

    const horizontalDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (horizontalDistance() === 0) return undefined;

    gsap.to(track, {
      x: () => -horizontalDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${horizontalDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  });
}

window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
