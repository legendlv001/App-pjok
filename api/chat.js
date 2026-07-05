import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { prompt, muridName } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pastikan struktur data seperti di bawah ini
    const result = await model.generateContent(prompt);
    
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ text: "Maaf, Si AGBI sedang sibuk." });
  }
}
