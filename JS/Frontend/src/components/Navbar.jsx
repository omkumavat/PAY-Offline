import { Link } from 'react-router-dom';
import { OfflineBadge } from './OfflineBadge';

export const Navbar = () => {

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">
                PayOffline
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <OfflineBadge />
            <button 
            className="text-gray-700 hover:text-primary-600 font-medium 
            transition-colors duration-200"
            onClick={handleLogOut}>
              Logout
            </button>
            {/* <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Dashboard
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};
