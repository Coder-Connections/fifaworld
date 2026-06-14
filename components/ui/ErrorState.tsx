import { AlertCircle, Key } from 'lucide-react';

interface Props {
  message?: string;
  isApiKey?: boolean;
}

export default function ErrorState({ message, isApiKey }: Props) {
  const noKey = isApiKey || message?.includes('not configured');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-stadium-600 border border-stadium-400 flex items-center justify-center mb-4">
        {noKey ? (
          <Key className="w-6 h-6 text-wc-gold" />
        ) : (
          <AlertCircle className="w-6 h-6 text-wc-live" />
        )}
      </div>

      {noKey ? (
        <>
          <h3 className="text-lg font-semibold text-white mb-2">API Key Required</h3>
          <p className="text-sm text-stadium-100 mb-4 max-w-sm">
            Add your football-data.org API key to <code className="text-wc-gold-light text-xs bg-stadium-600 px-1.5 py-0.5 rounded">.env.local</code> to see live data.
          </p>
          <a
            href="https://www.football-data.org/client/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-wc-blue-light hover:underline"
          >
            Get a free API key →
          </a>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load data</h3>
          <p className="text-sm text-stadium-100 max-w-sm">{message ?? 'Please try again later.'}</p>
        </>
      )}
    </div>
  );
}
