// /functions/tanya-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Pastikan header CORS agar tidak kena blokir oleh browser
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { pesan, namaMurid } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Menyisipkan nama murid agar AGBI lebih akrab
    const prompt = `Nama murid: ${namaMurid}. Pertanyaan: ${pesan}. 
                    Anda adalah asisten PJOK SDN 1 PARIGI. Berikan jawaban yang ramah.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ balasan: response.text() }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ balasan: "Si AGBI sedang lelah, coba tanya lagi nanti ya!" }) 
    };
  }
};
