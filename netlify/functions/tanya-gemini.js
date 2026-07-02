const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Pastikan di Netlify Environment Variables sudah diisi GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { pesan } = JSON.parse(event.body);
    
    // Inisialisasi AI dengan instruksi sistem agar fokus ke PJOK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Anda adalah asisten khusus PJOK SDN 1 PARIGI. Jawab hanya seputar olahraga, kesehatan, dan kegiatan fisik. Jika pertanyaan di luar itu, arahkan kembali ke topik olahraga."
    });

    // Kirim pesan ke model
    const result = await model.generateContent(pesan);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify({ balasan: text }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Maaf, Si AGBI sedang istirahat. " + error.message }) 
    };
  }
};
