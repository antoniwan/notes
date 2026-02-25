// Remark42 Comments System Types

export interface CommentsConfig {
  host: string;
  siteId: string;
  lang?: string;
  components?: readonly string[];
}

export interface CommentsProps {
  pageId?: string;
  theme?: 'light' | 'dark';
}

// Augment Window for Remark42 globals
declare global {
  interface Window {
    REMARK42?: {
      changeTheme: (theme: 'dark' | 'light') => void;
      destroy: () => void;
      createInstance: (config: Record<string, unknown>) => void;
    };
    remark_config?: Record<string, unknown>;
  }
}
