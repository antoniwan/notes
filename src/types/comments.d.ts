// Remark42 Comments System Types
// Theme sync contract: Comments listens for THEME_CHANGE_EVENT on window; theme state from document.documentElement.classList.contains('dark'). See utils/themeEvents.ts.

export interface CommentsConfig {
  host: string;
  siteId: string;
  lang?: string;
  components?: readonly string[];
}

// Remark42 instance returned by createInstance (has destroy method)
export interface Remark42Instance {
  destroy: () => void;
}

// Augment Window for Remark42 globals
declare global {
  interface Window {
    REMARK42?: {
      changeTheme: (theme: 'dark' | 'light') => void;
      destroy: () => void;
      createInstance: (config: Record<string, unknown>) => Remark42Instance;
    };
    remark_config?: Record<string, unknown>;
  }
}
