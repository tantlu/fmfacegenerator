
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
  backgroundMode: 'blur' | 'gradient' | 'mesh' | 'custom';
  customBgUrl: string;
  customBgBlur: number;
  customBgOpacity: number;
  blurIntensity: number;
  bgOpacity: number;
}
