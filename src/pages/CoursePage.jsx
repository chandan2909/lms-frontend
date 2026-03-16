import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Star, Clock, Globe, PlayCircle, MonitorPlay, FileText, Tv, Award, ChevronDown, Check } from 'lucide-react';

export default function CoursePage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem, isInCart, isPurchased } = useCartStore();
  const parsedId = parseInt(subjectId, 10);

  const [subject, setSubject] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const inCart = isInCart(parsedId);

  const getGradient = (id) => {
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
    ];
    return gradients[id % gradients.length];
  };

  const seededRandom = (seed) => {
    let x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const priceOptions = [999, 1299, 1499, 1999, 2499, 3499, 4999, 7999, 9999];
  const fakePrice = priceOptions[Math.floor(seededRandom(parsedId) * priceOptions.length)];
  const originalMultiplier = 3 + seededRandom(parsedId + 100) * 4; // 3x to 7x
  const fakeOriginal = Math.round(fakePrice * originalMultiplier);
  const fakeRating = (4 + seededRandom(parsedId + 200) * 0.9).toFixed(1);
  const fakeStudents = Math.floor(seededRandom(parsedId + 300) * 150000) + 5000;
  const fakeHours = Math.floor(seededRandom(parsedId + 400) * 50) + 5;
  const fakeLectures = Math.floor(seededRandom(parsedId + 500) * 80) + 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get(`/subjects`);
        const found = data.find((s) => s.id === parsedId);
        setSubject(found || { id: parsedId, title: 'Course', description: '' });

        try {
          const treeRes = await apiClient.get(`/subjects/${parsedId}/tree`);
          setSections(treeRes.data?.sections || []);
        } catch {
          setSections([]);
        }
      } catch {
        setSubject({ id: parsedId, title: 'Course', description: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parsedId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setEnrolled(false);
      return;
    }
    apiClient.get('/progress/overview').then(({ data }) => {
      const isEnrolled = data.some((course) => course.subject_id === parsedId);
      setEnrolled(isEnrolled);
    }).catch(() => {
      setEnrolled(isPurchased(parsedId));
    });
  }, [parsedId, isAuthenticated]);

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate(`/auth/login?redirect=/course/${parsedId}`);
      return;
    }
    navigate('/checkout', {
      state: {
        amount: fakePrice,
        originalAmount: fakeOriginal,
        itemCount: 1,
        courseTitle: subject?.title || 'Course',
        onSuccessAction: 'single',
        subjectId: parsedId,
      }
    });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/auth/login?redirect=/course/${parsedId}`);
      return;
    }
    addItem({
      id: parsedId,
      title: subject?.title || 'Course',
      price: fakePrice,
      originalPrice: fakeOriginal,
      gradient: getGradient(parsedId),
      thumbnail_url: subject?.thumbnail_url,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleStartLearning = () => {
    navigate(`/subjects/${parsedId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-[72px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c1d1f] dark:border-white"></div>
        </div>
      </div>
    );
  }

  const totalVideos = sections.reduce((acc, s) => acc + (s.videos?.length || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
      <Header />

      <div className="bg-[#1c1d1f] pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="flex-1 text-white text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{subject?.title}</h1>
            <p className="text-base md:text-lg text-gray-300 mb-4 max-w-xl">
              {subject?.description || 'Master the fundamentals and advanced concepts with hands-on projects and real-world examples.'}
            </p>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#f3ca8c] font-bold text-lg">{fakeRating}</span>
              <div className="flex text-[#f3ca8c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#f3ca8c]" />
                ))}
              </div>
              <span className="text-[#c0c4cc] text-sm">({fakeStudents.toLocaleString()} students)</span>
            </div>

            <p className="text-sm text-gray-400 mb-1">
              Created by <span className="text-[#cec0fc] underline cursor-pointer">Dr. Instructor</span>
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated 2026
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                English
              </span>
            </div>
          </div>

          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-white dark:bg-[#111111] rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200">
              <div className={`w-full aspect-video bg-gradient-to-br ${getGradient(parsedId)} relative overflow-hidden`}>
                {subject?.thumbnail_url ? (
                  <img
                    src={subject.thumbnail_url}
                    alt={subject?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <PlayCircle className="w-16 h-16 text-white opacity-60 absolute inset-0 m-auto" />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-[#1c1d1f] dark:text-gray-100">₹{fakePrice.toLocaleString('en-IN')}</span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">₹{fakeOriginal.toLocaleString('en-IN')}</span>
                  <span className="text-sm font-bold text-[#1c1d1f] dark:text-black bg-[#eceb98] px-2 py-0.5">
                    {Math.round((1 - fakePrice / fakeOriginal) * 100)}% off
                  </span>
                </div>

                <p className="text-sm text-red-600 font-medium mb-4 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">2 days</span> left at this price!
                </p>

                {enrolled ? (
                  <button
                    onClick={handleStartLearning}
                    className="w-full py-3 bg-[#1c1d1f] dark:bg-white text-white dark:text-[#1c1d1f] font-bold text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mb-3"
                  >
                    Start Learning →
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleBuy}
                      className="w-full py-3 bg-[#1c1d1f] dark:bg-white text-white dark:text-[#1c1d1f] font-bold text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mb-3"
                    >
                      Buy now
                    </button>
                    {inCart ? (
                      <button
                        onClick={() => navigate('/cart')}
                        className="w-full py-3 bg-white dark:bg-[#111111] text-[#1c1d1f] dark:text-white font-bold text-base border border-[#1c1d1f] dark:border-white hover:bg-[#f7f9fa] dark:hover:bg-[#1a1a1a] transition-colors mb-3"
                      >
                        Go to cart
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-white dark:bg-[#111111] text-[#1c1d1f] dark:text-white font-bold text-base border border-[#1c1d1f] dark:border-white hover:bg-[#f7f9fa] dark:hover:bg-[#1a1a1a] transition-colors mb-3"
                      >
                        Add to cart
                      </button>
                    )}
                  </>
                )}

                {addedToCart && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-3 text-sm font-medium">
                    🛒 Added to cart!
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">30-Day Money-Back Guarantee</p>
                <p className="text-xs text-gray-500 text-center">Full Lifetime Access</p>

                <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="font-bold text-sm text-[#1c1d1f] dark:text-gray-100 mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <MonitorPlay className="w-4 h-4 flex-shrink-0" />
                      {fakeHours} hours on-demand video
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      {fakeLectures} downloadable resources
                    </li>
                    <li className="flex items-center gap-2">
                      <Tv className="w-4 h-4 flex-shrink-0" />
                      Access on mobile and TV
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 flex-shrink-0" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full text-left">
        <h2 className="text-xl md:text-2xl font-bold text-[#1c1d1f] dark:text-white mb-2">Course content</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {sections.length} sections • {totalVideos} lectures • {fakeHours}h total length
        </p>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {sections.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No content available yet.</div>
          ) : (
            sections.map((section, idx) => (
              <div key={section.id} className={idx > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}>
                <div className="bg-[#f7f9fa] dark:bg-[#1a1a1a] px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-bold text-sm text-[#1c1d1f] dark:text-gray-100">{section.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{section.videos?.length || 0} lectures</span>
                </div>
                <div className="bg-white dark:bg-[#111111]">
                  {section.videos?.map((video) => (
                    <div key={video.id} className="flex items-center gap-3 px-8 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800">
                      <PlayCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span>{video.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 md:mt-12 border border-gray-200 dark:border-gray-700 rounded-lg p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#1c1d1f] dark:text-white mb-4 md:mb-5">What you'll learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Build real-world projects from scratch',
              'Understand core concepts deeply',
              'Apply best practices and patterns',
              'Debug and solve complex problems',
              'Write clean, maintainable code',
              'Prepare for technical interviews',
            ].map((item, i) => (
               <div key={i} className="flex items-start gap-2 text-sm text-[#1c1d1f] dark:text-gray-200">
                <Check className="w-5 h-5 text-[#1c1d1f] dark:text-white flex-shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
