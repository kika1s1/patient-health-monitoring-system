// utils/geminiDoctor.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getDoctorSummary(userInput: string, patientInfo: string): Promise<string> {
  try {
    const contentParts = [
      { text: "You are a medical AI assistant for doctors. Provide concise, helpful, and professional summaries and answers." },
      { text: `Patient Info:\n${patientInfo}\n\nDoctor's question: ${userInput}` }
    ];
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm sorry, something went wrong while processing your request.";
  }
}
