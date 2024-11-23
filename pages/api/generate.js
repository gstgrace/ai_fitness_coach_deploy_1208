import { getCompletion } from "@/services/openAiServices";
import { generateText } from "@/services/vertexAiServices";


export const generatePrompt = (userData) => {
  return `
  Based on the user data below, generate an exercise plan for a week.
  
  User data:
  ${JSON.stringify(userData)}
  
  Requirements:
  - Generate 3 exercises per day.
  - Saturday and Sunday are rest days.
  - Output the result as **valid JSON only**, without any additional text or formatting.
  - Do **not** include code snippets, code fences, explanations, or any text outside the JSON.
  - The JSON should follow this structure:
  
  [
	{
	  "day": "Monday",
	  "exercises": [
		{
		  "exercise": "...",
		  "sets": "...",
		  "reps": "...",
		  "weight": "...",
		  "rest": "..."
		}
	  ]
	}
  ]
  
  Notes:
  - The "reps" field is a string indicating the number of reps, including weight if needed.
  - The "rest" field indicates the rest time between sets.
  - The "weight" field is the weight to be used for the exercise, including units (e.g., "10 lbs"), or "---" if not applicable.
  - For rest days, return an object with "day" set to the day, and "exercises" containing a single object with "exercise" set to "Rest Day" and other fields as "---".
  
  Please provide the JSON output below:
  
  `;
};

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      let result;
      const { height, weight, age, gender, fitnessLevel, goal, model } =
        req.body;

      // generate the prompt
      const prompt = generatePrompt({
        height,
        weight,
        age,
        gender,
        fitnessLevel,
        goal,
      });

      // Debug logs
      console.log("Selected model:", model);
      console.log("Generated prompt:", prompt);

      if (model.toLowerCase() === "openai") {
        result = await getCompletion(prompt);
      } else if (model.toLowerCase() === "gemini") {
        result = await generateText(prompt);
      } else {
        throw new Error("Invalid model selected.");
      }

      return res.json({ result });
    } else {
      // Handle other HTTP methods or return an appropriate error response
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (e) {
    return res.status(405).json({ error: e.message });
  }
}
