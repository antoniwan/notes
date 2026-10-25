import { describe, expect, it } from 'vitest';
import { atRest, stepSpring, type Spring } from './logoJiggle.client';

const settle = (s: Spring, seconds: number) => {
  for (let t = 0; t < seconds; t += 1 / 120) stepSpring(s, 1 / 120);
};

describe('logo jiggle spring', () => {
  it('overshoots then settles after a hard shove', () => {
    const s: Spring = { x: 0, v: 900 };
    let minX = 0;
    for (let t = 0; t < 0.6; t += 1 / 120) {
      stepSpring(s, 1 / 120);
      minX = Math.min(minX, s.x);
    }
    expect(minX).toBeLessThan(0);
    settle(s, 1.5);
    expect(atRest(s)).toBe(true);
  });

  it('stays at rest when untouched', () => {
    const s: Spring = { x: 0, v: 0 };
    settle(s, 1);
    expect(s).toEqual({ x: 0, v: 0 });
  });
});
