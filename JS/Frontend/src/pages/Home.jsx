import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const Home = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="card max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              PayOffline
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your reliable offline-first payment solution. Make payments anytime,
              anywhere, even without an internet connection.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3 text-left">
              <svg
                className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-700">
                <strong>Offline-First:</strong> Continue making payments even when you're offline
              </p>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <svg
                className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-700">
                <strong>Auto-Sync:</strong> Transactions automatically sync when you're back online
              </p>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <svg
                className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-700">
                <strong>Secure Storage:</strong> Your data is safely stored locally using IndexedDB
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-lg"
          >
            Get Started
          </button>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Current Status:{' '}
              <span
                className={`font-semibold ${
                  isOnline ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
