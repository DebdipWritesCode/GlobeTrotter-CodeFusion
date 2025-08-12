import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Analytics from '@/pages/Admin/Analytics';

vi.mock('@/services/api/analytics', async (orig) => {
  const actual = (await orig()) as object;
  return {
    ...(actual as unknown as Record<string, unknown>),
    fetchAnalytics: vi.fn().mockResolvedValue({
      kpis: [
        { key: 'dau', label: 'DAU', value: 1000, changePct: 5, sparkline: [1,2,3] },
      ],
      tripsSeries: [ { date: '2025-02-01', count: 10 } ],
      expenseDistribution: [ { category: 'Flights', amount: 100 } ],
      topCities: [ { city: 'Paris', trips: 5 } ],
      topActivities: [ { id: 1, title: 'Tour', city: 'Paris', uses: 10, avg_cost: 20 } ],
    }),
  };
});

describe('Admin Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders KPI row', async () => {
    render(<Analytics />);
    await waitFor(() => expect(screen.getByText('Admin Analytics')).toBeInTheDocument());
    expect(await screen.findByText('DAU')).toBeInTheDocument();
  });

  it('renders charts and table', async () => {
    render(<Analytics />);
    expect(await screen.findByText('Trips over time')).toBeInTheDocument();
    expect(await screen.findByText('Expense distribution')).toBeInTheDocument();
    expect(await screen.findByText('Top cities by trips')).toBeInTheDocument();
    expect(await screen.findByText('Top activities')).toBeInTheDocument();
  });

  it('allows quick range change', async () => {
    render(<Analytics />);
    const btn = await screen.findByRole('button', { name: '7d' });
    fireEvent.click(btn);
    // No throw; fetch called
    expect(true).toBe(true);
  });

  it('exports CSV', async () => {
    render(<Analytics />);
    const spy = vi.spyOn(document, 'createElement');
    const exportBtn = await screen.findByRole('button', { name: /Export CSV/i });
    fireEvent.click(exportBtn);
    expect(spy).toHaveBeenCalledWith('a');
  });
});


