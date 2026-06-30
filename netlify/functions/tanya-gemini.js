// netlify/functions/tanya-gemini.js
const { GoogleGenAI } = require('@google/genai');

exports.handler = async function(event, context) {
  // Pastikan GEMINI_API_KEY sudah dimasukkan di Environment Variables Netlify
  const apiKey = process.env.GEMINI_API_KEY;
  
  // PERBAIKAN: Inisialisasi SDK yang benar untuk @google/genai
  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Validasi jika method bukan POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Gunakan POST." }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // PERBAIKAN: Pemanggilan model menggunakan ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: data.pesan, // Pastikan payload dari frontend mengirimkan properti "pesan"
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // Tambahkan CORS jika frontend Anda di-host di tempat berbeda
        "Access-Control-Allow-Origin": "*", 
      },
      body: JSON.stringify({ balasan: response.text }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || error.toString() }) 
    };
  }
};
