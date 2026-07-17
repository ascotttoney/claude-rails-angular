export interface Tool {
  id?: number;
  name: string;
  category: string | null;
  brand: string | null;
  model: string | null;
  quantity: number;
  location: string | null;
  created_at?: string;
  updated_at?: string;
}

export const TOOL_CATEGORIES = [
  'Hand',
  'Power',
  'Clamps',
  'Measuring',
  'Sharpening',
  'Safety',
  'Fastening',
  'Finishing',
  'Other'
] as const;

export function emptyTool(): Tool {
  return { name: '', category: '', brand: '', model: '', quantity: 1, location: '' };
}
