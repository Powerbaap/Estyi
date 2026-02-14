import React from 'react';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

type ErrorBoundaryProps = React.PropsWithChildren;

// Statik metin: i18n yüklenmeden veya hata verirse bile ekran her zaman gösterilir
const FALLBACK_TITLE = 'Beklenmeyen bir hata oluştu';
const FALLBACK_DESC = 'Sayfayı yenileyerek devam edebilirsiniz. Hata devam ederse lütfen bize bildirin.';
const FALLBACK_BTN = 'Sayfayı Yenile';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{FALLBACK_TITLE}</h2>
            <p className="text-sm text-gray-600 mb-4">{FALLBACK_DESC}</p>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              {FALLBACK_BTN}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;