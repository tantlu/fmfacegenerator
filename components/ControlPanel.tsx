
import React from 'react';
import { PlayerData } from '../types';
import { POSITIONS, COUNTRIES } from '../constants';
import { Shuffle, Download, User, Info, Globe, Shield, Palette, Crop, Maximize } from 'lucide-react';

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
    const { name, value } = e.target;
    setPlayerData(prev => ({ ...prev, [name]: value }));
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PlayerData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photoUrl') {
          setPlayerData(prev => ({ ...prev, photoUrl: result, photoZoom: 1, photoX: 0, photoY: 0 }));
          setCroppingImage(result);
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
            Note: The logo image will also be blurred in the background automatically.
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
