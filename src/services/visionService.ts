
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (ai) return ai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Vision features will be disabled.");
    return null;
  }
  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export interface ValidationResult {
  isValid: boolean;
  isWaste: boolean;
  isRealPhoto: boolean;
  reason?: string;
}

export const validateWasteImage = async (base64Image: string): Promise<ValidationResult> => {
  try {
    const aiInstance = getAI();
    if (!aiInstance) {
      console.warn("Vision AI not initialized due to missing API key.");
      return { isValid: true, isWaste: true, isRealPhoto: true };
    }

    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            text: "Analyze this image. Is it a photo of real physical waste or recyclable material (plastic, metal, paper, glass, etc.)? Does it look like a genuine photo taken by a user? Respond in JSON format with keys: 'isWaste' (boolean), 'isRealPhoto' (boolean), and 'reason' (string explaining why if it's invalid)."
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      isValid: result.isWaste && result.isRealPhoto,
      isWaste: result.isWaste,
      isRealPhoto: result.isRealPhoto,
      reason: result.reason
    };
  } catch (error) {
    console.error("Vision validation error:", error);
    // Fallback to true if AI fails, to not block users, but log it
    return { isValid: true, isWaste: true, isRealPhoto: true };
  }
};
