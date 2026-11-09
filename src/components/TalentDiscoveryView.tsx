import React, { useState, useMemo } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { Talent } from '../types/index.ts';

export const TalentDiscoveryView: React.FC = () => {
  const {
    talents,
    agencies,
    filters,
    setFilters,
    resetFilters,
    setActiveTalentForCompCard,
    toggleShortlist,
    shortlist
  } = useTalentAgency();

  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minHeight, setMinHeight] = useState(165);
  const [maxRate, setMaxRate] = useState(300000);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'rate-low' | 'rate-high' | 'popular' | 'verified'>('recommended');

  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (selectedGender !== 'all' && t.specs.gender !== selectedGender) return false;
      if (selectedCity !== 'all' && t.city !== selectedCity) return false;
      if (verifiedOnly && !t.verified) return false;
      if (t.specs.heightCm < minHeight) return false;
      if (t.dayRateInr > maxRate) return false;
      if (filters.agencyFilter && t.agencyName.toLowerCase() !== filters.agencyFilter.toLowerCase()) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesAgency = t.agencyName.toLowerCase().includes(q);
        const matchesLocation = t.location.toLowerCase().includes(q);
        const matchesHeadline = t.editorialHeadline.toLowerCase().includes(q);
        if (!matchesName && !matchesAgency && !matchesLocation && !matchesHeadline) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rate-low') return a.dayRateInr - b.dayRateInr;
      if (sortBy === 'rate-high') return b.dayRateInr - a.dayRateInr;
      if (sortBy === 'popular') return (b.rating * 10) - (a.rating * 10);
      if (sortBy === 'verified') return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      return b.rating - a.rating; // recommended
    });
  }, [talents, selectedCategory, selectedGender, selectedCity, verifiedOnly, minHeight, maxRate, filters.agencyFilter, search, sortBy]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#27272C] gap-6">
        <div>
          <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
            ModelKart Exclusive Roster
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-[#FFFFFF] font-light">
            Discover Extraordinary Talent
          </h1>
          <p className="font-sans text-sm text-[#E7E3DC] mt-2 max-w-2xl font-light">
            India’s premier runway models, screen actors, fashion photographers, celebrity stylists, and makeup artists backed by accredited agencies.
          </p>
        </div>

        {/* Search Bar on top */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, agency, credit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1E] border border-[#27272C] px-4 py-2.5 text-xs text-[#FFFFFF] font-mono focus:outline-none focus:border-[#D6B779]"
          />
        </div>
      </div>

      {/* Main Layout: Left Filter Sidebar + Right Talent Cards Grid */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="sticky top-28 bg-[#1A1A1E] border border-[#27272C] p-6 space-y-6 text-xs font-mono">
            
            <div className="flex items-center justify-between border-b border-[#27272C] pb-3">
              <span className="font-serif text-base text-[#FFFFFF]">Filters</span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedGender('all');
                  setSelectedCity('all');
                  setVerifiedOnly(false);
                  setMinHeight(165);
                  setMaxRate(300000);
                  setSearch('');
                  resetFilters();
                }}
                className="text-[10px] uppercase text-[#D6B779] hover:text-[#E8CF7A]"
              >
                Reset All
              </button>
            </div>

            {/* Talent Category */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#777777] block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#111111] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="all">All Categories</option>
                <option value="models-female">Female Models</option>
                <option value="models-male">Male Models</option>
                <option value="models-plus-size">Plus Size / Curve</option>
                <option value="models-commercial">Commercial Models</option>
                <option value="actors">Actors &amp; Screen Talent</option>
                <option value="influencers">Digital Influencers</option>
                <option value="photographers-fashion">Fashion Photographers</option>
                <option value="makeup-artists">Makeup &amp; Hair Artists</option>
              </select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#777777] block">Gender Board</label>
              <div className="grid grid-cols-3 gap-1">
                {(['all', 'female', 'male'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 uppercase text-[10px] border transition-colors ${
                      selectedGender === g
                        ? 'border-[#D6B779] bg-[#D6B779] text-[#111111] font-bold'
                        : 'border-[#27272C] bg-[#111111] text-[#E7E3DC]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Metro City */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-[#777777] block">Metro City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#111111] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="all">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Goa">Goa</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            {/* Height Slider */}
            <div className="space-y-2 border-t border-[#27272C] pt-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#777777] uppercase">Min Height</span>
                <span className="text-[#D6B779] font-bold">{minHeight} cm</span>
              </div>
              <input
                type="range"
                min="160"
                max="195"
                value={minHeight}
                onChange={(e) => setMinHeight(parseInt(e.target.value))}
                className="w-full accent-[#D6B779] cursor-pointer"
              />
            </div>

            {/* Day Rate Slider */}
            <div className="space-y-2 border-t border-[#27272C] pt-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#777777] uppercase">Max Day Rate</span>
                <span className="text-[#D6B779] font-bold">₹{maxRate.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="400000"
                step="25000"
                value={maxRate}
                onChange={(e) => setMaxRate(parseInt(e.target.value))}
                className="w-full accent-[#D6B779] cursor-pointer"
              />
            </div>

            {/* Verified Only */}
            <div className="border-t border-[#27272C] pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-[#E7E3DC]">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="accent-[#D6B779]"
                />
                <span className="text-xs">Verified Profiles Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Right Talent Cards Grid */}
        <main className="flex-1 min-w-0">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#27272C] gap-4 font-mono text-xs">
            <div className="text-[#777777]">
              Showing <span className="text-[#FFFFFF] font-bold">{filteredTalents.length}</span> extraordinary profiles
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#777777] uppercase text-[10px]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1A1A1E] border border-[#27272C] px-3 py-1.5 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779] cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="rate-low">Day Rate: Low to High</option>
                <option value="rate-high">Day Rate: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="verified">Verified First</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredTalents.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-[#1A1A1E] border border-[#27272C] mt-8">
              <span className="material-symbols-outlined text-[#777777] text-5xl">person_search</span>
              <h3 className="font-serif text-2xl text-[#FFFFFF]">No profiles match the search criteria</h3>
              <p className="text-xs text-[#777777] max-w-sm mx-auto font-mono">
                Try widening your height or rate parameters, or reset filters to view all verified talents.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-8">
              {filteredTalents.map((talent) => {
                const isShortlisted = shortlist.includes(talent.id);

                return (
                  <article
                    key={talent.id}
                    className="group bg-[#1A1A1E] border border-[#27272C] hover:border-[#D6B779] transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#111111]">
                      <img
                        src={talent.primaryImage}
                        alt={talent.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <span className="px-2.5 py-1 bg-[#111111]/85 border border-[#287A55] text-[#287A55] text-[10px] font-mono uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          {talent.agencyName}
                        </span>
                        <span className="px-2 py-1 bg-[#111111]/85 border border-[#27272C] text-[#D6B779] text-xs font-mono">
                          ★ {talent.rating.toFixed(2)}
                        </span>
                      </div>

                      {/* Specs drawer on hover */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#111111] via-[#111111]/90 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px] text-[#E7E3DC] border-t border-[#27272C] pt-2">
                          <div><span className="text-[#777777] block text-[9px]">HT</span>{talent.specs.heightCm}cm</div>
                          <div><span className="text-[#777777] block text-[9px]">BUST</span>{talent.specs.bustCm}cm</div>
                          <div><span className="text-[#777777] block text-[9px]">WAIST</span>{talent.specs.waistCm}cm</div>
                          <div><span className="text-[#777777] block text-[9px]">HIPS</span>{talent.specs.hipsCm}cm</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <h2
                            onClick={() => setActiveTalentForCompCard(talent)}
                            className="font-serif text-xl text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors cursor-pointer"
                          >
                            {talent.name}
                          </h2>
                          <span className="text-xs font-mono text-[#777777]">{talent.location}</span>
                        </div>
                        <p className="text-xs text-[#E7E3DC] mt-1 font-light line-clamp-2">
                          {talent.editorialHeadline}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs font-mono">
                          <span className="text-[10px] text-[#777777] uppercase">Standard Day Rate</span>
                          <span className="text-sm text-[#D6B779] font-bold">
                            ₹{talent.dayRateInr.toLocaleString()} <span className="text-[#777777] text-[10px]">/ 8h</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 mt-4 border-t border-[#27272C]">
                        <button
                          type="button"
                          onClick={() => setActiveTalentForCompCard(talent)}
                          className="w-full py-2 bg-[#111111] hover:border-[#D6B779] border border-[#27272C] text-xs font-mono uppercase text-[#FFFFFF] transition-colors cursor-pointer"
                        >
                          View Comp-Card
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleShortlist(talent.id)}
                          className={`w-full py-2 font-mono text-xs uppercase font-bold transition-colors cursor-pointer border ${
                            isShortlisted
                              ? 'border-[#D6B779] bg-[#D6B779]/20 text-[#D6B779]'
                              : 'bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] border-transparent'
                          }`}
                        >
                          {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
