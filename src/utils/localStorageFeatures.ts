// Clever local storage features for the blog
import { STORAGE_KEYS, dispatchClearEvents, isReadPostsKey } from '../config/storage.js';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  readingMode: 'normal' | 'focus' | 'speed';
  autoSaveProgress: boolean;
  showReadingStats: boolean;
}

export interface SessionData {
  lastVisited: string;
  visitCount: number;
  totalTimeOnSite: number;
  favoriteCategories: string[];
  searchHistory: string[];
  readingStreak: number;
  lastReadDate: string;
}

export interface ReadingAnalytics {
  totalPostsRead: number;
  averageReadingTime: number;
  mostReadCategory: string;
  readingStreak: number;
  totalTimeSpent: number;
  devicePreference: 'mobile' | 'desktop' | 'tablet';
  timeOfDayPreference: 'morning' | 'afternoon' | 'evening' | 'night';
  lastReadDate: string;
}

class LocalStorageManager {
  private readonly PREFERENCES_KEY = STORAGE_KEYS.PREFERENCES;
  private readonly SESSION_KEY = STORAGE_KEYS.SESSION;
  private readonly ANALYTICS_KEY = STORAGE_KEYS.ANALYTICS;
  private readonly SEARCH_HISTORY_KEY = STORAGE_KEYS.SEARCH_HISTORY;
  private readonly BOOKMARKED_POSTS_KEY = STORAGE_KEYS.BOOKMARKED_POSTS;
  private readonly READING_GOALS_KEY = STORAGE_KEYS.READING_GOALS;
  private readonly READ_POSTS_KEY = STORAGE_KEYS.READ_POSTS;
  private readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

  constructor() {
    this.migrateDataIfNeeded();
  }

  // Storage management methods
  private getStorageUsage(): number {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('blog-')) {
        totalSize += localStorage.getItem(key)?.length || 0;
      }
    }
    return totalSize;
  }

  private handleStorageQuotaExceeded(): void {
    this.pruneOldData();

    // If still over quota, remove oldest read posts
    if (this.getStorageUsage() > this.MAX_STORAGE_SIZE) {
      this.pruneReadPosts();
    }
  }

  private pruneOldData(): void {
    // Remove old version read posts
    const oldKeys = [];
    for (let key in localStorage) {
      if (
        (key.startsWith('blog-read-posts') || isReadPostsKey(key)) &&
        key !== this.READ_POSTS_KEY
      ) {
        oldKeys.push(key);
      }
    }
    oldKeys.forEach((key) => localStorage.removeItem(key));
  }

  private pruneReadPosts(): void {
    try {
      const readPosts = this.getReadPostsRaw();
      if (readPosts.length > 100) {
        // Keep only the 50 most recent posts
        const pruned = readPosts
          .sort((a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime())
          .slice(0, 50);

        localStorage.setItem(this.READ_POSTS_KEY, JSON.stringify(pruned));
      }
    } catch (error) {
      // Failed to prune read posts
    }
  }

  private migrateDataIfNeeded(): void {
    // Check for old version read posts and migrate
    const oldReadPosts = localStorage.getItem(STORAGE_KEYS.READ_POSTS_LEGACY);
    if (oldReadPosts && !localStorage.getItem(this.READ_POSTS_KEY)) {
      try {
        localStorage.setItem(this.READ_POSTS_KEY, oldReadPosts);
        localStorage.removeItem(STORAGE_KEYS.READ_POSTS_LEGACY);
      } catch (error) {
        // Failed to migrate read posts
      }
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    try {
      const dataSize = value.length;
      if (this.getStorageUsage() + dataSize > this.MAX_STORAGE_SIZE) {
        this.handleStorageQuotaExceeded();
      }

      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.handleStorageQuotaExceeded();
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (retryError) {
          return false;
        }
      }
      // Failed to save data
      return false;
    }
  }

  // Read posts management with versioning
  getReadPostsRaw(): any[] {
    try {
      const stored = localStorage.getItem(this.READ_POSTS_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => {
        if (!item || typeof item !== 'object') return false;

        const hasValidSlug = typeof item.postSlug === 'string' && item.postSlug.trim().length > 0;
        const hasValidDate = typeof item.readAt === 'string' && !isNaN(Date.parse(item.readAt));

        if (!hasValidSlug || !hasValidDate) {
          return false;
        }

        return true;
      });
    } catch (error) {
      return [];
    }
  }

  updateReadPosts(readPosts: any[]): boolean {
    try {
      return this.safeSetItem(this.READ_POSTS_KEY, JSON.stringify(readPosts));
    } catch (error) {
      return false;
    }
  }

  // User Preferences
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (!stored) return this.getDefaultPreferences();

      const parsed = JSON.parse(stored);

      // Validate data structure
      if (!parsed || typeof parsed !== 'object') {
        return this.getDefaultPreferences();
      }

      // Merge with defaults to ensure all required fields exist
      const defaults = this.getDefaultPreferences();
      return {
        theme: ['light', 'dark', 'auto'].includes(parsed.theme) ? parsed.theme : defaults.theme,
        fontSize: ['small', 'medium', 'large'].includes(parsed.fontSize)
          ? parsed.fontSize
          : defaults.fontSize,
        readingMode: ['normal', 'focus', 'speed'].includes(parsed.readingMode)
          ? parsed.readingMode
          : defaults.readingMode,
        autoSaveProgress:
          typeof parsed.autoSaveProgress === 'boolean'
            ? parsed.autoSaveProgress
            : defaults.autoSaveProgress,
        showReadingStats:
          typeof parsed.showReadingStats === 'boolean'
            ? parsed.showReadingStats
            : defaults.showReadingStats,
      };
    } catch (error) {
      return this.getDefaultPreferences();
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      this.safeSetItem(this.PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      // Failed to save preferences
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      fontSize: 'medium',
      readingMode: 'normal',
      autoSaveProgress: true,
      showReadingStats: true,
    };
  }

  // Session Data
  getSessionData(): SessionData {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultSessionData();
    } catch {
      return this.getDefaultSessionData();
    }
  }

  updateSessionData(updates: Partial<SessionData>): void {
    try {
      const current = this.getSessionData();
      const updated = { ...current, ...updates };
      this.safeSetItem(this.SESSION_KEY, JSON.stringify(updated));
    } catch (error) {
      // Failed to update session data
    }
  }

  private getDefaultSessionData(): SessionData {
    return {
      lastVisited: new Date().toISOString(),
      visitCount: 0,
      totalTimeOnSite: 0,
      favoriteCategories: [],
      searchHistory: [],
      readingStreak: 0,
      lastReadDate: '',
    };
  }

  // Search History
  addToSearchHistory(query: string): void {
    try {
      const history = this.getSearchHistory();
      const filtered = history.filter((item) => item !== query);
      const updated = [query, ...filtered].slice(0, 10); // Keep last 10 searches
      this.safeSetItem(this.SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      // Failed to save search history
    }
  }

  getSearchHistory(): string[] {
    try {
      const stored = localStorage.getItem(this.SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Bookmarked Posts
  toggleBookmark(postSlug: string): boolean {
    try {
      const bookmarks = this.getBookmarkedPosts();
      const isBookmarked = bookmarks.includes(postSlug);

      if (isBookmarked) {
        const updated = bookmarks.filter((slug) => slug !== postSlug);
        this.safeSetItem(this.BOOKMARKED_POSTS_KEY, JSON.stringify(updated));
        return false;
      } else {
        const updated = [...bookmarks, postSlug];
        this.safeSetItem(this.BOOKMARKED_POSTS_KEY, JSON.stringify(updated));
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  getBookmarkedPosts(): string[] {
    try {
      const stored = localStorage.getItem(this.BOOKMARKED_POSTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  isBookmarked(postSlug: string): boolean {
    return this.getBookmarkedPosts().includes(postSlug);
  }

  // Reading Goals
  setReadingGoal(goal: { postsPerWeek: number; minutesPerDay: number }): void {
    try {
      this.safeSetItem(this.READING_GOALS_KEY, JSON.stringify(goal));
    } catch (error) {
      // Failed to save reading goal
    }
  }

  getReadingGoal(): { postsPerWeek: number; minutesPerDay: number } {
    try {
      const stored = localStorage.getItem(this.READING_GOALS_KEY);
      return stored ? JSON.parse(stored) : { postsPerWeek: 3, minutesPerDay: 15 };
    } catch {
      return { postsPerWeek: 3, minutesPerDay: 15 };
    }
  }

  // Analytics
  updateAnalytics(readData: any): void {
    try {
      const analytics = this.getAnalytics();
      const timeOfDay = this.getTimeOfDay();
      const deviceType = this.getDeviceType();

      analytics.totalPostsRead++;
      analytics.totalTimeSpent += readData.readTime || 0;
      analytics.averageReadingTime = Math.round(
        analytics.totalTimeSpent / analytics.totalPostsRead,
      );
      analytics.devicePreference = deviceType;
      analytics.timeOfDayPreference = timeOfDay;

      // Update reading streak
      const today = new Date().toDateString();
      const lastRead = new Date(readData.readAt).toDateString();

      if (lastRead === today) {
        analytics.readingStreak++;
      } else if (this.isConsecutiveDay(lastRead, analytics.lastReadDate)) {
        analytics.readingStreak++;
      } else {
        analytics.readingStreak = 1;
      }

      analytics.lastReadDate = today;

      this.safeSetItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      // Failed to update analytics
    }
  }

  getAnalytics(): ReadingAnalytics {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultAnalytics();
    } catch {
      return this.getDefaultAnalytics();
    }
  }

  private getDefaultAnalytics(): ReadingAnalytics {
    return {
      totalPostsRead: 0,
      averageReadingTime: 0,
      mostReadCategory: '',
      readingStreak: 0,
      totalTimeSpent: 0,
      devicePreference: 'desktop',
      timeOfDayPreference: 'afternoon',
      lastReadDate: '',
    };
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private isConsecutiveDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  // Utility methods
  clearAllData(): void {
    try {
      localStorage.removeItem(this.PREFERENCES_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.ANALYTICS_KEY);
      localStorage.removeItem(this.SEARCH_HISTORY_KEY);
      localStorage.removeItem(this.BOOKMARKED_POSTS_KEY);
      localStorage.removeItem(this.READING_GOALS_KEY);
      localStorage.removeItem(this.READ_POSTS_KEY);

      // Also remove old version read posts
      localStorage.removeItem(STORAGE_KEYS.READ_POSTS_LEGACY);

      // Dispatch events for immediate UI reactivity
      dispatchClearEvents('all-cleared');
    } catch (error) {
      // Failed to clear data
    }
  }

  clearReadPosts(): void {
    try {
      localStorage.removeItem(this.READ_POSTS_KEY);
      localStorage.removeItem(STORAGE_KEYS.READ_POSTS_LEGACY);

      // Dispatch events for immediate UI reactivity
      dispatchClearEvents('posts-cleared');
    } catch (error) {
      // Failed to clear read posts
    }
  }

  exportData(): string {
    try {
      // Safely parse read posts with validation
      const readPosts = this.getReadPostsRaw();

      const data = {
        preferences: this.getPreferences(),
        session: this.getSessionData(),
        analytics: this.getAnalytics(),
        searchHistory: this.getSearchHistory(),
        bookmarks: this.getBookmarkedPosts(),
        readingGoal: this.getReadingGoal(),
        readPosts: readPosts,
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return '';
    }
  }
}

export const localStorageManager = new LocalStorageManager();
