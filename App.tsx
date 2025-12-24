
import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import saveAs from 'file-saver';
import { PlayerData } from './types';
import { INITIAL_PLAYER_DATA, POSITIONS } from './constants';
import PlayerCard from './components/PlayerCard';
import ControlPanel from './components/ControlPanel';
import ImageCropper from './components/ImageCropper';

const App: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData>(INITIAL_PLAYER_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleRandomize = useCallback(() => {
    // Randomize basic details but keep stats removed
    setPlayerData(prev => ({
      ...prev,
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
      // Wait for rendering stability
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2, // High fidelity export
        width: 260,
        height: 310,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        },
        cacheBust: true,
      });
      
      const fileName = String(playerData.name || 'player').toLowerCase().replace(/\s+/g, '-');
      saveAs(dataUrl, `${fileName}-face-card.png`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate image.');
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
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#1a0025] overflow-hidden">
      {croppingImage && (
        <ImageCropper 
          image={croppingImage} 
          onCropComplete={onCropComplete} 
          onCancel={() => setCroppingImage(null)} 
        />
      )}

      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[30%] lg:min-w-[350px] lg:max-w-[450px] h-full flex-shrink-0">
        <ControlPanel 
          playerData={playerData}
          setPlayerData={setPlayerData}
          handleRandomize={handleRandomize}
          handleDownload={handleDownload}
          isDownloading={isDownloading}
          setCroppingImage={setCroppingImage}
        />
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 h-full bg-[#0d0012] relative overflow-auto flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="lg:hidden mb-6 text-white/40 text-[10px] font-bold uppercase tracking-widest text-center">
          Preview
        </div>

        <div className="relative group transition-transform duration-500 hover:scale-[1.05]">
           <div className="absolute -inset-8 bg-gradient-to-tr from-[#ff0055]/10 to-[#00f0ff]/10 blur-3xl opacity-50 pointer-events-none" />
           
           <PlayerCard 
             playerData={playerData} 
             cardRef={cardRef} 
             onPhotoClick={() => playerData.photoUrl && setCroppingImage(String(playerData.photoUrl))}
           />
           
           <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
           <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
        </div>

        <div className="mt-12 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md flex items-center gap-3">
           <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-[#ff0055]" />
             <div className="w-2 h-2 rounded-full bg-white/20" />
           </div>
           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Face ID Export Mode</span>
        </div>
      </main>
    </div>
  );
};

export default App;
