import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { KPI } from '@/services/api/analytics';

/**
 * AnalyticsKPI renders a single KPI tile with value, % change, and a simple sparkline.
 */
type Props = { kpi: KPI };

const AnalyticsKPI: React.FC<Props> = ({ kpi }) => {
  const positive = kpi.changePct >= 0;
  return (
    <Card className="bg-card/50 dark:bg-card/30 border-border/50 hover:border-border/70 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 bg-transparent">
        <div className="text-xs text-muted-foreground font-medium">{kpi.label}</div>
        <div className="mt-2 text-xl font-semibold text-foreground">{kpi.value.toLocaleString()}</div>
        <div className="mt-1 text-xs flex items-center gap-1">
          <span className={`font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {positive ? '+' : ''}{kpi.changePct}%
          </span>
          <span className="text-muted-foreground">vs prev</span>
        </div>
        <Sparkline ariaLabel={`${kpi.label} sparkline`} points={kpi.sparkline} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsKPI;

type SparkProps = { points: number[]; ariaLabel?: string };

const Sparkline: React.FC<SparkProps> = ({ points, ariaLabel }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  const norm = points.map((p) => (p - min) / range);
  return (
    <div aria-label={ariaLabel} className="mt-3 h-10 w-full">
      <svg viewBox="0 0 100 40" role="img" className="w-full h-full">
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="currentColor"
          className="text-primary dark:text-primary/80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={norm.map((n, i) => `${(i / Math.max(1, norm.length - 1)) * 100},${40 - n * 36}`).join(' ')}
        />
        <polygon
          fill="url(#sparklineGradient)"
          points={`0,40 ${norm.map((n, i) => `${(i / Math.max(1, norm.length - 1)) * 100},${40 - n * 36}`).join(' ')} 100,40`}
        />
      </svg>
    </div>
  );
};


