import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function Home() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await apiClient.get('/subjects');
        setSubjects(data);
      } catch (err: any) {
        setError('Failed to load subjects.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const getGradient = (id: number) => {
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500'
    ];
    return gradients[id % gradients.length];
  };

  // Seeded pseudo-random for consistent but varied prices per course
  const seededRandom = (seed: number) => {
    let x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const priceOptions = [999, 1299, 1499, 1999, 2499, 3499, 4999, 7999, 9999];

  const getCoursePrice = (id: number) => priceOptions[Math.floor(seededRandom(id) * priceOptions.length)];
  const getOriginalPrice = (id: number) => {
    const price = getCoursePrice(id);
    const multiplier = 3 + seededRandom(id + 100) * 4;
    return parseFloat((price * multiplier).toFixed(2));
  };
  const getCourseRating = (id: number) => (4 + seededRandom(id + 200) * 0.9).toFixed(1);
  const getCourseStudents = (id: number) => Math.floor(seededRandom(id + 300) * 150000) + 5000;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow w-full">
        {/* Kodemy Hero Section */}
        <div className="relative w-full h-[400px] bg-[#f7f9fa] flex items-center justify-center overflow-hidden border-b border-gray-200">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1c1d1f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="max-w-7xl w-full mx-auto px-6 relative z-10 flex text-left">
            <div className="bg-white p-8 shadow-md max-w-lg w-full border border-gray-100">
              <h1 className="text-4xl font-bold font-serif text-[#1c1d1f] mb-3 leading-tight">
                Learning that gets you
              </h1>
              <p className="text-[19px] text-[#1c1d1f] mb-4">
                Skills for your present (and your future). Get started with us by exploring our curated catalog.
              </p>
            </div>
          </div>
        </div>

        {/* Main Course Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12 w-full text-[#1c1d1f]">
          <h2 className="text-3xl font-bold font-serif mb-2">A broad selection of courses</h2>
          <p className="text-[19px] mb-8">Choose from online video courses with new additions published every month</p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c1d1f]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-md font-bold text-left">{error}</div>
          ) : subjects.length === 0 ? (
            <div className="text-gray-500 border border-dashed border-gray-300 rounded-lg p-12 text-center">
              No subjects published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {subjects.map((subject) => (
                <Link 
                  key={subject.id} 
                  to={`/course/${subject.id}`}
                  className="group flex flex-col h-full bg-white transition-opacity cursor-pointer text-left"
                >
                  {/* Thumbnail */}
                  <div className={`w-full aspect-video bg-gradient-to-br ${getGradient(subject.id)} flex items-center justify-center border border-gray-200 mb-2`}>
                    <svg className="w-12 h-12 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-[15px] font-bold text-[#1c1d1f] leading-tight line-clamp-2 mb-1 group-hover:text-black">
                      {subject.title}
                    </h3>
                    <p className="text-xs text-[#6a6f73] mb-1 truncate">
                      Dr. Instructor Name
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm font-bold text-[#b4690e]">{getCourseRating(subject.id)}</span>
                      <div className="flex items-center text-[#b4690e]">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                      <span className="text-xs text-[#6a6f73]">({getCourseStudents(subject.id).toLocaleString()})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="font-bold text-base text-[#1c1d1f]">
                      ₹{getCoursePrice(subject.id).toLocaleString('en-IN')} <span className="text-sm font-normal text-[#6a6f73] line-through ml-1">₹{getOriginalPrice(subject.id).toLocaleString('en-IN')}</span>
                    </div>
                    
                    {/* Bestseller Tag */}
                    {subject.id % 2 !== 0 && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-[#eceb98] text-[#3d3c0a] text-[10px] font-bold leading-none">
                          Bestseller
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
