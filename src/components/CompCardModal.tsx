import React, { useState } from 'react';
import { Talent } from '../types/index.ts';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

interface CompCardModalProps {
  talent: Talent;
  onClose: () => void;
}

export const CompCardModal: React.FC<CompCardModalProps> = ({ talent, onClose }) => {
  const {
    agencies,
    shortlist,
    toggleShortlist,
    setActiveTalentForBooking
  } = useTalentAgency();

  const [activePhoto, setActivePhoto] = useState<string>(talent.primaryImage);
  const [printSuccess, setPrintSuccess] = useState(false);

  const agency = agencies.find(a => a.id === talent.agencyId);
  const isShortlisted = shortlist.includes(talent.id);

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setPrintSuccess(false);
    }, 400);
  };

  const handleBookNow = () => {
    onClose();
    setActiveTalentForBooking(talent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0A0A0C]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#121214] border border-[#D4AF37]/40 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-xs text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">badge</span>
              Official Digital Comp-Card
            </span>
            <span className="text-[#27272C]">•</span>
            <span className="text-xs text-[#C8C5BD] font-mono">
              {talent.agencyName} Board
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 border border-[#27272C] hover:border-[#D4AF37] text-xs font-mono uppercase text-[#FAF8F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              <span>{printSuccess ? 'Printing...' : 'Print Spec Sheet'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#99907c] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              aria-label="Close comp card"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Comp-Card Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Gallery (Hero + Polaroids) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Selected Shot */}
            <div className="relative aspect-[4/5] bg-[#0A0A0C] border border-[#27272C] overflow-hidden">
              <img
                src={activePhoto}
                alt={talent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3 left-3 bg-[#0A0A0C]/85 px-3 py-1 border border-[#D4AF37]/40 text-[#D4AF37] font-label-caps text-[10px] uppercase">
                {talent.category.toUpperCase()} ROSTER
              </div>
            </div>

            {/* Polaroid Thumbnails Row */}
            <div className="grid grid-cols-4 gap-2">
              {[talent.primaryImage, ...(talent.lookbookImages || [])].slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(img)}
                  className={`aspect-[4/5] border overflow-hidden cursor-pointer bg-[#0A0A0C] transition-all ${
                    activePhoto === img
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'border-[#27272C] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Look ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Physical Specifications & Agency Board */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              {/* Name & Agency Affiliation */}
              <div className="border-b border-[#27272C] pb-4">
                <span className="font-label-caps text-[10px] text-[#D4AF37] uppercase tracking-widest">
                  {talent.location} · {talent.representation.toUpperCase()} REPRESENTED
                </span>
                <h2 className="font-headline-lg text-3xl md:text-4xl text-[#FAF8F5] mt-1 font-light">
                  {talent.name}
                </h2>
                <p className="font-body-sm text-xs text-[#C8C5BD] mt-2">
                  {talent.editorialHeadline}
                </p>
              </div>

              {/* Physical Spec Sheet Grid (Models.com format) */}
              <div className="bg-[#1A1A1E] border border-[#27272C] p-4">
                <div className="font-label-caps text-[10px] uppercase text-[#99907c] tracking-widest mb-3 border-b border-[#27272C] pb-2">
                  Standard Measurement Card
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 font-mono text-xs tabular-nums">
                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1">
                    <span className="text-[#99907c]">HEIGHT</span>
                    <span className="text-[#FAF8F5]">{talent.specs.heightCm} cm ({talent.specs.heightFt})</span>
                  </div>

                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1">
                    <span className="text-[#99907c]">
                      {talent.specs.chestCm ? 'CHEST' : 'BUST'}
                    </span>
                    <span className="text-[#FAF8F5]">{talent.specs.chestCm || talent.specs.bustCm} cm</span>
                  </div>

                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1">
                    <span className="text-[#99907c]">WAIST</span>
                    <span className="text-[#FAF8F5]">{talent.specs.waistCm} cm</span>
                  </div>

                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1">
                    <span className="text-[#99907c]">HIPS</span>
                    <span className="text-[#FAF8F5]">{talent.specs.hipsCm} cm</span>
                  </div>

                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1">
                    <span className="text-[#99907c]">SHOES</span>
                    <span className="text-[#FAF8F5]">{talent.specs.shoeEu} EU</span>
                  </div>

                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1">
                    <span className="text-[#99907c]">EYES</span>
                    <span className="text-[#FAF8F5]">{talent.specs.eyeHue}</span>
                  </div>

                  <div className="flex justify-between border-b border-[#27272C]/60 pb-1 col-span-2">
                    <span className="text-[#99907c]">HAIR</span>
                    <span className="text-[#FAF8F5]">{talent.specs.hairComplexion}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Editorial Credits */}
              <div>
                <span className="font-label-caps text-[10px] uppercase text-[#99907c] tracking-widest block mb-2">
                  Runway &amp; Editorial Musings
                </span>
                <p className="font-body-sm text-xs text-[#C8C5BD] leading-relaxed mb-3">
                  {talent.bio}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {talent.editorialCredits.map((cred, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[#1A1A1E] border border-[#27272C] text-[#d0c5af] text-[10px] font-mono"
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agency Direct Booker Box */}
              {agency && (
                <div className="p-3 bg-[#1A1A1E] border border-[#27272C] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-[#D4AF37] uppercase">
                      Direct Booker Desk
                    </span>
                    <span className="text-[10px] text-[#99907c]">{agency.city}</span>
                  </div>
                  <div className="font-medium text-[#FAF8F5] mt-1">{agency.bookerName}</div>
                  <div className="text-[11px] text-[#C8C5BD] mt-0.5">
                    {agency.bookerEmail} · {agency.bookerPhone}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-[#27272C]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">
                  Standard Day Rate
                </span>
                <span className="font-title-md text-base text-[#FAF8F5] font-semibold tabular-nums">
                  {talent.currency === 'INR' ? '₹' : talent.currency === 'USD' ? '$' : '€'}
                  {talent.dayRateInr.toLocaleString()} / {talent.rateHours}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toggleShortlist(talent.id)}
                  className={`py-3 text-xs font-label-caps uppercase transition-colors cursor-pointer border ${
                    isShortlisted
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#E8CF7A]'
                      : 'border-[#27272C] bg-[#1A1A1E] text-[#FAF8F5] hover:border-[#D4AF37]'
                  }`}
                >
                  {isShortlisted ? 'Shortlisted ✓' : 'Shortlist Talent'}
                </button>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="py-3 bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-label-caps text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Request Booking
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
