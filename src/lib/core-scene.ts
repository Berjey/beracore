import * as THREE from 'three';

export interface CoreSceneAPI {
  setScrollProgress: (p: number) => void;
  dispose: () => void;
}

export function createCoreScene(canvas: HTMLCanvasElement): CoreSceneAPI {
  const box = canvas.parentElement!;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  camera.position.set(0, 0, 3.8);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Planet as billboard plane (the PNG is already a 3D-rendered sphere)
  const loader = new THREE.TextureLoader();
  const planetTex = loader.load('/planet.png');
  planetTex.colorSpace = THREE.SRGBColorSpace;
  planetTex.minFilter = THREE.LinearMipMapLinearFilter;
  planetTex.magFilter = THREE.LinearFilter;

  const planeSize = 1.6;
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshBasicMaterial({
    map: planetTex,
    transparent: true,
    alphaTest: 0.02,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const sphere = new THREE.Mesh(planeGeo, planeMat);
  scene.add(sphere);

  // Resize
  function resize() {
    const w = box.clientWidth, h = box.clientHeight || 600;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  let rsTick = false;
  const onRS = () => { if (rsTick) return; rsTick = true; requestAnimationFrame(() => { resize(); rsTick = false; }); };
  window.addEventListener('resize', onRS, { passive: true });

  let vis = true;
  const obs = new IntersectionObserver(e => { vis = e[0].isIntersecting; }, { threshold: 0 });
  obs.observe(canvas);
  const onVis = () => { vis = !document.hidden; };
  document.addEventListener('visibilitychange', onVis);

  // Hover
  let hover = 0, hT = 0;
  const rc = new THREE.Raycaster(), mv = new THREE.Vector2(9999, 9999);
  const onMM = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    mv.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mv.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  };
  const onML = () => mv.set(9999, 9999);
  canvas.addEventListener('mousemove', onMM, { passive: true });
  canvas.addEventListener('mouseleave', onML);

  let scrollTarget = 0;
  let scroll = 0;
  const clock = new THREE.Clock();
  resize();

  let raf: number;
  (function loop() {
    raf = requestAnimationFrame(loop);
    if (!vis) return;
    const t = clock.getElapsedTime();

    scroll += (scrollTarget - scroll) * 0.06;

    rc.setFromCamera(mv, camera);
    hT = rc.intersectObject(sphere).length ? 1 : 0;
    hover += (hT - hover) * 0.08;

    const p = scroll;

    // === IDLE ANIMATION (visible without any scroll) ===
    // Slow floating up-down
    const floatY = Math.sin(t * 0.5) * 0.035;
    const floatX = Math.cos(t * 0.35) * 0.02;
    // Gentle tilt — like a planet wobbling in space
    sphere.rotation.y = Math.sin(t * 0.3) * 0.18;
    sphere.rotation.x = Math.sin(t * 0.2) * 0.06;
    sphere.rotation.z = Math.cos(t * 0.25) * 0.03;
    // Breathing scale
    const breath = 1 + Math.sin(t * 0.8) * 0.02;

    // === SCROLL: yukarı uçar, küçülerek uzaklaşır ===
    // Ease-in: önce yavaş yukarı, sonra hızlanır — "uçup gidiyor" hissi
    const yOffset = Math.pow(p, 1.5) * 3.2;
    sphere.position.set(floatX, yOffset + floatY, 0);

    // Hafif büyüme (yaklaşma hissi yok, çakışmaz)
    const scaleBase = 1 + p * 0.25;
    sphere.scale.setScalar(scaleBase * breath);

    // Camera zoom (sahnenin içine doğru)
    camera.position.z = 3.8 - p * 0.8;

    // Dünya erken solar — %45'te başlar, %75'te tamamen yok. Sonrası temiz Manifesto için boşluk.
    planeMat.opacity = p > 0.45 ? Math.max(0, 1 - (p - 0.45) / 0.30) : 1;

    // Hover brightness
    const hBright = 1.0 + hover * 0.25;
    planeMat.color.setRGB(hBright, hBright, hBright);

    renderer.render(scene, camera);
  })();

  return {
    setScrollProgress(p: number) { scrollTarget = p; },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onRS);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('mousemove', onMM);
      canvas.removeEventListener('mouseleave', onML);
      obs.disconnect();
      renderer.dispose();
      planeGeo.dispose(); planeMat.dispose(); planetTex.dispose();
    },
  };
}
