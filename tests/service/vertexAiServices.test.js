process.env.GOOGLE_SERVICE_KEY = Buffer.from(
  JSON.stringify({
    client_email: "test@test.com",
    client_id: "123",
    private_key: "test-key",
  })
).toString("base64");

// Mock the entire Vertex AI module
const mockGenerateContent = jest.fn();

jest.mock("@google-cloud/vertexai", () => {
  return {
    VertexAI: jest.fn().mockImplementation(() => ({
      preview: {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent,
        }),
      },
    })),
  };
});

// Now require the module after mocks are set
const {
  generateText,
  preprocessOutput,
} = require("../../services/vertexAiServices");

describe("Vertex AI Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("preprocessOutput", () => {
    test("removes code fences and extracts JSON", () => {
      const input = '```json\n[{"test": "data"}]\n```';
      const result = preprocessOutput(input);
      expect(result).toBe('[{"test": "data"}]');
    });

    test("handles input without code fences", () => {
      const input = '[{"test": "data"}]';
      const result = preprocessOutput(input);
      expect(result).toBe('[{"test": "data"}]');
    });

    test("handles empty string", () => {
      const input = "";
      const result = preprocessOutput(input);
      expect(result).toBe("");
    });

    test("handles null or undefined input", () => {
      expect(preprocessOutput(null)).toBe("");
      expect(preprocessOutput(undefined)).toBe("");
    });

    test("handles whitespace", () => {
      const input = '  \n  [{"test": "data"}]  \n  ';
      const result = preprocessOutput(input);
      expect(result).toBe('[{"test": "data"}]');
    });
  });

  describe("generateText", () => {
    test("successfully generates text", async () => {
      const mockResponse = {
        response: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '[{"day": "Monday"}]',
                  },
                ],
              },
            },
          ],
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await generateText("test prompt");
      expect(result).toEqual([{ day: "Monday" }]);
    });

    test("handles complex workout data", async () => {
      const mockResponse = {
        response: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '[{"day": "Monday", "exercises": [{"name": "Squats", "sets": "3", "reps": "12"}]}]',
                  },
                ],
              },
            },
          ],
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await generateText("test prompt");
      expect(result).toEqual([
        {
          day: "Monday",
          exercises: [{ name: "Squats", sets: "3", reps: "12" }],
        },
      ]);
    });

    test("handles empty prompt", async () => {
      await expect(generateText("")).rejects.toThrow(
        "Prompt input is required"
      );
    });

    test("handles null prompt", async () => {
      await expect(generateText(null)).rejects.toThrow(
        "Prompt input is required"
      );
    });

    test("handles invalid response format", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          candidates: [],
        },
      });
      await expect(generateText("test prompt")).rejects.toThrow(
        "Invalid response format"
      );
    });

    test("handles malformed JSON in response", async () => {
      const mockResponse = {
        response: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: "invalid json",
                  },
                ],
              },
            },
          ],
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      await expect(generateText("test prompt")).rejects.toThrow();
    });

    test("handles missing parts in response", async () => {
      const mockResponse = {
        response: {
          candidates: [
            {
              content: {},
            },
          ],
        },
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      await expect(generateText("test prompt")).rejects.toThrow(
        "Invalid response format"
      );
    });
  });
});
