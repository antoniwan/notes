const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4321/brain-science/insights', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const p = document.querySelector('#vuln-bar > p');
    if (!p) return { err: 'no p' };
    const cs = getComputedStyle(p);
    const rect = p.getBoundingClientRect();
    const parent = p.parentElement;
    const pcs = parent ? getComputedStyle(parent) : null;
    return {
      text: p.textContent.slice(0, 80),
      width: rect.width,
      height: rect.height,
      display: cs.display,
      maxWidth: cs.maxWidth,
      widthCss: cs.width,
      float: cs.float,
      writingMode: cs.writingMode,
      whiteSpace: cs.whiteSpace,
      wordBreak: cs.wordBreak,
      parentDisplay: pcs?.display,
      parentWidth: parent?.getBoundingClientRect().width,
      parentClass: parent?.className,
      canvasWidths: [...document.querySelectorAll('canvas')].slice(0,3).map(c => ({id:c.id, w:c.width, cw:c.clientWidth, style:c.getAttribute('style')})),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
