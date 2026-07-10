import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { PlayerGuard, ManagerGuard, AdminGuard } from './RoleGuard';
import * as L from './lazy';

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
    path: '/player',
    Component: ProtectedRoute,
    children: [
      {
        Component: PlayerGuard,
        children: [
          { path: 'dashboard', ...L.playerDashboard },
          { path: 'reservations', ...L.playerReservations },
          { path: 'clubs', ...L.playerClubs },
          { path: 'orders', ...L.playerOrders },
          { path: 'campus-bookings', ...L.playerCampusBookings },
          { path: 'notifications', ...L.playerNotifications },
          { path: 'profile', ...L.playerProfile },
        ],
      },
    ],
  },

  // ─── Manager (auth + MANAGER role) ───
  {
    path: '/manager',
    Component: ProtectedRoute,
    children: [
      {
        Component: ManagerGuard,
        children: [
          { path: 'dashboard', ...L.managerDashboard },
          { path: 'club', ...L.managerClub },
          { path: 'planning', ...L.managerPlanning },
          { path: 'requests', ...L.managerRequests },
          { path: 'members', ...L.managerMembers },
          { path: 'tournaments', ...L.managerTournaments },
          { path: 'packages', ...L.managerPackages },
          { path: 'notifications', ...L.managerNotifications },
          { path: 'profile', ...L.managerProfile },
        ],
      },
    ],
  },

  // ─── Admin (auth + ADMIN role) ───
  {
    path: '/admin',
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminGuard,
        children: [
          { path: 'dashboard', ...L.adminDashboard },
          { path: 'users', ...L.adminUsers },
          { path: 'clubs', ...L.adminClubs },
          { path: 'shop', ...L.adminShop },
          { path: 'notifications', ...L.adminNotifications },
          { path: 'profile', ...L.adminProfile },
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