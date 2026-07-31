import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/buttons/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
          >
            <RefreshCw size={16} />
            Return to Dashboard
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
