const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Brak promptu" });

    const systemInstruction = `Jesteś profesjonalnym programistą Roblox Luau. 
Twoim zadaniem jest wygenerowanie czystego, wydajnego i bezpiecznego kodu Luau na podstawie prośby użytkownika.
ZASADY:
1. Zwracaj WYŁĄCZNIE czysty kod Luau. Nie dodawaj żadnych tekstów wstępnych ani opisów.
2. Nie używaj znaczników markdown takich jak \`\`\`lua ani \`\`\`. Zwróć sam surowy kod.
3. Kod musi działać od razu po wklejeniu do Roblox Studio.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n\nZadanie: " + prompt }] }
      ]
    });

    let generatedCode = response.text || "";
    generatedCode = generatedCode.replace(/```lua/g, "").replace(/```/g, "").trim();

    res.json({ code: generatedCode });
  } catch (error) {
    console.error("Błąd API:", error);
    res.status(500).json({ error: "Błąd podczas generowania kodu" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));