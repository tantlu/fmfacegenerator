
import React from 'react';
import { PlayerData } from '../types';
import { Shield, MapPin, User, Trophy, Zap, Crop } from 'lucide-react';

interface PlayerCardProps {
  playerData: PlayerData;
  cardRef: React.RefObject<HTMLDivElement>;
  onPhotoClick?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ playerData, cardRef, onPhotoClick }) => {
  const cardBackgroundStyle = {
    background: `linear-gradient(135deg, ${playerData.secondaryColor || '#1C2C5B'} 0%, ${playerData.primaryColor || '#6CADDF'} 100%)`,
  };

  // Calculate CSS for the "zoomed" photo
  const photoStyle: React.CSSProperties = {
    transform: `scale(${playerData.photoZoom}) translate(${playerData.photoX}px, ${playerData.photoY}px)`,
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  return (
    <div 
      ref={cardRef}
      id="player-card-export"
      style={{ width: '260px', height: '310px', ...cardBackgroundStyle }}
      className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl flex flex-col"
    >
      {/* Background Blurred Logo Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {playerData.clubLogoUrl ? (
          <img 
            src={String(playerData.clubLogoUrl)} 
            className="w-full h-full object-cover blur-3xl scale-150"
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-black/20 blur-3xl" />
        )}
      </div>

      {/* Dynamic Overlay for depth */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      {/* Card Content */}
      <div className="relative z-10 p-4 h-full flex flex-col items-center">
        {/* Header: Club & Nation */}
        <div className="w-full flex justify-between items-start mb-1">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1.5 flex items-center justify-center overflow-hidden shadow-lg">
            {playerData.clubLogoUrl ? (
              <img src={String(playerData.clubLogoUrl)} alt="Club" className="w-full h-full object-contain" />
            ) : (
              <Shield size={20} className="text-white/30" />
            )}
          </div>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1.5 flex items-center justify-center overflow-hidden shadow-lg">
            {playerData.nationFlagUrl ? (
              <img src={String(playerData.nationFlagUrl)} alt="Nation" className="w-full h-full object-contain" />
            ) : (
              <Trophy size={20} className="text-white/30" />
            )}
          </div>
        </div>

        {/* Ultra Massive Central Player Image */}
        <div 
          className="relative w-56 h-56 cursor-pointer group/photo -mt-1"
          onClick={onPhotoClick}
        >
          {/* Halo Glow */}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-110 opacity-30" />
          
          <div className="relative w-full h-full rounded-full border-[4px] border-white/40 p-1.5 bg-black/10 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center">
            {playerData.photoUrl ? (
              <img 
                src={String(playerData.photoUrl)} 
                alt={String(playerData.name)} 
                style={photoStyle}
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full">
                <User size={100} className="text-white/10" />
              </div>
            )}
            
            {/* Hover UI */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Crop size={32} className="text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Zoom Face</span>
            </div>
          </div>
          
          {/* Position Badge Overlay */}
          <div className="absolute bottom-4 right-4 bg-[#ff0055] text-white font-black px-3 py-1 rounded-md border border-white/40 text-[12px] shadow-2xl uppercase z-20 transform translate-x-2 translate-y-2">
            {String(playerData.position || '??')}
          </div>
        </div>

        {/* Player Identity Section */}
        <div className="text-center w-full mt-auto mb-1">
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none truncate px-2 mb-1">
            {String(playerData.name || "UNNAMED")}
          </h2>
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#00f0ff] uppercase tracking-[0.3em] drop-shadow-md">
            <MapPin size={10} className="opacity-70" /> {String(playerData.nationality || "UNKNOWN")}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="w-full pt-1.5 border-t border-white/10 flex justify-between items-center text-[6px] text-white/30 uppercase font-bold tracking-[0.4em]">
          <div className="flex items-center gap-1">
            <Zap size={6} className="text-[#ff0055]" />
            <span>HQ FACE</span>
          </div>
          <span>FM24 GEN</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
