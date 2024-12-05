import { VertexAI } from "@google-cloud/vertexai";
// Decode the base64-encoded service key
const getCredentials = () => {
  try {
    return JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_KEY ?? "", "base64").toString()
    );
  } catch (e) {
    console.error("Error parsing credentials:", e);
    return {
      client_email: "",
      client_id: "",
      private_key: "",
    };
  }
};
const credential = getCredentials();
// Initialize the Vertex AI client
const vertexAI = new VertexAI({
  project: "linen-team-424400-k8",
  location: "us-central1",
  googleAuthOptions: {
    credentials: {
      client_email: credential.client_email,
      client_id: credential.client_id,
      private_key: credential.private_key,
    },
  },
});
// Specify the model name
const modelName = "gemini-1.5-flash";
// Get the generative model
const generativeModel = vertexAI.preview.getGenerativeModel({
  model: modelName,
});
// Add export here and handle null/undefined input
export const preprocessOutput = (output) => {
  if (!output) return "";
  // Remove code fences and any text before or after the JSON array
  let cleanedOutput = output;
  // Remove markdown code fences (e.g., ```json and ```)
  cleanedOutput = cleanedOutput.replace(/```json\s*/g, "");
  cleanedOutput = cleanedOutput.replace(/```/g, "");
  // Trim whitespace
  cleanedOutput = cleanedOutput.trim();
  // Optionally, remove any text before the first '[' and after the last ']'
  const jsonStart = cleanedOutput.indexOf("[");
  const jsonEnd = cleanedOutput.lastIndexOf("]") + 1;
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleanedOutput = cleanedOutput.substring(jsonStart, jsonEnd);
  }
  return cleanedOutput;
};
export const generateText = async (promptInput) => {
  try {
    if (!promptInput) {
      throw new Error("Prompt input is required");
    }
    const result = await generativeModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: promptInput,
            },
          ],
        },
      ],
    });
    // Add validation for response structure
    if (!result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format");
    }
    // Extract the generated text
    const rawOutput =
      result.response.candidates[0].content.parts[0].text.trim();
    // Preprocess the output to remove code fences and extra text
    const cleanedOutput = preprocessOutput(rawOutput);
    if (!cleanedOutput) {
      throw new Error("No valid JSON content found in response");
    }
    // Parse the cleaned output as JSON
    return JSON.parse(cleanedOutput);
  } catch (e) {
    console.error("Error generating text:", e);
    throw new Error(e.message);
  }
};
