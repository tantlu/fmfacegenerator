
import React, { useEffect } from 'react';
import { PlayerData } from '../types';
import { POSITIONS, COUNTRIES } from '../constants';
import { Shuffle, Download, User, Info, Globe, Shield, Palette, Crop, Maximize, Move } from 'lucide-react';

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

  // Helper to extract dominant colors from an image
  const extractDominantColors = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Sample a few pixels to get colors
      // In a real app we'd use a more complex median-cut algorithm
      // For this UI, we'll take top-left and center samples
      const p1 = ctx.getImageData(canvas.width * 0.2, canvas.height * 0.2, 1, 1).data;
      const p2 = ctx.getImageData(canvas.width * 0.5, canvas.height * 0.5, 1, 1).data;
      
      const rgbToHex = (r: number, g: number, b: number) => 
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

      setPlayerData(prev => ({
        ...prev,
        primaryColor: rgbToHex(p1[0], p1[1], p1[2]),
        secondaryColor: rgbToHex(p2[0], p2[1], p2[2])
      }));
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

  const handleCropCurrentUrl = () => {
    if (playerData.photoUrl) {
      setCroppingImage(String(playerData.photoUrl));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0025] border-r border-white/10 overflow-y-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-tr from-[#ff0055] to-[#2b003e] rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
          <User className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">
          Face <span className="text-[#ff0055]">ID</span>
        </h1>
      </div>

      <div className="space-y-8">
        {/* Basic Info Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Info size={14} /> Profile Details
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Player Name</label>
              <input
                type="text"
                name="name"
                value={String(playerData.name)}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff0055] transition-colors"
                placeholder="Name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Nationality</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                  <Globe size={14} />
                </div>
                <select
                  onChange={handleCountrySelect}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff0055] appearance-none cursor-pointer"
                  value={COUNTRIES.find(c => c.name === playerData.nationality)?.code || ""}
                >
                  <option value="" disabled className="bg-[#2b003e]">Select Country...</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code} className="bg-[#2b003e] text-white">
                      {String(c.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Position</label>
              <select
                name="position"
                value={String(playerData.position)}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff0055] appearance-none cursor-pointer"
              >
                {POSITIONS.map(p => <option key={p} value={p} className="bg-[#2b003e] text-white">{String(p)}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Card Style Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Palette size={14} /> Theme Colors
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Primary</label>
              <input
                type="color"
                name="primaryColor"
                value={String(playerData.primaryColor)}
                onChange={handleChange}
                className="w-full h-10 bg-transparent border-0 cursor-pointer p-0"
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Secondary</label>
              <input
                type="color"
                name="secondaryColor"
                value={String(playerData.secondaryColor)}
                onChange={handleChange}
                className="w-full h-10 bg-transparent border-0 cursor-pointer p-0"
              />
            </div>
          </div>
          <p className="mt-2 text-[9px] text-white/30 uppercase tracking-widest italic leading-relaxed">
            Note: Changing the Club Crest will automatically update these colors.
          </p>
        </section>

        {/* Visual Assets Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Maximize size={14} /> Visual Assets
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Player Photo</label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="photoUrl"
                    value={String(playerData.photoUrl)}
                    onChange={handleChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white/70 focus:outline-none focus:border-[#ff0055]"
                    placeholder="Image URL"
                  />
                  {playerData.photoUrl && (
                    <button 
                      onClick={handleCropCurrentUrl}
                      className="bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] p-2 rounded-lg border border-[#00f0ff]/30"
                    >
                      <Maximize size={16} />
                    </button>
                  )}
                </div>
                <label className="flex items-center justify-center w-full h-16 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Crop size={16} className="text-white/30 mb-1" />
                    <p className="text-[9px] text-white/40 font-bold uppercase">UPLOAD & ZOOM FACE</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'photoUrl')} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 mb-2 text-[10px] text-[#00f0ff] font-black uppercase tracking-widest">
                <Move size={12} /> Fine Tuning
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase">
                  <span>Zoom</span>
                  <span>{playerData.photoZoom.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" name="photoZoom" min="0.5" max="5" step="0.1"
                  value={playerData.photoZoom} onChange={handleChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff0055]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase">
                    <span>X Offset</span>
                    <span>{playerData.photoX.toFixed(0)}px</span>
                  </div>
                  <input 
                    type="range" name="photoX" min="-200" max="200" step="1"
                    value={playerData.photoX} onChange={handleChange}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase">
                    <span>Y Offset</span>
                    <span>{playerData.photoY.toFixed(0)}px</span>
                  </div>
                  <input 
                    type="range" name="photoY" min="-200" max="200" step="1"
                    value={playerData.photoY} onChange={handleChange}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Club Crest</label>
                <label className="flex items-center justify-center w-full h-12 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                   <Shield size={14} className="text-white/30" />
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'clubLogoUrl')} accept="image/*" />
                </label>
              </div>
              <div>
                <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Country Flag</label>
                <label className="flex items-center justify-center w-full h-12 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                   <Globe size={14} className="text-white/30" />
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'nationFlagUrl')} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3 sticky bottom-0 bg-[#1a0025] pb-6">
           <button
             onClick={handleRandomize}
             className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/20 hover:bg-white/10 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-white"
           >
             <Shuffle size={16} className="text-[#00f0ff]" /> Reset View
           </button>
           
           <button
             onClick={handleDownload}
             disabled={isDownloading}
             className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff0055] to-[#e6004c] hover:opacity-90 py-4 rounded-xl transition-all font-black text-sm uppercase tracking-widest text-white shadow-lg shadow-pink-500/20 disabled:opacity-50"
           >
             {isDownloading ? (
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
             ) : (
               <><Download size={18} /> Export Face Card</>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
