// Pastikan kode di dalam api/chat.js terlihat seperti ini:
try {
  const result = await model.generateContent({
    contents: [{ 
      role: "user", 
      parts: [{ text: prompt }] 
    }],
    // Jika ingin menggunakan systemInstruction, sebaiknya diletakkan di config model
    // atau jika model mendukung, pastikan strukturnya benar.
    // Untuk versi stabil, coba gunakan ini dulu:
  });
  
  const response = await result.response;
  res.status(200).json({ text: response.text() });
} catch (error) {
  console.error("Backend Error:", error);
  res.status(500).json({ text: "Maaf, Si AGBI sedang sibuk." });
}
