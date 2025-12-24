
import React, { useState } from 'react';
import { PlayerData } from '../types';
import { POSITIONS, COUNTRIES } from '../constants';
import { Shuffle, Download, User, Info, Globe, Shield, Palette, Crop, Maximize, Move, Layout, Zap, Image as ImageIcon, Link as LinkIcon, Upload } from 'lucide-react';

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
  const [photoMode, setPhotoMode] = useState<'upload' | 'link'>('upload');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    
    setPlayerData(prev => {
      const next = { ...prev, [name]: val };
      // If photo URL is changed via link, sync background for that cinematic look
      if (name === 'photoUrl' && value) {
        next.customBgUrl = value as string;
        next.backgroundMode = 'custom';
        next.customBgBlur = 10; // Default blur for background version
        next.customBgOpacity = 0.5; // Good default dimming
      }
      return next;
    });
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
          setPlayerData(prev => ({ 
            ...prev, 
            photoUrl: result, 
            photoZoom: 1, 
            photoX: 0, 
            photoY: 0,
            // Sync to background automatically
            customBgUrl: result,
            backgroundMode: 'custom',
            customBgBlur: 10,
            customBgOpacity: 0.5
          }));
          setCroppingImage(result);
        } else if (field === 'clubLogoUrl') {
          setPlayerData(prev => ({ ...prev, clubLogoUrl: result }));
        } else if (field === 'customBgUrl') {
          setPlayerData(prev => ({ ...prev, customBgUrl: result, backgroundMode: 'custom' }));
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
        {/* Section: Identity */}
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
                className="w-full bg-transparent border-0 px-1 py-1 text-sm text-white focus:outline-none"
                placeholder="Enter Name..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Nationality</label>
                <select
                  onChange={handleCountrySelect}
                  className="w-full bg-transparent border-0 text-sm text-white focus:outline-none appearance-none"
                  value={COUNTRIES.find(c => c.name === playerData.nationality)?.code || ""}
                >
                  <option value="" disabled className="bg-[#2b003e]">Select Nation</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code} className="bg-[#2b003e]">{c.name}</option>)}
                </select>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <label className="block text-[10px] text-white/40 font-bold uppercase mb-1 ml-1">Position</label>
                <select
                  name="position"
                  value={playerData.position}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 text-sm text-white focus:outline-none appearance-none"
                >
                  {POSITIONS.map(p => <option key={p} value={p} className="bg-[#2b003e]">{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Player Photo */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <User size={14} /> Player Photo
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
            <div className="flex bg-white/5 rounded-lg p-1">
              <button 
                onClick={() => setPhotoMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${photoMode === 'upload' ? 'bg-white/10 text-white' : 'text-white/40'}`}
              >
                <Upload size={12} /> Upload
              </button>
              <button 
                onClick={() => setPhotoMode('link')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${photoMode === 'link' ? 'bg-white/10 text-white' : 'text-white/40'}`}
              >
                <LinkIcon size={12} /> Link
              </button>
            </div>

            {photoMode === 'upload' ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <Upload size={24} className="text-white/30 mb-2" />
                <p className="text-[10px] text-white/40 font-bold uppercase">Select Photo File</p>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'photoUrl')} accept="image/*" />
              </label>
            ) : (
              <div className="space-y-2">
                <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  <input
                    type="text"
                    name="photoUrl"
                    value={playerData.photoUrl}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 text-[10px] text-white focus:outline-none"
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <p className="text-[8px] text-white/20 italic text-center uppercase tracking-widest">Paste direct image URL from web</p>
              </div>
            )}
          </div>
        </section>

        {/* Section: Background Style */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Layout size={14} /> Background Style
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(['blur', 'gradient', 'mesh', 'custom'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPlayerData(prev => ({ ...prev, backgroundMode: mode }))}
                  className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
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
              <div className="space-y-3 pt-2">
                <div>
                  <label className="flex justify-between text-[8px] text-white/40 font-bold uppercase mb-1">
                    <span>Blur Intensity</span>
                    <span>{playerData.blurIntensity}px</span>
                  </label>
                  <input
                    type="range"
                    name="blurIntensity"
                    min="0"
                    max="100"
                    value={playerData.blurIntensity}
                    onChange={handleChange}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-[8px] text-white/40 font-bold uppercase mb-1">
                    <span>Logo Opacity</span>
                    <span>{(playerData.bgOpacity * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range"
                    name="bgOpacity"
                    min="0"
                    max="1"
                    step="0.05"
                    value={playerData.bgOpacity}
                    onChange={handleChange}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                </div>
              </div>
            )}

            {playerData.backgroundMode === 'custom' && (
              <div className="space-y-3 pt-2">
                <label className="flex flex-col items-center justify-center w-full h-16 border border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-white/30" />
                    <span className="text-[9px] text-white/40 font-bold uppercase">Background Image</span>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'customBgUrl')} accept="image/*" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] text-white/40 font-bold uppercase mb-1">Blur</label>
                    <input
                      type="range"
                      name="customBgBlur"
                      min="0"
                      max="40"
                      value={playerData.customBgBlur}
                      onChange={handleChange}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-white/40 font-bold uppercase mb-1">Dim</label>
                    <input
                      type="range"
                      name="customBgOpacity"
                      min="0"
                      max="1"
                      step="0.05"
                      value={playerData.customBgOpacity}
                      onChange={handleChange}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section: Colors */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Palette size={14} /> Color Palette
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-2 ml-1">Primary</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={playerData.primaryColor}
                  onChange={handleChange}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-[10px] text-white/60 font-mono uppercase">{playerData.primaryColor}</span>
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <label className="block text-[10px] text-white/40 font-bold uppercase mb-2 ml-1">Secondary</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={playerData.secondaryColor}
                  onChange={handleChange}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-[10px] text-white/60 font-mono uppercase">{playerData.secondaryColor}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Club Logo */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
            <Shield size={14} /> Club Logo
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <label className="flex flex-col items-center justify-center w-full h-20 border border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
              <Upload size={18} className="text-white/30 mb-1" />
              <p className="text-[9px] text-white/40 font-bold uppercase">Upload Club Crest</p>
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'clubLogoUrl')} accept="image/*" />
            </label>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleRandomize}
            className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            <Shuffle size={18} className="text-[#00f0ff]" />
            Randomize Player
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
              isDownloading 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#ff0055] to-[#e6004c] text-white shadow-pink-500/20'
            }`}
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Download size={20} />
                Export Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
