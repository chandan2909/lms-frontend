import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';

export default function HeaderActions() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Avoid hydration error (still useful in some React patterns, though less critical than Next.js)
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <nav className="flex items-center gap-3">
        <Link to="/profile" className="text-sm font-bold text-[#1c1d1f] hover:text-[#5624d0] px-3">
          My learning
        </Link>
        <button onClick={handleLogout} className="text-sm font-bold text-[#1c1d1f] hover:text-[#5624d0] px-3">
          Logout
        </button>
        <Link to="/profile" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold ml-2">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2">
      <Link 
        to="/auth/login" 
        className="h-10 px-4 flex items-center justify-center text-sm font-bold text-[#1c1d1f] border border-[#1c1d1f] bg-white hover:bg-[#f7f9fa] transition-colors"
      >
        Log in
      </Link>
      <Link 
        to="/auth/register" 
        className="h-10 px-4 flex items-center justify-center text-sm font-bold text-white bg-[#1c1d1f] hover:bg-gray-800 transition-colors"
      >
        Sign up
      </Link>
    </nav>
  );
}
