import type { APIRoute } from 'astro';
import type { Quote, QuoteKind } from '../../data/quotes';

/** Always run on-demand so ?kind= is honored (never a single baked JSON for all variants). */
export const prerender = false;
import {
  quotesData,
  getQuoteKind,
  getQuoteSourceUrl,
  getQuoteCountsByKind,
  pickRandomQuoteWithMeta,
} from '../../data/quotes';

const KIND_VALUES = new Set<QuoteKind>(['stoic', 'philosophical', 'site']);

function parseKindParam(raw: string | null): QuoteKind | undefined {
  if (!raw) return undefined;
  const k = raw.trim().toLowerCase();
  return KIND_VALUES.has(k as QuoteKind) ? (k as QuoteKind) : undefined;
}

/** Prefer the incoming HTTP URL (includes query); some runtimes omit search on Astro.url alone. */
function getKindSearchParam(request: Request, contextUrl?: URL): string | null {
  try {
    const fromReq = new URL(request.url).searchParams.get('kind');
    if (fromReq != null && fromReq !== '') return fromReq;
  } catch {
    // request.url invalid for new URL(...)
  }
  try {
    if (contextUrl) {
      const fallback = contextUrl.searchParams.get('kind');
      if (fallback != null && fallback !== '') return fallback;
    }
  } catch {
    //
  }
  return null;
}

function serializeQuote(quote: Quote) {
  const kind = getQuoteKind(quote);
  const sourceUrl = getQuoteSourceUrl(quote);
  return {
    ...quote,
    kind,
    sourceUrl,
  };
}

// GET /api/quotes — random quote; optional ?kind=stoic|philosophical|site
export const GET: APIRoute = async ({ request, url }) => {
  try {
    const kindFilter = parseKindParam(getKindSearchParam(request, url));
    const { quote, poolUsed, usedFallbackToFullPool } = pickRandomQuoteWithMeta(kindFilter);
    const counts = getQuoteCountsByKind();

    const response = {
      quote: serializeQuote(quote),
      metadata: {
        totalQuotes: quotesData.quotes.length,
        version: quotesData.metadata.version,
        lastUpdated: quotesData.metadata.lastUpdated,
        description:
          'Random quote: classical Stoicism, other philosophy, or a line from a post on this site.',
        countsByKind: counts,
        kindRequested: kindFilter ?? null,
        selectionPoolSize: poolUsed.length,
        usedFallbackToFullPool: usedFallbackToFullPool,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Random + query-dependent; never share one cached variant for all URLs.
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      },
    );
  }
};
