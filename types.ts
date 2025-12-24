
// Defined PlayerStats interface used by StatsRadar component
export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerData {
  name: string;
  club: string;
  nationality: string;
  position: string;
  age: number;
  photoUrl: string;
  photoZoom: number;
  photoX: number;
  photoY: number;
  clubLogoUrl: string;
  nationFlagUrl: string;
  primaryColor: string;
  secondaryColor: string;
}
