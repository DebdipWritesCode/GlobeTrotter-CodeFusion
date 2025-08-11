import React, { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RefreshCw, BarChart3, TrendingUp, PieChart, MapPin, Activity } from 'lucide-react';
import DateRangePicker from '@/components/admin/DateRangePicker';
import AnalyticsKPI from '@/components/admin/AnalyticsKPI';
import AnalyticsTable from '@/components/admin/AnalyticsTable';
import { fetchAnalytics } from '@/services/api/analytics';
import type { AnalyticsPayload } from '@/services/api/analytics';

const LineChartCard = React.lazy(() => import('@/components/admin/AnalyticsCharts/LineChartCard'));
const BarChartCard = React.lazy(() => import('@/components/admin/AnalyticsCharts/BarChartCard'));
const DonutChartCard = React.lazy(() => import('@/components/admin/AnalyticsCharts/DonutChartCard'));

const Analytics: React.FC = () => {
  const [from, setFrom] = useState<string>(() => new Date(Date.now() - 6 * 86400000).toISOString());
  const [to, setTo] = useState<string>(() => new Date().toISOString());
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAnalytics({ from, to, granularity });
      setData(res);
    } catch (e) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, granularity]);

  const onQuick = (days: number) => {
    const t = new Date();
    const f = new Date(Date.now() - (days - 1) * 86400000);
    setFrom(f.toISOString());
    setTo(t.toISOString());
  };

  const onExportCsv = () => {
    if (!data) return;
    const rows = [['ID', 'Title', 'City', 'Uses', 'Avg Cost']].concat(
      data.topActivities.map((a) => [a.id, a.title, a.city, a.uses, a.avg_cost])
    );
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top_activities.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 md:px-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Analytics</h1>
              <div className="text-sm text-muted-foreground mt-1">Mock data only. Replace with real API when ready.</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap bg-card/50 dark:bg-card/30 p-3 rounded-lg border border-border/50">
            <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t); }} />
            <div className="inline-flex rounded-md border border-border overflow-hidden bg-background">
              <Button variant={granularity === 'day' ? 'secondary' : 'ghost'} size="sm" onClick={() => setGranularity('day')}>Day</Button>
              <Button variant={granularity === 'week' ? 'secondary' : 'ghost'} size="sm" onClick={() => setGranularity('week')}>Week</Button>
              <Button variant={granularity === 'month' ? 'secondary' : 'ghost'} size="sm" onClick={() => setGranularity('month')}>Month</Button>
            </div>
            <div className="inline-flex rounded-md border border-border overflow-hidden bg-background">
              <Button variant="ghost" size="sm" onClick={() => onQuick(7)}>7d</Button>
              <Button variant="ghost" size="sm" onClick={() => onQuick(30)}>30d</Button>
              <Button variant="ghost" size="sm" onClick={() => onQuick(90)}>90d</Button>
            </div>
            <Button variant="outline" size="sm" onClick={load} className="border-border hover:bg-accent">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={onExportCsv} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mt-4 border-destructive/40 bg-destructive/5 dark:bg-destructive/10">
          <CardContent className="p-4 text-sm text-destructive flex items-center justify-between bg-transparent">
            <span>{error}</span>
            <Button size="sm" onClick={load} variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={`sk-${i}`} className="bg-card/50 dark:bg-card/30 border-border/50">
              <CardContent className="p-4 animate-pulse space-y-3 bg-transparent">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-8 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          data?.kpis.map((k) => <AnalyticsKPI key={k.key} kpi={k} />)
        )}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Suspense fallback={<Card><CardContent className="p-6">Loading line chart…</CardContent></Card>}>
          <div className="lg:col-span-2">
            <LineChartCard 
              title="Trips over time" 
              series={data?.tripsSeries.map(item => ({ date: item.date, value: item.count })) || []} 
              icon={<TrendingUp className="w-4 h-4" />}
            />
          </div>
        </Suspense>
        <Suspense fallback={<Card><CardContent className="p-6">Loading donut chart…</CardContent></Card>}>
          <DonutChartCard 
            title="Expense distribution" 
            data={data?.expenseDistribution.map(item => ({ name: item.category, value: item.amount })) || []} 
            icon={<PieChart className="w-4 h-4" />}
          />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Suspense fallback={<Card><CardContent className="p-6">Loading bar chart…</CardContent></Card>}>
          <BarChartCard 
            title="Top cities by trips" 
            data={data?.topCities.map(item => ({ city: item.city, trips: item.trips })) || []} 
            icon={<MapPin className="w-4 h-4" />}
          />
        </Suspense>
        <div className="lg:col-span-2">
          <AnalyticsTable 
            title="Top Activities"
            data={data?.topActivities || []} 
            icon={<Activity className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;