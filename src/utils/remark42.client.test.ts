import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildRemark42Config,
  createRemark42Instance,
  isRemark42FrameReady,
  loadRemark42Script,
  waitForRemark42Frame,
} from './remark42.client';

const host = 'https://comments.example.com/api/remark42';
const config = () =>
  buildRemark42Config(host, 'writing', 'https://example.com/p/test', 'es', 'dark');

class ScriptStub extends EventTarget {
  src = '';
  async = false;
  defer = false;
  remove = vi.fn(() => {
    scripts = scripts.filter((script) => script !== this);
  });
}

let scripts: ScriptStub[];
let browser: EventTarget & {
  REMARK42?: Window['REMARK42'];
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
};
let append: ReturnType<typeof vi.fn>;

function api() {
  return {
    createInstance: vi.fn(() => ({ destroy: vi.fn() })),
    destroy: vi.fn(),
    changeTheme: vi.fn(),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  scripts = [];
  browser = Object.assign(new EventTarget(), { setTimeout, clearTimeout });
  append = vi.fn((script: ScriptStub) => scripts.push(script));
  vi.stubGlobal('window', browser);
  vi.stubGlobal('document', {
    get scripts() {
      return scripts;
    },
    createElement: () => new ScriptStub(),
    head: { appendChild: append },
    documentElement: { classList: { contains: () => false } },
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Remark42 configuration and lifecycle', () => {
  it('keeps the canonical thread and uses the supported Spanish locale option', () => {
    expect(config()).toEqual({
      host,
      site_id: 'writing',
      url: 'https://example.com/p/test',
      locale: 'es',
      theme: 'dark',
      components: ['embed'],
      no_footer: true,
    });
    expect(buildRemark42Config(host, 'writing', '/p/test', 'en', 'light').locale).toBe('en');
  });

  it('reuses an API that is already available without fetching another script', async () => {
    browser.REMARK42 = api();
    await loadRemark42Script(config());
    expect(append).not.toHaveBeenCalled();
  });

  it('waits for the API rather than treating script download as readiness', async () => {
    const complete = vi.fn();
    const pending = loadRemark42Script(config()).then(complete);
    scripts[0].dispatchEvent(new Event('load'));
    await Promise.resolve();
    expect(complete).not.toHaveBeenCalled();
    browser.REMARK42 = api();
    browser.dispatchEvent(new Event('REMARK42::ready'));
    await pending;
    expect(complete).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('removes a failed script so a retry can request it again', async () => {
    const failure = expect(loadRemark42Script(config())).rejects.toThrow('could not be loaded');
    scripts[0].dispatchEvent(new Event('error'));
    await failure;
    expect(scripts).toHaveLength(0);
    const retry = loadRemark42Script(config());
    expect(append).toHaveBeenCalledTimes(2);
    browser.REMARK42 = api();
    scripts[0].dispatchEvent(new Event('load'));
    await retry;
  });

  it('bounds startup and reuses a slow request during retry to avoid duplicate bootstraps', async () => {
    const failure = expect(loadRemark42Script(config(), { timeoutMs: 100 })).rejects.toThrow(
      'in time',
    );
    await vi.advanceTimersByTimeAsync(100);
    await failure;
    const retry = loadRemark42Script(config());
    expect(append).toHaveBeenCalledOnce();
    browser.REMARK42 = api();
    browser.dispatchEvent(new Event('REMARK42::ready'));
    await retry;
  });

  it('cancels pending startup on navigation and removes its timer', async () => {
    const controller = new AbortController();
    const failure = expect(
      loadRemark42Script(config(), { signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await failure;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('allows a fresh request if the network fails after the startup timeout', async () => {
    const failure = expect(loadRemark42Script(config(), { timeoutMs: 100 })).rejects.toThrow(
      'in time',
    );
    await vi.advanceTimersByTimeAsync(100);
    await failure;
    scripts[0].dispatchEvent(new Event('error'));
    expect(scripts).toHaveLength(0);
    const retry = loadRemark42Script(config());
    expect(append).toHaveBeenCalledTimes(2);
    browser.REMARK42 = api();
    browser.dispatchEvent(new Event('REMARK42::ready'));
    await retry;
  });

  it('destroys the bootstrap instance before mounting one instance on the current node', () => {
    const embed = api();
    browser.REMARK42 = embed;
    const node = { replaceChildren: vi.fn() } as unknown as HTMLElement;
    createRemark42Instance(node, host, 'writing', '/p/test', 'es');
    expect(embed.destroy).toHaveBeenCalledOnce();
    expect(node.replaceChildren).toHaveBeenCalledOnce();
    expect(embed.createInstance).toHaveBeenCalledOnce();
    expect(embed.createInstance).toHaveBeenCalledWith(
      expect.objectContaining({ node, locale: 'es', url: '/p/test' }),
    );
  });
});

describe('Remark42 frame readiness', () => {
  const frame = {} as Window;
  const message = { origin: 'https://comments.example.com', source: frame, data: { inited: true } };

  it('accepts initialization only from the mounted frame and configured origin', () => {
    expect(isRemark42FrameReady(message, host, frame)).toBe(true);
    expect(
      isRemark42FrameReady({ ...message, origin: 'https://other.example.com' }, host, frame),
    ).toBe(false);
    expect(isRemark42FrameReady({ ...message, source: {} as Window }, host, frame)).toBe(false);
    expect(isRemark42FrameReady(message, host, null)).toBe(false);
  });

  it('does not confuse height updates or malformed messages with initialization', () => {
    for (const data of [null, [], 'ready', { height: 300 }, { inited: false }]) {
      expect(isRemark42FrameReady({ ...message, data }, host, frame)).toBe(false);
    }
  });

  it('does not report a mounted iframe as a ready comment box', async () => {
    const node = { querySelector: () => ({ contentWindow: frame }) } as unknown as HTMLElement;
    const failure = expect(waitForRemark42Frame(node, host, { timeoutMs: 100 })).rejects.toThrow(
      'initialize in time',
    );
    await vi.advanceTimersByTimeAsync(100);
    await failure;
  });

  it('finishes on the frame initialization message and clears the timeout', async () => {
    const node = { querySelector: () => ({ contentWindow: frame }) } as unknown as HTMLElement;
    const pending = waitForRemark42Frame(node, host);
    const event = Object.assign(new Event('message'), message);
    browser.dispatchEvent(event);
    await pending;
    expect(vi.getTimerCount()).toBe(0);
  });
});
