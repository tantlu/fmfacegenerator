
import { PlayerData } from './types';

export const INITIAL_PLAYER_DATA: PlayerData = {
  name: "ERLING HAALAND",
  club: "Manchester City",
  nationality: "Norway",
  position: "ST",
  age: 23,
  photoUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80",
  photoZoom: 1,
  photoX: 0,
  photoY: 0,
  clubLogoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/200px-Manchester_City_FC_badge.svg.png",
  nationFlagUrl: "https://flagcdn.com/w160/no.png",
  primaryColor: "#6CADDF",
  secondaryColor: "#1C2C5B",
  backgroundMode: 'blur',
  blurIntensity: 40,
  bgOpacity: 0.2,
};

export const POSITIONS = [
  "GK", "SW", "LB", "CB", "RB", "LWB", "RWB", "DM", "LM", "CM", "RM", "AM", "LW", "RW", "ST"
];

export const COUNTRIES = [
  { name: "Afghanistan", code: "af" }, { name: "Albania", code: "al" }, { name: "Algeria", code: "dz" },
  { name: "Argentina", code: "ar" }, { name: "Australia", code: "au" }, { name: "Austria", code: "at" },
  { name: "Belgium", code: "be" }, { name: "Brazil", code: "br" }, { name: "Canada", code: "ca" },
  { name: "Croatia", code: "hr" }, { name: "Denmark", code: "dk" }, { name: "Egypt", code: "eg" },
  { name: "England", code: "gb-eng" }, { name: "France", code: "fr" }, { name: "Germany", code: "de" },
  { name: "Italy", code: "it" }, { name: "Japan", code: "jp" }, { name: "Mexico", code: "mx" },
  { name: "Netherlands", code: "nl" }, { name: "Norway", code: "no" }, { name: "Portugal", code: "pt" },
  { name: "Spain", code: "es" }, { name: "Sweden", code: "se" }, { name: "USA", code: "us" }
];
