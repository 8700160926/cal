import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const solveMathProblem = async (problem: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a helpful mathematical assistant. 
      Solve the following math problem or answer the math-related question. 
      Provide the final answer clearly, followed by a brief step-by-step explanation if necessary.
      Format math symbols nicely using standard text or simple markdown.
      
      Problem: ${problem}`,
      config: {
        systemInstruction: "You are a concise and precise math expert.",
      }
    });

    return response.text || "Sorry, I couldn't solve that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the AI service.");
  }
};

export const explainCalculation = async (expression: string, result: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Explain the calculation "${expression} = ${result}" in simple terms. 
      If it's a scientific operation, explain what the function does.`,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not retrieve explanation.";
  }
};