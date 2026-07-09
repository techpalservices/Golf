const lazyLanding = () =>
  import('@/features/landing/pages/LandingPage').then((m) => ({ Component: m.default }));

const lazyPlaceholder = () =>
  import('@/components/shared/PlaceHolder').then((m) => ({ Component: m.default }));

// ─── Public ───
export const landing = { lazy: lazyLanding };
export const search = { lazy: lazyPlaceholder };
export const clubProfile = { lazy: lazyPlaceholder };
export const campus = { lazy: lazyPlaceholder };
export const campusDetail = { lazy: lazyPlaceholder };
export const shop = { lazy: lazyPlaceholder };
export const shopDetail = { lazy: lazyPlaceholder };
export const login = { lazy: lazyPlaceholder };
export const register = { lazy: lazyPlaceholder };
export const forgotPassword = { lazy: lazyPlaceholder };
export const resetPassword = { lazy: lazyPlaceholder };
export const verifyEmail = { lazy: lazyPlaceholder };

// ─── Player ───
export const playerDashboard = { lazy: lazyPlaceholder };
export const playerReservations = { lazy: lazyPlaceholder };
export const playerClubs = { lazy: lazyPlaceholder };
export const playerOrders = { lazy: lazyPlaceholder };
export const playerCampusBookings = { lazy: lazyPlaceholder };
export const playerNotifications = { lazy: lazyPlaceholder };
export const playerProfile = { lazy: lazyPlaceholder };

// ─── Manager ───
export const managerDashboard = { lazy: lazyPlaceholder };
export const managerClub = { lazy: lazyPlaceholder };
export const managerPlanning = { lazy: lazyPlaceholder };
export const managerRequests = { lazy: lazyPlaceholder };
export const managerMembers = { lazy: lazyPlaceholder };
export const managerTournaments = { lazy: lazyPlaceholder };
export const managerPackages = { lazy: lazyPlaceholder };
export const managerNotifications = { lazy: lazyPlaceholder };
export const managerProfile = { lazy: lazyPlaceholder };

// ─── Admin ───
export const adminDashboard = { lazy: lazyPlaceholder };
export const adminUsers = { lazy: lazyPlaceholder };
export const adminClubs = { lazy: lazyPlaceholder };
export const adminShop = { lazy: lazyPlaceholder };
export const adminNotifications = { lazy: lazyPlaceholder };
export const adminProfile = { lazy: lazyPlaceholder };

// ─── Errors ───
export const forbidden = { lazy: lazyPlaceholder };
export const notFound = { lazy: lazyPlaceholder };