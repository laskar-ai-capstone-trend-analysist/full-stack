// src/lib/performance.ts
import { debug } from './debug';

interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private entries: Map<string, PerformanceEntry> = new Map();
  private completedEntries: PerformanceEntry[] = [];
  private maxEntries: number = 1000;

  // Start timing an operation
  start(name: string, metadata?: Record<string, any>): void {
    const entry: PerformanceEntry = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.entries.set(name, entry);
    debug.debug(`Performance tracking started: ${name}`, metadata);
  }

  // End timing an operation
  end(name: string): number | null {
    const entry = this.entries.get(name);
    
    if (!entry) {
      debug.warn(`Performance tracking not found: ${name}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - entry.startTime;

    const completedEntry: PerformanceEntry = {
      ...entry,
      endTime,
      duration,
    };

    // Move to completed entries
    this.completedEntries.unshift(completedEntry);
    this.entries.delete(name);

    // Keep only the latest entries
    if (this.completedEntries.length > this.maxEntries) {
      this.completedEntries = this.completedEntries.slice(0, this.maxEntries);
    }

    debug.performance(name, entry.startTime);

    // Log slow operations
    if (duration > 1000) { // More than 1 second
      debug.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Measure a function execution
  measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  // Measure an async function execution
  async measureAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  // Get performance stats
  getStats(filter?: { name?: string; minDuration?: number }): {
    total: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    entries: PerformanceEntry[];
  } {
    let filteredEntries = this.completedEntries.filter(entry => entry.duration !== undefined);

    if (filter?.name) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.name.includes(filter.name!)
      );
    }

    if (filter?.minDuration) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.duration! >= filter.minDuration!
      );
    }

    if (filteredEntries.length === 0) {
      return {
        total: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        entries: [],
      };
    }

    const durations = filteredEntries.map(entry => entry.duration!);
    const total = durations.length;
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / total;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    return {
      total,
      avgDuration,
      minDuration,
      maxDuration,
      entries: filteredEntries,
    };
  }

  // Clear performance data
  clear(): void {
    this.entries.clear();
    this.completedEntries = [];
    debug.info('Performance data cleared');
  }

  // Export performance data
  export(): string {
    return JSON.stringify({
      activeEntries: Array.from(this.entries.values()),
      completedEntries: this.completedEntries,
    }, null, 2);
  }

  // Monitor Core Web Vitals
  monitorWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Monitor LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          debug.info(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            debug.info(`FID: ${entry.processingStart - entry.startTime}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              debug.info(`CLS: ${entry.value}`);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        debug.error('Error setting up performance observers', error);
      }
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export class for custom instances
export default PerformanceMonitor;