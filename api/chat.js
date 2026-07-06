// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method tidak diizinkan" });

    // 1. Pastikan API Key di Vercel Settings benar-benar milik Google AI Studio
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API Key tidak ditemukan di server" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Menggunakan model standar yang paling banyak didukung
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const { message, muridName } = req.body;
        const prompt = `Kamu adalah Si AGBI, asisten guru PJOK SDN 1 Parigi. Murid bernama ${muridName}. Pertanyaan: ${message}`;
        
        const result = await model.generateContent(prompt);
        res.status(200).json({ reply: result.response.text() });
    } catch (error) {
        // Jika error 404 muncul lagi, artinya API Key Anda tidak punya akses ke model ini
        console.error("DEBUG_ERROR:", error.message);
        res.status(500).json({ error: "Model tidak dapat diakses. Silakan periksa apakah API Key di Vercel sudah benar." });
    }
}
