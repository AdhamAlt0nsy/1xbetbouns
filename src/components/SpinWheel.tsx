import { useState, useRef, useEffect } from 'react';

interface SpinWheelProps {
  items: string[];
  onSpinComplete?: (index: number) => void;
}

export default function SpinWheel({ items, onSpinComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const itemCount = items.length;
  const anglePerItem = 360 / itemCount;

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Calculate a random number of full spins (between 5 and 10)
    const spins = 5 + Math.floor(Math.random() * 5);
    // Calculate a random winning index
    const winningIndex = Math.floor(Math.random() * itemCount);
    
    // We want the winning slice to end up at the top (0 degrees).
    // The center of slice 'i' is at i * anglePerItem.
    // To bring slice 'i' to the top, we need to rotate backwards by its angle.
    // Plus add the full spins.
    // Also, we can add a slight random offset within the slice so it doesn't land perfectly in the middle every time.
    const sliceOffset = anglePerItem / 2 - Math.random() * anglePerItem * 0.8; 
    
    const targetRotation = rotation + (spins * 360) + (360 - (winningIndex * anglePerItem)) + sliceOffset;
    
    setRotation(targetRotation);

    // Wait for the transition to finish
    setTimeout(() => {
      setIsSpinning(false);
      // Determine the actual winner based on final angle.
      // normalize rotation
      const normalizedRot = targetRotation % 360;
      // wheel spins clockwise, so index 0 is at 0, index 1 is at anglePerItem
      // if it rotated by normalizedRot, the slice at the top is (360 - normalizedRot) % 360
      const topAngle = (360 - normalizedRot) % 360;
      // finding index:
      // index = Math.round(topAngle / anglePerItem) % itemCount
      const finalIndex = Math.round(topAngle / anglePerItem) % itemCount;
      onSpinComplete?.(finalIndex);
    }, 5000); // 5 seconds spin duration
  };

  return (
    <div className="relative w-[320px] h-[320px] mx-auto">
      {/* Pointer at the top */}
      <div 
        className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 z-20"
        style={{
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '30px solid #FFD700',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
        }}
      />
      
      {/* The Wheel */}
      <div 
        ref={wheelRef}
        className="w-full h-full rounded-full border-4 border-[#2B6AFF] relative overflow-hidden shadow-2xl cursor-pointer"
        onClick={handleSpin}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.15, 1)' : 'none',
          boxShadow: '0 0 30px rgba(43,106,255,0.4)',
        }}
      >
        {items.map((img, i) => {
          const rotationAngle = i * anglePerItem;
          // Calculate skew for slices based on number of items
          // This is a simple approach, for actual slice backgrounds SVG is better,
          // but we can place the images in absolute positions radially.
          return (
            <div 
              key={i}
              className="absolute top-0 left-1/2 w-[100px] h-[160px] -ml-[50px] origin-bottom flex flex-col items-center justify-start pt-4"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
              }}
            >
              <img 
                src={img} 
                alt={`gift-${i}`} 
                className="w-16 h-16 object-cover rounded-lg shadow-md"
                style={{ transform: 'rotate(180deg)' }} // Orient image upright towards the center
              />
              {/* Optional slice divider */}
              <div className="absolute top-0 bottom-0 left-[-50px] w-[1px] bg-white/20 origin-bottom" style={{ transform: `rotate(-${anglePerItem/2}deg)` }} />
            </div>
          );
        })}
        
        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 bg-gradient-to-br from-[#1E5AEE] to-[#0B0E1A] rounded-full border-4 border-[#2B6AFF] z-10 flex items-center justify-center shadow-lg">
           <div className="w-6 h-6 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
