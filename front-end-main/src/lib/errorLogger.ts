// src/lib/errorLogger.ts
import { debug } from './debug';

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'api' | 'component' | 'navigation' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

class ErrorLogger {
  private errors: ErrorLog[] = [];
  private maxErrors: number = 100;

  constructor() {
    // Listen for unhandled errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleGlobalError(event: ErrorEvent) {
    this.logError({
      type: 'unknown',
      severity: 'high',
      message: event.message,
      stack: event.error?.stack,
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.logError({
      type: 'unknown',
      severity: 'high',
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      additionalData: {
        reason: event.reason,
      },
    });
  }

  logError(error: Partial<ErrorLog>): string {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: error.type || 'unknown',
      severity: error.severity || 'medium',
      message: error.message || 'Unknown error',
      stack: error.stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: error.userId,
      additionalData: error.additionalData,
    };

    // Add to internal storage
    this.errors.unshift(errorLog);

    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    debug.error(`Error logged: ${errorLog.message}`, errorLog);

    // In production, you might want to send to an external service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorLog);
    }

    return errorLog.id;
  }

  // API specific error logging
  logApiError(method: string, url: string, status?: number, message?: string, additionalData?: any): string {
    return this.logError({
      type: 'api',
      severity: status && status >= 500 ? 'high' : 'medium',
      message: `API Error: ${method.toUpperCase()} ${url} - ${message || 'Unknown API error'}`,
      additionalData: {
        method,
        url,
        status,
        ...additionalData,
      },
    });
  }

  // Component specific error logging
  logComponentError(componentName: string, message: string, error?: Error): string {
    return this.logError({
      type: 'component',
      severity: 'medium',
      message: `Component Error in ${componentName}: ${message}`,
      stack: error?.stack,
      additionalData: {
        componentName,
        errorName: error?.name,
        errorMessage: error?.message,
      },
    });
  }

  // Navigation error logging
  logNavigationError(route: string, message: string): string {
    return this.logError({
      type: 'navigation',
      severity: 'low',
      message: `Navigation Error: ${route} - ${message}`,
      additionalData: {
        route,
      },
    });
  }

  // Get errors for debugging
  getErrors(filter?: { type?: string; severity?: string; limit?: number }): ErrorLog[] {
    let filteredErrors = this.errors;

    if (filter?.type) {
      filteredErrors = filteredErrors.filter(error => error.type === filter.type);
    }

    if (filter?.severity) {
      filteredErrors = filteredErrors.filter(error => error.severity === filter.severity);
    }

    if (filter?.limit) {
      filteredErrors = filteredErrors.slice(0, filter.limit);
    }

    return filteredErrors;
  }

  // Clear errors
  clearErrors(): void {
    this.errors = [];
    debug.info('Error logs cleared');
  }

  // Export errors (useful for debugging)
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  // Send to external service (placeholder)
  private async sendToExternalService(error: ErrorLog): Promise<void> {
    try {
      debug.info('Error would be sent to external service in production', error);
    } catch (sendError) {
      debug.error('Failed to send error to external service', sendError);
    }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Export class for custom instances
export default ErrorLogger;