import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // MENGGANTI KE MODEL 1.5 FLASH
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Teknik prompt agar AI tetap menjadi asisten PJOK SD Negeri 1 Parigi
    const fullPrompt = `Anda adalah asisten Guru PJOK SD Negeri 1 Parigi. 
    Selalu jawab pertanyaan dengan fokus pada PJOK, olahraga, dan kesehatan SD. 
    Jika di luar topik, arahkan kembali ke olahraga. 
    Berikut pertanyaan pengguna: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Gagal memproses permintaan AI." });
  }
}
