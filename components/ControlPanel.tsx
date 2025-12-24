import React from 'react';
import { PlayerData } from '../types';
import { POSITIONS, COUNTRIES } from '../constants';
// Added Zap to the imports to fix the "Cannot find name 'Zap'" error on line 96
import { Shuffle, Download, User, Info, Globe, Shield, Palette, Crop, Maximize, Move, Layout, Zap } from 'lucide-react';

interface ControlPanelProps {
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
  handleRandomize: () => void;
  handleDownload: () => void;
  isDownloading: boolean;
  setCroppingImage: (url: string | null) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  playerData, 
  setPlayerData, 
  handleRandomize, 
  handleDownload,
  isDownloading,
  setCroppingImage
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setPlayerData(prev => ({ ...prev, [name]: val }));
  };

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const country = COUNTRIES.find(c => c.code === code);
    if (country) {
      setPlayerData(prev => ({
        ...prev,
        nationality: country.name,
        nationFlagUrl: `https://flagcdn.com/w160/${code}.png`
      }));
    }
  };

  const extractDominantColors = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const p1 = ctx.getImageData(canvas.width * 0.2, canvas.height * 0.2, 1, 1).data;
        const p2 = ctx.getImageData(canvas.width * 0.5, canvas.height * 0.5, 1, 1).data;
        
        const rgbToHex = (r: number, g: number, b: number) => 
          "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

        setPlayerData(prev => ({
          ...prev,
          primaryColor: rgbToHex(p1[0], p1[1], p1[2]),
          secondaryColor: rgbToHex(p2[0], p2[1], p2[2])
        }));
      } catch (e) {
        console.warn("Color extraction failed due to CORS restrictions, using defaults.");
      }
    };
    img.src = imageUrl;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PlayerData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photoUrl') {
          setPlayerData(prev => ({ ...prev, photoUrl: result, photoZoom: 1, photoX: 0, photoY: 0 }));
          setCroppingImage(result);
        } else if (field === 'clubLogoUrl') {
          setPlayerData(prev => ({ ...prev, clubLogoUrl: result }));
          extractDominantColors(result);
        } else {
          setPlayerData(prev => ({ ...prev, [field]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0025] border-r border-white/10 overflow-y-auto p-6 scrollbar-thin">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-tr from-[#ff0055] to-[#2b003e] rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Zap className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">
          Face <span className="text-[#ff0055]">ID</span> PRO
        </h1>
      </div>

      <div className="space-y-8 pb-10">
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Info size={14} /> Profile Details
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Player Name</label>
              <input
                type="text"
                name="name"
                value={playerData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-0 px-1 py-1 text-sm text-white focus:outline-none placeholder-white/20"
                placeholder="Enter Name..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Nationality</label>
                <select
                  onChange={handleCountrySelect}
                  className="w-full bg-transparent border-0 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                  value={COUNTRIES.find(c => c.name === playerData.nationality)?.code || ""}
                >
                  {COUNTRIES.map(c => <option key={c.code} value={c.code} className="bg-[#2b003e]">{c.name}</option>)}
                </select>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Position</label>
                <select
                  name="position"
                  value={playerData.position}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                >
                  {POSITIONS.map(p => <option key={p} value={p} className="bg-[#2b003e]">{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Layout size={14} /> Background Style
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
            <div className="flex gap-2">
              {(['blur', 'gradient', 'mesh'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPlayerData(prev => ({ ...prev, backgroundMode: mode }))}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                    playerData.backgroundMode === mode 
                      ? 'bg-[#00f0ff] text-[#1a0025] border-[#00f0ff]' 
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {playerData.backgroundMode === 'blur' && (
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                  <span>Blur Intensity</span>
                  <span>{playerData.blurIntensity}px</span>
                </div>
                <input 
                  type="range" name="blurIntensity" min="0" max="100" step="1"
                  value={playerData.blurIntensity} onChange={handleChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                  <span>Overlay Opacity</span>
                  <span>{(playerData.bgOpacity * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" name="bgOpacity" min="0" max="1" step="0.05"
                  value={playerData.bgOpacity} onChange={handleChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff0055]"
                />
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Palette size={14} /> Color Pallete
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center gap-3">
              <input type="color" name="primaryColor" value={playerData.primaryColor} onChange={handleChange} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
              <span className="text-[10px] font-black text-white/60">PRIMARY</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center gap-3">
              <input type="color" name="secondaryColor" value={playerData.secondaryColor} onChange={handleChange} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
              <span className="text-[10px] font-black text-white/60">SECONDARY</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Maximize size={14} /> Photo Fine-Tuning
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                  <span>Zoom</span>
                  <span>{playerData.photoZoom.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" name="photoZoom" min="0.5" max="5" step="0.01"
                  value={playerData.photoZoom} onChange={handleChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff0055]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase"><span>X Off</span></div>
                  <input type="range" name="photoX" min="-150" max="150" step="1" value={playerData.photoX} onChange={handleChange} className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-[#00f0ff]" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase"><span>Y Off</span></div>
                  <input type="range" name="photoY" min="-150" max="150" step="1" value={playerData.photoY} onChange={handleChange} className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-[#00f0ff]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4 flex flex-col gap-3">
           <button
             onClick={handleDownload}
             disabled={isDownloading}
             className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff0055] to-[#e6004c] hover:opacity-90 py-4 rounded-xl transition-all font-black text-sm uppercase tracking-widest text-white shadow-lg shadow-pink-500/20 disabled:opacity-50"
           >
             {isDownloading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><Download size={18} /> Download HQ PNG</>}
           </button>
           <button
             onClick={handleRandomize}
             className="w-full py-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors"
           >
             Randomize Mock Data
           </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;