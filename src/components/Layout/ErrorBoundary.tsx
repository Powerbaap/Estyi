import React from 'react';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Basic logging; can be wired to a logging service if needed
    console.error('UI crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Beklenmeyen bir hata oluştu</h2>
            <p className="text-sm text-gray-600 mb-4">Sayfa yenilenerek devam edebilirsiniz. Hata devam ederse lütfen bize bildirin.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => location.reload()}>Sayfayı Yenile</button>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}