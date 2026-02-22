import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";
// import env from "dotenv";
// env.config();


export const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();


  const validateForm = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const requestPermission = async () => {
    try {
      console.log("Requesting notification permission...");

      const permission = await Notification.requestPermission();
      console.log("Permission status:", permission);

      if (permission !== "granted") {
        console.warn("Notification permission not granted.");
        return;
      }

      console.log("Getting FCM token...");

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAP_ID_KEY,
      });

      console.log("FCM Token:", token);

      if (!token) {
        console.warn("No FCM token received.");
        return;
      }

      // Get user safely
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("User not found in localStorage.");
        return;
      }

      const user = JSON.parse(userData);
      console.log(user);
      

      console.log("Sending token to backend...");

      const response = await fetch(`${API_URL}/api/payments/save-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          userId: user.id
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response body:", data);

      if (!response.ok || data.success !== true) {
        console.error("Backend error:", data);
        return;
      }

      console.log("Token saved successfully ✅");

    } catch (error) {
      console.error("Error in requestPermission:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const { success, error: loginError } = await login(email, password);

    if (success) {
      navigate('/dashboard');
      requestPermission();
    } else {
      setError(loginError || 'Failed to sign in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Welcome Back</h1>
            <p className="text-gray-600 text-center mt-2">Sign in to PayOffline</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-gray-400 transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-600 font-semibold hover:text-sky-700">
                Create one
              </Link>
            </p>
          </div>

          <button
            type="button"
            className="w-full mt-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition"
          >
            Continue as Guest
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  );
};
