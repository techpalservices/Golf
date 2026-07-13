import { useAuthStore } from '@/features/auth/store';
import { lazy , Suspense } from 'react';


const PlayerDashboard = lazy(() => import('../components/PlayerDashboard'));
const ManagerDashboard = lazy(() => import('../components/ManagerDashboard'));
const AdminDashboard = lazy(() => import('../components/AdminDashboard'));

function DashboardSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function DashboardPage() {
  const role = useAuthStore((s) => s.user?.role);

  // return (
  //   <Suspense fallback={<DashboardSpinner />}>
  //     {role === 'MANAGER' && <ManagerDashboard />}
  //     {role === 'ADMIN' && <AdminDashboard />}
  //     {role === 'PLAYER' && <PlayerDashboard />}
  //   </Suspense>
  // );

  // used just in the dev mode, for testing
  return <PlayerDashboard />;
}