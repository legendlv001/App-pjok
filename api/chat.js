import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Hanya izinkan metode POST untuk keamanan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Mengambil API Key dari Environment Variable Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key tidak terkonfigurasi di Vercel");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Konfigurasi model dengan instruksi khusus (System Instruction)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Anda adalah Si AGBI, asisten pendamping Guru PJOK di SD Negeri 1 Parigi. 
      Tugas utama Anda adalah menjawab pertanyaan seputar Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK) untuk tingkat Sekolah Dasar. 
      Gunakan bahasa yang santun, edukatif, dan mudah dipahami siswa SD. 
      Jika ada pertanyaan di luar topik PJOK atau olahraga, dengan sopan arahkan kembali ke topik tersebut: 
      'Maaf, sebagai asisten khusus PJOK SD Negeri 1 Parigi, saya hanya bisa menjawab pertanyaan seputar olahraga dan kesehatan. Mari kita bahas materi PJOK saja!'`
    });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Pertanyaan tidak boleh kosong" });
    }

    // Memproses permintaan ke AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Mengirim jawaban kembali ke frontend
    return res.status(200).json({ text: text });
    
  } catch (error) {
    console.error("Error Detail:", error);
    return res.status(500).json({ error: "Terjadi kesalahan pada sistem AI." });
  }
}
