
import React from 'react';
import { PlayerData } from '../types';
import { Shield, MapPin, User, Trophy, Zap, Crop } from 'lucide-react';

interface PlayerCardProps {
  playerData: PlayerData;
  cardRef: React.RefObject<HTMLDivElement>;
  onPhotoClick?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ playerData, cardRef, onPhotoClick }) => {
  const baseGradient = `linear-gradient(135deg, ${playerData.secondaryColor || '#1C2C5B'} 0%, ${playerData.primaryColor || '#6CADDF'} 100%)`;

  const photoStyle: React.CSSProperties = {
    transform: `translate(${playerData.photoX}px, ${playerData.photoY}px) scale(${playerData.photoZoom})`,
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.1s ease-out',
  };

  return (
    <div 
      ref={cardRef}
      id="player-card-export"
      style={{ 
        width: '260px', 
        height: '310px', 
        background: baseGradient 
      }}
      className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl flex flex-col group/card"
    >
      {/* Refined Dynamic Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Layer 1: The "Ghost" Logo Blur - Applied to entire card */}
        {playerData.backgroundMode === 'blur' && playerData.clubLogoUrl && (
          <div 
            className="absolute inset-0 transition-opacity duration-700 mix-blend-soft-light"
            style={{ opacity: playerData.bgOpacity }}
          >
            <img 
              src={playerData.clubLogoUrl} 
              className="w-full h-full object-cover scale-[1.8]"
              style={{ filter: `blur(${playerData.blurIntensity}px) saturate(1.5)` }}
              alt=""
            />
          </div>
        )}

        {/* Layer 2: Mesh Gradient Overlay */}
        {playerData.backgroundMode === 'mesh' && (
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_#ffffff33_0%,_transparent_50%),_radial-gradient(circle_at_100%_100%,_#00000066_0%,_transparent_50%)]" />
          </div>
        )}

        {/* Layer 3: Subtle FM-inspired Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
      </div>

      {/* Content Scrim - Darkens the bottom slightly for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40 pointer-events-none z-[1]" />
      
      {/* Card Content */}
      <div className="relative z-10 p-4 h-full flex flex-col items-center">
        {/* Header: Club & Nation Logos */}
        <div className="w-full flex justify-between items-start mb-1">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1.5 flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover/card:scale-110">
            {playerData.clubLogoUrl ? (
              <img src={playerData.clubLogoUrl} alt="Club" className="w-full h-full object-contain" />
            ) : (
              <Shield size={20} className="text-white/30" />
            )}
          </div>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1.5 flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover/card:scale-110">
            {playerData.nationFlagUrl ? (
              <img src={playerData.nationFlagUrl} alt="Nation" className="w-full h-full object-contain" />
            ) : (
              <Trophy size={20} className="text-white/30" />
            )}
          </div>
        </div>

        {/* Central Player Image Area */}
        <div 
          className="relative w-56 h-56 cursor-pointer group/photo -mt-1"
          onClick={onPhotoClick}
        >
          {/* Dynamic Halo Glow */}
          <div className="absolute inset-0 bg-[#00f0ff]/10 rounded-full blur-3xl scale-110 opacity-30 group-hover/card:opacity-60 group-hover/card:scale-125 transition-all duration-500" />
          
          <div className="relative w-full h-full rounded-full border-[4px] border-white/40 p-1.5 bg-black/10 backdrop-blur-sm overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover/card:shadow-[0_0_40px_rgba(0,240,255,0.5)] group-hover/card:border-[#00f0ff]/60 transition-all duration-300 flex items-center justify-center">
            {playerData.photoUrl ? (
              <img 
                src={playerData.photoUrl} 
                alt={playerData.name} 
                style={photoStyle}
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full">
                <User size={100} className="text-white/10" />
              </div>
            )}
            
            {/* Alignment Guides Focus Area */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-px h-full bg-[#00f0ff]/30" />
                 <div className="h-px w-full bg-[#00f0ff]/30" />
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 rounded-full border border-[#00f0ff]/20 border-dashed" />
               </div>
            </div>

            {/* Hover UI Action Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Crop size={32} className="text-[#00f0ff]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Adjust View</span>
            </div>
          </div>
          
          {/* Position Badge Overlay */}
          <div className="absolute bottom-4 right-4 bg-[#ff0055] text-white font-black px-3 py-1 rounded-md border border-white/40 text-[12px] shadow-2xl uppercase z-20 transform translate-x-2 translate-y-2 group-hover/card:scale-110 transition-transform">
            {playerData.position || '??'}
          </div>
        </div>

        {/* Identity Section */}
        <div className="text-center w-full mt-auto mb-1">
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none truncate px-2 mb-1 group-hover/card:tracking-normal transition-all duration-300">
            {playerData.name || "UNNAMED"}
          </h2>
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#00f0ff] uppercase tracking-[0.3em] drop-shadow-md">
            <MapPin size={10} className="opacity-70" /> {playerData.nationality || "UNKNOWN"}
          </div>
        </div>

        {/* Branding Footer */}
        <div className="w-full pt-1.5 border-t border-white/10 flex justify-between items-center text-[6px] text-white/30 uppercase font-bold tracking-[0.4em]">
          <div className="flex items-center gap-1">
            <Zap size={6} className="text-[#ff0055]" />
            <span>FM PRO GEN</span>
          </div>
          <span>FM24 EDITION</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
