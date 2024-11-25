require("@testing-library/jest-dom");

jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "mocked response" } }],
        }),
      };
    }),
  };
});

// require("dotenv").config({ path: ".env.local" });
process.env.OPENAI_API_KEY = "mocked-api-key";
