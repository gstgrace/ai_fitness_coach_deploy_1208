import {TextServiceClient} from "@google-ai/generativelanguage"
import {GoogleAuth} from "google-auth-library"

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.PALM_API_KEY;

const client = new TextServiceClient({
	apiKey: API_KEY, // Use apiKey directly
	fallback: true,
  });
  
  const extractJSON = (output) => {
	const jsonStartIndex = output.indexOf("[");
	const jsonEndIndex = output.lastIndexOf("]") + 1;
	const json = output.substring(jsonStartIndex, jsonEndIndex);
	return JSON.parse(json);
  };
  
  export const generateText = async (prompt) => {
	try {
	  const response = await client.generateText({
		model: MODEL_NAME,
		temperature: 0.25,
		candidateCount: 1,
		top_k: 40,
		top_p: 0.95,
		max_output_tokens: 5000,
		prompt: {
		  text: prompt,
		},
	  });
  
	  return extractJSON(response[0].candidates[0].output);
	} catch (e) {
	  console.error(e);
	  throw new Error(e.message);
	}
  };