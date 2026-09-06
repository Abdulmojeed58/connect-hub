import { Layout } from '@/components/Layout';
import { ProfileSummary } from '@/components/dashboard/ProfileSummary';
import { StatsPanel } from '@/components/dashboard/StatsPanel';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          <ProfileSummary />
        </div>
        <StatsPanel />
      </div>
    </Layout>
  );
}
