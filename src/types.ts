export interface Question {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Session {
  id: string;
  userName: string;
  date: string;
  mode: 'title' | 'description';
  questionsAnswered: number;
  correctAnswers: number;
  completed: boolean;
  answers: {
    questionId: number;
    correct: boolean;
    answer: string;
  }[];
}

export interface GameState {
  score: number;
  mistakes: Question[];
  currentMode: 'title' | 'description' | 'study' | null;
  showMistakes: boolean;
  showStudy: boolean;
  sessions: Session[];
  currentSession: Session | null;
  userName: string;
  currentAnswers: {
    questionId: number;
    correct: boolean;
    answer: string;
  }[];
  addAnswer: (questionId: number, correct: boolean, answer: string) => void;
  addMistake: (question: Question) => void;
  incrementScore: () => void;
  setMode: (mode: 'title' | 'description' | 'study' | null) => void;
  setShowMistakes: (show: boolean) => void;
  setShowStudy: (show: boolean) => void;
  resetGame: () => void;
  startSession: (mode: 'title' | 'description', userName: string) => void;
  endSession: (completed: boolean) => void;
  setUserName: (name: string) => void;
  loadSessions: () => Promise<void>;
}