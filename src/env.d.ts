/// <reference types="astro/client" />

declare global {
  interface Window {
    ReadStateService?: {
      getInstance: () => {
        getReadData: (postSlug: string) => { readAt: string; postSlug: string } | null;
        subscribe: (callback: (postSlug: string | null, isRead: boolean, readData: unknown) => void) => () => void;
        subscribeToAll: (callback: () => void) => () => void;
      };
    };
  }
}

export {};
