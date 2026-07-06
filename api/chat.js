// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method tidak diizinkan." });
    }
    
    const { message, muridName } = req.body;
    
    // Inisialisasi API Key dari Environment Variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // MENGGUNAKAN "gemini-pro" KARENA INI ADALAH MODEL PALING STABIL 
    // DAN PASTI DITERIMA OLEH SEMUA API KEY GOOGLE AI STUDIO
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const prompt = `Kamu adalah Si AGBI, asisten guru PJOK SDN 1 Parigi. Murid bernama ${muridName}. Berikan jawaban singkat, ramah, menyenangkan, dan edukatif seputar materi PJOK. Pertanyaan murid: ${message}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();
        
        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ 
            reply: "Maaf, Si AGBI sedang istirahat. Silakan coba beberapa saat lagi." 
        });
    }
}
