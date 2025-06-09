// src/lib/debug.ts
interface DebugConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  prefix: string;
}

class Debug {
  private config: DebugConfig;

  constructor(config: Partial<DebugConfig> = {}) {
    this.config = {
      enabled: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || process.env.NODE_ENV === 'development',
      level: 'debug',
      prefix: '[Tokopedia-Trends]',
      ...config,
    };
  }

  private log(level: string, message: string, data?: any) {
    if (!this.config.enabled) return;

    const timestamp = new Date().toISOString();
    const logMessage = `${this.config.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logMessage, data || '');
        break;
      case 'info':
        console.info(logMessage, data || '');
        break;
      case 'warn':
        console.warn(logMessage, data || '');
        break;
      case 'error':
        console.error(logMessage, data || '');
        break;
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  // API Call logging
  apiCall(method: string, url: string, data?: any) {
    this.debug(`API Call: ${method.toUpperCase()} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, duration: number) {
    this.debug(`API Response: ${method.toUpperCase()} ${url} - ${status} (${duration}ms)`);
  }

  apiError(method: string, url: string, error: any) {
    this.error(`API Error: ${method.toUpperCase()} ${url}`, error);
  }

  // Component lifecycle logging
  componentMount(componentName: string) {
    this.debug(`Component mounted: ${componentName}`);
  }

  componentUnmount(componentName: string) {
    this.debug(`Component unmounted: ${componentName}`);
  }

  // State changes
  stateChange(stateName: string, oldValue: any, newValue: any) {
    this.debug(`State changed: ${stateName}`, { from: oldValue, to: newValue });
  }

  // Performance monitoring
  performance(operation: string, startTime: number) {
    const duration = Date.now() - startTime;
    this.info(`Performance: ${operation} completed in ${duration}ms`);
  }
}

// Export singleton instance
export const debug = new Debug();

// Export class for custom instances
export default Debug;