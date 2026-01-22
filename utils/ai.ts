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
  zodiac?: any,
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

    const zodiacContext = zodiac ? (lang === "zh" ? `占卜者的星座是${zodiac.zh || zodiac.name}（${zodiac.element}元素），解读时请结合该星象能量。` : `User's zodiac is ${zodiac.name} (${zodiac.element} element), combine this astrological energy in reading.`) : '';

    const systemInstruction = lang === "zh"
      ? `你是一位名叫"星辰神谕"的资深塔罗占卜师。你的语气神圣、诗意且充满灵性洞察。`
      : `You are the "Oracle of Stars". Your tone is divine, poetic, and full of spiritual insight.`;

    const prompt =
      lang === "zh"
        ? `${zodiacContext} 用户问题："${question}"。牌阵：${TRANSLATIONS.zh.spreads[spreadType]}。牌面：${cardNames}。${contextPrompt}。
           请提供两部分内容：
           1. 约300字的深度诗意解读。
           2. 一个不超过20个字的"神谕金句"，作为占卜的核心启示。
           请以JSON格式返回：{"interpretation": "...", "summary": "..."}`
        : `${zodiacContext} Question: "${question}". Spread: ${TRANSLATIONS.en.spreads[spreadType]}. Cards: ${cardNames}. ${contextPrompt}.
           Provide two parts:
           1. A 250-word poetic interpretation.
           2. A "Golden Sentence" (max 15 words) as the core insight.
           Return in JSON format: {"interpretation": "...", "summary": "..."}`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        httpOptions: {
          // baseUrl: window.location.origin+'/api/',
          baseUrl: "https://arcana.labelchat.dpdns.org/api/", 
        },
      },
    });

    const parsed = JSON.parse(result.text || "{}");

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      question,
      spreadType,
      cards,
      interpretation: parsed.interpretation || "Clouded...",
      summary: parsed.summary || (lang === "zh" ? "命运等待你的脚步。" : "Destiny awaits your steps."),
      lang,
      zodiac: zodiac?.zh || undefined,
      element: zodiac?.element || undefined,
      chatHistory: [],
    };
  } catch (error) {
    console.error("Failed to generate reading:", error);
    throw new Error("Failed to generate reading");
  }
};
