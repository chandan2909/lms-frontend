import { Link, useLocation } from 'react-router-dom';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { Home, ShoppingCart, User } from 'lucide-react';

export default function BottomNav() {
  const itemCount = useCartStore((s) => s.items.length);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 z-50 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors duration-200">
      <Link 
        to="/" 
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/') ? 'text-[#1c1d1f] dark:text-white' : 'text-gray-400 hover:text-[#1c1d1f] dark:hover:text-gray-300'}`}
      >
        <Home className={`w-6 h-6 ${isActive('/') ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      
      <Link 
        to="/cart" 
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${isActive('/cart') ? 'text-[#1c1d1f] dark:text-white' : 'text-gray-400 hover:text-[#1c1d1f] dark:hover:text-gray-300'}`}
      >
        <div className="relative">
          <ShoppingCart className={`w-6 h-6 ${isActive('/cart') ? 'fill-current' : ''}`} />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#a435f0] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white dark:border-[#0a0a0a]">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold">Cart</span>
      </Link>
      
      <Link 
        to={isAuthenticated ? "/profile" : "/auth/login"} 
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/profile') || isActive('/auth/login') ? 'text-[#1c1d1f] dark:text-white' : 'text-gray-400 hover:text-[#1c1d1f] dark:hover:text-gray-300'}`}
      >
        <User className={`w-6 h-6 ${isActive('/profile') || isActive('/auth/login') ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>
    </nav>
  );
}
