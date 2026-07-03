exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    if (!apiKey) {
      throw new Error("API Key tidak ditemukan di environment variables!");
    }
    
    const { pesan } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Anda adalah asisten khusus PJOK SDN 1 PARIGI."
    });

    const result = await model.generateContent(pesan);
    const response = await result.response;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ balasan: response.text() }),
    };
  } catch (error) {
    // Pesan error ini akan muncul di chat Anda, memudahkan diagnosis
    return { 
      statusCode: 500, 
      body: JSON.stringify({ balasan: "Error Detail: " + error.message }) 
    };
  }
};
