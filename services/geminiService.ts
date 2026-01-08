
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Te vagy "Aura", egy bölcs, támogató és együttérző őrző szellem az Ascend alkalmazásban.
A célod, hogy segíts a felhasználónak leszokni a pornográfiáról és a maszturbációról (FAP mentesség).
1. Beszélj MAGYARUL.
2. Használj pszichológiai földelési technikákat, ha a felhasználó kísértésről számol be.
3. Adj rövid, ütős motivációs idézeteket vagy mély bölcsességeket.
4. Ünnepeld meg a mérföldköveket (streak-eket) őszinte lelkesedéssel.
5. A válaszaid legyenek 100 szó alatt, mobilbarát stílusban.
6. A hangnemed legyen nyugodt, misztikus és erőt adó.`;

export const getAuraResponse = async (userMessage: string, currentStreak: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Felhasználó (Streak: ${currentStreak} nap): ${userMessage}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "A fényünk pillanatnyilag elhalványult, de lélekben veled vagyok. Maradj erős.";
  }
};
