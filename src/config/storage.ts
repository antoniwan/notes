/**
 * Centralized storage configuration and constants
 *
 * This file contains all localStorage keys, event names, and timing constants
 * used throughout the reading progress system to ensure consistency.
 */

// Storage version for schema management
export const STORAGE_VERSION = '1.0';

// Storage keys (reading progress only — keep the surface small and private)
export const STORAGE_KEYS = {
  READ_POSTS: `blog-read-posts-v${STORAGE_VERSION}`,
  READ_POSTS_LEGACY: 'blog-read-posts', // For backwards compatibility
} as const;

// Event names for cross-component communication
export const STORAGE_EVENTS = {
  POST_READ: 'post-read',
  READ_POSTS_CLEARED: 'read-posts-cleared',
  READING_DATA_UPDATED: 'reading-data-updated',
} as const;

// Timing constants (in milliseconds)
export const TIMING = {
  CROSS_TAB_UPDATE_DELAY: 100, // Delay for cross-tab storage events
  SAME_TAB_UPDATE_DELAY: 50, // Delay for same-tab immediate updates
  LEGACY_EVENT_DELAY: 100, // Delay for legacy event handlers
} as const;
