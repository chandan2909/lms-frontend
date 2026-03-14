import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      navigate(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, mounted, navigate, pathname]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c1d1f]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
