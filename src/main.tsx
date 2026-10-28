import React, {StrictMode, type ReactNode, type ErrorInfo} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-xl">!</div>
            <h1 className="text-xl font-bold mb-2">Affichage de la Newsletter</h1>
            <p className="text-slate-400 text-sm mb-6">
              Une erreur temporaire est survenue lors du chargement. Cliquez ci-dessous pour actualiser.
            </p>
            <button
              onClick={() => {
                try {
                  window.localStorage.clear();
                  window.sessionStorage.clear();
                } catch {
                  // ignore
                }
                window.location.reload();
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
