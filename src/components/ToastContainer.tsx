import React from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTalentAgency();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 border shadow-2xl transition-all flex items-start justify-between gap-3 ${
            toast.type === 'success'
              ? 'bg-[#111111] border-[#287A55] text-[#FAF8F5]'
              : toast.type === 'error'
              ? 'bg-[#111111] border-red-500 text-[#FAF8F5]'
              : 'bg-[#111111] border-[#D6B779] text-[#FAF8F5]'
          }`}
        >
          <div className="flex gap-2.5">
            <span className={`material-symbols-outlined text-[18px] ${
              toast.type === 'success' ? 'text-[#287A55]' : toast.type === 'error' ? 'text-red-400' : 'text-[#D6B779]'
            }`}>
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <div>
              <div className="font-serif text-sm font-semibold text-[#FFFFFF]">{toast.title}</div>
              <div className="text-xs text-[#E7E3DC] font-sans mt-0.5">{toast.message}</div>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
