import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ShapeSceneAPI {
  setShape: (shape: string, color: string) => void;
  dispose: () => void;
}

const PARTICLES = 5000;

// ===== Generate particle positions on shape surface =====
function generatePositions(shape: string, count: number): Float32Array {
  const pos = new Float32Array(count * 3);

  // All shapes normalized to fit inside radius ~0.9
  const S = 0.9;

  switch (shape) {
    case 'cube': {
      const s = S * 0.58;
      for (let i = 0; i < count; i++) {
        const face = i % 6;
        const u = (Math.random() * 2 - 1) * s;
        const v = (Math.random() * 2 - 1) * s;
        if (face === 0) { pos[i*3] = s; pos[i*3+1] = u; pos[i*3+2] = v; }
        else if (face === 1) { pos[i*3] = -s; pos[i*3+1] = u; pos[i*3+2] = v; }
        else if (face === 2) { pos[i*3] = u; pos[i*3+1] = s; pos[i*3+2] = v; }
        else if (face === 3) { pos[i*3] = u; pos[i*3+1] = -s; pos[i*3+2] = v; }
        else if (face === 4) { pos[i*3] = u; pos[i*3+1] = v; pos[i*3+2] = s; }
        else { pos[i*3] = u; pos[i*3+1] = v; pos[i*3+2] = -s; }
      }
      break;
    }
    case 'octahedron': {
      const s = S;
      const verts = [[s,0,0],[-s,0,0],[0,s,0],[0,-s,0],[0,0,s],[0,0,-s]];
      const faces: number[][] = [];
      for (const ya of [2,3]) for (const xa of [0,1]) for (const za of [4,5]) faces.push([ya,xa,za]);
      for (let i = 0; i < count; i++) {
        const f = faces[i % 8];
        let r1 = Math.random(), r2 = Math.random();
        if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
        const r3 = 1 - r1 - r2;
        pos[i*3]   = verts[f[0]][0]*r1 + verts[f[1]][0]*r2 + verts[f[2]][0]*r3;
        pos[i*3+1] = verts[f[0]][1]*r1 + verts[f[1]][1]*r2 + verts[f[2]][1]*r3;
        pos[i*3+2] = verts[f[0]][2]*r1 + verts[f[1]][2]*r2 + verts[f[2]][2]*r3;
      }
      break;
    }
    case 'torus': {
      const R = S * 0.7, r = S * 0.28;
      for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        pos[i*3]   = (R + r * Math.cos(v)) * Math.cos(u);
        pos[i*3+1] = r * Math.sin(v);
        pos[i*3+2] = (R + r * Math.cos(v)) * Math.sin(u);
      }
      break;
    }
    case 'diamond': {
      const s = S;
      const apex = [0, s, 0], base = [0, -s * 0.5, 0];
      const sides = 8;
      for (let i = 0; i < count; i++) {
        const angle = (i % sides) / sides * Math.PI * 2;
        const nextAngle = ((i % sides) + 1) / sides * Math.PI * 2;
        const mid = [Math.cos(angle) * s * 0.6, 0, Math.sin(angle) * s * 0.6];
        const nextMid = [Math.cos(nextAngle) * s * 0.6, 0, Math.sin(nextAngle) * s * 0.6];
        const top = i % 2 === 0;
        const tip = top ? apex : base;
        let r1 = Math.random(), r2 = Math.random();
        if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
        const r3 = 1 - r1 - r2;
        pos[i*3]   = tip[0]*r1 + mid[0]*r2 + nextMid[0]*r3;
        pos[i*3+1] = tip[1]*r1 + mid[1]*r2 + nextMid[1]*r3;
        pos[i*3+2] = tip[2]*r1 + mid[2]*r2 + nextMid[2]*r3;
      }
      break;
    }
    case 'ring': {
      const R = S * 0.7, r = S * 0.14;
      for (let i = 0; i < count; i++) {
        const p = i / count;
        const t = p * Math.PI * 4;
        const u = Math.random() * Math.PI * 2;
        const cx = Math.cos(t) * R;
        const cz = Math.sin(t) * R;
        const cy = Math.sin(t * 1.5) * 0.3;
        const nx = Math.cos(t), nz = Math.sin(t);
        pos[i*3]   = cx + Math.cos(u) * r * nx;
        pos[i*3+1] = cy + Math.sin(u) * r;
        pos[i*3+2] = cz + Math.cos(u) * r * nz;
      }
      break;
    }
    case 'sphere':
    default: {
      const phi = Math.PI * (Math.sqrt(5) - 1);
      const r = S;
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const rd = Math.sqrt(1 - y * y);
        const th = phi * i;
        pos[i*3]   = Math.cos(th) * rd * r;
        pos[i*3+1] = y * r;
        pos[i*3+2] = Math.sin(th) * rd * r;
      }
      break;
    }
  }
  return pos;
}

// ===== Glow texture for particles =====
function makeGlowTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

export function createShapeScene(canvas: HTMLCanvasElement): ShapeSceneAPI {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 4.5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // OrbitControls — unlimited rotation
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.8;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  let resumeTimer: ReturnType<typeof setTimeout> | null = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    if (resumeTimer) clearTimeout(resumeTimer);
  });
  controls.addEventListener('end', () => {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 2500);
  });

  // Particle system
  const glowTex = makeGlowTex();
  const positions = generatePositions('sphere', PARTICLES);
  const seeds = new Float32Array(PARTICLES);
  for (let i = 0; i < PARTICLES; i++) seeds[i] = Math.random();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#ffa9f9') },
      uColor2: { value: new THREE.Color('#fff7ad') },
      uPixelRatio: { value: Math.min(devicePixelRatio, 2) },
      uGlowTex: { value: glowTex },
    },
    vertexShader: `
      attribute float aSeed;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uPixelRatio;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = 10.0 + sin(uTime * 1.5 + aSeed * 6.28) * 2.5;
        gl_PointSize = size * uPixelRatio * (1.0 / -mv.z) * 2.2;
        float mix1 = sin(position.x * 2.0 + position.y * 1.5 + position.z * 1.8 + uTime * 0.5 + aSeed * 3.14) * 0.5 + 0.5;
        vColor = mix(uColor1, uColor2, mix1);
        vAlpha = 0.5 + 0.5 * sin(uTime * 0.8 + aSeed * 6.28);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      uniform sampler2D uGlowTex;
      void main() {
        vec4 tex = texture2D(uGlowTex, gl_PointCoord);
        gl_FragColor = vec4(vColor, tex.a * vAlpha * 0.95);
        if (gl_FragColor.a < 0.01) discard;
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Resize
  function resize() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Transition
  let transitioning = false;
  let tProg = 0;
  let pendingShape = '';
  let pendingColor = '';
  let targetPositions: Float32Array | null = null;

  const clock = new THREE.Clock();
  let vis = true;
  const obs = new IntersectionObserver(e => { vis = e[0].isIntersecting; }, { threshold: 0 });
  obs.observe(canvas);

  let raf: number;
  (function loop() {
    raf = requestAnimationFrame(loop);
    if (!vis) return;
    const t = clock.getElapsedTime();

    controls.update();

    // Float
    points.position.y = Math.sin(t * 0.5) * 0.03;

    // Breathing
    const breath = 1 + Math.sin(t * 0.7) * 0.01;

    // Morph transition
    if (transitioning) {
      tProg += 0.02;

      if (tProg >= 0.5 && pendingShape) {
        // Generate new target
        targetPositions = generatePositions(pendingShape, PARTICLES);

        // Always corporate colors: pink ↔ yellow
        mat.uniforms.uColor1.value.set('#ffa9f9');
        mat.uniforms.uColor2.value.set('#fff7ad');

        pendingShape = '';
        pendingColor = '';
      }

      // Morph positions
      if (targetPositions) {
        const posArr = geo.attributes.position.array as Float32Array;
        const morphT = Math.min(1, (tProg - 0.3) / 0.7);
        const ease = morphT * morphT * (3 - 2 * morphT); // smoothstep
        for (let i = 0; i < posArr.length; i++) {
          posArr[i] += (targetPositions[i] - posArr[i]) * ease * 0.08;
        }
        geo.attributes.position.needsUpdate = true;
      }

      // Scale pulse during transition
      const s = tProg < 0.3 ? 1 - tProg : 0.7 + (tProg - 0.3) * 0.43;

      if (tProg >= 1) {
        transitioning = false;
        tProg = 0;
        targetPositions = null;
        points.scale.setScalar(breath);
      } else {
        points.scale.setScalar(Math.max(0.01, s) * breath);
      }
    } else {
      points.scale.setScalar(breath);
    }

    mat.uniforms.uTime.value = t;

    renderer.render(scene, camera);
  })();

  return {
    setShape(shape: string, color: string) {
      transitioning = true;
      tProg = 0;
      pendingShape = shape;
      pendingColor = color;
    },
    dispose() {
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      controls.dispose();
      ro.disconnect();
      obs.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      glowTex.dispose();
    },
  };
}
