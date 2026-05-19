export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number?: string;
  teams?: { id: number; abbreviation: string; full_name: string; city: string; }[];
  team?: { id: number; abbreviation: string; full_name: string; city: string; };
}
