import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';

export default function SubjectIndex() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFirstVideo = async () => {
      try {
        const { data } = await apiClient.get(`/subjects/${subjectId}/first-video`);
        if (data.videoId) {
          navigate(`/subjects/${subjectId}/video/${data.videoId}`, { replace: true });
        } else {
          setError('No videos found for this course.');
        }
      } catch (err) {
        console.error('Failed to get first video:', err);
        setError('Failed to load course content.');
      }
    };

    getFirstVideo();
  }, [subjectId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9fa] dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-[#1c1d1f] dark:text-white transition-colors duration-200">
        <div className="text-xl mb-4 font-bold">{error}</div>
        <button 
          onClick={() => navigate(`/subjects/${subjectId}`)}
          className="px-6 py-2 bg-[#1c1d1f] dark:bg-white text-white dark:text-[#1c1d1f] font-bold rounded hover:bg-black dark:hover:bg-gray-200 transition-colors"
        >
          Back to Course Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] dark:bg-[#0a0a0a] flex items-center justify-center transition-colors duration-200">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c1d1f] dark:border-white"></div>
    </div>
  );
}
