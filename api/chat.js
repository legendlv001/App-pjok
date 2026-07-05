import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Konfigurasi model dengan instruksi khusus agar selalu menjadi pakar PJOK SD
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      systemInstruction: `Anda adalah asisten AI pendamping Guru PJOK di SD Negeri 1 Parigi. 
      Tugas Anda adalah:
      1. Menjawab semua pertanyaan dengan fokus pada materi Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK) untuk siswa Sekolah Dasar.
      2. Menggunakan bahasa yang santun, edukatif, dan mudah dipahami oleh anak usia sekolah dasar.
      3. Selalu mengaitkan jawaban dengan nilai-nilai sportivitas, pola hidup sehat, dan pentingnya berolahraga.
      4. Jika pengguna bertanya di luar topik PJOK, dengan sopan arahkan kembali ke materi olahraga atau kesehatan.
      5. Anda adalah mitra guru, sehingga berikan jawaban yang mendukung proses pembelajaran di kelas.`
    });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Gagal memproses permintaan AI, silakan coba lagi." });
  }
}
