export interface AdminKpis {
    totalUsers: number;
    totalPlayers: number;
    totalManagers: number;
    totalInfluencers: number;
    totalClubs: number;
    activeClubs: number;
    reservationsLast30Days: number;
    reservationsTrendPct: number;
    pendingReservations: number;
    pendingMembershipRequests: number;
    activeTournaments: number;
    revenueLast30Days: number;
    revenueTrendPct: number;
    newUsersThisMonth: number;
}

/** month formatted as "YYYY-MM", values are cumulative users per role */
export interface MonthlyGrowthPoint {
    month: string;
    players: number;
    managers: number;
    influencers: number;
}

/** date formatted as "YYYY-MM-DD" */
export interface DailyCountPoint {
    date: string;
    count: number;
}

export interface ClubCountPoint {
    name: string;
    count: number;
}

export interface AdminDashboardData {
    kpis: AdminKpis;
    usersGrowth: MonthlyGrowthPoint[];
    reservationsTrend: DailyCountPoint[];
    activityHeatmap: DailyCountPoint[];
    topClubs: ClubCountPoint[];
}

export interface ManagerKpis {
    todayReservations: number;
    pendingRequests: number;
    members: number;
    todayRevenue: number;
}

/** date formatted as "YYYY-MM-DD", rate as a 0–100 percentage */
export interface DailyRatePoint {
    date: string;
    rate: number;
}

/** status: PENDING / ACCEPTED / REJECTED */
export interface StatusCountPoint {
    status: string;
    count: number;
}

/** date formatted as "YYYY-MM-DD", revenue in MAD (green fees) */
export interface DailyRevenuePoint {
    date: string;
    revenue: number;
}

export interface ManagerDashboardData {
    kpis: ManagerKpis;
    utilization: DailyRatePoint[];
    reservationsByStatus: StatusCountPoint[];
    revenue: DailyRevenuePoint[];
}