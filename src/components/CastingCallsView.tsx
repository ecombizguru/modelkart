import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

export const CastingCallsView: React.FC = () => {
  const {
    castingBriefs,
    talents,
    agencies,
    selectedAgencyId,
    submitTalentToBrief,
    setActiveTalentForCompCard,
    setIsPostBriefModalOpen
  } = useTalentAgency();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentAgency = agencies.find(a => a.id === selectedAgencyId) || agencies[0];
  const currentAgencyTalents = talents.filter(t => t.agencyId === currentAgency.id);

  const filteredBriefs = selectedCategory === 'all'
    ? castingBriefs
    : castingBriefs.filter(b => b.talentCategory === selectedCategory);

  const handlePitch = (briefId: string, talentId: string) => {
    submitTalentToBrief(briefId, talentId, `Directly submitted by ${currentAgency.name}`);
    setSuccessMsg('Model successfully submitted to casting director review board.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#27272C] gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] font-mono text-[11px] uppercase tracking-wider mb-2">
            Haute Couture Casting Calls &amp; Auditions
          </div>
          <h1 className="font-headline-lg text-3xl md:text-4xl text-[#FAF8F5] font-light">
            Verified Casting Briefs
          </h1>
          <p className="font-body-md text-sm text-[#C8C5BD] mt-2 max-w-2xl">
            Casting directors from luxury ateliers, editorial houses, and fashion weeks post verified briefs with escrow-secured talent budgets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostBriefModalOpen(true)}
            className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-label-caps text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            + Post a Casting Brief
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="my-6 p-4 bg-[#D4AF37]/15 border border-[#D4AF37] text-[#E8CF7A] text-xs font-mono flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)}>✕</button>
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex items-center gap-2 my-8 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {['all', 'runway', 'editorial', 'commercial'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 uppercase transition-colors cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-[#FAF8F5] text-[#0A0A0C] font-bold border-[#FAF8F5]'
                : 'bg-[#1A1A1E] text-[#C8C5BD] hover:text-[#FAF8F5] border-[#27272C]'
            }`}
          >
            {cat === 'all' ? 'All Castings' : cat}
          </button>
        ))}
      </div>

      {/* Briefs List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBriefs.map((brief) => {
          return (
            <div key={brief.id} className="bg-[#121214] border border-[#27272C] p-6 lg:p-8 space-y-6">
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] font-mono text-[10px] uppercase">
                      {brief.talentCategory}
                    </span>
                    <span className="text-xs text-[#99907c] font-mono">
                      {brief.location}
                    </span>
                    <span className="text-[#27272C]">•</span>
                    <span className="text-xs text-[#99907c] font-mono">
                      Dates: {brief.shootDates}
                    </span>
                  </div>

                  <h2 className="font-headline-md text-2xl text-[#FAF8F5]">
                    {brief.title}
                  </h2>
                  <p className="text-xs text-[#C8C5BD]">
                    Brand: <span className="text-[#FAF8F5] font-semibold">{brief.brandOrProduction}</span> · Posted by {brief.postedBy}
                  </p>
                </div>

                <div className="text-left lg:text-right flex-shrink-0">
                  <span className="font-label-caps text-[10px] text-[#99907c] uppercase block">
                    Talent Compensation
                  </span>
                  <span className="font-headline-md text-2xl text-[#FAF8F5] tabular-nums">
                    ₹{brief.budgetMaxInr.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] block mt-0.5 font-mono">
                    Stripe Escrow Pre-Authorized
                  </span>
                </div>
              </div>

              {/* Requirements Box */}
              <div className="bg-[#1A1A1E] border border-[#27272C] p-4 text-xs">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase block mb-1">
                  Casting Specifications &amp; Walk Profile:
                </span>
                <p className="text-[#d0c5af] leading-relaxed">
                  {brief.talentRequirements}
                </p>
              </div>

              {/* Submissions Review Strip */}
              <div className="pt-4 border-t border-[#27272C] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] uppercase text-[#99907c]">
                    Pitched Talents ({brief.submittedTalents.length})
                  </span>
                  
                  {/* Agency Quick Submit Action */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#99907c] font-mono hidden sm:inline">
                      Submit from {currentAgency.name}:
                    </span>
                    <select
                      id={`pitch-brief-${brief.id}`}
                      className="bg-[#1A1A1E] border border-[#27272C] text-xs text-[#FAF8F5] px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {currentAgencyTalents.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.specs.heightCm}cm / {t.category})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const select = document.getElementById(`pitch-brief-${brief.id}`) as HTMLSelectElement;
                        if (select && select.value) {
                          handlePitch(brief.id, select.value);
                        }
                      }}
                      className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-mono text-xs uppercase font-bold cursor-pointer"
                    >
                      Pitch Talent
                    </button>
                  </div>
                </div>

                {/* Submissions Badges Grid */}
                {brief.submittedTalents.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {brief.submittedTalents.map((sub, idx) => {
                      const talent = talents.find(t => t.id === sub.talentId);
                      if (!talent) return null;
                      return (
                        <div
                          key={idx}
                          className="bg-[#1A1A1E] border border-[#27272C] p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={talent.primaryImage}
                              alt={talent.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-10 object-cover bg-[#0A0A0C]"
                            />
                            <div>
                              <div className="font-headline-sm text-xs text-[#FAF8F5]">
                                {talent.name}
                              </div>
                              <div className="text-[10px] text-[#99907c] font-mono">
                                {talent.agencyName} · {talent.specs.heightCm}cm
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveTalentForCompCard(talent)}
                            className="text-[10px] font-mono text-[#D4AF37] hover:underline"
                          >
                            Comp-Card
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
