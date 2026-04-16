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
    // ===== Sub-service shapes =====

    case 'mobile': {
      // Phone shape — tall thin rounded rectangle
      const w = S * 0.35, h = S * 0.75, d = S * 0.06;
      for (let i = 0; i < count; i++) {
        const face = i % 6;
        const u = (Math.random() * 2 - 1);
        const v = (Math.random() * 2 - 1);
        if (face === 0) { pos[i*3] = w; pos[i*3+1] = u * h; pos[i*3+2] = v * d; }
        else if (face === 1) { pos[i*3] = -w; pos[i*3+1] = u * h; pos[i*3+2] = v * d; }
        else if (face === 2) { pos[i*3] = u * w; pos[i*3+1] = h; pos[i*3+2] = v * d; }
        else if (face === 3) { pos[i*3] = u * w; pos[i*3+1] = -h; pos[i*3+2] = v * d; }
        else if (face === 4) { pos[i*3] = u * w; pos[i*3+1] = v * h; pos[i*3+2] = d; }
        else { pos[i*3] = u * w; pos[i*3+1] = v * h; pos[i*3+2] = -d; }
      }
      // Screen line (top notch hint)
      for (let i = 0; i < Math.min(count * 0.1, 200); i++) {
        const idx = (count - 1 - i);
        pos[idx*3]   = (Math.random() * 2 - 1) * w * 0.3;
        pos[idx*3+1] = h * 0.85;
        pos[idx*3+2] = d + 0.01;
      }
      break;
    }

    case 'chatbot': {
      // Speech bubble — rounded box + triangle pointer
      const bw = S * 0.55, bh = S * 0.45, bd = S * 0.12;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.85) {
          // Main bubble box
          const face = i % 6;
          const u = (Math.random() * 2 - 1);
          const v = (Math.random() * 2 - 1);
          const yo = S * 0.15; // shift up
          if (face === 0) { pos[i*3] = bw; pos[i*3+1] = u * bh + yo; pos[i*3+2] = v * bd; }
          else if (face === 1) { pos[i*3] = -bw; pos[i*3+1] = u * bh + yo; pos[i*3+2] = v * bd; }
          else if (face === 2) { pos[i*3] = u * bw; pos[i*3+1] = bh + yo; pos[i*3+2] = v * bd; }
          else if (face === 3) { pos[i*3] = u * bw; pos[i*3+1] = -bh + yo; pos[i*3+2] = v * bd; }
          else if (face === 4) { pos[i*3] = u * bw; pos[i*3+1] = v * bh + yo; pos[i*3+2] = bd; }
          else { pos[i*3] = u * bw; pos[i*3+1] = v * bh + yo; pos[i*3+2] = -bd; }
        } else {
          // Triangle pointer at bottom-left
          const t = Math.random();
          const px = -bw * 0.3 + t * (-bw * 0.2);
          const py = -bh + S * 0.15 - t * S * 0.35;
          pos[i*3] = px + (Math.random() - 0.5) * 0.05;
          pos[i*3+1] = py;
          pos[i*3+2] = (Math.random() - 0.5) * bd * 0.5;
        }
      }
      break;
    }

    case 'gear': {
      // Gear/cog — circle with teeth
      const R = S * 0.55, teeth = 8, tw = 0.18, th = S * 0.2;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.4) {
          // Inner ring
          const a = Math.random() * Math.PI * 2;
          const r2 = R * 0.35;
          const z = (Math.random() - 0.5) * S * 0.2;
          pos[i*3] = Math.cos(a) * r2; pos[i*3+1] = Math.sin(a) * r2; pos[i*3+2] = z;
        } else if (i < count * 0.7) {
          // Outer ring
          const a = Math.random() * Math.PI * 2;
          const z = (Math.random() - 0.5) * S * 0.2;
          pos[i*3] = Math.cos(a) * R; pos[i*3+1] = Math.sin(a) * R; pos[i*3+2] = z;
        } else {
          // Teeth
          const ti = i % teeth;
          const a = (ti / teeth) * Math.PI * 2;
          const off = (Math.random() - 0.5) * tw;
          const ext = R + Math.random() * th;
          const z = (Math.random() - 0.5) * S * 0.2;
          pos[i*3] = Math.cos(a + off) * ext; pos[i*3+1] = Math.sin(a + off) * ext; pos[i*3+2] = z;
        }
      }
      break;
    }

    case 'chart': {
      // Bar chart — 3 vertical bars + base line
      const bars = [
        { x: -S * 0.4, h: S * 0.4 },
        { x: 0, h: S * 0.7 },
        { x: S * 0.4, h: S * 0.55 },
      ];
      const bw2 = S * 0.14, bd2 = S * 0.1;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.1) {
          // Base line
          pos[i*3] = (Math.random() * 2 - 1) * S * 0.65;
          pos[i*3+1] = -S * 0.7;
          pos[i*3+2] = (Math.random() - 0.5) * bd2;
        } else {
          const bar = bars[i % 3];
          const face = Math.floor(Math.random() * 4);
          const yBase = -S * 0.7;
          const yy = yBase + Math.random() * bar.h * 2;
          if (face === 0) { pos[i*3] = bar.x + bw2; pos[i*3+1] = yy; pos[i*3+2] = (Math.random() - 0.5) * bd2; }
          else if (face === 1) { pos[i*3] = bar.x - bw2; pos[i*3+1] = yy; pos[i*3+2] = (Math.random() - 0.5) * bd2; }
          else if (face === 2) { pos[i*3] = bar.x + (Math.random() * 2 - 1) * bw2; pos[i*3+1] = yBase + bar.h * 2; pos[i*3+2] = (Math.random() - 0.5) * bd2; }
          else { pos[i*3] = bar.x + (Math.random() * 2 - 1) * bw2; pos[i*3+1] = yy; pos[i*3+2] = bd2 * (Math.random() > 0.5 ? 1 : -1); }
        }
      }
      break;
    }

    case 'brain': {
      // Brain — bumpy double-lobe sphere
      const r = S * 0.7;
      for (let i = 0; i < count; i++) {
        const phi2 = Math.PI * (Math.sqrt(5) - 1);
        const y = 1 - (i / (count - 1)) * 2;
        const rd = Math.sqrt(1 - y * y);
        const theta = phi2 * i;
        // Two lobes offset + surface noise
        const lobe = Math.cos(theta * 3) * 0.08 + Math.sin(y * 8) * 0.06;
        const split = y > 0 ? 0.05 : -0.05;
        pos[i*3]   = (Math.cos(theta) * rd * r + split) * (1 + lobe);
        pos[i*3+1] = y * r * 0.85;
        pos[i*3+2] = Math.sin(theta) * rd * r * (1 + lobe);
      }
      break;
    }

    case 'coin': {
      // Flat disc/coin
      const R2 = S * 0.65, thick = S * 0.08;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.3) {
          // Edge (cylinder side)
          const a = Math.random() * Math.PI * 2;
          const y2 = (Math.random() * 2 - 1) * thick;
          pos[i*3] = Math.cos(a) * R2; pos[i*3+1] = y2; pos[i*3+2] = Math.sin(a) * R2;
        } else {
          // Top or bottom face
          const a = Math.random() * Math.PI * 2;
          const r2 = Math.sqrt(Math.random()) * R2;
          const y2 = i % 2 === 0 ? thick : -thick;
          pos[i*3] = Math.cos(a) * r2; pos[i*3+1] = y2; pos[i*3+2] = Math.sin(a) * r2;
        }
      }
      break;
    }

    case 'contract': {
      // Document/scroll — flat rectangle with lines
      const dw = S * 0.4, dh = S * 0.6, dd = S * 0.04;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.7) {
          // Document surface
          const face = i % 4;
          if (face < 2) {
            pos[i*3] = (Math.random() * 2 - 1) * dw;
            pos[i*3+1] = (Math.random() * 2 - 1) * dh;
            pos[i*3+2] = face === 0 ? dd : -dd;
          } else {
            const edge = face === 2;
            pos[i*3] = edge ? (Math.random() > 0.5 ? dw : -dw) : (Math.random() * 2 - 1) * dw;
            pos[i*3+1] = edge ? (Math.random() * 2 - 1) * dh : (Math.random() > 0.5 ? dh : -dh);
            pos[i*3+2] = (Math.random() * 2 - 1) * dd;
          }
        } else {
          // Text lines
          const line = i % 5;
          const ly = dh * 0.7 - line * dh * 0.3;
          const lw2 = line === 4 ? dw * 0.5 : dw * 0.8;
          pos[i*3] = (Math.random() * 2 - 1) * lw2;
          pos[i*3+1] = ly + (Math.random() - 0.5) * 0.02;
          pos[i*3+2] = dd + 0.01;
        }
      }
      break;
    }

    case 'chain': {
      // Two interlocked chain links (torus-like)
      const R3 = S * 0.35, r3 = S * 0.08;
      for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        if (i < count / 2) {
          // First link — shifted left
          pos[i*3]   = (R3 + r3 * Math.cos(v)) * Math.cos(u) - S * 0.2;
          pos[i*3+1] = r3 * Math.sin(v);
          pos[i*3+2] = (R3 + r3 * Math.cos(v)) * Math.sin(u);
        } else {
          // Second link — shifted right, rotated 90°
          const x = (R3 + r3 * Math.cos(v)) * Math.cos(u);
          const y = r3 * Math.sin(v);
          const z = (R3 + r3 * Math.cos(v)) * Math.sin(u);
          pos[i*3]   = z + S * 0.2;
          pos[i*3+1] = y;
          pos[i*3+2] = x;
        }
      }
      break;
    }

    case 'creditcard': {
      // Credit card — wide flat rectangle with chip detail
      const cw = S * 0.65, ch = S * 0.4, cd = S * 0.04;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.8) {
          const face = i % 6;
          const u = (Math.random() * 2 - 1);
          const v = (Math.random() * 2 - 1);
          if (face === 0) { pos[i*3] = cw; pos[i*3+1] = u * ch; pos[i*3+2] = v * cd; }
          else if (face === 1) { pos[i*3] = -cw; pos[i*3+1] = u * ch; pos[i*3+2] = v * cd; }
          else if (face === 2) { pos[i*3] = u * cw; pos[i*3+1] = ch; pos[i*3+2] = v * cd; }
          else if (face === 3) { pos[i*3] = u * cw; pos[i*3+1] = -ch; pos[i*3+2] = v * cd; }
          else if (face === 4) { pos[i*3] = u * cw; pos[i*3+1] = v * ch; pos[i*3+2] = cd; }
          else { pos[i*3] = u * cw; pos[i*3+1] = v * ch; pos[i*3+2] = -cd; }
        } else {
          // Chip rectangle
          const cx2 = -cw * 0.5 + (Math.random()) * cw * 0.25;
          const cy2 = ch * 0.2 + (Math.random()) * ch * 0.3;
          pos[i*3] = cx2; pos[i*3+1] = cy2; pos[i*3+2] = cd + 0.01;
        }
      }
      break;
    }

    case 'globe': {
      // Globe — sphere with latitude rings
      const phi3 = Math.PI * (Math.sqrt(5) - 1);
      const r4 = S;
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const rd = Math.sqrt(1 - y * y);
        const theta = phi3 * i;
        pos[i*3]   = Math.cos(theta) * rd * r4;
        pos[i*3+1] = y * r4;
        pos[i*3+2] = Math.sin(theta) * rd * r4;
      }
      break;
    }

    case 'wrench': {
      // Wrench — handle + open jaw
      for (let i = 0; i < count; i++) {
        if (i < count * 0.5) {
          // Handle (long bar)
          const t = Math.random();
          pos[i*3]   = (Math.random() - 0.5) * S * 0.1;
          pos[i*3+1] = -S * 0.7 + t * S * 1.0;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.1;
        } else if (i < count * 0.8) {
          // Jaw top (open circle)
          const a = Math.random() * Math.PI * 1.5 - Math.PI * 0.25;
          const r5 = S * 0.3;
          pos[i*3]   = Math.cos(a) * r5;
          pos[i*3+1] = S * 0.45 + Math.sin(a) * r5;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.1;
        } else {
          // Jaw bottom ring
          const a = Math.random() * Math.PI * 1.2;
          const r5 = S * 0.18;
          pos[i*3]   = Math.cos(a) * r5;
          pos[i*3+1] = -S * 0.6 + Math.sin(a) * r5;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.1;
        }
      }
      break;
    }

    case 'plug': {
      // Plug/connector — cylinder body + prongs
      for (let i = 0; i < count; i++) {
        if (i < count * 0.5) {
          // Body cylinder
          const a = Math.random() * Math.PI * 2;
          const r5 = S * 0.3;
          const y2 = (Math.random() - 0.5) * S * 0.6;
          pos[i*3] = Math.cos(a) * r5; pos[i*3+1] = y2; pos[i*3+2] = Math.sin(a) * r5;
        } else if (i < count * 0.75) {
          // Left prong
          const t = Math.random();
          pos[i*3]   = -S * 0.12 + (Math.random() - 0.5) * S * 0.04;
          pos[i*3+1] = S * 0.3 + t * S * 0.4;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.04;
        } else {
          // Right prong
          const t = Math.random();
          pos[i*3]   = S * 0.12 + (Math.random() - 0.5) * S * 0.04;
          pos[i*3+1] = S * 0.3 + t * S * 0.4;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.04;
        }
      }
      break;
    }

    case 'palette': {
      // Artist palette — flat blob with thumb hole
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const rBase = S * 0.6 + Math.sin(a * 2) * S * 0.15;
        const r5 = Math.sqrt(Math.random()) * rBase;
        // Thumb hole cutout
        const dx = r5 * Math.cos(a) - S * 0.2;
        const dy = r5 * Math.sin(a) + S * 0.15;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < S * 0.18) {
          // On the hole edge
          const ha = Math.random() * Math.PI * 2;
          pos[i*3]   = S * 0.2 + Math.cos(ha) * S * 0.18;
          pos[i*3+1] = -S * 0.15 + Math.sin(ha) * S * 0.18;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.06;
        } else {
          pos[i*3]   = r5 * Math.cos(a);
          pos[i*3+1] = r5 * Math.sin(a) * 0.7;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.06;
        }
      }
      break;
    }

    case 'layout': {
      // UI Layout — rectangle with grid dividers
      const lw = S * 0.6, lh = S * 0.5, ld = S * 0.04;
      for (let i = 0; i < count; i++) {
        if (i < count * 0.6) {
          // Outer frame
          const side = i % 4;
          if (side === 0) { pos[i*3] = lw; pos[i*3+1] = (Math.random() * 2 - 1) * lh; pos[i*3+2] = (Math.random() - 0.5) * ld; }
          else if (side === 1) { pos[i*3] = -lw; pos[i*3+1] = (Math.random() * 2 - 1) * lh; pos[i*3+2] = (Math.random() - 0.5) * ld; }
          else if (side === 2) { pos[i*3] = (Math.random() * 2 - 1) * lw; pos[i*3+1] = lh; pos[i*3+2] = (Math.random() - 0.5) * ld; }
          else { pos[i*3] = (Math.random() * 2 - 1) * lw; pos[i*3+1] = -lh; pos[i*3+2] = (Math.random() - 0.5) * ld; }
        } else if (i < count * 0.75) {
          // Top bar
          pos[i*3] = (Math.random() * 2 - 1) * lw;
          pos[i*3+1] = lh * 0.6;
          pos[i*3+2] = (Math.random() - 0.5) * ld;
        } else if (i < count * 0.88) {
          // Vertical divider
          pos[i*3] = -lw * 0.3;
          pos[i*3+1] = (Math.random() * 2 - 1) * lh * 0.6 - lh * 0.2;
          pos[i*3+2] = (Math.random() - 0.5) * ld;
        } else {
          // Content blocks
          pos[i*3] = lw * 0.3 + (Math.random() - 0.5) * lw * 0.5;
          pos[i*3+1] = (Math.random() - 0.5) * lh * 0.4;
          pos[i*3+2] = ld + 0.01;
        }
      }
      break;
    }

    case 'badge': {
      // Star/badge shape
      const points2 = 5, outerR = S * 0.75, innerR = S * 0.35;
      for (let i = 0; i < count; i++) {
        const pi = i % (points2 * 2);
        const a1 = (pi / (points2 * 2)) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((pi + 1) / (points2 * 2)) * Math.PI * 2 - Math.PI / 2;
        const r1 = pi % 2 === 0 ? outerR : innerR;
        const r2b = pi % 2 === 0 ? innerR : outerR;
        const t = Math.random();
        const x2 = Math.cos(a1) * r1 * (1 - t) + Math.cos(a2) * r2b * t;
        const y2 = Math.sin(a1) * r1 * (1 - t) + Math.sin(a2) * r2b * t;
        pos[i*3] = x2;
        pos[i*3+1] = y2;
        pos[i*3+2] = (Math.random() - 0.5) * S * 0.12;
      }
      break;
    }

    case 'frame': {
      // Picture frame — hollow rectangle
      const fw = S * 0.55, fh = S * 0.45, ft = S * 0.08;
      for (let i = 0; i < count; i++) {
        const side = i % 4;
        if (side === 0) {
          const t = (Math.random() * 2 - 1);
          pos[i*3] = fw; pos[i*3+1] = t * fh; pos[i*3+2] = (Math.random() - 0.5) * ft;
        } else if (side === 1) {
          const t = (Math.random() * 2 - 1);
          pos[i*3] = -fw; pos[i*3+1] = t * fh; pos[i*3+2] = (Math.random() - 0.5) * ft;
        } else if (side === 2) {
          const t = (Math.random() * 2 - 1);
          pos[i*3] = t * fw; pos[i*3+1] = fh; pos[i*3+2] = (Math.random() - 0.5) * ft;
        } else {
          const t = (Math.random() * 2 - 1);
          pos[i*3] = t * fw; pos[i*3+1] = -fh; pos[i*3+2] = (Math.random() - 0.5) * ft;
        }
        // Add depth to frame edges
        if (Math.random() < 0.3) {
          pos[i*3+2] = ft * (Math.random() > 0.5 ? 1 : -1);
        }
      }
      break;
    }

    case 'cart': {
      // Shopping cart
      for (let i = 0; i < count; i++) {
        if (i < count * 0.15) {
          // Handle bar (top-left)
          const t = Math.random();
          pos[i*3]   = -S * 0.6 + t * S * 0.15;
          pos[i*3+1] = S * 0.1 + t * S * 0.35;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.05;
        } else if (i < count * 0.65) {
          // Basket (trapezoidal box)
          const face = i % 4;
          const t = Math.random();
          const bBottom = S * 0.25, bTop = S * 0.45;
          const bH = S * 0.4, bD = S * 0.2;
          const y2 = -S * 0.4 + t * bH;
          const wAtY = bBottom + (bTop - bBottom) * t;
          if (face === 0) { pos[i*3] = wAtY; pos[i*3+1] = y2; pos[i*3+2] = (Math.random() - 0.5) * bD; }
          else if (face === 1) { pos[i*3] = -wAtY; pos[i*3+1] = y2; pos[i*3+2] = (Math.random() - 0.5) * bD; }
          else if (face === 2) { pos[i*3] = (Math.random() * 2 - 1) * wAtY; pos[i*3+1] = y2; pos[i*3+2] = bD; }
          else { pos[i*3] = (Math.random() * 2 - 1) * wAtY; pos[i*3+1] = y2; pos[i*3+2] = -bD; }
        } else {
          // Two wheels
          const wheel = i < count * 0.825 ? -1 : 1;
          const a = Math.random() * Math.PI * 2;
          const wr = S * 0.12;
          pos[i*3]   = wheel * S * 0.25 + Math.cos(a) * wr;
          pos[i*3+1] = -S * 0.55 + Math.sin(a) * wr;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.04;
        }
      }
      break;
    }

    case 'store': {
      // Storefront — house shape with awning
      for (let i = 0; i < count; i++) {
        if (i < count * 0.5) {
          // Building body
          const face = i % 4;
          const bw3 = S * 0.5, bh3 = S * 0.4;
          if (face === 0) { pos[i*3] = bw3; pos[i*3+1] = (Math.random() * 2 - 1) * bh3 - S * 0.2; pos[i*3+2] = (Math.random() - 0.5) * S * 0.15; }
          else if (face === 1) { pos[i*3] = -bw3; pos[i*3+1] = (Math.random() * 2 - 1) * bh3 - S * 0.2; pos[i*3+2] = (Math.random() - 0.5) * S * 0.15; }
          else if (face === 2) { pos[i*3] = (Math.random() * 2 - 1) * bw3; pos[i*3+1] = bh3 - S * 0.2; pos[i*3+2] = (Math.random() - 0.5) * S * 0.15; }
          else { pos[i*3] = (Math.random() * 2 - 1) * bw3; pos[i*3+1] = -bh3 - S * 0.2; pos[i*3+2] = (Math.random() - 0.5) * S * 0.15; }
        } else if (i < count * 0.8) {
          // Awning (wavy top)
          const t = (Math.random() * 2 - 1);
          const wave = Math.sin(t * Math.PI * 3) * S * 0.06;
          pos[i*3]   = t * S * 0.55;
          pos[i*3+1] = S * 0.2 + wave + (Math.random() - 0.5) * S * 0.04;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.2;
        } else {
          // Door
          const dw3 = S * 0.12, dh3 = S * 0.25;
          pos[i*3]   = (Math.random() * 2 - 1) * dw3;
          pos[i*3+1] = -S * 0.6 + Math.random() * dh3;
          pos[i*3+2] = S * 0.15 + 0.01;
        }
      }
      break;
    }

    case 'search': {
      // Magnifying glass — circle + handle
      for (let i = 0; i < count; i++) {
        if (i < count * 0.7) {
          // Lens circle
          const a = Math.random() * Math.PI * 2;
          const rr = S * 0.45;
          const z = (Math.random() - 0.5) * S * 0.1;
          pos[i*3] = Math.cos(a) * rr - S * 0.05;
          pos[i*3+1] = Math.sin(a) * rr + S * 0.15;
          pos[i*3+2] = z;
        } else {
          // Handle
          const t = Math.random();
          pos[i*3]   = S * 0.3 + t * S * 0.35;
          pos[i*3+1] = -S * 0.2 - t * S * 0.35;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.08;
        }
      }
      break;
    }

    case 'megaphone': {
      // Megaphone/cone
      for (let i = 0; i < count; i++) {
        if (i < count * 0.8) {
          // Cone body
          const t = Math.random();
          const rr = S * 0.08 + t * S * 0.45;
          const a = Math.random() * Math.PI * 2;
          pos[i*3]   = -S * 0.5 + t * S;
          pos[i*3+1] = Math.sin(a) * rr;
          pos[i*3+2] = Math.cos(a) * rr;
        } else {
          // Handle grip at narrow end
          const t = Math.random();
          pos[i*3]   = -S * 0.55 - t * S * 0.15;
          pos[i*3+1] = (Math.random() - 0.5) * S * 0.08;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.08;
        }
      }
      break;
    }

    case 'trending': {
      // Trending up arrow — ascending zigzag line + arrow head
      for (let i = 0; i < count; i++) {
        if (i < count * 0.7) {
          // Ascending line segments
          const seg = i % 3;
          const t = Math.random();
          let x2 = 0, y2 = 0;
          if (seg === 0) { x2 = -S * 0.7 + t * S * 0.4; y2 = -S * 0.4 + t * S * 0.3; }
          else if (seg === 1) { x2 = -S * 0.3 + t * S * 0.35; y2 = -S * 0.1 - t * S * 0.15; }
          else { x2 = S * 0.05 + t * S * 0.55; y2 = -S * 0.25 + t * S * 0.7; }
          pos[i*3] = x2 + (Math.random() - 0.5) * S * 0.04;
          pos[i*3+1] = y2 + (Math.random() - 0.5) * S * 0.04;
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.08;
        } else {
          // Arrow head
          const t = Math.random();
          const ax = S * 0.6, ay = S * 0.45;
          if (i % 2 === 0) {
            pos[i*3] = ax - t * S * 0.25; pos[i*3+1] = ay + t * S * 0.1;
          } else {
            pos[i*3] = ax + t * S * 0.05; pos[i*3+1] = ay - t * S * 0.25;
          }
          pos[i*3+2] = (Math.random() - 0.5) * S * 0.06;
        }
      }
      break;
    }

    case 'pen': {
      // Pen/pencil — long thin diagonal shape
      for (let i = 0; i < count; i++) {
        const t = Math.random();
        if (i < count * 0.8) {
          // Body
          const rr = S * 0.06;
          const a = Math.random() * Math.PI * 2;
          pos[i*3]   = -S * 0.5 + t * S * 0.85 + Math.cos(a) * rr;
          pos[i*3+1] = -S * 0.5 + t * S * 0.85 + Math.sin(a) * rr;
          pos[i*3+2] = (Math.random() - 0.5) * rr;
        } else {
          // Tip (cone)
          const rr = S * 0.06 * (1 - t);
          const a = Math.random() * Math.PI * 2;
          pos[i*3]   = S * 0.35 + t * S * 0.2 + Math.cos(a) * rr;
          pos[i*3+1] = S * 0.35 + t * S * 0.2 + Math.sin(a) * rr;
          pos[i*3+2] = Math.cos(a) * rr;
        }
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
function makeGlowTex(sharp = false): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (sharp) {
    // Sharper, more defined particles — less glow bleed
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.15, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.3)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.05)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
  } else {
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

export interface ShapeSceneOptions {
  /** 'sub' = alt hizmet kartları (daha küçük parçacık, daha net) */
  mode?: 'main' | 'sub';
}

export function createShapeScene(canvas: HTMLCanvasElement, opts?: ShapeSceneOptions): ShapeSceneAPI {
  const mode = opts?.mode ?? 'main';
  const isSub = mode === 'sub';

  // Sub: çok daha fazla parçacık, aynı büyük canvas — şekil net belli olsun
  const particleCount = isSub ? 8000 : PARTICLES;

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
  const glowTex = makeGlowTex(isSub);
  const positions = generatePositions('sphere', particleCount);
  const seeds = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) seeds[i] = Math.random();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  // Sub: küçük sıkı parçacıklar, düşük glow → şekil net belli olsun
  const ptSizeBase = isSub ? 4.0 : 10.0;
  const ptSizeVar = isSub ? 0.5 : 2.5;
  const ptScale = isSub ? 1.2 : 2.2;
  const alphaBase = isSub ? 0.75 : 0.5;
  const alphaVar = isSub ? 0.2 : 0.5;
  const alphaMult = isSub ? 0.7 : 0.95;

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
        float size = ${ptSizeBase.toFixed(1)} + sin(uTime * 1.5 + aSeed * 6.28) * ${ptSizeVar.toFixed(1)};
        gl_PointSize = size * uPixelRatio * (1.0 / -mv.z) * ${ptScale.toFixed(1)};
        float mix1 = sin(position.x * 2.0 + position.y * 1.5 + position.z * 1.8 + uTime * 0.5 + aSeed * 3.14) * 0.5 + 0.5;
        vColor = mix(uColor1, uColor2, mix1);
        vAlpha = ${alphaBase.toFixed(1)} + ${alphaVar.toFixed(1)} * sin(uTime * 0.8 + aSeed * 6.28);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      uniform sampler2D uGlowTex;
      void main() {
        vec4 tex = texture2D(uGlowTex, gl_PointCoord);
        gl_FragColor = vec4(vColor, tex.a * vAlpha * ${alphaMult.toFixed(2)});
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
        targetPositions = generatePositions(pendingShape, particleCount);

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
