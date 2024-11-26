import { create } from 'zustand';
import { Question, GameState, Session } from './types';
import { supabase } from './lib/supabase';

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  mistakes: [],
  currentMode: null,
  showMistakes: false,
  showStudy: false,
  sessions: [],
  currentSession: null,
  userName: '',
  currentAnswers: [],
  
  addAnswer: (questionId, correct, answer) =>
    set((state) => ({
      currentAnswers: [...state.currentAnswers, { questionId, correct, answer }],
    })),

  addMistake: (question) =>
    set((state) => ({
      mistakes: [...state.mistakes, question],
    })),

  incrementScore: () =>
    set((state) => ({
      score: state.score + 1,
    })),

  setMode: (mode) => set({ currentMode: mode }),
  setShowMistakes: (show) => set({ showMistakes: show }),
  setShowStudy: (show) => set({ showStudy: show }),
  setUserName: (name) => set({ userName: name }),

  resetGame: () =>
    set({
      score: 0,
      mistakes: [],
      currentMode: null,
      showMistakes: false,
      showStudy: false,
      currentSession: null,
      currentAnswers: [],
    }),

  startSession: (mode, userName) =>
    set((state) => ({
      currentSession: {
        id: Date.now().toString(),
        userName,
        date: new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          dateStyle: 'full',
          timeStyle: 'long',
        }),
        mode,
        questionsAnswered: 0,
        correctAnswers: 0,
        completed: false,
        answers: [],
      },
      score: 0,
      mistakes: [],
      currentAnswers: [],
    })),

  endSession: async (completed) => {
    const state = get();
    const session = {
      ...state.currentSession!,
      completed,
      questionsAnswered: state.score + state.mistakes.length,
      correctAnswers: state.score,
      answers: state.currentAnswers,
    };

    // Save to Supabase
    await supabase.from('sessions').insert({
      id: session.id,
      user_name: session.userName,
      mode: session.mode,
      date: session.date,
      questions_answered: session.questionsAnswered,
      correct_answers: session.correctAnswers,
      completed: session.completed,
      answers: session.answers,
    });

    set((state) => ({
      sessions: [...state.sessions, session],
      currentSession: null,
      currentMode: null,
    }));
  },

  loadSessions: async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      const sessions: Session[] = data.map((session) => ({
        id: session.id,
        userName: session.user_name,
        date: session.date,
        mode: session.mode,
        questionsAnswered: session.questions_answered,
        correctAnswers: session.correct_answers,
        completed: session.completed,
        answers: session.answers,
      }));

      set({ sessions });
    }
  },
}));