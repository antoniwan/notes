/// <reference types="astro/client" />

import type { JSX as AstroJSX } from 'astro/jsx';

declare global {
  namespace JSX {
    interface IntrinsicElements extends AstroJSX.IntrinsicElements {}
  }
}

export {};
