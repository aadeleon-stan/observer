import { REFLECTION_THRESHOLD } from '../constants/config';

export type Category = 'observation' | 'reflection';

export interface Entry {
  id: string;
  body: string;
  category: Category;
  prompt: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export function categorize(text: string): Category {
  return text.length >= REFLECTION_THRESHOLD ? 'reflection' : 'observation';
}
