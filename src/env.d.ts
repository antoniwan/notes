/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly LETTERBOXD_PROFILE_URL?: string;
  readonly LETTERBOXD_RSS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    ReadStateService?: {
      getInstance: () => {
        getReadData: (postSlug: string) => { readAt: string; postSlug: string } | null;
        subscribe: (
          callback: (postSlug: string | null, isRead: boolean, readData: unknown) => void,
        ) => () => void;
        subscribeToAll: (callback: () => void) => () => void;
      };
    };
  }
}

export {};
