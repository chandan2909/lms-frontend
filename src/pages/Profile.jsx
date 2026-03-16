import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import AuthGuard from '@/components/Auth/AuthGuard';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import useAuthStore from '@/store/authStore';
import { PlayCircle, Award } from 'lucide-react';

export default function ProfilePage() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('learning');
  const navigate = useNavigate();

  const { user, fetchUser, deleteAccount, logout } = useAuthStore();

  useEffect(() => {
    fetchUser();
    const fetchProgress = async () => {
      try {
        const { data } = await apiClient.get('/progress/overview');
        setProgress(data || []);
      } catch (err) {
        setError('Failed to load progress.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [fetchUser]);

  const seededRandom = (seed) => {
    let x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const priceOptions = [999, 1299, 1499, 1999, 2499, 3499, 4999, 7999, 9999];

  const getCoursePrice = (subjectId) => {
    return priceOptions[Math.floor(seededRandom(subjectId) * priceOptions.length)];
  };

  const getCourseOriginalPrice = (subjectId, basePrice) => {
    const originalMultiplier = 3 + seededRandom(subjectId + 100) * 4;
    return Math.round(basePrice * originalMultiplier);
  };

  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown date';

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f7f9fa] dark:bg-[#0a0a0a] flex flex-col transition-colors duration-200">
        <Header />
        
        <div className="bg-[#1c1d1f] text-white pt-[112px] pb-[40px]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-[#2d2f31] rounded-full flex items-center justify-center text-2xl md:text-4xl font-bold font-serif border-4 border-[#3e4143] flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 font-serif">{user?.name || 'Student'}</h1>
                <p className="text-[#c0c4cc] text-sm mb-2 break-all">{user?.email || 'Loading email...'}</p>
                <p className="text-sm font-medium text-[#cec0fc]">Student since {joinDate}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="mt-4 md:mt-0 px-6 py-2 bg-transparent border border-white font-bold text-sm hover:bg-white hover:text-[#1c1d1f] transition-colors rounded"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 sticky top-[72px] z-40 transition-colors duration-200">
           <div className="max-w-5xl mx-auto px-4 md:px-6 flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
              {['learning', 'certificates', 'history', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 md:py-4 text-sm md:text-base font-bold transition-colors ${
                    activeTab === tab 
                      ? 'text-[#1c1d1f] dark:text-white border-b-4 border-[#1c1d1f] dark:border-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-[#1c1d1f] dark:hover:text-white border-b-4 border-transparent'
                  }`}
                >
                  {tab === 'learning' ? 'My Learning' : 
                   tab === 'certificates' ? 'Certificates' : 
                   tab === 'history' ? 'Purchase History' : 'Settings'}
                </button>
              ))}
           </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full text-[#1c1d1f] dark:text-white flex-grow">
          {activeTab === 'learning' && (
             <>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-left font-serif">All courses</h2>

              {loading ? (
                <div className="flex py-12 justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c1d1f] dark:border-white"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 bg-red-50 p-4 rounded-md text-left border border-red-200 font-medium">{error}</div>
              ) : progress.length === 0 ? (
                <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded p-12 text-center text-gray-500 font-medium">
                  <p className="mb-4">You don't have any courses yet.</p>
                  <Link to="/" className="px-6 py-3 bg-[#1c1d1f] dark:bg-white text-white dark:text-[#1c1d1f] font-bold rounded hover:bg-black dark:hover:bg-gray-200 transition-colors">
                    Browse courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {progress.map((p) => (
                    <Link 
                      key={p.subject_id}
                      to={`/subjects/${p.subject_id}`}
                      className="group flex flex-col h-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-gray-500 transition-colors cursor-pointer text-left rounded overflow-hidden"
                    >
                      <div className="w-full aspect-video bg-[#2d2f31] relative overflow-hidden">
                        {p.thumbnail_url ? (
                          <img
                            src={p.thumbnail_url}
                            alt={p.subject_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.currentTarget;
                              const current = img.src;
                              if (current.includes('hqdefault')) {
                                img.src = current.replace('hqdefault', 'sddefault');
                              } else {
                                img.style.display = 'none';
                              }
                            }}
                          />
                        ) : (
                          <PlayCircle className="w-12 h-12 text-white opacity-50 absolute inset-0 m-auto" />
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-base font-bold text-[#1c1d1f] dark:text-gray-100 mb-1 line-clamp-2 leading-tight">
                          {p.subject_title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Dr. Instructor</p>
                        
                        <div className="mt-auto">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                {Math.round(p.completion_percentage)}% complete
                             </span>
                             <span className="text-xs text-gray-500 dark:text-gray-400">
                                {p.completed_videos}/{p.total_videos} lessons
                             </span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 mb-2 overflow-hidden">
                            <div 
                              className="bg-[#5624d0] h-1.5 transition-all duration-1000 ease-out" 
                              style={{ width: `${p.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
             </>
          )}

          {activeTab === 'certificates' && (
             <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded p-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p>No certificates earned yet.</p>
                <p className="text-sm mt-2 text-gray-400 dark:text-gray-500">Complete 100% of a course to earn its certificate.</p>
             </div>
          )}

          {activeTab === 'history' && (
             <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-[#f7f9fa] dark:bg-[#1a1a1a]">
                  <h3 className="text-lg font-bold text-[#1c1d1f] dark:text-white font-serif">Your Purchases</h3>
                </div>
                {progress.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-medium">
                    <p>You haven't made any purchases.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {progress.map((p) => {
                      const price = getCoursePrice(p.subject_id);
                      const purchaseDate = p.enrolled_at 
                        ? new Date(p.enrolled_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'Unknown date';
                      
                      return (
                        <div key={p.subject_id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors">
                          <div className="w-full md:w-48 aspect-video bg-[#2d2f31] flex-shrink-0 relative">
                            {p.thumbnail_url ? (
                               <img
                                 src={p.thumbnail_url}
                                 alt={p.subject_title}
                                 className="w-full h-full object-cover"
                                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
                               />
                             ) : (
                               <PlayCircle className="w-8 h-8 text-white opacity-50 absolute inset-0 m-auto" />
                             )}
                          </div>
                          
                          <div className="flex-grow min-w-0 flex flex-col items-start gap-1">
                            <Link to={`/subjects/${p.subject_id}`} className="text-base md:text-lg font-bold text-[#1c1d1f] dark:text-gray-100 hover:text-[#5624d0] dark:hover:text-[#cec0fc] hover:underline line-clamp-2">
                              {p.subject_title || 'Course'}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dr. Instructor</p>
                            <div className="flex items-center gap-2 mt-2 pt-2 md:pt-0 md:mt-1">
                               <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Receipt</span>
                               <span className="text-xs text-gray-500 dark:text-gray-400">{purchaseDate}</span>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-end gap-2 md:gap-0 mt-2 md:mt-0 right-0">
                            <span className="text-lg font-bold text-[#1c1d1f] dark:text-gray-100">₹{price.toLocaleString('en-IN')}</span>
                            <span className="text-sm text-[#0056d2] dark:text-[#cec0fc] hover:underline cursor-pointer font-medium mt-1">Receipt</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded p-8">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Danger Zone</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Once you delete your account, there is no going back. Please be certain.
                  This will permanently delete your user data, purchase history, and course progress.
                </p>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                      await deleteAccount();
                      navigate('/');
                    }
                  }}
                  className="px-6 py-2 border-2 border-red-600 text-red-600 font-bold hover:bg-red-50 transition-colors"
                >
                  Delete Account
                </button>
             </div>
          )}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
