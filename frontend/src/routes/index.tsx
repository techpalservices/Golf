import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ManagerGuard, AdminGuard } from './RoleGuard';
import * as L from './lazy';
import AppLayout from '@/components/layout/AppLayout';

export const router = createBrowserRouter([
  // ─── Public ───
  {
    path: '/',
    children: [
      { index: true, ...L.landing },
      { path: 'reservations', ...L.clubs },
      { path: 'reservations/:clubId', ...L.clubProfile },
      { path: 'sessions/:courseId', ...L.reservations },
      { path: 'memberships', ...L.memberships },
      { path: 'tournaments', ...L.tournaments },
      { path: 'search', ...L.search },
      { path: 'campus', ...L.campus },
      { path: 'campus/:packageId', ...L.campusDetail },
      { path: 'shop', ...L.shop },
      { path: 'shop/:productId', ...L.shopDetail },
      { path: 'login', ...L.login },
      { path: 'register', ...L.register },
      { path: 'forgot-password', ...L.forgotPassword },
      { path: 'reset-password', ...L.resetPassword },
      { path: 'verify-email', ...L.verifyEmail },
    ],
  },

  // ─── Player (auth + PLAYER role) ───
  {
    // Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          { path: 'reservations', ...L.myReservations },
          { path: 'clubs', ...L.myClubs },
          { path: 'orders', ...L.myOrders },
          { path: 'campus-bookings', ...L.myCampus },

          // ─── Shared (auth + any role content changed based on the user's role) ───
          { path: 'dashboard', ...L.dashboard },
          { path: 'notifications', ...L.notifications },
          { path: 'profile', ...L.profile },

          {
            Component: ManagerGuard,
            children: [
              { path: 'club', ...L.myClub },
              { path: 'planning', ...L.planning },
              { path: 'requests', ...L.requests },
              { path: 'members', ...L.members },
              { path: 'tournaments', ...L.manageTournaments },
              { path: 'packages', ...L.packages },
            ],
          },

          {
            Component: AdminGuard,
            children: [
              { path: 'users', ...L.users },
              { path: 'clubs', ...L.clubsManagement },
              { path: 'shop', ...L.shopManagement },
            ],
          },
        ],
      },
    ],
  },

  // ─── Errors ───
  { path: '/403', ...L.forbidden },
  { path: '*', ...L.notFound },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}