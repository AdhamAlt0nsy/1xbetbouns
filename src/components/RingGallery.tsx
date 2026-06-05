import { useRef, useState, useEffect } from 'react';

interface RingGalleryProps {
  images: string[];
  onSpinComplete?: (index: number) => void;
}

interface RingImageProps {
  src: string;
  index: number;
  angleStep: number;
  radius: number;
  isSelected: boolean;
}

function RingImage({ src, index, angleStep, radius, isSelected }: RingImageProps) {
  return (
    <div
      className={isSelected ? 'ring-item selected' : 'ring-item'}
      style={{
        position: 'absolute',
        width: '100px',
        height: '140px',
        left: '50%',
        top: '50%',
        marginLeft: '-50px',
        marginTop: '-70px',
        transform: `rotateY(${index * angleStep}deg) translateZ(${radius}px)`,
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.3s',
        boxShadow: isSelected ? '0 0 30px rgba(255,215,0,0.6)' : undefined,
      }}
    >
      <img
        src={src}
        alt={`gift-${index}`}
        width={100}
        height={140}
        style={{
          objectFit: 'cover',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}

export default function RingGallery({ images, onSpinComplete }: RingGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const itemCount = images.length || 8;
  const radius = 220;
  const angleStep = 360 / itemCount;
  const rotation = useRef({ x: -15, y: 0 });
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let rafId: number;
    let localAngle = currentAngle;
    let localIsSpinning = isSpinning;
    let localSpinSpeed = spinSpeed;

    const animate = () => {
      const el = containerRef.current;
      if (!el) return;

      if (localIsSpinning) {
        localAngle += localSpinSpeed;
        localSpinSpeed *= 0.98;

        if (Math.abs(localSpinSpeed) < 0.1) {
          localIsSpinning = false;
          const finalIndex = Math.round((Math.abs(localAngle) % 360) / angleStep) % itemCount;
          setSelectedIndex(finalIndex);
          onSpinComplete?.(finalIndex);
          setIsSpinning(false);
        }

        setCurrentAngle(localAngle);
        setSpinSpeed(localSpinSpeed);
      } else if (selectedIndex === -1) {
        localAngle += 0.15;
        setCurrentAngle(localAngle);
      }

      if (!localIsSpinning) {
        rotation.current.y = localAngle + mouseX.current * 0.05;
        rotation.current.x = -15 + mouseY.current * 0.03;
      } else {
        rotation.current.y = localAngle;
        rotation.current.x = -15;
      }

      el.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [images, angleStep, itemCount, onSpinComplete, selectedIndex]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 100;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 100;
    };

    const handleMouseLeave = () => {
      mouseX.current = 0;
      mouseY.current = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedIndex(-1);
    const randomSpins = 5 + Math.floor(Math.random() * 5);
    const finalAngle = currentAngle + randomSpins * 360 + Math.floor(Math.random() * 360);
    const newSpeed = (finalAngle - currentAngle) * 0.02;
    setSpinSpeed(newSpeed);
  };

  return (
    <div
      className="ring-gallery"
      style={{
        perspective: '1200px',
        width: '320px',
        height: '420px',
        position: 'relative',
        cursor: 'pointer',
        margin: '0 auto',
      }}
    >
      <div
        ref={containerRef}
        className="ring-container"
        onClick={handleClick}
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {images.map((img, i) => (
          <RingImage
            key={i}
            src={img}
            index={i}
            angleStep={angleStep}
            radius={radius}
            isSelected={selectedIndex === i}
          />
        ))}
      </div>
    </div>
  );
}
