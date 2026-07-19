import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[400px]">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
            حدث خطأ غير متوقع
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6 max-w-md">
            عذراً، حدث خطأ أثناء تحميل المحتوى. يرجى المحاولة مرة أخرى.
          </p>
          <Button onClick={this.handleRetry} variant="primary">
            <RefreshCw className="w-4 h-4 ml-2" />
            المحاولة مرة أخرى
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
