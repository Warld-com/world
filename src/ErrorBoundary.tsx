import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch {
      window.location.href = './';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 text-center z-[99999]">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-4">
            <img 
              src="./logo.png" 
              alt="warld logo" 
              className="w-10 h-10 object-cover rounded-xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-lg font-black tracking-tight mb-2">
            কিছু সাময়িক ত্রুটি হয়েছে / Something went wrong
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
            অ্যাপটি পুনরায় চালু করতে নিচের বাটনে চাপ দিন। আপনার ডেটা নিরাপদ আছে।
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-[#FF4B91] hover:opacity-90 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            অ্যাপ রিলোড করুন (Reload App)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
