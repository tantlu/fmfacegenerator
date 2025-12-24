
import React from 'react';
import { PlayerData } from '../types';
import { Shield, MapPin, User, Trophy, Zap, Crop, Star, Hexagon, Octagon, Square, Cpu, Anchor, Radio, Sparkles, Ghost, Joystick, Terminal, Boxes, Compass, Layers } from 'lucide-react';

interface PlayerCardProps {
  playerData: PlayerData;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  onPhotoClick?: () => void;
  isSelected?: boolean;
}

const MASK_PATHS = {
  circle: 'inset(0% round 50%)',
  square: 'inset(0%)',
  squircle: 'inset(0% round 20%)',
  shield: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  badge: 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)',
  pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
};

const PlayerCard: React.FC<PlayerCardProps> = ({ playerData, cardRef, onPhotoClick, isSelected }) => {
  const baseGradient = `linear-gradient(135deg, ${playerData.secondaryColor || '#1C2C5B'} 0%, ${playerData.primaryColor || '#6CADDF'} 100%)`;

  const photoStyle: React.CSSProperties = {
    transform: `translate(${playerData.photoX}px, ${playerData.photoY}px) scale(${playerData.photoZoom})`,
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.05s ease-out',
    clipPath: MASK_PATHS[playerData.faceMask || 'circle'],
  };

  const getThemeStyles = () => {
    switch(playerData.cardTheme) {
      case 'vivid': // Flare
        return {
          card: 'border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.2)]',
          header: 'absolute top-2 left-2 z-20 flex-col gap-2',
          footer: 'text-white font-black italic border-t border-white/20',
          name: 'font-black text-white text-3xl italic drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] absolute top-20 left-0 w-full text-center z-30 pointer-events-none',
          accent: 'text-white animate-pulse',
          layout: 'flare'
        };
      case 'magma': // Volcano
        return {
          card: 'border-red-600 bg-zinc-950 shadow-[0_0_20px_rgba(255,0,0,0.4)]',
          header: 'absolute bottom-12 right-2 flex-col gap-2 opacity-80 scale-75',
          footer: 'text-red-600 font-mono tracking-[0.6em] border-t border-red-950',
          name: 'font-black text-red-500 text-2xl tracking-tight absolute top-4 right-4 z-30 uppercase',
          accent: 'text-red-900',
          layout: 'volcano'
        };
      case 'glacial': // Arctic
        return {
          card: 'border-[#00d4ff] bg-[#e6f7ff] shadow-[0_10px_30px_rgba(0,212,255,0.2)]',
          header: 'absolute left-0 top-0 h-full w-12 flex-col justify-start pt-4 gap-4 bg-white/40 backdrop-blur-md border-r border-white/40',
          footer: 'text-[#005580] font-bold border-t border-[#00d4ff]/20',
          name: 'font-black text-[#005580] uppercase tracking-wider',
          accent: 'text-[#00d4ff]',
          layout: 'arctic'
        };
      case 'emerald': // Luxe
        return {
          card: 'border-[#004d33] bg-[#00261a] shadow-[0_15px_50px_rgba(0,77,51,0.5)]',
          header: 'justify-center border-b border-[#00ffcc]/20 py-2',
          footer: 'text-[#00ffcc] font-serif border-t border-[#00ffcc]/10 uppercase tracking-[0.5em]',
          name: 'font-serif text-[#00ffcc] italic text-2xl border-y border-[#00ffcc]/30 py-1 bg-black/40',
          accent: 'text-[#00ffcc]/40',
          layout: 'luxe'
        };
      case 'sunset': // RetroWave
        return {
          card: 'border-[#ff00ff] bg-black shadow-[0_0_40px_rgba(255,0,255,0.3)]',
          header: 'justify-between absolute top-4 w-full px-4 opacity-70 scale-90',
          footer: 'text-[#00f0ff] font-mono bg-black/80',
          name: 'font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00f0ff] text-4xl italic absolute bottom-12 w-full text-center z-30 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]',
          accent: 'text-[#ff00ff]',
          layout: 'retrowave'
        };
      case 'mecha':
        return {
          card: 'border-[#ff4d00] bg-zinc-900 shadow-[inset_0_0_20px_rgba(255,77,0,0.1)]',
          header: 'flex-col gap-2 absolute left-2 top-2 z-20',
          footer: 'text-[#ff4d00] font-mono border-t border-[#ff4d00]/30',
          name: 'font-black text-[#ff4d00] tracking-widest skew-x-[-10deg]',
          accent: 'text-orange-500/50',
          layout: 'mecha'
        };
      case 'vintage':
        return {
          card: 'border-[#4a3728] shadow-[0_15px_30px_rgba(0,0,0,0.4)]',
          header: 'justify-center absolute bottom-24 left-0 w-full z-20 opacity-80',
          footer: 'text-[#4a3728] font-serif border-t border-[#4a3728]/20 bg-[#d2b48c]/30',
          name: 'font-serif text-[#2a1b0e] absolute top-6 left-1/2 -translate-x-1/2 w-[85%] bg-[#f4e4bc] py-1 border-2 border-[#4a3728] shadow-md italic',
          accent: 'text-[#4a3728]/60',
          layout: 'vintage'
        };
      case 'hologram':
        return {
          card: 'border-cyan-400/50 bg-cyan-900/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.2)]',
          header: 'justify-between opacity-80',
          footer: 'text-cyan-400 font-mono tracking-[0.5em] border-cyan-400/20',
          name: 'font-thin text-white tracking-[0.2em] drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]',
          accent: 'text-cyan-400',
          layout: 'hologram'
        };
      case 'aurora':
        return {
          card: 'border-white/10 shadow-[0_0_60px_rgba(100,255,218,0.15)] bg-gradient-to-br from-[#0a192f] via-[#203a43] to-[#2c5364]',
          header: 'flex-col absolute right-2 top-2 z-20 gap-2',
          footer: 'text-[#64ffda] font-light italic',
          name: 'font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] to-[#7f00ff]',
          accent: 'text-white/40',
          layout: 'aurora'
        };
      case 'noir':
        return {
          card: 'border-white/5 bg-black',
          header: 'justify-center gap-10 grayscale brightness-150',
          footer: 'hidden',
          name: 'font-black text-white text-3xl uppercase tracking-tighter mix-blend-difference',
          accent: 'text-white/20 uppercase tracking-[1em]',
          layout: 'noir'
        };
      case 'arcade':
        return {
          card: 'border-4 border-yellow-400 rounded-none shadow-[4px_4px_0_#ff0055] bg-blue-900',
          header: 'justify-center border-b-4 border-yellow-400 bg-black/40',
          footer: 'text-yellow-400 font-mono text-[8px] bg-black',
          name: 'font-mono text-yellow-400 bg-[#ff0055] px-2 shadow-[2px_2px_0_#000]',
          accent: 'text-cyan-400 animate-pulse',
          layout: 'arcade'
        };
      case 'blueprint':
        return {
          card: 'border-[#4e79a7] bg-[#f0f4f8] shadow-none',
          header: 'absolute top-2 right-2 flex-col gap-1 items-end',
          footer: 'text-[#4e79a7] font-mono border-t border-[#4e79a7]/40 border-dashed',
          name: 'font-mono text-[#1a3a5a] border border-[#4e79a7] px-2 italic bg-white shadow-sm',
          accent: 'text-[#4e79a7]/30',
          layout: 'blueprint'
        };
      case 'terminal':
        return {
          card: 'border-[#33ff33] bg-black shadow-[0_0_20px_#33ff3322]',
          header: 'absolute top-0 left-0 w-full flex justify-between px-2 bg-[#33ff3322] border-b border-[#33ff3322]',
          footer: 'text-[#33ff33] font-mono text-[6px]',
          name: 'font-mono text-[#33ff33] bg-black border border-[#33ff33] px-2 mt-4',
          accent: 'text-[#33ff33]/50',
          layout: 'terminal'
        };
      case 'luxury':
        return {
          card: 'border-[#d4af37] shadow-[0_10px_40px_rgba(212,175,55,0.2)]',
          header: 'border-b border-[#d4af37]/20',
          footer: 'text-[#d4af37] font-serif tracking-[0.2em]',
          name: 'font-serif text-[#d4af37] italic uppercase',
          accent: 'text-white/60',
        };
      case 'cyber':
        return {
          card: 'border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]',
          header: 'border-b border-[#00f0ff]/20 bg-black/40',
          footer: 'text-[#00f0ff] border-t border-[#00f0ff]/20 font-mono',
          name: 'font-black italic text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ff00ff]',
          accent: 'text-[#ff00ff]',
        };
      default: // pro
        return {
          card: 'border-white/20 shadow-2xl',
          header: '',
          footer: 'text-white/30',
          name: 'font-black text-white',
          accent: 'text-[#00f0ff]',
        };
    }
  };

  const theme = getThemeStyles();
  const isVintage = theme.layout === 'vintage';
  const isMecha = theme.layout === 'mecha';
  const isArcade = theme.layout === 'arcade';
  const isBlueprint = theme.layout === 'blueprint';
  const isTerminal = theme.layout === 'terminal';
  const isArctic = theme.layout === 'arctic';
  const isRetrowave = theme.layout === 'retrowave';
  const isFlare = theme.layout === 'flare';
  const isVolcano = theme.layout === 'volcano';

  return (
    <div 
      ref={cardRef}
      id={`player-card-${playerData.id}`}
      style={{ 
        width: '260px', 
        height: '360px', 
        background: isVintage ? '#f4e4bc' : (isBlueprint ? '#f0f4f8' : (playerData.backgroundMode === 'custom' && playerData.customBgUrl ? 'black' : baseGradient))
      }}
      className={`relative overflow-hidden transition-all duration-300 flex flex-col group/card flex-shrink-0 ${playerData.cardTheme === 'retro' || isArcade || isBlueprint || isTerminal ? '' : 'rounded-2xl'} border ${isSelected ? 'ring-4 ring-[#00f0ff]/20 scale-105 z-30' : ''} ${theme.card}`}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {!isVintage && !isBlueprint && playerData.backgroundMode === 'blur' && playerData.clubLogoUrl && (
          <div className="absolute inset-0 transition-opacity duration-700 mix-blend-soft-light" style={{ opacity: playerData.bgOpacity }}>
            <img src={playerData.clubLogoUrl} crossOrigin="anonymous" className="w-full h-full object-cover scale-[1.8]" style={{ filter: `blur(${playerData.blurIntensity}px) saturate(1.5)` }} alt="" />
          </div>
        )}

        {playerData.backgroundMode === 'custom' && playerData.customBgUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={playerData.customBgUrl} crossOrigin="anonymous" className="w-full h-full object-cover scale-110" style={{ filter: `blur(${playerData.customBgBlur}px)` }} alt="" />
            <div className="absolute inset-0 bg-black transition-opacity duration-300" style={{ opacity: playerData.customBgOpacity }} />
          </div>
        )}

        {isBlueprint && (
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4e79a7 0.5px, transparent 0.5px), linear-gradient(90deg, #4e79a7 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
        )}
        
        {isMecha && (
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ff4d00 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
        )}

        {isTerminal && (
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        )}

        {isRetrowave && (
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)', backgroundSize: '40px 40px', perspective: '500px', transform: 'rotateX(60deg)' }} />
        )}

        {isVolcano && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.2),transparent)]" />
        )}

        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40 pointer-events-none z-[1]" />
      
      <div className="relative z-10 p-3 h-full flex flex-col items-center">
        {/* Header - Variable Layout */}
        <div className={`w-full flex ${playerData.showFlag ? 'justify-between' : 'justify-center'} items-start mb-1 ${theme.header} p-1 rounded-lg`}>
          <div className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1.5 flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover/card:scale-110 ${isVintage ? 'border-[#4a3728] rounded-full' : (isBlueprint ? 'border-[#4e79a7] rounded-none bg-transparent' : '')}`}>
            {playerData.clubLogoUrl ? (
              <img src={playerData.clubLogoUrl} crossOrigin="anonymous" alt="Club" className="w-full h-full object-contain" />
            ) : (
              <Shield size={20} className="text-white/30" />
            )}
          </div>
          {playerData.showFlag && (
            <div className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-1.5 flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover/card:scale-110 ${isVintage ? 'border-[#4a3728] rounded-full' : (isBlueprint ? 'border-[#4e79a7] rounded-none bg-transparent' : '')}`}>
              {playerData.nationFlagUrl ? (
                <img src={playerData.nationFlagUrl} crossOrigin="anonymous" alt="Nation" className="w-full h-full object-contain" />
              ) : (
                <Trophy size={20} className="text-white/30" />
              )}
            </div>
          )}
        </div>

        {/* Central Player Image Area */}
        <div className={`relative w-[245px] h-[245px] cursor-pointer group/photo ${isVintage ? 'mt-8' : (isArctic ? 'ml-10' : (isTerminal ? 'mt-4' : '-mt-1'))}`} onClick={onPhotoClick}>
          <div className={`absolute inset-0 rounded-full blur-3xl scale-110 opacity-40 group-hover/card:opacity-70 transition-all duration-500 ${playerData.cardTheme === 'stealth' ? 'bg-red-500/20' : (isVolcano ? 'bg-red-900/40' : 'bg-[#00f0ff]/20')}`} />
          
          <div 
            className={`relative w-full h-full p-1 bg-black/20 backdrop-blur-sm shadow-[0_0_25px_rgba(0,0,0,0.4)] group-hover/card:shadow-[0_0_50px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center overflow-hidden ${isVintage || isBlueprint ? 'grayscale' : ''} ${isTerminal ? 'border border-[#33ff3322]' : ''}`}
            style={{ clipPath: MASK_PATHS[playerData.faceMask || 'circle'] }}
          >
            {playerData.photoUrl ? (
              <img src={playerData.photoUrl} crossOrigin="anonymous" alt={playerData.name} style={photoStyle} />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full">
                <User size={100} className="text-white/10" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Crop size={32} className="text-[#00f0ff]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Adjust View</span>
            </div>
          </div>
          
          {playerData.showPosition && (
            <div className={`absolute bottom-6 right-6 text-white font-black px-3 py-1 border border-white/40 text-[12px] shadow-2xl uppercase z-20 transform translate-x-2 translate-y-2 group-hover/card:scale-110 transition-transform ${playerData.cardTheme === 'retro' || isArcade || isBlueprint || isTerminal ? 'bg-black rounded-none border-yellow-400' : (isArctic ? 'bg-[#005580] rounded-none' : 'bg-[#ff0055] rounded-md')}`}>
              {playerData.position || '??'}
            </div>
          )}
        </div>

        {/* Identity Section - Robust Fixed Height Container */}
        <div className={`text-center w-full mt-auto mb-2 min-h-[55px] flex flex-col justify-end ${isMecha ? 'items-end pr-4' : (isArctic ? 'pl-10' : '')}`}>
          {playerData.showName && (
            <h2 className={`text-2xl tracking-tighter uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-[0.85] truncate px-2 mb-1 group-hover/card:tracking-normal transition-all duration-300 flex-shrink-0 ${theme.name}`}>
              {playerData.name || "UNNAMED"}
            </h2>
          )}
          <div className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-[0.3em] drop-shadow-md flex-shrink-0 ${theme.accent}`}>
            <MapPin size={10} className="opacity-70" /> {playerData.nationality || "UNKNOWN"}
          </div>
        </div>

        {/* Branding Footer */}
        {theme.layout !== 'noir' && (
          <div className={`w-full pt-1.5 flex justify-between items-center text-[6px] uppercase font-bold tracking-[0.4em] flex-shrink-0 ${theme.footer} ${isArctic ? 'pl-10' : ''}`}>
            <div className="flex items-center gap-1">
              {isMecha ? <Cpu size={6} /> : (isTerminal ? <Terminal size={6} /> : (isArcade ? <Joystick size={6} /> : (isBlueprint ? <Boxes size={6} /> : (isVintage ? <Anchor size={6} /> : <Zap size={6} className={playerData.cardTheme === 'stealth' ? 'text-red-500' : 'text-[#ff0055]'} />))))}
              <span>{playerData.footerLeft || "FM PRO GEN"}</span>
            </div>
            <span>{playerData.footerRight || "FM24 EDITION"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
