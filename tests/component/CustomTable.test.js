import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomTable from '@/components/CustomTable';

describe('CustomTable Component', () => {
  const mockExercises = [
    {
      exercise: 'Push-ups',
      sets: '3',
      reps: '10',
      weight: 'bodyweight',
      rest: '60s'
    }
  ];

  test('renders table headers correctly', () => {
    render(<CustomTable exercises={mockExercises} />);
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Sets')).toBeInTheDocument();
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('Weights')).toBeInTheDocument();
    expect(screen.getByText('Rest Between Sets')).toBeInTheDocument();
  });

  test('renders exercise data correctly', () => {
    render(<CustomTable exercises={mockExercises} />);
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('bodyweight')).toBeInTheDocument();
    expect(screen.getByText('60s')).toBeInTheDocument();
  });
});
