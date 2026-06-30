// Isi file: netlify/functions/chat.js
exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body);
  const API_KEY = process.env.API_KEY; // Pastikan API Key sudah di-setting di Netlify

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: "Anda adalah asisten khusus PJOK SDN 1 PARIGI. Jawab hanya seputar olahraga, kesehatan, dan pendidikan jasmani. Jika ditanya di luar itu, arahkan kembali ke topik PJOK." }] },
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text })
  };
};
