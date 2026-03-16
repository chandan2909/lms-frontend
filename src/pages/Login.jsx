import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import Header from '@/components/Layout/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      setAccessToken(data.accessToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] relative transition-colors duration-200">
      
      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-colors duration-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
          <p className="mt-4 font-bold text-gray-700 dark:text-gray-200 font-serif">Signing in...</p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-[#1c1d1f] dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            {error && (
              <div className="text-sm bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-black dark:text-white bg-white dark:bg-[#111111] dark:placeholder-gray-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-black dark:text-white bg-white dark:bg-[#111111] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black dark:bg-white text-white dark:text-[#1c1d1f] whitespace-nowrap py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin"></div>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-black dark:text-white hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
