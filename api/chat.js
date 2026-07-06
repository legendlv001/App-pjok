import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method tidak diizinkan." });
    }
    
    const { message, muridName } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Coba gunakan model "gemini-1.5-flash" 
    // Jika masih 404, silakan ganti string ini menjadi "gemini-1.5-flash-001"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const prompt = `Kamu adalah Si AGBI, asisten guru PJOK SDN 1 Parigi. Murid bernama ${muridName}. Berikan jawaban singkat, ramah, dan edukatif tentang PJOK. Pertanyaan: ${message}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        console.error("Error AI:", error);
        res.status(500).json({ reply: "Maaf, Si AGBI sedang istirahat. Coba lagi nanti." });
    }
}
