/**
 * Poem pages only: a quiet pond behind the verse. Two layers, both decorative.
 * - Pond: the pointer leaves faint rings; a tap drops a bigger one; idle drops fall now and then.
 * - Tide: a soft color wash drifts behind the text on a slow, non-repeating hue path.
 * The text itself is never touched (Lantern is CSS only, in global.css). Skipped under
 * prefers-reduced-motion.
 */

const LIGHT_WASH = 0.09;
const DARK_WASH = 0.1;

export function initPoemAmbience(): void {
  const poem = document.querySelector<HTMLElement>('.a-poem');
  if (!poem || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tide = document.createElement('div');
  tide.className = 'poem-tide';
  const canvas = document.createElement('canvas');
  canvas.className = 'poem-pond';
  for (const el of [tide, canvas]) {
    el.setAttribute('aria-hidden', 'true');
    document.body.prepend(el);
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Sum of sines with unrelated periods and random phases: smooth, and it never visibly repeats.
  const phase = [0, 0, 0, 0].map(() => Math.random() * Math.PI * 2);
  const wander = (t: number, o: number) =>
    210 +
    70 * Math.sin(t / 47000 + phase[0] + o * 0.9) +
    55 * Math.sin(t / 113000 + phase[1] + o * 0.37) +
    40 * Math.sin(t / 271000 + phase[2]) +
    25 * Math.sin(t / 19000 + phase[3] + o * 1.7);
  const isDark = () => document.documentElement.classList.contains('dark');

  let width = 0;
  let height = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  type Ring = { x: number; y: number; r: number; max: number; s: number };
  const rings: Ring[] = [];
  const drop = (x: number, y: number, s: number) => {
    rings.push({ x, y, r: 2, max: 60 + s * 120, s });
    if (rings.length > 40) rings.shift();
  };

  let lastX = -999;
  let lastY = -999;
  let lastAt = 0;
  let idleSince = performance.now();
  addEventListener('pointermove', (e) => {
    const now = performance.now();
    idleSince = now;
    if (Math.hypot(e.clientX - lastX, e.clientY - lastY) > 46 && now - lastAt > 90) {
      drop(e.clientX, e.clientY, 0.35);
      lastX = e.clientX;
      lastY = e.clientY;
      lastAt = now;
    }
  });
  addEventListener('pointerdown', (e) => {
    if (!(e.target as Element).closest('a, button, input, textarea, select'))
      drop(e.clientX, e.clientY, 1);
  });

  let nextAmbient = performance.now() + 2500;
  let lastDrift = 0;
  const frame = (t: number) => {
    const wash = isDark() ? DARK_WASH : LIGHT_WASH;
    const hue = ((wander(t, 0) % 360) + 360) % 360;

    ctx.clearRect(0, 0, width, height);
    if (t > nextAmbient && t - idleSince > 3000) {
      drop(width * (0.15 + Math.random() * 0.7), height * (0.2 + Math.random() * 0.6), 0.6);
      nextAmbient = t + 4000 + Math.random() * 4000;
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.r += 0.9 + ring.s * 1.1;
      const life = 1 - ring.r / ring.max;
      if (life <= 0) {
        rings.splice(i, 1);
        continue;
      }
      for (let k = 0; k < 3; k++) {
        const rr = ring.r - k * 11;
        if (rr <= 0) continue;
        const alpha = life * life * (0.48 - k * 0.13) * (0.6 + ring.s * 0.4);
        ctx.strokeStyle = `hsla(${(hue + k * 25) % 360}, 60%, 55%, ${alpha})`;
        ctx.lineWidth = 1.4 - k * 0.3;
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, rr, rr * 0.92, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (t - lastDrift > 120) {
      lastDrift = t;
      tide.style.background =
        `radial-gradient(60% 50% at 30% 35%, hsla(${hue}, 70%, 60%, ${wash}), transparent 70%), ` +
        `radial-gradient(55% 45% at 72% 70%, hsla(${(hue + 60) % 360}, 70%, 60%, ${wash}), transparent 70%)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
