import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomSelect from '@/components/form/CustomSelect';
import InputText from '@/components/form/InputText';

describe('CustomSelect Component', () => {
  const mockValues = [
    { value: 'beginner', title: 'Beginner' },
    { value: 'intermediate', title: 'Intermediate' },
    { value: 'advanced', title: 'Advanced' }
  ];

  test('renders label correctly', () => {
    render(<CustomSelect label="Fitness Level" id="fitnessLevel" values={mockValues} />);
    expect(screen.getByLabelText('Fitness Level')).toBeInTheDocument();
  });

  test('renders all option values', () => {
    render(<CustomSelect label="Fitness Level" id="fitnessLevel" values={mockValues} />);
    mockValues.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('select has correct attributes', () => {
    render(<CustomSelect label="Fitness Level" id="fitnessLevel" values={mockValues} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'fitnessLevel');
    expect(select).toHaveAttribute('name', 'fitnessLevel');
  });
});

describe('InputText Component', () => {
  test('renders label correctly', () => {
    render(<InputText label="Height (cm)" id="height" />);
    expect(screen.getByLabelText('Height (cm)')).toBeInTheDocument();
  });

  test('input has correct attributes', () => {
    render(<InputText label="Height (cm)" id="height" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'height');
    expect(input).toHaveAttribute('name', 'height');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('input allows text entry', async () => {
    const user = userEvent.setup();
    render(<InputText label="Height (cm)" id="height" />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, '175');
    expect(input).toHaveValue('175');
  });
});