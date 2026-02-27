declare module 'sentiment' {
  export interface AnalysisResult {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
    calculation: Array<Record<string, number>>;
  }

  class Sentiment {
    constructor();
    analyze(phrase: string): AnalysisResult;
  }

  export = Sentiment;
}

