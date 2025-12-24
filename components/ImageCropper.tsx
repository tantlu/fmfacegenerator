
import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, Check, ZoomIn } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (transform: { zoom: number; x: number; y: number }) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const handleConfirm = () => {
    /**
     * NORMALIZATION LOGIC
     * To make the crop consistent across devices, we normalize the pixel offsets
     * relative to our fixed target size in PlayerCard (224px).
     */
    const cropperContainer = containerRef.current?.querySelector('.react-easy-crop_Container');
    const cropperWidth = cropperContainer?.clientWidth || 1;
    const TARGET_SIZE = 224; 
    const scaleFactor = TARGET_SIZE / cropperWidth;

    onCropComplete({
      zoom: zoom,
      x: crop.x * scaleFactor,
      y: crop.y * scaleFactor
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0d0012]/95 backdrop-blur-xl items-center justify-center p-4">
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg aspect-square bg-[#1a0025] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="mt-8 w-full max-w-md space-y-6">
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <ZoomIn size={20} className="text-[#00f0ff]" />
          <input
            type="range"
            value={zoom}
            min={1}
            max={5}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff0055]"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest text-white/60 transition-all"
          >
            <X size={18} /> Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff0055] to-[#e6004c] hover:opacity-90 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-lg shadow-pink-500/20 transition-all"
          >
            <Check size={18} /> Apply Zoom
          </button>
        </div>
      </div>

      <div className="mt-8 text-center space-y-2">
        <p className="text-xs font-bold text-[#00f0ff] uppercase tracking-[0.2em]">Adjust Face Positioning</p>
        <p className="text-[10px] text-white/30 uppercase tracking-widest">Drag and zoom the image to align the face perfectly</p>
      </div>
    </div>
  );
};

export default ImageCropper;
