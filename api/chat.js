import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Pastikan hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key tidak dikonfigurasi di Vercel" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Menggunakan gemini-1.5-flash dengan systemInstruction agar selalu fokus ke PJOK
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Anda adalah asisten AI pendamping Guru PJOK di SD Negeri 1 Parigi. " +
                         "Tugas utama Anda adalah menjawab pertanyaan seputar Pendidikan Jasmani, " +
                         "Olahraga, dan Kesehatan (PJOK) untuk tingkat Sekolah Dasar. " +
                         "Gunakan bahasa yang santun, edukatif, dan mudah dipahami siswa SD. " +
                         "Jika ada pertanyaan di luar topik PJOK atau olahraga, dengan sopan " +
                         "arahkan kembali ke topik tersebut: 'Maaf, sebagai asisten khusus PJOK " +
                         "SD Negeri 1 Parigi, saya hanya bisa menjawab pertanyaan seputar olahraga dan kesehatan. Mari kita bahas materi PJOK saja!'"
    });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt tidak ditemukan" });
    }

    // Menghasilkan konten
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });
    
  } catch (error) {
    console.error("Error API:", error);
    return res.status(500).json({ error: "Terjadi kesalahan koneksi ke AI." });
  }
}
