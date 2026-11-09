import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { DashboardPersona } from '../types/index.ts';

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { login, setActivePersona } = useTalentAgency();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<DashboardPersona>('brand');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(selectedRole, email || `${selectedRole}@modelkart.in`);
      if (success) {
        setActivePersona(selectedRole);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError('Authentication failed. Please verify credentials.');
      }
    } catch (_) {
      setError('Connection interrupted. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: DashboardPersona) => {
    setSelectedRole(role);
    setIsLoading(true);
    await login(role, `${role}@modelkart.in`);
    setActivePersona(role);
    setIsLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-[#111111] border border-[#D6B779]/50 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B779] text-[20px]">
              lock
            </span>
            <h2 className="font-serif text-xl text-[#FFFFFF]">
              Sign In to ModelKart
            </h2>
          </div>
          <button onClick={onClose} className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono text-[#D6B779] uppercase tracking-widest block mb-1">
              Escrow-Secured Session
            </span>
            <p className="text-xs text-[#E7E3DC] font-light">
              Enter your registered portal credentials or select an institutional demo account.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-[#777777] block">
              1-Click Demo Profile Login:
            </label>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('brand')}
                className="p-2 border border-[#27272C] bg-[#1A1A1E] text-[#E7E3DC] hover:border-[#D6B779] hover:text-[#D6B779] transition-colors text-left"
              >
                <span className="text-[#D6B779] font-bold block">Brand / Client</span>
                <span className="text-[9px] text-[#777777] block lowercase">Sabyasachi Atelier</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('agency')}
                className="p-2 border border-[#27272C] bg-[#1A1A1E] text-[#E7E3DC] hover:border-[#D6B779] hover:text-[#D6B779] transition-colors text-left"
              >
                <span className="text-[#D6B779] font-bold block">Agency Booker</span>
                <span className="text-[9px] text-[#777777] block lowercase">Anima Creative</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('talent')}
                className="p-2 border border-[#27272C] bg-[#1A1A1E] text-[#E7E3DC] hover:border-[#D6B779] hover:text-[#D6B779] transition-colors text-left"
              >
                <span className="text-[#D6B779] font-bold block">Model / Talent</span>
                <span className="text-[9px] text-[#777777] block lowercase">Aarohi Sen</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('property')}
                className="p-2 border border-[#27272C] bg-[#1A1A1E] text-[#E7E3DC] hover:border-[#D6B779] hover:text-[#D6B779] transition-colors text-left"
              >
                <span className="text-[#D6B779] font-bold block">Property Host</span>
                <span className="text-[9px] text-[#777777] block lowercase">Villa Beleza Goa</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#27272C] w-full" />
            <span className="bg-[#111111] px-3 text-[10px] font-mono uppercase text-[#777777] absolute">
              Or Custom Sign-in
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Portal Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as DashboardPersona)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="brand">Brand, Production House &amp; Client</option>
                <option value="agency">Talent Agency Management</option>
                <option value="talent">Individual Creative Talent / Model</option>
                <option value="property">Shoot Location &amp; Venue Host</option>
                <option value="admin">Platform Governance &amp; Admin</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@modelkart.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Verifying Session...' : 'Authenticate & Enter Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
