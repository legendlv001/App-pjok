import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Menggunakan model 3.5 tanpa filter atau systemInstruction tambahan
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Gagal memproses permintaan AI." });
  }
}
