# Admin Analytics Dashboard

A comprehensive analytics dashboard for the admin panel with full light/dark mode support, built using React, TypeScript, and Recharts.

## Features

### 🎨 **Theme Support**
- **Light/Dark Mode**: Seamless switching between light and dark themes
- **System Theme**: Automatically follows user's system preference
- **Theme Toggle**: Built-in theme switcher in the dashboard header
- **CSS Custom Properties**: Uses your app's design system colors
- **Accessible**: High contrast ratios and proper color semantics

### 📊 **Dashboard Widgets**
1. **KPI Cards**: DAU, New Signups (7d), Trips Created (7d), Published Trips (7d)
   - Sparkline charts with gradient fills
   - Percentage change indicators
   - Hover effects and smooth transitions

2. **Line Chart**: Trips over time with theme-aware styling
   - Responsive design
   - Interactive tooltips
   - Smooth animations

3. **Donut Chart**: Expense distribution with custom colors
   - Uses CSS custom properties for theme colors
   - Interactive segments
   - Total calculation display

4. **Bar Chart**: Top cities by trips
   - Theme-aware bars and axes
   - Hover effects
   - Responsive layout

5. **Data Table**: Top activities with search and pagination
   - Searchable by title or city
   - Paginated results (5 per page)
   - Hover effects on rows

### 🎛️ **Controls & Filters**
- **Date Range Picker**: Custom datetime inputs
- **Granularity Toggle**: Day/Week/Month views
- **Quick Ranges**: 7d, 30d, 90d buttons
- **Refresh Button**: Manual data reload
- **CSV Export**: Download current table data

## Theme Implementation

### Color System
The dashboard uses your app's CSS custom properties:

```css
/* Light Mode */
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--card: oklch(1 0 0);
--border: oklch(0.922 0 0);
--primary: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);

/* Dark Mode */
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--card: oklch(0.205 0 0);
--border: oklch(1 0 0 / 10%);
--primary: oklch(0.922 0 0);
--muted: oklch(0.269 0 0);
--muted-foreground: oklch(0.708 0 0);
```

### Chart Colors
Charts use theme-aware colors from your design system:
- `--chart-1` through `--chart-5`: Predefined chart colors
- `--primary`: Primary brand color for highlights
- Automatic contrast adjustment for dark mode

## File Structure

```
frontend/src/
├── pages/Admin/
│   └── Analytics.tsx              # Main dashboard page
├── components/admin/
│   ├── AnalyticsKPI.tsx           # KPI cards with sparklines
│   ├── AnalyticsTable.tsx         # Searchable data table
│   ├── DateRangePicker.tsx        # Date range controls
│   └── AnalyticsCharts/
│       ├── LineChartCard.tsx      # Time series chart
│       ├── BarChartCard.tsx       # Bar chart component
│       └── DonutChartCard.tsx     # Pie/donut chart
├── services/api/
│   └── analytics.ts               # Mock API client
├── mocks/
│   └── analytics.json             # Mock data payload
└── tests/admin/
    └── Analytics.test.tsx         # Component tests
```

## API Contract

```typescript
export type AnalyticsPayload = {
  kpis: {
    key: string;
    label: string;
    value: number;
    changePct: number;
    sparkline: number[];
  }[];
  tripsSeries: { date: string; count: number }[];
  expenseDistribution: { category: string; amount: number }[];
  topCities: { city: string; trips: number }[];
  topActivities: {
    id: number;
    title: string;
    city: string;
    uses: number;
    avg_cost: number;
  }[];
};
```

## Usage

### Basic Setup
```tsx
import Analytics from '@/pages/Admin/Analytics';

// In your router
<Route path="/admin/analytics" element={<Analytics />} />
```

### Theme Integration
The dashboard automatically integrates with your existing theme system:
- Uses `useTheme()` hook for theme state
- Respects system theme preferences
- Persists theme choice in localStorage
- Smooth transitions between themes

### Customization
```tsx
// Custom chart colors
const customColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--primary))'
];

// Custom date ranges
const customRanges = [
  { label: 'Last Week', days: 7 },
  { label: 'Last Month', days: 30 },
  { label: 'Last Quarter', days: 90 }
];
```

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Theme colors meet WCAG contrast requirements
- **Focus Indicators**: Clear focus states for all interactive elements
- **Semantic HTML**: Proper table structure and form labels

## Performance Optimizations

- **Lazy Loading**: Charts load on demand using `React.lazy()`
- **Memoization**: Expensive calculations are memoized
- **Debounced Search**: Table search is debounced for performance
- **Virtual Scrolling**: Large datasets can be virtualized (future enhancement)

## Testing

```bash
# Run tests
npm run test

# Test coverage
npm run test -- --coverage
```

### Test Coverage
- ✅ Component rendering
- ✅ User interactions
- ✅ Theme switching
- ✅ Data filtering
- ✅ CSV export functionality

## Future Enhancements

- [ ] Real-time data updates
- [ ] Advanced filtering options
- [ ] Custom date range presets
- [ ] Export to PDF/Excel
- [ ] Drill-down capabilities
- [ ] Custom dashboard layouts
- [ ] Real-time notifications
- [ ] Performance metrics

## Troubleshooting

### Theme Issues
- Ensure CSS custom properties are properly defined
- Check that `useTheme` hook is working
- Verify localStorage permissions

### Chart Rendering
- Check Recharts version compatibility
- Ensure data format matches expected schema
- Verify CSS custom properties are accessible

### Performance
- Monitor bundle size with chart libraries
- Consider code splitting for large datasets
- Implement virtual scrolling for tables >1000 rows
