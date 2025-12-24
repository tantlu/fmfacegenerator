
export interface PlayerData {
  id: string;
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
  showName: boolean;
  showPosition: boolean;
  showFlag: boolean;
  cardTheme: 'pro' | 'cyber' | 'luxury' | 'stealth' | 'retro' | 'vivid' | 'magma' | 'glacial' | 'emerald' | 'sunset' | 'phantom' | 'royal' | 'mecha' | 'vintage' | 'hologram' | 'aurora' | 'noir' | 'arcade' | 'blueprint' | 'prism' | 'terminal' | 'sticker';
  faceMask: 'circle' | 'square' | 'squircle' | 'shield' | 'hexagon' | 'diamond' | 'octagon' | 'star' | 'badge' | 'pentagon';
  footerLeft: string;
  footerRight: string;
  originalFilename: string;
}
