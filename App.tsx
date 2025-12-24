
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import saveAs from 'file-saver';
import { PlayerData } from './types';
import { INITIAL_PLAYER_DATA, POSITIONS } from './constants';
import PlayerCard from './components/PlayerCard';
import ControlPanel from './components/ControlPanel';
import ImageCropper from './components/ImageCropper';
import { Settings2, Trash2, Zap, Edit3 } from 'lucide-react';

const App: React.FC = () => {
  const [players, setPlayers] = useState<PlayerData[]>([{ ...INITIAL_PLAYER_DATA, id: 'player-' + Date.now() }]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0].id);
  const [isDownloading, setIsDownloading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<{ id: string, url: string } | null>(null);
  const [exportScale, setExportScale] = useState<number>(2);
  
  // Single settings template used for newly added players
  const [templateSettings, setTemplateSettings] = useState<PlayerData>(INITIAL_PLAYER_DATA);

  // Get the currently selected player's data
  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || players[0];

  // Apply template changes to all existing players or a specific one
  const handleSettingsChange = useCallback((updatedSettings: PlayerData | ((prev: PlayerData) => PlayerData), targetId?: string) => {
    if (targetId) {
      // Apply to a SPECIFIC player (usually for individual name/nation/pos/alignment)
      setPlayers(currentPlayers => currentPlayers.map(p => {
        if (p.id === targetId) {
          const next = typeof updatedSettings === 'function' ? updatedSettings(p) : updatedSettings;
          return { ...next, id: p.id };
        }
        return p;
      }));
    } else {
      // Apply GLOBAL STYLES (background, colors, masks, themes)
      setTemplateSettings(prev => {
        const next = typeof updatedSettings === 'function' ? updatedSettings(prev) : updatedSettings;
        
        setPlayers(currentPlayers => currentPlayers.map(p => ({
          ...next,
          id: p.id,
          // Preserve individual player data
          name: p.name,
          position: p.position,
          nationality: p.nationality,
          nationFlagUrl: p.nationFlagUrl,
          photoUrl: p.photoUrl,
          photoZoom: p.photoZoom,
          photoX: p.photoX,
          photoY: p.photoY,
          footerLeft: p.footerLeft,
          footerRight: p.footerRight,
          originalFilename: p.originalFilename,
          // Background sync logic if photo is the same as custom bg
          customBgUrl: next.backgroundMode === 'custom' && next.customBgUrl === prev.photoUrl ? p.photoUrl : next.customBgUrl
        })));
        
        return next;
      });
    }
  }, []);

  const handleRandomize = useCallback(() => {
    handleSettingsChange(prev => ({
      ...prev,
      name: "PLAYER " + Math.floor(Math.random() * 99),
      age: Math.floor(Math.random() * 20) + 16,
      position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
    }), selectedPlayerId);
  }, [handleSettingsChange, selectedPlayerId]);

  const handleBatchUpload = useCallback((files: FileList) => {
    const newPlayers: PlayerData[] = [];
    const promises = Array.from(files).map((file, index) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        const fileName = file.name.split('.').slice(0, -1).join('.') || 'face-id-player';
        reader.onloadend = () => {
          const result = reader.result as string;
          const timestamp = Date.now();
          newPlayers.push({
            ...templateSettings,
            id: `player-${timestamp}-${index}`,
            photoUrl: result,
            originalFilename: fileName,
            customBgUrl: result, // Cinematic default
            backgroundMode: 'custom',
            customBgBlur: 10,
            customBgOpacity: 0.5,
            photoZoom: 1,
            photoX: 0,
            photoY: 0,
            name: "PLAYER " + (players.length + index + 1)
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      setPlayers(prev => {
        const updated = [...prev, ...newPlayers];
        return updated;
      });
    });
  }, [templateSettings, players.length]);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (const player of players) {
        const cardElement = document.getElementById(`player-card-${player.id}`);
        if (cardElement) {
          const dataUrl = await toPng(cardElement, {
            pixelRatio: exportScale,
            cacheBust: true,
          });
          // Prioritize original source filename
          const finalName = player.originalFilename || (player.name || 'player').toLowerCase().replace(/\s+/g, '-');
          saveAs(dataUrl, `${finalName}.png`);
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }
    } catch (error) {
      console.error('Batch download error:', error);
      alert('One or more exports failed. Check console for details.');
    } finally {
      setIsDownloading(false);
    }
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (selectedPlayerId === id) {
        setSelectedPlayerId(filtered[0].id);
      }
      return filtered;
    });
  };

  const onCropComplete = (transform: { zoom: number; x: number; y: number }) => {
    if (!croppingImage) return;
    setPlayers(prev => prev.map(p => 
      p.id === croppingImage.id 
        ? { ...p, photoZoom: transform.zoom, photoX: transform.x, photoY: transform.y }
        : p
    ));
    setCroppingImage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#1a0025] overflow-hidden text-white">
      {croppingImage && (
        <ImageCropper 
          image={croppingImage.url} 
          onCropComplete={onCropComplete} 
          onCancel={() => setCroppingImage(null)} 
        />
      )}

      <aside className="w-full lg:w-[30%] lg:min-w-[380px] lg:max-w-[420px] h-full flex-shrink-0 z-50">
        <ControlPanel 
          playerData={selectedPlayer}
          setPlayerData={handleSettingsChange}
          handleRandomize={handleRandomize}
          handleDownload={handleDownloadAll}
          isDownloading={isDownloading}
          setCroppingImage={(url) => url && setCroppingImage({ id: selectedPlayerId, url })}
          onBatchUpload={handleBatchUpload}
          batchCount={players.length}
        />
      </aside>

      <main className="flex-1 h-full bg-[#0d0012] relative flex flex-col items-center p-8 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="fixed inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ff0055 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="mb-10 flex flex-col items-center gap-4 z-20 sticky top-0 bg-[#0d0012]/80 backdrop-blur-md p-4 px-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <Settings2 size={14} className="text-[#00f0ff]" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mr-1">Export Quality:</span>
                <div className="flex gap-1">
                  {[1, 2, 4].map(scale => (
                    <button
                      key={scale}
                      onClick={() => setExportScale(scale)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                        exportScale === scale 
                          ? 'bg-[#ff0055] text-white shadow-lg' 
                          : 'text-white/30 hover:text-white/60 bg-white/5'
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="text-[10px] font-black text-[#00f0ff] uppercase tracking-widest">
                {players.length} Players in Batch
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 pb-24 relative z-10 w-full max-w-7xl justify-items-center">
          {players.map((player) => (
            <div 
              key={player.id} 
              className="relative group/wrapper"
              onClick={() => setSelectedPlayerId(player.id)}
            >
              <div className="absolute -inset-10 bg-gradient-to-tr from-[#ff0055]/10 to-[#00f0ff]/10 blur-[80px] opacity-20 pointer-events-none" />
              
              {/* Batch Actions Overlay */}
              <div className="absolute -top-4 -right-4 z-40 flex gap-2 opacity-0 group-hover/wrapper:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); removePlayer(player.id); }}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-90 transition-all border border-white/20"
                  title="Remove from batch"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {selectedPlayerId === player.id && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00f0ff] text-[#1a0025] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 z-40">
                  <Edit3 size={10} />
                  Currently Editing
                </div>
              )}

              <PlayerCard 
                playerData={player} 
                isSelected={selectedPlayerId === player.id}
                onPhotoClick={() => setCroppingImage({ id: player.id, url: player.photoUrl })}
              />
              
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-xl pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl pointer-events-none" />
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/20 uppercase font-black tracking-[0.5em] gap-4">
             <Zap size={48} className="opacity-20 animate-pulse" />
             <p>Upload faces to start batch</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
