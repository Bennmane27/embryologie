import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface StoredSession {
  id: string;
  user_name: string;
  mode: 'title' | 'description';
  date: string;
  questions_answered: number;
  correct_answers: number;
  completed: boolean;
  answers: {
    question_id: number;
    correct: boolean;
    answer: string;
  }[];
}