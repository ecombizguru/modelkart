import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

interface AgencyDirectoryViewProps {
  onSelectAgency: (agencyName: string) => void;
  onOpenAgencyDashboard: (agencyId: string) => void;
}

export const AgencyDirectoryView: React.FC<AgencyDirectoryViewProps> = ({
  onSelectAgency,
  onOpenAgencyDashboard
}) => {
  const { agencies, talents, setIsRegisterModalOpen, setRegisterInitialPersona } = useTalentAgency();
  const [search, setSearch] = useState('');

  const filteredAgencies = agencies.filter(a => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#27272C] gap-6">
        <div>
          <span className="font-label-caps text-xs uppercase text-[#D4AF37] tracking-widest block mb-2">
            Institutional Network Registry
          </span>
          <h1 className="font-headline-lg text-3xl md:text-4xl text-[#FAF8F5]">
            Certified Agency Directory
          </h1>
          <p className="font-body-md text-sm text-[#C8C5BD] mt-2 max-w-2xl">
            Accredited modeling agencies, creative management bureaus, and boutique talent ateliers across Mumbai, Delhi NCR, Bangalore, Goa, and Jaipur.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRegisterInitialPersona('agency');
              setIsRegisterModalOpen(true);
            }}
            className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-label-caps text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            + Register New Agency
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="my-8 max-w-md">
        <input
          type="text"
          placeholder="Filter agencies by name or metro city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1A1A1E] border border-[#27272C] px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37] font-mono"
        />
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => {
          const agencyModels = talents.filter(t => t.agencyId === agency.id);

          return (
            <div
              key={agency.id}
              className="bg-[#121214] border border-[#27272C] p-6 hover:border-[#D4AF37]/50 transition-colors flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] font-mono text-[10px] uppercase">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    {agency.tier}
                  </span>
                  <span className="text-xs text-[#99907c] font-mono">
                    {agency.city}, {agency.country}
                  </span>
                </div>

                <h2 className="font-headline-sm text-2xl text-[#FAF8F5]">
                  {agency.name}
                </h2>
                <div className="text-[11px] text-[#99907c] font-mono mt-1">
                  Established {agency.establishedYear} · Head Booker: {agency.bookerName}
                </div>

                <p className="font-body-sm text-xs text-[#C8C5BD] mt-3 leading-relaxed">
                  {agency.description}
                </p>

                {/* Models Preview Thumbnails */}
                {agencyModels.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#27272C]">
                    <span className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-2">
                      Exclusive Roster Preview ({agencyModels.length})
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {agencyModels.slice(0, 5).map(m => (
                        <img
                          key={m.id}
                          src={m.primaryImage}
                          alt={m.name}
                          className="w-10 h-12 object-cover border border-[#27272C] bg-[#0A0A0C]"
                          title={`${m.name} (${m.specs.heightCm}cm)`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#27272C]">
                <button
                  onClick={() => onSelectAgency(agency.name)}
                  className="w-full bg-[#1A1A1E] hover:bg-[#D4AF37] hover:text-[#0A0A0C] border border-[#27272C] text-[#FAF8F5] font-mono text-xs uppercase py-2.5 transition-colors font-medium cursor-pointer"
                >
                  Browse Models ({agencyModels.length})
                </button>
                <button
                  onClick={() => onOpenAgencyDashboard(agency.id)}
                  className="px-3 border border-[#27272C] hover:border-[#FAF8F5] text-[#C8C5BD] hover:text-[#FAF8F5] font-mono text-xs uppercase py-2.5 transition-colors cursor-pointer"
                >
                  Manage Roster
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
