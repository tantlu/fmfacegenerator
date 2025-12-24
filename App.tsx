import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import saveAs from 'file-saver';
import { PlayerData } from './types';
import { INITIAL_PLAYER_DATA, POSITIONS } from './constants';
import PlayerCard from './components/PlayerCard';
import ControlPanel from './components/ControlPanel';
import ImageCropper from './components/ImageCropper';
import { Settings2 } from 'lucide-react';

const App: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData>(INITIAL_PLAYER_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [exportScale, setExportScale] = useState<number>(2);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleRandomize = useCallback(() => {
    setPlayerData(prev => ({
      ...prev,
      name: "RANDOM PRO " + Math.floor(Math.random() * 99),
      age: Math.floor(Math.random() * 20) + 16,
      position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
      photoZoom: 1,
      photoX: 0,
      photoY: 0
    }));
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsDownloading(true);
      // Wait for all rendering to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: exportScale,
        cacheBust: true,
        // Filter out any problematic elements if they existed
        filter: (node) => {
          if (node.tagName === 'IFRAME') return false;
          return true;
        },
        // Ensure fonts are embedded
        fontEmbedCSS: undefined, // Let it try to find them automatically with the link fix
      });
      
      const fileName = `${playerData.name.toLowerCase().replace(/\s+/g, '-')}-card.png`;
      saveAs(dataUrl, fileName);
    } catch (error: any) {
      console.error('Download error:', error);
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Export failed: ${msg}. Try using a lower export quality or use direct image links that support CORS.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const onCropComplete = (transform: { zoom: number; x: number; y: number }) => {
    setPlayerData(prev => ({ 
      ...prev, 
      photoZoom: transform.zoom,
      photoX: transform.x,
      photoY: transform.y
    }));
    setCroppingImage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#1a0025] overflow-hidden text-white">
      {croppingImage && (
        <ImageCropper 
          image={croppingImage} 
          onCropComplete={onCropComplete} 
          onCancel={() => setCroppingImage(null)} 
        />
      )}

      <aside className="w-full lg:w-[30%] lg:min-w-[380px] lg:max-w-[420px] h-full flex-shrink-0 z-50">
        <ControlPanel 
          playerData={playerData}
          setPlayerData={setPlayerData}
          handleRandomize={handleRandomize}
          handleDownload={handleDownload}
          isDownloading={isDownloading}
          setCroppingImage={setCroppingImage}
        />
      </aside>

      <main className="flex-1 h-full bg-[#0d0012] relative overflow-hidden flex flex-col items-center justify-center p-8">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ff0055 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="mb-10 flex flex-col items-center gap-4 z-20">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-xl">
             <Settings2 size={14} className="text-[#00f0ff]" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mr-2">Export Quality:</span>
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
        </div>

        <div className="relative group transition-transform duration-700 hover:scale-[1.02]">
           {/* Decorative Glow */}
           <div className="absolute -inset-20 bg-gradient-to-tr from-[#ff0055]/20 to-[#00f0ff]/20 blur-[120px] opacity-40 pointer-events-none" />
           
           <PlayerCard 
             playerData={playerData} 
             cardRef={cardRef} 
             onPhotoClick={() => playerData.photoUrl && setCroppingImage(playerData.photoUrl)}
           />
           
           {/* Card Frame Guides */}
           <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-xl" />
           <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl" />
        </div>

        <div className="mt-16 text-center opacity-30 select-none">
          <p className="text-[10px] font-black uppercase tracking-[0.6em]">FM24 Pro Visualizer</p>
        </div>
      </main>
    </div>
  );
};

export default App;