import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { User } from '../types';

// Initialize Gemini API
// Note: process.env.API_KEY is assumed to be available in the build environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });
const modelId = 'gemini-2.5-flash';

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure process.env.API_KEY.";
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI.";
  }
};

export const analyzeProfileMatch = async (userA: User, userB: User): Promise<string> => {
  if (!apiKey) return "AI Match analysis requires API Key.";

  const prompt = `
    Compare the following two research profiles and provide a brief, 2-sentence analysis on why they might be a good collaboration match.
    
    User 1: ${userA.name} (${userA.role} at ${userA.institution}). Interests: ${userA.interests.join(', ')}. Bio: ${userA.bio}.
    User 2: ${userB.name} (${userB.role} at ${userB.institution}). Interests: ${userB.interests.join(', ')}. Bio: ${userB.bio}.
  `;

  return getGeminiResponse(prompt);
};

export const polishResearchPitch = async (draft: string): Promise<string> => {
    if (!apiKey) return "AI Pitch Polish requires API Key.";
    
    const prompt = `
      Rewrite the following research pitch to be more engaging, professional, and suitable for a social media post for academics (like LinkedIn or Twitter). Keep it under 280 characters if possible, but prioritize clarity.
      
      Draft: "${draft}"
    `;
    return getGeminiResponse(prompt);
}
