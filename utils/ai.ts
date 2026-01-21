import { GoogleGenAI } from "@google/genai";
import { TarotCard, Lang, SpreadType, SavedReading } from "../types";
import { TRANSLATIONS } from "../constants";

let currentApiKey: string | null = null;
let aiInstance: GoogleGenAI | null = null;

export const getAIInstance = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  if (currentApiKey !== apiKey) {
    currentApiKey = apiKey;
    aiInstance = null;
  }

  if (!aiInstance) {
    try {
      aiInstance = new GoogleGenAI({ apiKey });
    } catch (error) {
      console.error("Failed to initialize AI instance:", error);
      throw new Error("Failed to initialize AI instance");
    }
  }
  return aiInstance;
};

export const generateReading = async (
  cards: TarotCard[],
  question: string,
  spreadType: SpreadType,
  lang: Lang,
  apiKey: string,
): Promise<SavedReading> => {
  try {
    const ai = getAIInstance(apiKey);
    const cardNames = cards
      .map((c) => (lang === "zh" ? c.nameZh : c.name))
      .join(", ");

    let contextPrompt = "";
    if (spreadType === "THREE_CARD") {
      contextPrompt =
        lang === "zh"
          ? `按照"过去、现在、未来"的顺序解读。`
          : `Interpret as Past, Present, Future.`;
    } else if (spreadType === "RELATIONSHIP") {
      contextPrompt =
        lang === "zh"
          ? `按照"我、对方、连接纽带"的顺序解读。`
          : `Interpret as You, Them, The Bond.`;
    }

    const prompt =
      lang === "zh"
        ? `你是一位名叫"星辰神谕"的资深塔罗占卜师。问题："${question}"。牌阵：${TRANSLATIONS.zh.spreads[spreadType]}。牌面：${cardNames}。${contextPrompt}提供300字深度诗意解读。回复中文。`
        : `You are the "Oracle of Stars". Question: "${question}". Spread: ${TRANSLATIONS.en.spreads[spreadType]}. Cards: ${cardNames}. ${contextPrompt}Provide 250-word celestial interpretation. Reply in English.`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        httpOptions: {
          baseUrl: window.location.origin+'/api/',
        },
      },
    });

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      question,
      spreadType,
      cards,
      interpretation: result.text || "Clouded...",
      lang,
    };
  } catch (error) {
    console.error("Failed to generate reading:", error);
    throw new Error("Failed to generate reading");
  }
};
