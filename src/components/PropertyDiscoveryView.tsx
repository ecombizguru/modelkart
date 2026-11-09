import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { PropertyCategory, ShootProperty } from '../types/index.ts';

export const PropertyDiscoveryView: React.FC = () => {
  const {
    properties,
    setActivePropertyForDetails,
    setIsAddPropertyModalOpen
  } = useTalentAgency();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [maxBudget, setMaxBudget] = useState(250000);

  const filteredProperties = properties.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedCity !== 'all' && p.city !== selectedCity) return false;
    if (p.dailyRateInr > maxBudget) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesLocation = p.locationDetails.toLowerCase().includes(q);
      const matchesCategory = p.category.toLowerCase().includes(q);
      if (!matchesName && !matchesLocation && !matchesCategory) return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#27272C] gap-6">
        <div>
          <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
            Production Venues &amp; Studios
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-[#FFFFFF] font-light">
            Find the Perfect Location for Your Next Production
          </h1>
          <p className="font-sans text-sm text-[#E7E3DC] mt-2 max-w-2xl font-light">
            Daylight studios in Mumbai, minimalist luxury villas in Goa, royal palaces in Jaipur, and beachfront estates in Alibaug for fashion editorials, brand commercials, and lookbooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="px-5 py-3 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            + List Your Property
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="my-8 p-4 bg-[#1A1A1E] border border-[#27272C] grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="text-[10px] text-[#777777] uppercase block mb-1">Search Keyword</label>
          <input
            type="text"
            placeholder="Search venue or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-[#27272C] px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
          />
        </div>

        <div>
          <label className="text-[10px] text-[#777777] uppercase block mb-1">Property Type</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#111111] border border-[#27272C] px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779] cursor-pointer"
          >
            <option value="all">All Venue Categories</option>
            <option value="Luxury Villas">Luxury Villas</option>
            <option value="Photography Studios">Photography Studios</option>
            <option value="Heritage Havelis & Palaces">Heritage Havelis &amp; Palaces</option>
            <option value="Outdoor Locations">Outdoor Locations</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-[#777777] uppercase block mb-1">Metro Region</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-[#111111] border border-[#27272C] px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779] cursor-pointer"
          >
            <option value="all">All Indian Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Goa">Goa</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Alibaug">Alibaug</option>
            <option value="Delhi NCR">Delhi NCR</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-[#777777] uppercase mb-1">
            <span>Max Day Rate</span>
            <span className="text-[#D6B779] font-bold">₹{maxBudget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="30000"
            max="300000"
            step="10000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(parseInt(e.target.value))}
            className="w-full accent-[#D6B779] cursor-pointer mt-2"
          />
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            onClick={() => setActivePropertyForDetails(prop)}
            className="group bg-[#1A1A1E] border border-[#27272C] hover:border-[#D6B779] transition-all duration-300 flex flex-col cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#111111]">
              <img
                src={prop.heroImage}
                alt={prop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#111111]/85 border border-[#27272C] px-2.5 py-1 text-[10px] font-mono text-[#D6B779] uppercase">
                {prop.category}
              </div>
              <div className="absolute top-3 right-3 bg-[#111111]/85 border border-[#287A55] px-2 py-0.5 text-[10px] font-mono text-[#287A55] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Verified Host
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-serif text-2xl text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors">
                    {prop.name}
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#777777] block mt-0.5">
                  {prop.locationDetails} ({prop.city})
                </span>

                <p className="text-xs text-[#E7E3DC] font-light mt-3 line-clamp-2 leading-relaxed">
                  {prop.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {prop.amenities.slice(0, 3).map((am, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#111111] border border-[#27272C] text-[10px] font-mono text-[#E7E3DC]">
                      {am}
                    </span>
                  ))}
                  {prop.amenities.length > 3 && (
                    <span className="px-2 py-0.5 bg-[#111111] text-[10px] font-mono text-[#777777]">
                      +{prop.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#27272C] flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-[#777777] block uppercase">Daily Rental</span>
                  <span className="text-base text-[#D6B779] font-bold">
                    ₹{prop.dailyRateInr.toLocaleString()} <span className="text-xs text-[#777777] font-normal">/ day</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  View &amp; Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
