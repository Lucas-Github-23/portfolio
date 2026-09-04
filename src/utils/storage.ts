/**
 * Safe local storage utility with defensive error handling for
 * sandboxed environments, restricted iframes (e.g. Vercel dashboard preview),
 * and private browsing modes where accessing localStorage throws SecurityError.
 */

export function safeGetItem(key: string, defaultValue: string = ""): string {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    }
  } catch {
    // Silently fall back to default when localStorage is blocked
  }
  return defaultValue;
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Silently ignore storage quota or access denial errors
  }
}
