export type Lang = 'en' | 'zh';
export type ViewType = 'HOME' | 'DAILY' | 'ENCYCLOPEDIA' | 'HISTORY' | '';
export type AppState = 'IDLE' | 'DRAWING' | 'REVEAL' | 'READING';
export type SpreadType = 'SINGLE' | 'THREE_CARD' | 'RELATIONSHIP';
export type RitualState = 'START' | 'SHUFFLE' | 'FATED_CARD';
export type ElementType = 'FIRE' | 'EARTH' | 'AIR' | 'WATER';
export interface TarotCard {
  id: number;
  name: string;
  nameZh: string;
  image: string;
  meaning: string;
  meaningZh: string;
}

export interface SavedReading {
  id: string;
  timestamp: number;
  question: string;
  spreadType: SpreadType;
  cards: TarotCard[];
  interpretation: string;
  summary: string;
  lang: Lang;
  zodiac?: string;
  element?: ElementType;
  chatHistory?: Array<{
    role: 'user' | 'model';
    text: string;
  }>;
}
