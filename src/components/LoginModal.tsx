import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function LoginModal() {
  const [accountId, setAccountId] = useState('');
  const [role, setRole] = useState<'player' | 'admin'>('player');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountId.trim().length < 4) {
      addToast('Account ID must be at least 4 characters', 'error');
      return;
    }
    login(accountId.trim(), role);
    addToast(`Welcome back, ${role === 'admin' ? 'Admin' : 'Player'}!`, 'success');
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, #12162B 0%, #0B0E1A 100%)',
      }}
    >
      <div
        className="absolute inset-0 grid-pattern"
        style={{ opacity: 0.5 }}
      />
      <div
        className="relative"
        style={{
          width: '440px',
          background: '#12162B',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '48px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center">
          <span
            className="text-white font-extrabold text-[28px] tracking-tight"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            AGENCY
          </span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: '#2B6AFF' }}
          />
        </div>

        {/* Title */}
        <h1
          className="text-white text-center mt-8"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
          }}
        >
          Welcome Back
        </h1>
        <p
          className="text-center mt-2"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#94A3B8',
          }}
        >
          Enter your Account ID to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="ACC-XXXX-XXXX"
            className="w-full font-mono text-white transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '16px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2B6AFF';
              e.target.style.boxShadow = '0 0 0 3px rgba(43,106,255,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* Role Selection */}
          <div
            className="flex mt-6 p-1 rounded-[10px]"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <button
              type="button"
              onClick={() => setRole('player')}
              className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: role === 'player' ? 'rgba(43,106,255,0.2)' : 'transparent',
                color: role === 'player' ? '#2B6AFF' : '#64748B',
              }}
            >
              Player
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: role === 'admin' ? 'rgba(43,106,255,0.2)' : 'transparent',
                color: role === 'admin' ? '#2B6AFF' : '#64748B',
              }}
            >
              Admin
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 text-white font-semibold text-base transition-all"
            style={{
              background: '#2B6AFF',
              padding: '16px',
              borderRadius: '12px',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = '#1E5AEE';
              (e.target as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = '#2B6AFF';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
