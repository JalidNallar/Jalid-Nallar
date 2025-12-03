export interface Example {
  chinese: string;
  pinyin: string;
  meaning: string;
}

export interface ChineseChar {
  char: string;
  pinyin: string;
  meaning: string;
  example?: Example;
}

export interface Score {
  correct: number;
  total: number;
}

export interface Feedback {
  isCorrect: boolean;
  meaningCorrect: boolean;
  pinyinCorrect: boolean;
}

export interface HistoryItem {
  char: string;
  correct: boolean;
  skipped?: boolean;
  timestamp: number;
}

// Definition for the global HanziWriter object window
declare global {
  interface Window {
    HanziWriter: any;
  }
}