import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBadge = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center">
      <div
        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
          isOnline
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          } animate-pulse`}
        />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
};
