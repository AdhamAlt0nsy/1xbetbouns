import { Check, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ScreenshotModalProps {
  imageUrl: string;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}

export default function ScreenshotModal({
  imageUrl,
  onClose,
  onVerify,
  onReject,
}: ScreenshotModalProps) {
  const { addToast } = useToast();

  const handleVerify = () => {
    onVerify();
    addToast('Transaction verified successfully', 'success');
    onClose();
  };

  const handleReject = () => {
    onReject();
    addToast('Transaction rejected', 'error');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="overflow-hidden"
        style={{
          maxWidth: '800px',
          maxHeight: '90vh',
          background: '#12162B',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Transaction Screenshot"
          style={{
            width: '100%',
            objectFit: 'contain',
            maxHeight: '500px',
            display: 'block',
          }}
        />
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-[#64748B] text-sm">Uploaded: 2 mins ago</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleVerify}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'rgba(0,208,132,0.1)',
                color: '#00D084',
              }}
            >
              <Check className="w-4 h-4" />
              Verify
            </button>
            <button
              onClick={handleReject}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,43,43,0.1)',
                color: '#FF2B2B',
              }}
            >
              <X className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] transition-all"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
