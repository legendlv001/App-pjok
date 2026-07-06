// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Memastikan hanya menerima method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method tidak diizinkan." });
    }
    
    const { message, muridName } = req.body;
    
    // Inisialisasi API Key dari Environment Variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ID model yang stabil dan didukung secara resmi
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const prompt = `Kamu adalah Si AGBI, asisten guru PJOK SDN 1 Parigi. Murid bernama ${muridName}. Berikan jawaban singkat, ramah, menyenangkan, dan edukatif seputar materi PJOK. Pertanyaan murid: ${message}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();
        
        res.status(200).json({ reply });
    } catch (error) {
        // Logging error ke konsol untuk pengecekan di Vercel Dashboard
        console.error("Error Detail:", error.message);
        
        // Memberikan respon yang ramah kepada murid jika terjadi kegagalan sistem
        res.status(500).json({ 
            reply: "Maaf, Si AGBI sedang perlu istirahat sebentar untuk berlatih olahraga. Silakan tanya lagi ya!" 
        });
    }
}
