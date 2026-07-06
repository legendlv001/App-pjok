import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY_GEMINI,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { message, muridName } = req.body;

    const prompt = `Kamu adalah Si AGBI, asisten guru PJOK SDN 1 Parigi.
Murid bernama ${muridName}.
Pertanyaan: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      reply: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Maaf, sistem sedang sibuk.",
    });
  }
}
