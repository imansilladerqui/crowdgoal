import React from "react";

type Props = { children: React.ReactNode };
type State = { error?: Error };

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Optional: send to analytics/logging here
    console.error("Uncaught error:", error, info);
  }

  handleRetry = () => {
    this.setState({ error: undefined });
    // Prefer a soft reload
    window.location.reload();
  };

  handleReport = () => {
    const body = encodeURIComponent(
      `Describe what you were doing:\n\nError:\n${this.state.error?.message}\n\nURL: ${window.location.href}`
    );
    window.open(
      `mailto:support@example.com?subject=CrowdGoal Error&body=${body}`,
      "_blank"
    );
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
          <div className="max-w-md w-full border rounded-lg p-6 space-y-4">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm opacity-80 break-words">
              {this.state.error.message || "An unexpected error occurred."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 rounded bg-primary text-primary-foreground"
              >
                Try again
              </button>
              <button
                onClick={this.handleReport}
                className="px-4 py-2 rounded border"
              >
                Report issue
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
