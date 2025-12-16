export interface Expansion {
  name: string;
  description: string;
}

export interface BoardGame {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  playtime: string; // e.g., "30-60 min"
  minAge: number;
  mechanics: string[];
  imageUrl?: string; // Kept for backward compatibility or manual entry if needed later
  emoji?: string; // Emoji representation
  rating?: number;
  notes?: string;
  ownedExpansions: Expansion[]; // Only the ones the user selected
  addedAt: number;
}

export type GameFormData = Omit<BoardGame, 'id' | 'addedAt' | 'ownedExpansions'>;

export interface AIInfoResponse {
  description: string;
  minPlayers: number;
  maxPlayers: number;
  playtime: string;
  minAge: number;
  mechanics: string[];
  emoji: string;
  officialExpansions: Expansion[];
}
