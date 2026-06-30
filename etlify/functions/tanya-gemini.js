// .netlify/functions/tanya-gemini.js
const { GoogleGenAI } = require('@google/genai');

exports.handler = async function(event, context) {
  // Di sini process.env BARU BISA DIBACA dengan aman dan rahasia
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const data = JSON.parse(event.body);
    // Panggil model Gemini (misal: gemini-2.5-flash)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: data.pesan,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ balasan: response.text }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
