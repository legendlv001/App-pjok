// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method tidak diizinkan." });
    }
    
    const { message, muridName } = req.body;
    
    // Pastikan API Key di Vercel Settings sudah benar dan tidak terpotong
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Menggunakan model "gemini-1.5-flash-8b"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    try {
        const prompt = `Kamu adalah Si AGBI, asisten guru PJOK SDN 1 Parigi. Murid bernama ${muridName}. Berikan jawaban singkat, ramah, dan edukatif tentang PJOK. Pertanyaan: ${message}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();
        
        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ 
            reply: "Maaf, Si AGBI sedang perlu istirahat sebentar. Coba lagi nanti ya!" 
        });
    }
}
