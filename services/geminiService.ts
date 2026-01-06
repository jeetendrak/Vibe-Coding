
import { GoogleGenAI, Type } from "@google/genai";

export interface ParsedSMS {
  type: 'debit' | 'credit';
  amount: number;
  merchant: string;
  date: string;
  account: string;
  category: string;
}

export const parseSMSWithGemini = async (smsText: string): Promise<ParsedSMS | null> => {
  try {
    // Instantiate right before usage as per best practices and to ensure the most up-to-date API key is used
    // Directly use process.env.API_KEY as per SDK initialization guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this Indian bank/UPI SMS and extract transaction details. SMS: "${smsText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['debit', 'credit'] },
            amount: { type: Type.NUMBER },
            merchant: { type: Type.STRING },
            date: { type: Type.STRING },
            account: { type: Type.STRING },
            category: { type: Type.STRING, description: 'Best matching finance category like Food, Travel, Shopping, Bill, etc.' }
          },
          required: ['type', 'amount', 'merchant', 'date', 'category']
        }
      }
    });

    // The .text property is a getter that returns the generated text directly
    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr) as ParsedSMS;
    }
    return null;
  } catch (error) {
    console.error("Gemini SMS parsing error:", error);
    return null;
  }
};
