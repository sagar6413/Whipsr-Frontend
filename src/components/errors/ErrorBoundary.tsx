"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">
                Oops! Something went wrong.
              </h1>
              <p>
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
              {/* Optionally display error details in development */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <pre className="mt-4 text-left text-xs bg-red-100 p-2 rounded overflow-auto">
                  {this.state.error.stack || this.state.error.toString()}
                </pre>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
