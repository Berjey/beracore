import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SubShapeAPI {
  setShape: (shape: string, color: string) => void;
  dispose: () => void;
}

// ===== Kurumsal kimlik renkleri =====
const CORP_PINK = '#ffa9f9';
const CORP_YELLOW = '#fff7ad';

// Şeklin tüm yaşam döngüsünde kullanılan taban ölçek (idle ve morph içinde çarpan)
const BASE_SCALE = 1.0;

function makeLineMat(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({ color: CORP_PINK, transparent: true, opacity: 1.0 });
}

function makeLineMatAccent(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({ color: CORP_YELLOW, transparent: true, opacity: 0.95 });
}

function makeFillMat(): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({
    color: CORP_PINK,
    emissive: new THREE.Color(CORP_PINK),
    emissiveIntensity: 0.25,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    shininess: 120,
    specular: new THREE.Color('#ffffff'),
  });
}

function makeFillMatAccent(): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({
    color: CORP_YELLOW,
    emissive: new THREE.Color(CORP_YELLOW),
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    shininess: 120,
    specular: new THREE.Color('#ffffff'),
  });
}

// ===== Build 3D meshes for each sub-service =====
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildShape(name: string, _color: string): THREE.Group {
  const g = new THREE.Group();

  const lineMat = makeLineMat();
  const lineMatAcc = makeLineMatAccent();
  const fillMat = makeFillMat();
  const fillMatAcc = makeFillMatAccent();

  function addMesh(geo: THREE.BufferGeometry, pos?: [number, number, number], rot?: [number, number, number], scale?: [number, number, number], accent = false) {
    const fill = new THREE.Mesh(geo, accent ? fillMatAcc : fillMat);
    const edges = new THREE.EdgesGeometry(geo, 15);
    const lines = new THREE.LineSegments(edges, accent ? lineMatAcc : lineMat);
    const sub = new THREE.Group();
    sub.add(fill, lines);
    if (pos) sub.position.set(...pos);
    if (rot) sub.rotation.set(...rot);
    if (scale) sub.scale.set(...scale);
    g.add(sub);
    return sub;
  }

  function addWireframe(geo: THREE.BufferGeometry, pos?: [number, number, number], rot?: [number, number, number], accent = false) {
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 15), accent ? lineMatAcc : lineMat);
    if (pos) wire.position.set(...pos);
    if (rot) wire.rotation.set(...rot);
    g.add(wire);
    return wire;
  }

  switch (name) {
    case 'mobile': {
      // Phone body
      const body = new THREE.BoxGeometry(0.55, 1.0, 0.04, 2, 4, 1);
      addMesh(body);
      // Screen — accent yellow
      const screen = new THREE.BoxGeometry(0.45, 0.78, 0.005);
      addWireframe(screen, [0, 0.02, 0.025], undefined, true);
      // Camera notch — accent
      const notch = new THREE.CylinderGeometry(0.025, 0.025, 0.01, 8);
      addMesh(notch, [0, 0.42, 0.025], [Math.PI / 2, 0, 0], undefined, true);
      // Home bar — accent
      const bar = new THREE.BoxGeometry(0.15, 0.015, 0.005);
      addWireframe(bar, [0, -0.43, 0.025], undefined, true);
      break;
    }

    case 'chatbot': {
      // Robot head
      const head = new THREE.BoxGeometry(0.7, 0.6, 0.4, 2, 2, 2);
      addMesh(head, [0, 0.1, 0]);
      // Eyes — accent yellow
      const eye = new THREE.SphereGeometry(0.07, 8, 6);
      addMesh(eye, [-0.15, 0.2, 0.22], undefined, undefined, true);
      addMesh(eye, [0.15, 0.2, 0.22], undefined, undefined, true);
      // Mouth — accent
      const mouth = new THREE.BoxGeometry(0.25, 0.04, 0.02);
      addWireframe(mouth, [0, 0.0, 0.22], undefined, true);
      // Antenna
      const ant = new THREE.CylinderGeometry(0.015, 0.015, 0.2, 6);
      addWireframe(ant, [0, 0.5, 0]);
      const tip = new THREE.SphereGeometry(0.04, 6, 6);
      addMesh(tip, [0, 0.62, 0], undefined, undefined, true);
      // Body
      const bodyB = new THREE.BoxGeometry(0.5, 0.3, 0.3, 1, 1, 1);
      addMesh(bodyB, [0, -0.35, 0]);
      break;
    }

    case 'gear': {
      // Gear shape using extrude
      const shape = new THREE.Shape();
      const teeth = 10;
      const outerR = 0.55, innerR = 0.4, toothH = 0.12;
      for (let i = 0; i < teeth; i++) {
        const a1 = (i / teeth) * Math.PI * 2;
        const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
        const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
        const a4 = ((i + 0.8) / teeth) * Math.PI * 2;
        const r1 = innerR, r2 = outerR + toothH;
        if (i === 0) shape.moveTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
        else shape.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
        shape.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
        shape.lineTo(Math.cos(a3) * r2, Math.sin(a3) * r2);
        shape.lineTo(Math.cos(a4) * r1, Math.sin(a4) * r1);
      }
      const holeShape = new THREE.Path();
      holeShape.absarc(0, 0, 0.15, 0, Math.PI * 2, false);
      shape.holes.push(holeShape);
      const extGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false });
      addMesh(extGeo, [0, 0, -0.06]);
      break;
    }

    case 'chart': {
      const base = new THREE.BoxGeometry(1.2, 0.03, 0.3);
      addMesh(base, [0, -0.45, 0]);
      const bars = [
        { x: -0.35, h: 0.4, acc: false },
        { x: 0, h: 0.7, acc: true },
        { x: 0.35, h: 0.55, acc: false },
      ];
      bars.forEach(b => {
        const bar = new THREE.BoxGeometry(0.2, b.h, 0.2);
        addMesh(bar, [b.x, -0.45 + b.h / 2, 0], undefined, undefined, b.acc);
      });
      break;
    }

    case 'brain': {
      const lobe = new THREE.SphereGeometry(0.35, 12, 10, 0, Math.PI);
      addMesh(lobe, [-0.12, 0, 0], [0, Math.PI / 2, 0]);
      addMesh(lobe, [0.12, 0, 0], [0, -Math.PI / 2, 0]);
      const stem = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8);
      addMesh(stem, [0, -0.4, 0]);
      // Wrinkle lines — accent
      const wrinkle = new THREE.TorusGeometry(0.32, 0.01, 4, 16, Math.PI);
      addWireframe(wrinkle, [-0.12, 0.05, 0.01], [0.3, Math.PI / 2, 0], true);
      addWireframe(wrinkle, [0.12, 0.05, 0.01], [-0.3, -Math.PI / 2, 0], true);
      break;
    }

    case 'coin': {
      const coin = new THREE.CylinderGeometry(0.5, 0.5, 0.06, 24);
      addMesh(coin, [0, 0, 0], [Math.PI / 6, 0, 0]);
      // Inner ring — accent
      const ring = new THREE.TorusGeometry(0.35, 0.015, 6, 24);
      addWireframe(ring, [0, 0.035, 0], [Math.PI / 6 + Math.PI / 2, 0, 0], true);
      // $ symbol — accent
      const line1 = new THREE.BoxGeometry(0.02, 0.3, 0.02);
      addWireframe(line1, [0, 0.035, 0.02], [Math.PI / 6, 0, 0], true);
      const curve = new THREE.TorusGeometry(0.1, 0.015, 4, 8, Math.PI);
      addWireframe(curve, [0, 0.1, 0.02], [Math.PI / 6, 0, 0], true);
      addWireframe(curve, [0, -0.03, 0.02], [Math.PI / 6, Math.PI, 0], true);
      break;
    }

    case 'contract': {
      const doc = new THREE.BoxGeometry(0.6, 0.85, 0.03);
      addMesh(doc);
      // Text lines — accent
      for (let i = 0; i < 5; i++) {
        const lw = i === 0 ? 0.4 : i === 4 ? 0.25 : 0.35;
        const line = new THREE.BoxGeometry(lw, 0.012, 0.005);
        addWireframe(line, [-0.05 + (0.4 - lw) * 0.5, 0.28 - i * 0.12, 0.02], undefined, true);
      }
      // Folded corner
      const fold = new THREE.BufferGeometry();
      const fv = new Float32Array([0.3, 0.425, 0.016, 0.3, 0.3, 0.016, 0.17, 0.425, 0.016]);
      fold.setAttribute('position', new THREE.BufferAttribute(fv, 3));
      fold.setIndex([0, 1, 2]);
      fold.computeVertexNormals();
      const foldMesh = new THREE.Mesh(fold, new THREE.MeshBasicMaterial({ color: CORP_YELLOW, transparent: true, opacity: 0.15, side: THREE.DoubleSide }));
      g.add(foldMesh);
      // Check mark — accent
      const check = new THREE.BufferGeometry();
      const cv = new Float32Array([-0.15, -0.22, 0.02, -0.08, -0.3, 0.02, 0.1, -0.12, 0.02]);
      check.setAttribute('position', new THREE.BufferAttribute(cv, 3));
      g.add(new THREE.Line(check, lineMatAcc));
      break;
    }

    case 'chain': {
      const link = new THREE.TorusGeometry(0.28, 0.05, 8, 16);
      addMesh(link, [-0.2, 0, 0], [Math.PI / 2, 0, 0]);
      addMesh(link, [0.2, 0, 0], [Math.PI / 2, Math.PI / 2, 0], undefined, true);
      break;
    }

    case 'creditcard': {
      const card = new THREE.BoxGeometry(0.9, 0.55, 0.03);
      addMesh(card, [0, 0, 0], [0.15, -0.2, 0]);
      const stripe = new THREE.BoxGeometry(0.9, 0.06, 0.005);
      addWireframe(stripe, [0, 0.15, 0.02], [0.15, -0.2, 0]);
      // Chip — accent
      const chip = new THREE.BoxGeometry(0.1, 0.08, 0.005);
      addMesh(chip, [-0.25, 0.02, 0.02], [0.15, -0.2, 0], undefined, true);
      // Number line — accent
      const num = new THREE.BoxGeometry(0.5, 0.02, 0.005);
      addWireframe(num, [0, -0.05, 0.02], [0.15, -0.2, 0], true);
      break;
    }

    case 'globe': {
      const sphere = new THREE.SphereGeometry(0.5, 16, 12);
      addMesh(sphere);
      // Equator — accent
      const eq = new THREE.TorusGeometry(0.51, 0.008, 4, 32);
      addWireframe(eq, [0, 0, 0], [Math.PI / 2, 0, 0], true);
      const lat1 = new THREE.TorusGeometry(0.4, 0.006, 4, 24);
      addWireframe(lat1, [0, 0.3, 0], [Math.PI / 2, 0, 0]);
      addWireframe(lat1, [0, -0.3, 0], [Math.PI / 2, 0, 0]);
      // Meridians — accent
      const mer = new THREE.TorusGeometry(0.51, 0.006, 4, 32);
      addWireframe(mer, [0, 0, 0], [0, 0, 0], true);
      addWireframe(mer, [0, 0, 0], [0, Math.PI / 2, 0]);
      break;
    }

    case 'wrench': {
      const handle = new THREE.BoxGeometry(0.12, 0.7, 0.05);
      addMesh(handle, [0, -0.1, 0]);
      // Jaws — accent
      const jawTop = new THREE.TorusGeometry(0.18, 0.04, 6, 12, Math.PI * 1.4);
      addMesh(jawTop, [0, 0.38, 0], [0, 0, 0.3], undefined, true);
      const jawBot = new THREE.TorusGeometry(0.12, 0.03, 6, 10, Math.PI * 1.6);
      addMesh(jawBot, [0, -0.52, 0], [0, 0, Math.PI + 0.2]);
      break;
    }

    case 'plug': {
      const body = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 10);
      addMesh(body, [0, -0.1, 0]);
      // Prongs — accent
      const prong = new THREE.BoxGeometry(0.04, 0.35, 0.02);
      addMesh(prong, [-0.1, 0.3, 0], undefined, undefined, true);
      addMesh(prong, [0.1, 0.3, 0], undefined, undefined, true);
      const gnd = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 6);
      addMesh(gnd, [0, 0.32, 0], undefined, undefined, true);
      const cord = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
      addMesh(cord, [0, -0.45, 0]);
      break;
    }

    case 'palette': {
      const shape = new THREE.Shape();
      shape.moveTo(0.5, 0);
      shape.quadraticCurveTo(0.5, 0.35, 0.2, 0.45);
      shape.quadraticCurveTo(-0.2, 0.5, -0.45, 0.25);
      shape.quadraticCurveTo(-0.55, 0, -0.45, -0.25);
      shape.quadraticCurveTo(-0.2, -0.45, 0.2, -0.4);
      shape.quadraticCurveTo(0.45, -0.35, 0.5, 0);
      const hole = new THREE.Path();
      hole.absarc(0.15, 0.15, 0.1, 0, Math.PI * 2, false);
      shape.holes.push(hole);
      const extGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
      addMesh(extGeo, [0, 0, -0.03]);
      // Paint dots — accent
      const dot = new THREE.SphereGeometry(0.05, 6, 6);
      addMesh(dot, [-0.25, 0.2, 0.04], undefined, undefined, true);
      addMesh(dot, [-0.1, 0.3, 0.04], undefined, undefined, true);
      addMesh(dot, [0.3, -0.1, 0.04]);
      addMesh(dot, [-0.3, -0.1, 0.04]);
      break;
    }

    case 'layout': {
      const frame = new THREE.BoxGeometry(0.9, 0.65, 0.03);
      addMesh(frame);
      // Title bar — accent
      const titleBar = new THREE.BoxGeometry(0.9, 0.06, 0.005);
      addWireframe(titleBar, [0, 0.295, 0.02], undefined, true);
      // Dots
      const dot = new THREE.SphereGeometry(0.015, 6, 6);
      addMesh(dot, [-0.35, 0.295, 0.025], undefined, undefined, true);
      addMesh(dot, [-0.31, 0.295, 0.025], undefined, undefined, true);
      addMesh(dot, [-0.27, 0.295, 0.025], undefined, undefined, true);
      const sidebar = new THREE.BoxGeometry(0.003, 0.52, 0.005);
      addWireframe(sidebar, [-0.15, -0.01, 0.02]);
      // Content blocks — accent
      const block1 = new THREE.BoxGeometry(0.25, 0.15, 0.005);
      addWireframe(block1, [0.22, 0.15, 0.02], undefined, true);
      const block2 = new THREE.BoxGeometry(0.25, 0.1, 0.005);
      addWireframe(block2, [0.22, -0.05, 0.02]);
      const block3 = new THREE.BoxGeometry(0.25, 0.12, 0.005);
      addWireframe(block3, [0.22, -0.2, 0.02], undefined, true);
      break;
    }

    case 'badge': {
      const starShape = new THREE.Shape();
      const points = 5, outerR = 0.55, innerR = 0.25;
      for (let i = 0; i < points * 2; i++) {
        const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        if (i === 0) starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.1, bevelEnabled: false });
      addMesh(starGeo, [0, 0, -0.05], undefined, undefined, true);
      break;
    }

    case 'frame': {
      const outer = new THREE.BoxGeometry(0.8, 0.6, 0.06);
      addMesh(outer);
      const inner = new THREE.BoxGeometry(0.6, 0.4, 0.07);
      addWireframe(inner, undefined, undefined, true);
      // Mountain — accent
      const mountain = new THREE.BufferGeometry();
      const mv = new Float32Array([
        -0.25, -0.1, 0.04,  0, 0.1, 0.04,  0.25, -0.1, 0.04,
        0, -0.1, 0.04,  0.15, 0.05, 0.04,  0.3, -0.1, 0.04
      ]);
      mountain.setAttribute('position', new THREE.BufferAttribute(mv, 3));
      mountain.setIndex([0, 1, 2, 3, 4, 5]);
      g.add(new THREE.LineSegments(mountain, lineMatAcc));
      // Sun — accent
      const sun = new THREE.SphereGeometry(0.04, 8, 6);
      addMesh(sun, [-0.15, 0.12, 0.04], undefined, undefined, true);
      break;
    }

    case 'cart': {
      const basket = new THREE.BoxGeometry(0.55, 0.35, 0.3, 1, 1, 1);
      addMesh(basket, [0.05, 0, 0]);
      // Handle
      const handleGeo = new THREE.BufferGeometry();
      const hv = new Float32Array([-0.45, 0.3, 0, -0.22, 0.18, 0, -0.22, -0.05, 0]);
      handleGeo.setAttribute('position', new THREE.BufferAttribute(hv, 3));
      g.add(new THREE.Line(handleGeo, lineMat));
      // Wheels — accent
      const wheel = new THREE.TorusGeometry(0.07, 0.02, 6, 12);
      addMesh(wheel, [-0.12, -0.28, 0.15], [Math.PI / 2, 0, 0], undefined, true);
      addMesh(wheel, [0.25, -0.28, 0.15], [Math.PI / 2, 0, 0], undefined, true);
      break;
    }

    case 'store': {
      const building = new THREE.BoxGeometry(0.75, 0.55, 0.4);
      addMesh(building, [0, -0.1, 0]);
      // Roof — accent
      const roofShape = new THREE.Shape();
      roofShape.moveTo(-0.45, 0);
      roofShape.lineTo(0, 0.3);
      roofShape.lineTo(0.45, 0);
      roofShape.lineTo(-0.45, 0);
      const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 0.45, bevelEnabled: false });
      addMesh(roofGeo, [0, 0.18, -0.225], undefined, undefined, true);
      // Door — accent
      const door = new THREE.BoxGeometry(0.15, 0.25, 0.01);
      addWireframe(door, [0, -0.25, 0.21], undefined, true);
      const win = new THREE.BoxGeometry(0.12, 0.12, 0.01);
      addWireframe(win, [-0.2, 0, 0.21]);
      addWireframe(win, [0.2, 0, 0.21]);
      break;
    }

    case 'diamond': {
      const dGeo = new THREE.OctahedronGeometry(0.5, 0);
      addMesh(dGeo, [0, 0, 0], [0, 0, 0], [1, 1.3, 1], true);
      break;
    }

    case 'search': {
      const lens = new THREE.TorusGeometry(0.3, 0.04, 8, 24);
      addMesh(lens, [-0.05, 0.1, 0]);
      // Glass — accent fill
      const glass = new THREE.CircleGeometry(0.3, 24);
      const glassMesh = new THREE.Mesh(glass, new THREE.MeshBasicMaterial({
        color: CORP_YELLOW, transparent: true, opacity: 0.04, side: THREE.DoubleSide
      }));
      glassMesh.position.set(-0.05, 0.1, 0);
      g.add(glassMesh);
      // Handle
      const handle2 = new THREE.CylinderGeometry(0.04, 0.05, 0.4, 8);
      addMesh(handle2, [0.25, -0.28, 0], [0, 0, Math.PI / 4]);
      break;
    }

    case 'megaphone': {
      const cone = new THREE.ConeGeometry(0.4, 0.8, 12, 1, true);
      addMesh(cone, [0.1, 0, 0], [0, 0, -Math.PI / 2]);
      // Mouth ring — accent
      const mouthRing = new THREE.TorusGeometry(0.4, 0.025, 6, 16);
      addWireframe(mouthRing, [0.5, 0, 0], [0, Math.PI / 2, 0], true);
      const grip = new THREE.BoxGeometry(0.08, 0.2, 0.08);
      addMesh(grip, [-0.25, -0.2, 0]);
      break;
    }

    case 'trending': {
      // Axes
      const axis = new THREE.BufferGeometry();
      const av = new Float32Array([-0.5, -0.4, 0, -0.5, 0.4, 0, -0.5, -0.4, 0, 0.5, -0.4, 0]);
      axis.setAttribute('position', new THREE.BufferAttribute(av, 3));
      g.add(new THREE.LineSegments(axis, lineMat));
      // Trend line — accent
      const trendGeo = new THREE.BufferGeometry();
      const tv = new Float32Array([-0.4, -0.25, 0, -0.15, -0.05, 0, 0.05, -0.15, 0, 0.35, 0.3, 0]);
      trendGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3));
      g.add(new THREE.Line(trendGeo, lineMatAcc));
      // Arrow head — accent
      const arrow = new THREE.BufferGeometry();
      const arv = new Float32Array([0.2, 0.35, 0, 0.35, 0.3, 0, 0.35, 0.3, 0, 0.3, 0.15, 0]);
      arrow.setAttribute('position', new THREE.BufferAttribute(arv, 3));
      g.add(new THREE.LineSegments(arrow, lineMatAcc));
      // Data dots — accent
      const dot2 = new THREE.SphereGeometry(0.03, 6, 6);
      addMesh(dot2, [-0.4, -0.25, 0], undefined, undefined, true);
      addMesh(dot2, [-0.15, -0.05, 0], undefined, undefined, true);
      addMesh(dot2, [0.05, -0.15, 0], undefined, undefined, true);
      addMesh(dot2, [0.35, 0.3, 0], undefined, undefined, true);
      break;
    }

    case 'pen': {
      const penBody = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8);
      addMesh(penBody, [0, 0.05, 0], [0, 0, Math.PI / 8]);
      // Tip — accent
      const tip = new THREE.ConeGeometry(0.05, 0.18, 8);
      addMesh(tip, [-0.07, -0.41, 0], [0, 0, Math.PI / 8], undefined, true);
      const clip = new THREE.BoxGeometry(0.015, 0.25, 0.02);
      addWireframe(clip, [0.08, 0.35, 0.06], [0, 0, Math.PI / 8]);
      // Cap — accent
      const cap = new THREE.SphereGeometry(0.05, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2);
      addMesh(cap, [0.1, 0.47, 0], [0, 0, Math.PI / 8], undefined, true);
      break;
    }

    default: {
      // Fallback: sphere
      const sphere = new THREE.SphereGeometry(0.45, 14, 10);
      addMesh(sphere);
      break;
    }
  }

  // Not: BASE_SCALE render döngüsünde uygulanır; burada şekil 1.0'da kalır.
  return g;
}

// Modül seviyesinde registry — aynı canvas için WebGL context çakışmalarını önler.
// React Strict Mode / HMR / çoklu effect gibi senaryolarda koruyucu görev yapar.
const sceneRegistry = new WeakMap<HTMLCanvasElement, SubShapeAPI>();

// ===== Create the 3D mesh scene =====
// Minimal, sakin ve güvenilir: küçük taban ölçek, neredeyse statik idle,
// temiz morph geçişi, WebGL context çakışmalarına karşı registry koruması.
export function createSubScene(canvas: HTMLCanvasElement): SubShapeAPI {
  // Bu canvas için zaten bir sahne varsa yeniden yaratma — mevcudu döndür.
  const existing = sceneRegistry.get(canvas);
  if (existing) return existing;

  // --- Scene & lights ---
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const keyLight = new THREE.DirectionalLight(0xffa9f9, 0.85);
  keyLight.position.set(2, 3, 4);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xfff7ad, 0.55);
  rimLight.position.set(-2, -1, -3);
  scene.add(rimLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.25);
  fillLight.position.set(-3, 2, -1);
  scene.add(fillLight);

  // --- Camera (daha geride → şekil küçük ve sabit görünür) ---
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 4.6);

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // --- Kullanıcı kontrolü (hafif) ---
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.45;
  controls.autoRotate = false;

  let userInteracting = false;
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;
  controls.addEventListener('start', () => {
    userInteracting = true;
    if (resumeTimer) clearTimeout(resumeTimer);
  });
  controls.addEventListener('end', () => {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { userInteracting = false; }, 2500);
  });

  // --- State ---
  let currentGroup: THREE.Group | null = null;
  let introProgress = 0;
  let introActive = false;
  // Aktif şekil adı — aynı shape için setShape tekrar çağrılırsa no-op.
  let currentShape: string | null = null;

  function traverseMats(group: THREE.Group, fn: (m: THREE.Material) => void) {
    group.traverse(o => {
      const mesh = o as THREE.Mesh;
      const mat = mesh.material;
      if (!mat) return;
      if (Array.isArray(mat)) mat.forEach(fn);
      else fn(mat);
    });
  }

  function disposeGroup(group: THREE.Group) {
    group.traverse(o => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material;
      if (!mat) return;
      if (Array.isArray(mat)) mat.forEach(m => m.dispose());
      else mat.dispose();
    });
  }

  // --- Resize: layout henüz yokken fallback boyutla aç ---
  function resize() {
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    if (w === 0 || h === 0) {
      const rect = canvas.getBoundingClientRect();
      w = rect.width || 480;
      h = rect.height || 480;
    }
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // --- Görünürlük (ekran dışında RAF'ı boşa harcama) ---
  let visible = true;
  const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  // --- Render loop ---
  const clock = new THREE.Clock();
  let raf = 0;
  (function loop() {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    controls.update();

    if (currentGroup) {
      // Lokal const + explicit type — TS closure-scope'da currentGroup narrowing'i kaybediyor.
      const cg: THREE.Group = currentGroup;
      if (introActive) {
        // İlk yükleme intro'su: 0 → BASE_SCALE, ~0.4s
        introProgress = Math.min(1, introProgress + 2.5 * dt);
        const e = 1 - Math.pow(1 - introProgress, 3);
        cg.scale.setScalar(BASE_SCALE * e);
        traverseMats(cg, m => {
          m.opacity = (m.userData.baseOpacity ?? 1) * e;
        });
        if (introProgress >= 1) {
          introActive = false;
          cg.scale.setScalar(BASE_SCALE);
          traverseMats(cg, m => { m.opacity = m.userData.baseOpacity ?? 1; });
        }
      } else if (!userInteracting) {
        // Çok hafif salınım — şekil sabit gibi dursun
        cg.rotation.y = Math.sin(t * 0.18) * 0.18;
        cg.rotation.x = Math.sin(t * 0.12) * 0.05;
      }
    }

    renderer.render(scene, camera);
  })();

  // --- API ---
  const api: SubShapeAPI = {
    setShape(shape: string, color: string) {
      // Aynı şekilse hiçbir şey yapma.
      if (currentShape === shape) return;
      currentShape = shape;

      const newGroup = buildShape(shape, color);
      traverseMats(newGroup, m => { m.userData.baseOpacity = m.opacity; });

      if (!currentGroup) {
        // İlk yükleme — intro başlat (0 → BASE_SCALE, hafif fade-in)
        currentGroup = newGroup;
        currentGroup.scale.setScalar(0);
        traverseMats(currentGroup, m => { m.opacity = 0; });
        scene.add(currentGroup);
        introProgress = 0;
        introActive = true;
      } else {
        // Anında swap — eski siliniyor, yeni tam boyda ekleniyor.
        // Animasyon yok, flicker yok, race yok.
        scene.remove(currentGroup);
        disposeGroup(currentGroup);
        currentGroup = newGroup;
        currentGroup.scale.setScalar(BASE_SCALE);
        currentGroup.rotation.set(0, 0, 0);
        scene.add(currentGroup);
        introActive = false;
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      controls.dispose();
      ro.disconnect();
      io.disconnect();
      if (currentGroup) disposeGroup(currentGroup);
      renderer.dispose();
      sceneRegistry.delete(canvas);
    },
  };

  sceneRegistry.set(canvas, api);
  return api;
}
