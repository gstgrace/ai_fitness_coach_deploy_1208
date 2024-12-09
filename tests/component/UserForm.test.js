import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserForm from "../../components/UserForm"; // Adjust path if needed
import { AI_SOURCES, FITNESS_LEVELS, GENDERS, GOALS } from "@/constants";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("UserForm Component", () => {
  const mockSetData = jest.fn();
  const mockSetLoading = jest.fn();
  const toast = require("react-hot-toast");

  beforeEach(() => {
    fetch.mockClear();
    mockSetData.mockClear();
    mockSetLoading.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
  });

  test("renders all form fields", () => {
    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={false}
      />
    );

    expect(screen.getByLabelText(/AI Source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height \(cm\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age \(yr\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fitness Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal/i)).toBeInTheDocument();
  });

  test("handles form submission successfully", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ result: [] }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={false}
      />
    );

    // Provide valid input values so that validation passes
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
      target: { value: "170" },
    });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: "70" },
    });
    fireEvent.change(screen.getByLabelText(/Age \(yr\)/i), {
      target: { value: "30" },
    });

    fireEvent.submit(screen.getByTestId("user-form"));

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(fetch).toHaveBeenCalled();
      expect(mockSetData).toHaveBeenCalledWith([]);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(toast.success).toHaveBeenCalledWith("Workout generated!");
    });
  });

  test("handles API error", async () => {
    const errorMessage = "API Error";
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: { message: errorMessage } }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={false}
      />
    );

    // Provide valid input values
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
      target: { value: "170" },
    });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: "70" },
    });
    fireEvent.change(screen.getByLabelText(/Age \(yr\)/i), {
      target: { value: "30" },
    });

    fireEvent.submit(screen.getByTestId("user-form"));

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test("shows loading state during submission", () => {
    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={true}
      />
    );
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  test("shows error toast if height is non-numeric", async () => {
    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={false}
      />
    );

    // Non-numeric height
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: "70" },
    });
    fireEvent.change(screen.getByLabelText(/Age \(yr\)/i), {
      target: { value: "30" },
    });

    fireEvent.submit(screen.getByTestId("user-form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid height input: Must be a number.")
      );
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  test("shows error toast if weight is out of range", async () => {
    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={false}
      />
    );

    // Weight too large
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
      target: { value: "170" },
    });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByLabelText(/Age \(yr\)/i), {
      target: { value: "30" },
    });

    fireEvent.submit(screen.getByTestId("user-form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid weight input:")
      );
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  test("shows error toast if age is out of range", async () => {
    render(
      <UserForm
        setData={mockSetData}
        setLoading={mockSetLoading}
        loading={false}
      />
    );

    // Age too low
    fireEvent.change(screen.getByLabelText(/Height \(cm\)/i), {
      target: { value: "170" },
    });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: "70" },
    });
    fireEvent.change(screen.getByLabelText(/Age \(yr\)/i), {
      target: { value: "-1" },
    });

    fireEvent.submit(screen.getByTestId("user-form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid age input:")
      );
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
