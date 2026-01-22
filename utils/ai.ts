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
           1. 约300字的深度诗意解读。 示例：旅人，欢迎来到星辰的静谧之境。我是你的引路人，星辰神谕。\n\n今日，你于命运的牌阵中唤醒了大阿卡纳 XVIII —— **「月亮」**。\n\n当这张牌显现，意味着理性之光暂时隐退，你已踏入了一片由直觉与潜意识交织的银色荒野。今日的运势如同潮汐般起伏，充满了迷离的诗意与不可言说的变幻。\n\n**【深度的指引】**\n在月光的清辉下，万物的轮廓变得模糊。今日，你或许会感到一种莫名的不安或迷茫，仿佛行走在浓雾笼罩的沼泽。请记住，眼见的并非全部真实，那些潜伏在阴影里的恐惧，不过是你内心未被察觉的投射。这是直觉最为敏锐的一天，也是逻辑最为无力的时刻。\n\n**【心灵的处方】**\n不要急于在黎明前做出决定，真相仍隐藏在波光粼粼的水面之下。此刻，你应该停止向外探寻，转而向内观照。那些困扰你的梦境、突如其来的情绪波动，都是灵魂发出的加密信号。请接纳那只从心底深潭中爬出的甲壳生物，它是你原始本能的觉醒。\n\n**【神谕寄语】**\n既然光线微弱，便无需疾行。请学会在模糊中行走，在未知中安放恐惧。当你在两座尖塔间的幽径上缓步前行时，请倾听那来自荒野的犬吠——那是你在清醒与梦幻间的守望。\n\n在这朦胧的辉光中，请保持谦卑与警觉。愿你能穿透幻象的轻纱，于灵魂的暗夜里，捕捉到那抹通往真知的微光。\n\n星辰守护你。\n
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

    // 清理 result.text 中的 Markdown 代码块标记和额外空白
    let cleanText = result.text || "{}";
    // 移除可能的 Markdown 代码块标记
    cleanText = cleanText.replace(/^```json\n|\n```$/g, '');
    // 移除首尾空白
    cleanText = cleanText.trim();

    const parsed = JSON.parse(cleanText || "{}");

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
