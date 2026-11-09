import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { DashboardPersona, Talent, ShootProperty, CastingBrief, Booking } from '../types/index.ts';

export const DashboardsView: React.FC = () => {
  const {
    activePersona,
    setActivePersona,
    talents,
    agencies,
    properties,
    castingBriefs,
    bookings,
    selectedAgencyId,
    setSelectedAgencyId,
    setIsAddTalentModalOpen,
    setIsAddPropertyModalOpen,
    setIsPostBriefModalOpen,
    updateBookingStatus,
    updateTalent,
    deleteTalent,
    deleteProperty,
    setActiveTalentForCompCard,
    setEditingTalent,
    setEditingProperty,
    setEditingAgency,
    addToast
  } = useTalentAgency();

  const [talentSubTab, setTalentSubTab] = useState<'overview' | 'portfolio' | 'bookings' | 'applications'>('overview');
  const [agencySubTab, setAgencySubTab] = useState<'roster' | 'bookings' | 'casting' | 'team'>('roster');
  const [propertySubTab, setPropertySubTab] = useState<'listings' | 'pricing' | 'bookings'>('listings');
  const [brandSubTab, setBrandSubTab] = useState<'projects' | 'shortlists' | 'casting'>('projects');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'users' | 'moderation' | 'revenue'>('overview');

  const agency = agencies.find(a => a.id === selectedAgencyId) || agencies[0];
  const agencyTalents = talents.filter(t => t.agencyId === agency.id);
  const agencyBookings = bookings.filter(b => b.agencyId === agency.id || b.providerName?.toLowerCase().includes(agency.name.toLowerCase()));

  const sampleTalent = talents[0]; // Aarohi Sen for Talent Persona simulation

  return (
    <div className="w-full min-h-screen bg-[#111111] text-[#FFFFFF] flex flex-col">
      
      {/* Persona Ribbon Bar */}
      <div className="bg-[#1A1A1E] border-b border-[#27272C] px-6 lg:px-12 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#D6B779] font-bold uppercase">Dashboard Persona:</span>
            <span className="text-[#E7E3DC]">Select role to view tailored control center</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs uppercase">
            {[
              { id: 'talent' as DashboardPersona, label: 'Talent Dashboard' },
              { id: 'agency' as DashboardPersona, label: 'Agency Dashboard' },
              { id: 'property' as DashboardPersona, label: 'Property Owner' },
              { id: 'brand' as DashboardPersona, label: 'Brand & Client' },
              { id: 'admin' as DashboardPersona, label: 'Admin Console' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`px-3 py-1.5 transition-colors cursor-pointer border ${
                  activePersona === p.id
                    ? 'border-[#D6B779] bg-[#D6B779] text-[#111111] font-bold'
                    : 'border-[#27272C] bg-[#111111] text-[#E7E3DC] hover:text-[#FFFFFF]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout (Sidebar + Content Ground) */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* ============================================================ */}
        {/* PERSONA A: INDIVIDUAL TALENT DASHBOARD                       */}
        {/* ============================================================ */}
        {activePersona === 'talent' && (
          <>
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
              <div className="bg-[#1A1A1E] border border-[#27272C] p-5 text-center">
                <img
                  src={sampleTalent.primaryImage}
                  alt={sampleTalent.name}
                  className="w-20 h-24 object-cover mx-auto border border-[#D6B779]"
                />
                <h3 className="font-serif text-lg text-[#FFFFFF] mt-3">{sampleTalent.name}</h3>
                <span className="text-[11px] font-mono text-[#D6B779] block">{sampleTalent.categoryLabel}</span>
                <span className="text-[10px] font-mono text-[#777777] block mt-0.5">{sampleTalent.agencyName}</span>
                
                <div className="mt-4 pt-3 border-t border-[#27272C] flex justify-center gap-1 font-mono text-xs text-[#287A55]">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>KYC Verified Pro</span>
                </div>
              </div>

              <div className="bg-[#1A1A1E] border border-[#27272C] p-2 space-y-1 font-mono text-xs">
                {[
                  { id: 'overview', label: 'Overview & Analytics', icon: 'dashboard' },
                  { id: 'portfolio', label: 'Comp-Card & Polaroids', icon: 'photo_library' },
                  { id: 'bookings', label: 'Booking Inquiries', icon: 'receipt_long' },
                  { id: 'applications', label: 'Casting Applications', icon: 'assignment_turned_in' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTalentSubTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                      talentSubTab === item.id
                        ? 'bg-[#D6B779] text-[#111111] font-bold'
                        : 'text-[#E7E3DC] hover:bg-[#111111]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 min-w-0 space-y-6">
              
              {talentSubTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-[#1A1A1E] border border-[#27272C]">
                      <span className="text-[10px] font-mono text-[#777777] uppercase block">Profile Views (30 Days)</span>
                      <span className="font-serif text-3xl text-[#FFFFFF] mt-1 block">14,820</span>
                      <span className="text-[11px] font-mono text-[#287A55] mt-1 block">↑ 24% vs last month</span>
                    </div>
                    <div className="p-5 bg-[#1A1A1E] border border-[#27272C]">
                      <span className="text-[10px] font-mono text-[#777777] uppercase block">Day Rate Standard</span>
                      <span className="font-serif text-3xl text-[#D6B779] mt-1 block">₹{sampleTalent.dayRateInr.toLocaleString()}</span>
                      <span className="text-[11px] font-mono text-[#777777] mt-1 block">Full 8h Shoot Day</span>
                    </div>
                    <div className="p-5 bg-[#1A1A1E] border border-[#27272C]">
                      <span className="text-[10px] font-mono text-[#777777] uppercase block">Active Inquiries</span>
                      <span className="font-serif text-3xl text-[#FFFFFF] mt-1 block">3 Proposals</span>
                      <span className="text-[11px] font-mono text-[#D6B779] mt-1 block">Escrow Protected</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                    <h3 className="font-serif text-xl text-[#FFFFFF]">Upcoming Production Call Sheets</h3>
                    <div className="space-y-3 font-mono text-xs">
                      {bookings.filter(b => b.type === 'talent').map(b => (
                        <div key={b.id} className="p-4 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                          <div>
                            <span className="text-[#D6B779] font-bold block">{b.projectTitle}</span>
                            <span className="text-[#777777] text-[11px]">Client: {b.clientName} · Dates: {b.dates}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[#FFFFFF] font-bold block">₹{b.totalAmountInr.toLocaleString()}</span>
                            <span className="text-[#287A55] text-[10px] uppercase">{b.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {talentSubTab === 'portfolio' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-[#FFFFFF]">Comp-Card Specification Sheet</h3>
                      <p className="text-xs text-[#777777] font-mono">Validated physical measurements for casting directors</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTalent(sampleTalent)}
                        className="px-4 py-2 border border-[#D6B779] text-[#D6B779] hover:bg-[#D6B779]/10 text-xs font-mono uppercase font-bold cursor-pointer"
                      >
                        Edit Specs &amp; Day Rate
                      </button>
                      <button
                        onClick={() => setActiveTalentForCompCard(sampleTalent)}
                        className="px-4 py-2 bg-[#D6B779] text-[#111111] text-xs font-mono uppercase font-bold cursor-pointer"
                      >
                        Preview Comp-Card
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3 bg-[#111111] border border-[#27272C]">
                      <span className="text-[9px] text-[#777777] block uppercase">Height</span>
                      <span className="text-[#FFFFFF]">{sampleTalent.specs.heightCm}cm ({sampleTalent.specs.heightFt})</span>
                    </div>
                    <div className="p-3 bg-[#111111] border border-[#27272C]">
                      <span className="text-[9px] text-[#777777] block uppercase">Bust</span>
                      <span className="text-[#FFFFFF]">{sampleTalent.specs.bustCm}cm</span>
                    </div>
                    <div className="p-3 bg-[#111111] border border-[#27272C]">
                      <span className="text-[9px] text-[#777777] block uppercase">Waist</span>
                      <span className="text-[#FFFFFF]">{sampleTalent.specs.waistCm}cm</span>
                    </div>
                    <div className="p-3 bg-[#111111] border border-[#27272C]">
                      <span className="text-[9px] text-[#777777] block uppercase">Hips</span>
                      <span className="text-[#FFFFFF]">{sampleTalent.specs.hipsCm}cm</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {sampleTalent.lookbookImages.map((img, idx) => (
                      <div key={idx} className="aspect-[3/4] bg-[#111111] border border-[#27272C] overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {talentSubTab === 'bookings' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                  <h3 className="font-serif text-xl text-[#FFFFFF]">Direct Booking Inquiries</h3>
                  <div className="space-y-3 font-mono text-xs">
                    {bookings.map(b => (
                      <div key={b.id} className="p-4 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-[#FFFFFF]">{b.projectTitle}</div>
                          <div className="text-[#777777] text-[11px]">Client: {b.clientName} · Amount: ₹{b.totalAmountInr.toLocaleString()}</div>
                        </div>
                        <span className="px-3 py-1 bg-[#287A55]/15 border border-[#287A55] text-[#287A55] text-[10px] uppercase">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {talentSubTab === 'applications' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                  <h3 className="font-serif text-xl text-[#FFFFFF]">Casting Call Submissions</h3>
                  <div className="space-y-3 font-mono text-xs">
                    {castingBriefs.map(brief => (
                      <div key={brief.id} className="p-4 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-[#FFFFFF]">{brief.title}</div>
                          <div className="text-[#777777] text-[11px]">Production: {brief.brandOrProduction} · Location: {brief.location}</div>
                        </div>
                        <span className="text-[#D6B779] text-xs font-bold">
                          Budget: ₹{brief.budgetMaxInr.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </main>
          </>
        )}

        {/* ============================================================ */}
        {/* PERSONA B: AGENCY DASHBOARD                                  */}
        {/* ============================================================ */}
        {activePersona === 'agency' && (
          <>
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
              <div className="bg-[#1A1A1E] border border-[#27272C] p-5">
                <span className="text-[10px] font-mono text-[#D6B779] uppercase block">Agency Dashboard</span>
                <h3 className="font-serif text-xl text-[#FFFFFF] mt-1">{agency.name}</h3>
                <span className="text-xs font-mono text-[#777777]">{agency.city} · {agency.tier}</span>

                <div className="mt-4 pt-3 border-t border-[#27272C]">
                  <select
                    value={selectedAgencyId}
                    onChange={(e) => setSelectedAgencyId(e.target.value)}
                    className="w-full bg-[#111111] border border-[#27272C] p-2 text-xs font-mono text-[#FFFFFF] focus:outline-none"
                  >
                    {agencies.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#1A1A1E] border border-[#27272C] p-2 space-y-1 font-mono text-xs">
                {[
                  { id: 'roster', label: 'Manage Talent Roster', icon: 'group' },
                  { id: 'bookings', label: 'Booking Requests & Escrow', icon: 'payments' },
                  { id: 'casting', label: 'Casting Calls Pitching', icon: 'campaign' },
                  { id: 'team', label: 'Head Booker Desk', icon: 'badge' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setAgencySubTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                      agencySubTab === item.id
                        ? 'bg-[#D6B779] text-[#111111] font-bold'
                        : 'text-[#E7E3DC] hover:bg-[#111111]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddTalentModalOpen(true)}
                className="w-full py-3 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold hover:bg-[#E8CF7A] transition-colors cursor-pointer"
              >
                + Add Model to Roster
              </button>
            </aside>

            <main className="flex-1 min-w-0 space-y-6">
              
              {/* Agency KPI Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Total Roster</span>
                  <span className="font-serif text-2xl text-[#FFFFFF] mt-1 block">{agencyTalents.length} Talents</span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Active In Escrow</span>
                  <span className="font-serif text-2xl text-[#D6B779] mt-1 block">
                    ₹{agencyBookings.reduce((s, b) => s + b.totalAmountInr, 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Rating</span>
                  <span className="font-serif text-2xl text-[#FFFFFF] mt-1 block">★ {agency.rating.toFixed(2)}</span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Vetting Status</span>
                  <span className="font-mono text-sm text-[#287A55] mt-2 block font-bold">100% Verified</span>
                </div>
              </div>

              {agencySubTab === 'roster' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-[#FFFFFF]">{agency.name} Exclusive Model Roster</h3>
                    <button
                      onClick={() => setIsAddTalentModalOpen(true)}
                      className="px-3 py-1.5 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold"
                    >
                      + Add Talent
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#27272C] text-[#777777] uppercase text-[10px]">
                          <th className="py-2.5 px-3">Model</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Measurements</th>
                          <th className="py-2.5 px-3">Day Rate</th>
                          <th className="py-2.5 px-3">Availability</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272C]">
                        {agencyTalents.map((t) => (
                          <tr key={t.id} className="hover:bg-[#111111]">
                            <td className="py-3 px-3 flex items-center gap-2">
                              <img src={t.primaryImage} alt="" className="w-8 h-10 object-cover" />
                              <div>
                                <span className="font-serif text-sm text-[#FFFFFF] block">{t.name}</span>
                                <span className="text-[10px] text-[#777777]">{t.location}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[#E7E3DC]">{t.categoryLabel}</td>
                            <td className="py-3 px-3 text-[#777777]">{t.specs.heightCm}cm (B:{t.specs.bustCm}/W:{t.specs.waistCm}/H:{t.specs.hipsCm})</td>
                            <td className="py-3 px-3 text-[#D6B779] font-bold">₹{t.dayRateInr.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 border border-[#287A55] text-[#287A55] text-[10px]">
                                {t.availability}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setEditingTalent(t)}
                                className="text-xs text-[#E7E3DC] hover:text-[#D6B779] mr-3 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setActiveTalentForCompCard(t)}
                                className="text-xs text-[#D6B779] hover:underline mr-3 cursor-pointer"
                              >
                                Comp-Card
                              </button>
                              <button
                                onClick={() => {
                                  deleteTalent(t.id);
                                  addToast('Talent Removed', `${t.name} removed from agency roster.`, 'info');
                                }}
                                className="text-xs text-red-400 hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {agencySubTab === 'bookings' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4 font-mono text-xs">
                  <h3 className="font-serif text-xl text-[#FFFFFF]">Escrow Bookings &amp; Call Sheets</h3>
                  {agencyBookings.map(b => (
                    <div key={b.id} className="p-4 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#FFFFFF]">{b.projectTitle}</div>
                        <div className="text-[#777777] text-[11px]">Client: {b.clientName} · Talent: {b.itemName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#D6B779] font-bold">₹{b.totalAmountInr.toLocaleString()}</div>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'Completed & Released')}
                          className="mt-1 px-3 py-1 bg-[#287A55] text-[#FFFFFF] text-[10px] uppercase font-bold"
                        >
                          Sign-off Call Sheet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {agencySubTab === 'casting' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                  <h3 className="font-serif text-xl text-[#FFFFFF]">Open Casting Calls Ready for Pitching</h3>
                  <div className="space-y-3 font-mono text-xs">
                    {castingBriefs.map(brief => (
                      <div key={brief.id} className="p-4 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-[#FFFFFF]">{brief.title}</div>
                          <div className="text-[#777777] text-[11px]">{brief.brandOrProduction} · Budget: ₹{brief.budgetMaxInr.toLocaleString()}</div>
                        </div>
                        <span className="text-[#D6B779]">{brief.deadline}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {agencySubTab === 'team' && (
                <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4 font-mono text-xs">
                  <h3 className="font-serif text-xl text-[#FFFFFF]">Agency Booker Desk</h3>
                  <div className="p-4 bg-[#111111] border border-[#27272C] space-y-2">
                    <div><span className="text-[#777777]">Head Booker:</span> {agency.bookerName}</div>
                    <div><span className="text-[#777777]">Email:</span> {agency.bookerEmail}</div>
                    <div><span className="text-[#777777]">Phone:</span> {agency.bookerPhone}</div>
                    <div><span className="text-[#777777]">Website:</span> {agency.website}</div>
                  </div>
                </div>
              )}

            </main>
          </>
        )}

        {/* ============================================================ */}
        {/* PERSONA C: PROPERTY OWNER DASHBOARD                          */}
        {/* ============================================================ */}
        {activePersona === 'property' && (
          <>
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
              <div className="bg-[#1A1A1E] border border-[#27272C] p-5">
                <span className="text-[10px] font-mono text-[#D6B779] uppercase block">Location Host Console</span>
                <h3 className="font-serif text-xl text-[#FFFFFF] mt-1">Property Manager</h3>
                <span className="text-xs font-mono text-[#777777]">{properties.length} Active Venues</span>
              </div>

              <div className="bg-[#1A1A1E] border border-[#27272C] p-2 space-y-1 font-mono text-xs">
                {[
                  { id: 'listings', label: 'My Listed Properties', icon: 'villa' },
                  { id: 'bookings', label: 'Shoot Booking Requests', icon: 'receipt_long' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setPropertySubTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                      propertySubTab === item.id
                        ? 'bg-[#D6B779] text-[#111111] font-bold'
                        : 'text-[#E7E3DC] hover:bg-[#111111]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddPropertyModalOpen(true)}
                className="w-full py-3 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold hover:bg-[#E8CF7A] transition-colors cursor-pointer"
              >
                + List New Property
              </button>
            </aside>

            <main className="flex-1 min-w-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Listed Locations</span>
                  <span className="font-serif text-2xl text-[#FFFFFF] mt-1 block">{properties.length} Venues</span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Location Escrow Revenue</span>
                  <span className="font-serif text-2xl text-[#D6B779] mt-1 block">₹3,40,000</span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Verified Host Seal</span>
                  <span className="font-mono text-sm text-[#287A55] mt-2 block font-bold">Active ✓</span>
                </div>
              </div>

              <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-[#FFFFFF]">My Production Venues</h3>
                  <button
                    onClick={() => setIsAddPropertyModalOpen(true)}
                    className="px-3 py-1.5 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold"
                  >
                    + Add Property
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map(p => (
                    <div key={p.id} className="p-4 bg-[#111111] border border-[#27272C] flex gap-4">
                      <img src={p.heroImage} alt="" className="w-24 h-20 object-cover border border-[#27272C]" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-base text-[#FFFFFF]">{p.name}</h4>
                          <span className="text-xs font-mono text-[#777777]">{p.city} · {p.category}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono text-xs text-[#D6B779]">₹{p.dailyRateInr.toLocaleString()}/day</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProperty(p)}
                              className="text-[10px] font-mono text-[#E7E3DC] hover:text-[#D6B779] cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                deleteProperty(p.id);
                                addToast('Property Removed', `${p.name} removed from listings.`, 'info');
                              }}
                              className="text-[10px] font-mono text-red-400 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </>
        )}

        {/* ============================================================ */}
        {/* PERSONA D: BRAND & CLIENT DASHBOARD                          */}
        {/* ============================================================ */}
        {activePersona === 'brand' && (
          <>
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
              <div className="bg-[#1A1A1E] border border-[#27272C] p-5">
                <span className="text-[10px] font-mono text-[#D6B779] uppercase block">Brand Production Suite</span>
                <h3 className="font-serif text-xl text-[#FFFFFF] mt-1">Atelier Studio Paris</h3>
                <span className="text-xs font-mono text-[#777777]">Haute Couture Campaigns</span>
              </div>

              <div className="bg-[#1A1A1E] border border-[#27272C] p-2 space-y-1 font-mono text-xs">
                {[
                  { id: 'projects', label: 'Active Shoot Projects', icon: 'movie' },
                  { id: 'casting', label: 'Broadcasted Casting Briefs', icon: 'campaign' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setBrandSubTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                      brandSubTab === item.id
                        ? 'bg-[#D6B779] text-[#111111] font-bold'
                        : 'text-[#E7E3DC] hover:bg-[#111111]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsPostBriefModalOpen(true)}
                className="w-full py-3 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold hover:bg-[#E8CF7A] transition-colors cursor-pointer"
              >
                + Post a Casting Brief
              </button>
            </aside>

            <main className="flex-1 min-w-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Active Campaigns</span>
                  <span className="font-serif text-2xl text-[#FFFFFF] mt-1 block">4 Shoots</span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Escrow Deposited</span>
                  <span className="font-serif text-2xl text-[#D6B779] mt-1 block">
                    ₹{bookings.reduce((s, b) => s + b.totalAmountInr, 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Staged Talents</span>
                  <span className="font-serif text-2xl text-[#FFFFFF] mt-1 block">6 Booked</span>
                </div>
              </div>

              <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
                <h3 className="font-serif text-xl text-[#FFFFFF]">Escrow-Backed Campaigns In Production</h3>
                <div className="space-y-3 font-mono text-xs">
                  {bookings.map(b => (
                    <div key={b.id} className="p-4 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#FFFFFF]">{b.projectTitle}</div>
                        <div className="text-[#777777] text-[11px]">Provider: {b.providerName} · Dates: {b.dates}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#D6B779] font-bold block">₹{b.totalAmountInr.toLocaleString()}</span>
                        <span className="text-[#287A55] text-[10px] uppercase">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </>
        )}

        {/* ============================================================ */}
        {/* PERSONA E: ADMIN DASHBOARD                                   */}
        {/* ============================================================ */}
        {activePersona === 'admin' && (
          <main className="flex-1 space-y-6">
            <div className="bg-[#1A1A1E] border border-[#27272C] p-6">
              <span className="text-xs font-mono text-[#D6B779] uppercase block">ModelKart System Command</span>
              <h2 className="font-serif text-2xl text-[#FFFFFF] mt-1">Platform Master Analytics &amp; Moderation</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                <span className="text-[10px] font-mono text-[#777777] uppercase block">Total Talents</span>
                <span className="font-serif text-3xl text-[#FFFFFF] mt-1 block">{talents.length}</span>
              </div>
              <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                <span className="text-[10px] font-mono text-[#777777] uppercase block">Certified Agencies</span>
                <span className="font-serif text-3xl text-[#D6B779] mt-1 block">{agencies.length}</span>
              </div>
              <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                <span className="text-[10px] font-mono text-[#777777] uppercase block">Shoot Properties</span>
                <span className="font-serif text-3xl text-[#FFFFFF] mt-1 block">{properties.length}</span>
              </div>
              <div className="p-4 bg-[#1A1A1E] border border-[#27272C]">
                <span className="text-[10px] font-mono text-[#777777] uppercase block">Escrow GTV (Gross Trans. Val)</span>
                <span className="font-serif text-2xl text-[#287A55] mt-1 block">₹4.2 Cr</span>
              </div>
            </div>

            <div className="bg-[#1A1A1E] border border-[#27272C] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#FFFFFF]">Listing Verification &amp; KYC Queue</h3>
              <div className="space-y-3 font-mono text-xs">
                {talents.map(t => (
                  <div key={t.id} className="p-3 bg-[#111111] border border-[#27272C] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={t.primaryImage} alt="" className="w-8 h-10 object-cover" />
                      <div>
                        <span className="text-sm font-serif text-[#FFFFFF]">{t.name}</span>
                        <span className="text-[#777777] text-[11px] block">{t.agencyName} · {t.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#287A55] font-bold">APPROVED ✓</span>
                      <button
                        onClick={() => deleteTalent(t.id)}
                        className="text-red-400 hover:underline"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

      </div>

    </div>
  );
};
