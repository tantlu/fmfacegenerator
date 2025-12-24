
import React from 'react';
import { PlayerStats } from '../types';

interface StatsRadarProps {
  stats: PlayerStats;
}

const StatsRadar: React.FC<StatsRadarProps> = ({ stats }) => {
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;
  const maxValue = 20;

  const points = [
    { key: 'pace', angle: 0 },
    { key: 'shooting', angle: 60 },
    { key: 'passing', angle: 120 },
    { key: 'dribbling', angle: 180 },
    { key: 'defending', angle: 240 },
    { key: 'physical', angle: 300 },
  ];

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / maxValue) * radius;
    const x = center + r * Math.cos((angle - 90) * (Math.PI / 180));
    const y = center + r * Math.sin((angle - 90) * (Math.PI / 180));
    return { x, y };
  };

  const polyPoints = points
    .map((p) => {
      const { x, y } = getCoordinates(stats[p.key as keyof PlayerStats], p.angle);
      return `${x},${y}`;
    })
    .join(' ');

  const gridLevels = [5, 10, 15, 20];

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={points.map((p) => {
              const { x, y } = getCoordinates(level, p.angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {points.map((p) => {
          const { x, y } = getCoordinates(maxValue, p.angle);
          return (
            <line
              key={p.key}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area */}
        <polygon
          points={polyPoints}
          fill="rgba(0, 240, 255, 0.2)"
          stroke="#00f0ff"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
        />

        {/* Data Points */}
        {points.map((p) => {
          const val = stats[p.key as keyof PlayerStats];
          const { x, y } = getCoordinates(val, p.angle);
          const color = val >= 16 ? '#ff0055' : val >= 11 ? '#00f0ff' : '#ffffff';
          return (
            <circle
              key={p.key}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className={val >= 16 ? "animate-pulse" : ""}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default StatsRadar;
