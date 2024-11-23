import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TableToPDF from '@/components/TableToPDF';

// Mock html2pdf more explicitly
const mockSave = jest.fn();
const mockFrom = jest.fn().mockReturnThis();
const mockSet = jest.fn().mockReturnThis();

jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    set: mockSet,
    from: mockFrom,
    save: mockSave
  }))
}));

// Mock WeeklyPlan component
jest.mock('@/components/WeeklyPlan', () => {
  return function MockWeeklyPlan({ data }) {
    return <div data-testid="weekly-plan">Weekly Plan Mock</div>;
  };
});

describe('TableToPDF Component', () => {
  const mockData = [
    {
      day: 'Monday',
      exercises: [
        { exercise: 'Push-ups', sets: '3', reps: '10', weight: 'bodyweight', rest: '60s' }
      ]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when data is empty', () => {
    render(<TableToPDF data={[]} />);
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
  });

  test('renders download button when data is provided', () => {
    render(<TableToPDF data={mockData} />);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  test('handles download button click', async () => {
    render(<TableToPDF data={mockData} />);
    const downloadButton = screen.getByText('Download');
    
    fireEvent.click(downloadButton);
    
    await waitFor(() => {
      expect(mockSet).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });
  });
});