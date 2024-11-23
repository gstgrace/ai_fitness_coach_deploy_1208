import { generatePrompt } from "@/pages/api/generate";
import { OpenAI } from "openai"; 
import {dotenv} from 'dotenv';

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });


// Mock OpenAI API to prevent actual API calls in tests
jest.mock('openai', () => {
    return {
      OpenAI: jest.fn().mockImplementation(() => {
        return {
          chat: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'mocked response' } }],
          }),
        };
      }),
    };
  });

describe("generatePrompt", () => {
  it("should generate a prompt with user data embedded correctly", () => {
    const userData = {
      height: 170,
      weight: 70,
      age: 25,
      gender: "male",
      fitnessLevel: "beginner",
      goal: "weight_loss",
    };

    const result = generatePrompt(userData);

    // Check that all data is embedded in the prompt
    expect(result).toContain(`"height":170`);
    expect(result).toContain(`"weight":70`);
    expect(result).toContain(`"age":25`);
    expect(result).toContain(`"gender":"male"`);
    expect(result).toContain(`"goal":"weight_loss"`);
  });

  it("should generate a prompt even when user data is missing", () => {
    const userData = {}; // Empty user data
    const result = generatePrompt(userData);

    // Check that the prompt still includes basic structure
    expect(result).toContain("Based on the user data below, generate an exercise plan for a week.");
    expect(result).toContain("{}"); // Empty JSON
  });

  it("should include JSON requirements in the generated prompt", () => {
    const userData = {
      height: 180,
      weight: 80,
      age: 30,
      gender: "female",
      fitnessLevel: "intermediate",
      goal: "muscle_gain",
    };

    const result = generatePrompt(userData);

    // Check that the JSON structure instructions are included
    expect(result).toContain("Generate 3 exercises per day.");
    expect(result).toContain("Saturday and Sunday are rest days.");
    expect(result).toContain("Output the result as **valid JSON only**");
  });
});

console.log(process.env.OPENAI_API_KEY);  // Should print the OpenAI API key if loaded correctly
