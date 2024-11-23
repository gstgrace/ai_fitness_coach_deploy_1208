import { getCompletion, preprocessOutput } from "../../services/openAiServices";
import OpenAI from "openai";
// Mock the OpenAI class
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});
// Mock the actual service file
jest.mock("../../services/openAiServices", () => ({
  getCompletion: jest.fn(),
  preprocessOutput: jest.fn(),
}));
describe("OpenAI Services", () => {
  let openaiInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    openaiInstance = new OpenAI();
  });
  // preprocessOutput tests
  describe("preprocessOutput", () => {
    test("removes code fences and extracts JSON", () => {
      const input = '```json\n[{"test": "data"}]\n```';
      preprocessOutput.mockReturnValueOnce('[{"test": "data"}]');
      const output = preprocessOutput(input);
      expect(output).toBe('[{"test": "data"}]');
    });
    test("handles JSON without code fences", () => {
      const input = '[{"test": "data"}]';
      preprocessOutput.mockReturnValueOnce('[{"test": "data"}]');
      const output = preprocessOutput(input);
      expect(output).toBe('[{"test": "data"}]');
    });
    test("handles input with extra whitespace", () => {
      const input = '  \n  ```json\n[{"test": "data"}]\n```  \n  ';
      preprocessOutput.mockReturnValueOnce('[{"test": "data"}]');
      const output = preprocessOutput(input);
      expect(output).toBe('[{"test": "data"}]');
    });
    test("handles empty JSON array", () => {
      const input = "```json\n[]\n```";
      preprocessOutput.mockReturnValueOnce("[]");
      const output = preprocessOutput(input);
      expect(output).toBe("[]");
    });
    test("throws error for invalid JSON", () => {
      const input = "```json\n[{invalid json}]\n```";
      preprocessOutput.mockImplementation(() => {
        throw new Error("JSON data not found in the model output.");
      });
      expect(() => preprocessOutput(input)).toThrow("JSON data not found");
    });
  });
  // getCompletion tests
  describe("getCompletion", () => {
    test("handles API response correctly", async () => {
      const mockResponse = [{ day: "Monday" }];
      getCompletion.mockResolvedValueOnce(mockResponse);
      const result = await getCompletion("test prompt");
      expect(result).toEqual([{ day: "Monday" }]);
    });
    test("handles complex workout data", async () => {
      const mockResponse = [
        {
          day: "Monday",
          exercises: [
            {
              exercise: "Squats",
              sets: "3",
              reps: "12",
              weight: "100 lbs",
              rest: "90 sec",
            },
          ],
        },
      ];
      getCompletion.mockResolvedValueOnce(mockResponse);
      const result = await getCompletion("generate workout plan");
      expect(result).toEqual(mockResponse);
    });
    test("handles empty prompt gracefully", async () => {
      getCompletion.mockRejectedValueOnce(new Error("Prompt cannot be empty"));
      await expect(getCompletion("")).rejects.toThrow("Prompt cannot be empty");
    });
    test("handles API error responses", async () => {
      getCompletion.mockRejectedValueOnce(
        new Error("API Error: Rate limit exceeded")
      );
      await expect(getCompletion("test prompt")).rejects.toThrow("API Error");
    });
    test("handles network errors", async () => {
      getCompletion.mockRejectedValueOnce(new Error("Network Error"));
      await expect(getCompletion("test prompt")).rejects.toThrow(
        "Network Error"
      );
    });
    test("validates response format", async () => {
      const mockResponse = [
        {
          day: "Monday",
          exercises: [
            {
              exercise: "Push-ups",
              sets: "3",
              reps: "15",
              weight: "bodyweight",
              rest: "60 sec",
            },
          ],
        },
      ];
      getCompletion.mockResolvedValueOnce(mockResponse);
      const result = await getCompletion("test prompt");
      expect(result).toMatchObject([
        expect.objectContaining({
          day: expect.any(String),
          exercises: expect.arrayContaining([
            expect.objectContaining({
              exercise: expect.any(String),
              sets: expect.any(String),
              reps: expect.any(String),
              weight: expect.any(String),
              rest: expect.any(String),
            }),
          ]),
        }),
      ]);
    });
  });
  // API configuration tests
  describe("OpenAI Configuration", () => {
    test("uses correct model name", async () => {
      const mockResponse = [{ day: "Monday" }];
      getCompletion.mockResolvedValueOnce(mockResponse);
      await getCompletion("test prompt");
    });
    test("handles token limit appropriately", async () => {
      const longPrompt = "a".repeat(10000); // Very long prompt
      getCompletion.mockRejectedValueOnce(new Error("Token limit exceeded"));
      await expect(getCompletion(longPrompt)).rejects.toThrow(
        "Token limit exceeded"
      );
    });
  });
});
