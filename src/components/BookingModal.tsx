import React, { useState } from 'react';
import { Talent } from '../types/index.ts';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

interface BookingModalProps {
  talent: Talent;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ talent, onClose, onSuccess }) => {
  const { createBooking } = useTalentAgency();

  const [days, setDays] = useState(1);
  const [projectTitle, setProjectTitle] = useState('Haute Couture Editorial Lookbook');
  const [clientName, setClientName] = useState('Sabyasachi Creative Atelier');
  const [callSheetDate, setCallSheetDate] = useState('2025-05-18');
  const [location, setLocation] = useState('Mehboob Studios, Bandra, Mumbai');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const totalRate = talent.dayRateInr * days;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    createBooking({
      type: 'talent',
      itemId: talent.id,
      itemName: talent.name,
      itemImage: talent.primaryImage,
      providerName: talent.agencyName,
      clientName: clientName.trim() || 'Sabyasachi Creative Atelier',
      projectTitle: projectTitle.trim() || 'Haute Couture Campaign',
      dates: `${callSheetDate} (${days} Day${days > 1 ? 's' : ''})`,
      totalAmountInr: totalRate,
      totalEscrow: totalRate,
      agencyId: talent.agencyId,
      agencyName: talent.agencyName,
      talentId: talent.id,
      talentName: talent.name,
      callSheetDate,
      currency: talent.currency,
      status: 'Escrow Funded',
    });

    setIsConfirmed(true);
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#121214] border border-[#D4AF37]/40 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D4AF37] text-[20px]">
              receipt_long
            </span>
            <h2 className="font-headline-sm text-lg text-[#FAF8F5]">
              Escrow-Secured Talent Booking Request
            </h2>
          </div>
          <button onClick={onClose} className="text-[#99907c] hover:text-[#FAF8F5]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {isConfirmed ? (
          <div className="p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-[#10B981] text-5xl">
              check_circle
            </span>
            <h3 className="font-headline-sm text-2xl text-[#FAF8F5]">
              Escrow Deposit Transferred to Stripe Vault
            </h3>
            <p className="text-xs text-[#C8C5BD] max-w-md mx-auto">
              Call sheet initiated for <span className="text-[#FAF8F5] font-semibold">{talent.name}</span> with {talent.agencyName}. Funds remain in escrow custody until digital call sheet sign-off.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="p-6 space-y-5">
            {/* Model Preview Strip */}
            <div className="flex items-center gap-4 p-3 bg-[#1A1A1E] border border-[#27272C]">
              <img
                src={talent.primaryImage}
                alt={talent.name}
                referrerPolicy="no-referrer"
                className="w-12 h-14 object-cover border border-[#27272C]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-base text-[#FAF8F5]">{talent.name}</span>
                  <span className="font-mono text-xs text-[#D4AF37]">
                    ₹{talent.dayRateInr.toLocaleString()} / day
                  </span>
                </div>
                <div className="text-xs text-[#99907c] font-mono mt-0.5">
                  Represented by {talent.agencyName} ({talent.location})
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                  Production / Shoot Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                    Casting Client / House
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                    Call Sheet Date
                  </label>
                  <input
                    type="date"
                    required
                    value={callSheetDate}
                    onChange={(e) => setCallSheetDate(e.target.value)}
                    className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37] [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                    Number of Shoot Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Escrow Calculation Box */}
              <div className="p-4 bg-[#1A1A1E] border border-[#D4AF37]/40 space-y-2">
                <div className="flex justify-between text-xs text-[#C8C5BD] font-mono">
                  <span>Talent Day Rate ({days} day{days > 1 ? 's' : ''}):</span>
                  <span>₹{totalRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[#C8C5BD] font-mono">
                  <span>Agency Management Rider &amp; Escrow Fee:</span>
                  <span className="text-[#10B981]">₹0 (Waived for ModelKart Partners)</span>
                </div>
                <div className="border-t border-[#27272C] pt-2 flex justify-between text-sm font-headline-sm text-[#FAF8F5]">
                  <span>Total Escrow Deposit:</span>
                  <span className="text-[#D4AF37] font-bold">₹{totalRate.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#99907c] font-mono leading-relaxed">
                <span className="text-[#D4AF37]">Escrow Guarantee:</span> Deposit is locked via ModelKart Escrow Vault. Zero advance disbursement occurs until the agency booker and casting director digitally sign the wrap call sheet.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272C]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono uppercase text-[#C8C5BD] hover:text-[#FAF8F5] border border-[#27272C]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-label-caps text-xs uppercase font-bold tracking-wider"
              >
                Fund Escrow &amp; Dispatch Call Sheet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
