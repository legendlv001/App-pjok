// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        // Cara pemanggilan yang benar untuk SDK Google Generative AI
        const response = await genAI.listModels();
        console.log("DAFTAR MODEL:", JSON.stringify(response));
        res.status(200).json({ models: response });
    } catch (error) {
        console.error("Error Detail:", error);
        res.status(500).json({ error: error.message });
    }
}
