import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default and can be omitted if the environment variable is set
});
const OPEN_AI_CHAT_COMPLETION_MODEL = "gpt-3.5-turbo";
export const getCompletion = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: OPEN_AI_CHAT_COMPLETION_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const rawOutput = completion.choices[0].message.content;
    // Preprocess the output if necessary
    const cleanedOutput = preprocessOutput(rawOutput);
    return JSON.parse(cleanedOutput);
  } catch (error) {
    console.error("Error in getCompletion:", error);
    // Improved error handling based on the new SDK
    if (error instanceof OpenAI.APIError) {
      console.error("Status:", error.status);
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Type:", error.type);
    }
    throw error;
  }
};
// Helper function to preprocess the output
const preprocessOutput = (output) => {
  let cleanedOutput = output;
  // Remove code fences and extra text
  cleanedOutput = cleanedOutput.replace(/```json\s*/g, "");
  cleanedOutput = cleanedOutput.replace(/```/g, "");
  cleanedOutput = cleanedOutput.trim();
  // Extract JSON content between the first '[' and the last ']'
  const jsonStart = cleanedOutput.indexOf("[");
  const jsonEnd = cleanedOutput.lastIndexOf("]") + 1;
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleanedOutput = cleanedOutput.substring(jsonStart, jsonEnd);
  } else {
    // If brackets are not found, throw an error
    throw new Error("JSON data not found in the model output.");
  }
  return cleanedOutput;
};
