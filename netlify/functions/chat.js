// Isi file: netlify/functions/chat.js
exports.handler = async (event) => {
  // Pastikan metode permintaan adalah POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const API_KEY = process.env.API_KEY; // Mengambil dari Environment Variables Netlify

    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "API Key tidak ditemukan" }) };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { 
          parts: [{ text: "Anda adalah asisten khusus PJOK SDN 1 PARIGI. Jawab hanya seputar olahraga." }] 
        },
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Memeriksa apakah ada jawaban dari model
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Gagal mendapatkan jawaban dari AI" })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan pada server" })
    };
  }
};
