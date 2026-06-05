import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import SpinWheel from '../components/SpinWheel';
import { TrendingUp, Users, Gift, LogOut } from 'lucide-react';

const giftImages = [
  '/gift-box.jpg',
  '/gift-box-2.jpg',
  '/gift-box-3.jpg',
  '/gift-box-4.jpg',
  '/gift-box-5.jpg',
  '/gift-box-6.jpg',
  '/gift-box-7.jpg',
  '/gift-box-8.jpg',
];

const multipliers = [1.0, 1.5, 2.0, 2.5, 3.0];

const recentWinners = [
  { id: '4821', name: 'Player #4821', amount: '+2.5x', initials: 'P4' },
  { id: '2917', name: 'Player #2917', amount: '+1.5x', initials: 'P2' },
  { id: '8834', name: 'Player #8834', amount: '+3.0x', initials: 'P8' },
  { id: '1156', name: 'Player #1156', amount: '+2.0x', initials: 'P1' },
  { id: '7432', name: 'Player #7432', amount: '+1.0x', initials: 'P7' },
  { id: '3389', name: 'Player #3389', amount: '+2.5x', initials: 'P3' },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [revealedMultiplier, setRevealedMultiplier] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleSpinComplete = useCallback(
    (_index: number) => {
      const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      setRevealedMultiplier(randomMultiplier);
      setHasSpun(true);
      addToast(`You won ${randomMultiplier.toFixed(1)}x bonus!`, 'success');
    },
    [addToast]
  );

  const handleClaim = () => {
    setClaimed(true);
    addToast('Bonus claimed! Make your first deposit now.', 'success');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0B0E1A' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-8 h-[72px] sticky top-0 z-50"
        style={{
          background: 'rgba(18,22,43,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-xl tracking-tight">AGENCY</span>
          <span className="w-2 h-2 rounded-full" style={{ background: '#2B6AFF' }} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #2B6AFF, #1E5AEE)' }}
            >
              {user?.name?.slice(0, 2)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name || 'Player'}</p>
              <p className="text-[#64748B] text-xs font-mono">{user?.accountId}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
            style={{ color: '#FF2B2B', background: 'rgba(255,43,43,0.1)' }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Hero Banner */}
        <div
          className="w-full h-[300px] relative overflow-hidden rounded-[20px] mb-8"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <img
            src="/hero-banner.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(11,14,26,0.7) 0%, rgba(43,106,255,0.15) 100%)',
            }}
          />
          <div className="absolute bottom-10 left-10">
            <h1
              className="text-white"
              style={{
                fontSize: '48px',
                fontWeight: 800,
                lineHeight: 1.1,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              Spin & Win
            </h1>
            <p
              className="mt-2"
              style={{
                fontSize: '18px',
                color: '#94A3B8',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Get up to 3x bonus on your first deposit
            </p>
          </div>
        </div>

        {/* Gift Wheel Area */}
        <div
          className="w-full flex flex-col items-center justify-center py-12 px-12 rounded-[20px] mb-8 relative overflow-hidden"
          style={{
            background: '#12162B',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Floating poker chips */}
          <img
            src="/poker-chips.jpg"
            alt=""
            className="absolute w-16 h-16 rounded-full object-cover animate-float opacity-30"
            style={{ top: '10%', left: '5%', animationDelay: '0s' }}
          />
          <img
            src="/poker-chips.jpg"
            alt=""
            className="absolute w-12 h-12 rounded-full object-cover animate-float opacity-20"
            style={{ bottom: '15%', right: '8%', animationDelay: '2s' }}
          />

          <h2
            className="text-white text-center relative z-10"
            style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
          >
            Your Gift Awaits
          </h2>
          <p
            className="text-center mt-2 relative z-10"
            style={{ fontSize: '16px', color: '#94A3B8' }}
          >
            Click the wheel to spin and reveal your bonus
          </p>

          <div className="mt-8 relative z-10">
            <SpinWheel items={giftImages} onSpinComplete={handleSpinComplete} />
          </div>

          {/* Multiplier Reveal */}
          {hasSpun && revealedMultiplier !== null && (
            <div
              className="mt-8 text-center relative z-10 animate-glow-pulse"
              style={{
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '16px',
                padding: '24px 48px',
              }}
            >
              <p
                className="text-[#64748B] text-xs font-medium tracking-[0.15em] uppercase"
              >
                Bonus Multiplier
              </p>
              <p
                className="mt-2"
                style={{
                  fontSize: '64px',
                  fontWeight: 800,
                  color: '#FFD700',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1,
                }}
              >
                {revealedMultiplier.toFixed(1)}x
              </p>
              {!claimed && (
                <button
                  onClick={handleClaim}
                  className="mt-4 font-bold text-base transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#0B0E1A',
                    padding: '16px 40px',
                    borderRadius: '12px',
                  }}
                >
                  Claim Bonus & Deposit
                </button>
              )}
              {claimed && (
                <p className="mt-4 text-[#00D084] font-medium text-sm">
                  Bonus claimed successfully!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent Winners Marquee */}
        <div
          className="w-full overflow-hidden py-6 mb-8"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p
            className="text-[#64748B] text-xs font-medium tracking-[0.15em] uppercase mb-4 text-center"
          >
            Recent Winners
          </p>
          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {[...recentWinners, ...recentWinners].map((winner, i) => (
              <div
                key={`${winner.id}-${i}`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl mr-4"
                style={{
                  background: '#12162B',
                  border: '1px solid rgba(255,255,255,0.08)',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: '#2B6AFF' }}
                >
                  {winner.initials}
                </div>
                <span className="text-white text-sm font-medium">{winner.name}</span>
                <span className="text-[#FFD700] text-sm font-semibold">{winner.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: TrendingUp, label: 'Total Spins Today', value: '12,847', color: '#2B6AFF' },
            { icon: Users, label: 'Active Players', value: '3,291', color: '#00D084' },
            { icon: Gift, label: 'Bonuses Claimed', value: '8,432', color: '#FFD700' },
          ].map((stat, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: '#12162B',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p
                    className="text-white"
                    style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[#94A3B8] text-sm mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
