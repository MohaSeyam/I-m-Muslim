import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Unregister any stale service workers to ensure clean loading in development
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(() => {});
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#070D0B] text-white font-cairo text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L9.5 6.5H14.5L12 2ZM5 9C5 7.5 6 6.5 7.5 6.5H16.5C18 6.5 19 7.5 19 9V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V9ZM10 14V19H14V14C14 12.9 13.1 12 12 12C10.9 12 10 12.9 10 14Z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-emerald-400 mb-2">أنا مسلم | I'm Muslim</h1>
          <p className="text-sm text-gray-300 mb-4 max-w-md">
            حدث خطأ غير متوقع أثناء معالجة الصفحة.
          </p>
          {this.state.error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-2.5 rounded-xl max-w-md font-mono mb-6 overflow-auto">
              {this.state.error.message}
            </p>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch {}
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs border border-white/20 transition active:scale-95 cursor-pointer"
            >
              إعادة ضبط وفتح التطبيق
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

