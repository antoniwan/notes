/**
 * The diamond mark in the site logo reacts to the pointer like a small object on a spring.
 * The cursor shoves it on the way in, it fidgets while you wiggle over it, it gets tugged on
 * the way out, then it settles. Entry side and speed decide the push and the spin (torque is
 * offset from center crossed with pointer motion). Mouse and pen only; skipped under
 * prefers-reduced-motion. The frame loop runs only while the mark is still moving.
 */

export interface Spring {
  x: number;
  v: number;
}

const STIFFNESS = 170;
const DAMPING = 9;
const REST_X = 0.02;
const REST_V = 0.5;

/** One semi-implicit Euler step of a damped spring pulled toward 0. */
export function stepSpring(s: Spring, dt: number): void {
  s.v += (-STIFFNESS * s.x - DAMPING * s.v) * dt;
  s.x += s.v * dt;
}

export function atRest(s: Spring): boolean {
  return Math.abs(s.x) < REST_X && Math.abs(s.v) < REST_V;
}

const clamp = (n: number, max: number) => Math.max(-max, Math.min(max, n));

// Impulse scale per pointer event kind, and hard caps so a flung mouse stays charming.
const KICK = { enter: 1, move: 0.35, leave: 0.8 } as const;
const MAX_SHIFT_V = 60; // px/s
const MAX_SPIN_V = 900; // deg/s
const MAX_SHIFT = 3; // px
const MAX_SPIN = 40; // deg
const MAX_SQUASH = 0.18;

function attach(mark: SVGElement, signal: AbortSignal): void {
  const link = mark.closest('a');
  if (!link) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tx: Spring = { x: 0, v: 0 };
  const ty: Spring = { x: 0, v: 0 };
  const rot: Spring = { x: 0, v: 0 };
  const squash: Spring = { x: 0, v: 0 };
  const springs = [tx, ty, rot, squash];
  let frame = 0;
  let last = 0;

  const render = () => {
    tx.x = clamp(tx.x, MAX_SHIFT);
    ty.x = clamp(ty.x, MAX_SHIFT);
    rot.x = clamp(rot.x, MAX_SPIN);
    squash.x = clamp(squash.x, MAX_SQUASH);
    const s = squash.x;
    mark.style.transform = `translate(${tx.x.toFixed(2)}px, ${ty.x.toFixed(2)}px) rotate(${rot.x.toFixed(2)}deg) scale(${(1 + s).toFixed(3)}, ${(1 - s).toFixed(3)})`;
  };

  const tick = (now: number) => {
    // Fixed small steps keep the spring stable even after a dropped frame.
    let elapsed = Math.min((now - last) / 1000, 0.05);
    last = now;
    while (elapsed > 0) {
      const dt = Math.min(elapsed, 1 / 120);
      springs.forEach((s) => stepSpring(s, dt));
      elapsed -= dt;
    }
    if (springs.every(atRest)) {
      frame = 0;
      mark.style.transform = '';
      mark.style.willChange = '';
      return;
    }
    render();
    frame = requestAnimationFrame(tick);
  };

  const kick = (event: PointerEvent, kind: keyof typeof KICK) => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    const box = mark.getBoundingClientRect();
    const half = Math.max(box.width, 1) / 2;
    // Where the pointer is relative to the center, in half-widths (-1..1 on the mark).
    const ox = clamp((event.clientX - (box.left + half)) / half, 1.5);
    const oy = clamp((event.clientY - (box.top + box.height / 2)) / half, 1.5);
    let mx = event.movementX || 0;
    let my = event.movementY || 0;
    // Some browsers report no movement on enter/leave: push in from the side it came from.
    if (!mx && !my && kind !== 'move') {
      const sign = kind === 'enter' ? -1 : 1;
      mx = sign * ox * 6;
      my = sign * oy * 6;
    }
    const k = KICK[kind];
    tx.v = clamp(tx.v + mx * 4 * k, MAX_SHIFT_V);
    ty.v = clamp(ty.v + my * 4 * k, MAX_SHIFT_V);
    const speed = Math.hypot(mx, my);
    // Torque from an off-center push, plus a little spin even on a dead-center hit.
    const torque = ox * my - oy * mx;
    const spin = torque * 40 + Math.sign(torque || Math.random() - 0.5) * speed * 12;
    rot.v = clamp(rot.v + spin * k, MAX_SPIN_V);
    if (kind !== 'move') squash.v += clamp(speed / 25, 1) * 3 * k;
    if (!frame) {
      mark.style.willChange = 'transform';
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  const opts = { passive: true, signal };
  link.addEventListener('pointerenter', (e) => kick(e, 'enter'), opts);
  link.addEventListener('pointermove', (e) => kick(e, 'move'), opts);
  link.addEventListener('pointerleave', (e) => kick(e, 'leave'), opts);
  reduced.addEventListener(
    'change',
    () => {
      if (!reduced.matches) return;
      cancelAnimationFrame(frame);
      frame = 0;
      springs.forEach((s) => ((s.x = 0), (s.v = 0)));
      mark.style.transform = '';
    },
    { signal },
  );
  signal.addEventListener('abort', () => cancelAnimationFrame(frame));
}

let controller: AbortController | undefined;

export function initLogoJiggle(): void {
  controller?.abort();
  controller = new AbortController();
  for (const mark of document.querySelectorAll<SVGElement>('[data-logo-mark]')) {
    attach(mark, controller.signal);
  }
}
