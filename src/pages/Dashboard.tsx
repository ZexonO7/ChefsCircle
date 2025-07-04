
import PageLayout from '@/components/PageLayout';
import GamificationDashboard from '@/components/GamificationDashboard';
import SEO from '@/components/SEO';

const Dashboard = () => {
  return (
    <PageLayout>
      <SEO 
        title="Dashboard - ChefsCircle" 
        description="Track your culinary progress, view achievements, and compete with fellow chefs in your personalized dashboard."
      />
      <GamificationDashboard />
    </PageLayout>
  );
};

export default Dashboard;
