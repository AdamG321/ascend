
export interface UserData {
  streak: number;
  maxStreak: number;
  lastCheckIn: string | null; // ISO string
  shards: number;
  level: number;
  exp: number;
  ecosystem: {
    mushrooms: number;
    bushes: number;
    squirrels: number;
    birds: number;
    guardians: number;
    streams: number;
    flowers: number;
    ancientStones: number;
    sunRays: number;
  };
  history: HistoryEntry[];
}

export interface HistoryEntry {
  date: string;
  success: number; // 1 for success, 0 for relapse
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
