import { Outlet, useParams } from 'react-router-dom';
import AuthGuard from '@/components/Auth/AuthGuard';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';

export default function SubjectLayout() {
  const { subjectId } = useParams();
  const parsedSubjectId = parseInt(subjectId, 10);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-[#1c1d1f]">
        
        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden pt-[72px]">
          <div className="flex-1 relative lg:overflow-y-auto custom-scrollbar text-white">
            <Outlet />
          </div>
          <SubjectSidebar subjectId={parsedSubjectId} />
        </div>
      </div>
    </AuthGuard>
  );
}
