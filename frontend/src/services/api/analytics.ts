/**
 * Analytics mock API client.
 *
 * NOTE: This is mock-only. To swap to real backend, replace the fetch logic with:
 * GET /api/admin/analytics?from=...&to=...&granularity=...&country=...
 */

export type KPI = {
  key: string;
  label: string;
  value: number;
  changePct: number;
  sparkline: number[];
};

export type TripsSeriesPoint = { date: string; count: number };
export type ExpenseSlice = { category: string; amount: number };
export type TopCity = { city: string; trips: number };
export type TopActivity = {
  id: number;
  title: string;
  city: string;
  uses: number;
  avg_cost: number;
};

export type AnalyticsPayload = {
  kpis: KPI[];
  tripsSeries: TripsSeriesPoint[];
  expenseDistribution: ExpenseSlice[];
  topCities: TopCity[];
  topActivities: TopActivity[];
};

export type AnalyticsParams = {
  from?: string;
  to?: string;
  granularity?: 'day' | 'week' | 'month';
  country?: string;
};

/**
 * fetchAnalytics – loads analytics from local mock file, with optional params.
 * In a real implementation, pass params as querystring to your backend.
 */
export async function fetchAnalytics(params?: AnalyticsParams): Promise<AnalyticsPayload> {
  // Lazy import to keep bundle small; Vite turns this into a separate chunk
  const mod = await import('../../mocks/analytics.json');
  const data = mod.default as AnalyticsPayload;

  const cloned: AnalyticsPayload = JSON.parse(JSON.stringify(data));

  // Mock filtering by date/granularity on the client for demo
  if (params?.from || params?.to) {
    const fromTs = params.from ? Date.parse(params.from) : Number.NEGATIVE_INFINITY;
    const toTs = params.to ? Date.parse(params.to) : Number.POSITIVE_INFINITY;
    cloned.tripsSeries = cloned.tripsSeries.filter((p) => {
      const t = Date.parse(p.date);
      return t >= fromTs && t <= toTs;
    });
  }

  // Granularity mock: sample every N points
  if (params?.granularity === 'week') {
    cloned.tripsSeries = cloned.tripsSeries.filter((_, i) => i % 2 === 0);
  } else if (params?.granularity === 'month') {
    cloned.tripsSeries = cloned.tripsSeries.filter((_, i) => i % 3 === 0);
  }

  return cloned;
}

// TODO: Swap to real endpoint
// export async function fetchAnalytics(params?: AnalyticsParams): Promise<AnalyticsPayload> {
//   const res = await api.get<AnalyticsPayload>('/api/admin/analytics', { params });
//   return res.data;
// }


