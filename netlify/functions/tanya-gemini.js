const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { pesan } = JSON.parse(event.body);
    
    // Inisialisasi Gemini dengan API Key dari Environment Variable Netlify[span_1](start_span)[span_1](end_span)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Menggunakan model gemini-1.0-pro untuk stabilitas
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

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
      body: JSON.stringify({ error: "Gagal terhubung ke server AI" }) 
    };
  }
};
