const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { pesan } = req.body;
    
    // Inisialisasi Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(pesan);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ balasan: text });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Gagal memproses AI" });
  }
};
