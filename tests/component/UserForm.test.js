import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '../../components/UserForm';
import { AI_SOURCES, FITNESS_LEVELS, GENDERS, GOALS } from '@/constants';


// Mock react-hot-toast properly
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

describe('UserForm Component', () => {
  const mockSetData = jest.fn();
  const mockSetLoading = jest.fn();
  const toast = require('react-hot-toast');

  beforeEach(() => {
    fetch.mockClear();
    mockSetData.mockClear();
    mockSetLoading.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
  });

  test('renders all form fields', () => {
    render(<UserForm setData={mockSetData} setLoading={mockSetLoading} loading={false} />);
    
    expect(screen.getByLabelText(/AI Source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fitness Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal/i)).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const mockResponse = { 
      ok: true, 
      json: () => Promise.resolve({ result: [] }) 
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(<UserForm setData={mockSetData} setLoading={mockSetLoading} loading={false} />);
    
    const form = screen.getByTestId('user-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(fetch).toHaveBeenCalled();
      expect(mockSetData).toHaveBeenCalledWith([]);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(toast.success).toHaveBeenCalledWith('Workout generated!');
    });
  });

  test('handles API error', async () => {
    const errorMessage = 'API Error';
    const mockResponse = { 
      ok: false, 
      json: () => Promise.resolve({ error: { message: errorMessage } }) 
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(<UserForm setData={mockSetData} setLoading={mockSetLoading} loading={false} />);
    
    const form = screen.getByTestId('user-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('shows loading state during submission', () => {
    render(<UserForm setData={mockSetData} setLoading={mockSetLoading} loading={true} />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});