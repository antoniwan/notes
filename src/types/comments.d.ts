// Remark42 Comments System Types

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
