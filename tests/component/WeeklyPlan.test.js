import React from 'react';
import { render, screen } from '@testing-library/react';
import WeeklyPlan from '@/components/WeeklyPlan';

describe('WeeklyPlan Component', () => {
  const mockData = [
    {
      day: 'Monday',
      exercises: [
        { exercise: 'Push-ups', sets: '3', reps: '10', weight: 'bodyweight', rest: '60s' }
      ]
    }
  ];

  test('renders day correctly', () => {
    render(<WeeklyPlan data={mockData} />);
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });

  test('renders exercises table', () => {
    render(<WeeklyPlan data={mockData} />);
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(<WeeklyPlan data={[]} />);
    expect(screen.queryByText('Monday')).not.toBeInTheDocument();
  });
});