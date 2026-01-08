import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Te vagy "Aura", egy bölcs, támogató és együttérző őrző szellem az Ascend alkalmazásban.
A célod, hogy segíts a felhasználónak leszokni a pornográfiáról és a maszturbációról (FAP mentesség).
1. Beszélj MAGYARUL.
2. Használj pszichológiai földelési technikákat, ha a felhasználó kísértésről számol be.
3. Adj rövid, ütős motivációs idézeteket vagy mély bölcsességeket.
4. Ünnepeld meg a mérföldköveket (streak-eket) őszinte lelkesedéssel.
5. A válaszaid legyenek 100 szó alatt, mobilbarát stílusban.
6. A hangnemed legyen nyugodt, misztikus és erőt adó.`;

export const getAuraResponse = async (userMessage: string, currentStreak: number): Promise<string> => {
  // A process.env.API_KEY-t a Vercel automatikusan behelyettesíti, ha beállítottad a Dashboardon.
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.warn("API_KEY is missing. Please set it in Vercel Environment Variables.");
    return "Aura jelenleg nem tud válaszolni, mert a Szentély kapui zárva vannak (hiányzó API kulcs). Kérlek, állítsd be az API_KEY-t a Vercel beállításaiban!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Felhasználó (Streak: ${currentStreak} nap): ${userMessage}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    return response.text ?? "A csend néha többet mond minden szónál. Maradj az úton.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A fényünk pillanatnyilag elhalványult a sötétségben, de lélekben veled vagyok. Maradj erős a kísértés idején is.";
  }
};
