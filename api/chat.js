import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Perintah untuk menarik daftar model yang diizinkan untuk API Key ini
        const models = await genAI.listModels();
        console.log("DAFTAR MODEL:", JSON.stringify(models));
        res.status(200).json({ status: "Silakan cek log Vercel untuk daftar model." });
    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ error: error.message });
    }
}
