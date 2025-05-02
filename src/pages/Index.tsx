
import { ProjectProvider } from '@/contexts/ProjectContext';
import MainLayout from '@/components/MainLayout';

const Index = () => {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
};

export default Index;
