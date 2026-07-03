const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { pesan } = JSON.parse(event.body);
    
    // Inisialisasi API dengan key yang tersimpan di environment Netlify
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Gunakan model yang didukung secara resmi
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Panggilan fungsi yang benar sesuai dokumentasi
    const result = await model.generateContent(pesan);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balasan: text }),
    };
  } catch (error) {
    console.error("Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Gagal memproses permintaan AI" }) 
    };
  }
};
