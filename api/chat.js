// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method tidak diizinkan." });
    }
    
    const { message, muridName } = req.body;
    
    // Inisialisasi menggunakan model flash yang stabil[span_1](start_span)[span_1](end_span)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    try {
        const prompt = `Kamu adalah asisten guru PJOK SDN 1 Parigi bernama Si AGBI. Murid bernama ${muridName}. Berikan jawaban singkat, ramah, menyenangkan, dan edukatif. Pertanyaan murid: ${message}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();
        
        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error AI:", error);
        res.status(500).json({ reply: "Maaf, Si AGBI sedang istirahat. Coba lagi nanti ya!" });
    }
}
