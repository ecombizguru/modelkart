import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { IndianMetro, TalentMainCategory, PropertyCategory } from '../types/index.ts';

interface MultiStepRegistrationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const MultiStepRegistrationModal: React.FC<MultiStepRegistrationModalProps> = ({
  onClose,
  onSuccess
}) => {
  const {
    registerInitialPersona,
    addTalent,
    addAgency,
    addProperty,
    setActivePersona
  } = useTalentAgency();

  const [track, setTrack] = useState<'talent' | 'agency' | 'property' | 'brand'>(registerInitialPersona || 'talent');
  const [step, setStep] = useState(1);

  // Common and Track States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<IndianMetro>('Mumbai');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [instagram, setInstagram] = useState('');
  const [bio, setBio] = useState('');
  const [dayRate, setDayRate] = useState(75000);

  // Talent Specific
  const [talentCategory, setTalentCategory] = useState<TalentMainCategory>('models-female');
  const [heightCm, setHeightCm] = useState(178);

  // Agency Specific
  const [agencyName, setAgencyName] = useState('');
  const [agencyTier, setAgencyTier] = useState<'Accredited Tier 1' | 'Boutique Luxury' | 'National Major' | 'Independent Collective'>('Boutique Luxury');

  // Property Specific
  const [propertyName, setPropertyName] = useState('');
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>('Luxury Villas');
  const [propertyCapacity, setPropertyCapacity] = useState('Up to 40 Crew');

  // Brand Specific
  const [brandName, setBrandName] = useState('');
  const [companyType, setCompanyType] = useState('Fashion Brand & Couture House');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    if (track === 'talent') {
      const feet = Math.floor(Math.round(heightCm / 2.54) / 12);
      const inches = Math.round(heightCm / 2.54) % 12;
      addTalent({
        name: fullName || 'New Talent',
        category: talentCategory,
        categoryLabel: talentCategory.replace('models-', '').toUpperCase(),
        location: `${city}, India`,
        city,
        editorialHeadline: `${talentCategory.toUpperCase()} · ModelKart Verified Roster`,
        dayRateInr: Number(dayRate) || 85000,
        currency: 'INR',
        rateHours: '8h',
        rating: 5.0,
        primaryImage: '/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg',
        lookbookImages: ['/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg'],
        representation: 'freelance',
        agencyName: 'Independent Verified Pro',
        specs: {
          heightCm,
          heightFt: `${feet}'${inches}"`,
          bustCm: 84,
          waistCm: 60,
          hipsCm: 89,
          shoeEu: 40,
          eyeHue: 'Deep Brown',
          hairComplexion: 'Raven Black',
          gender: 'female',
          age: 22
        },
        capabilities: {
          internationalPassport: true,
          runwayVerified: true,
          sensitivitiesLogged: true,
        },
        skills: ['High Fashion Editorial', 'Runway Striding', 'Commercial'],
        editorialCredits: ['ModelKart Debut 2025'],
        languages: ['English', 'Hindi'],
        bio: bio || 'Professional verified talent on ModelKart marketplace.',
        availability: 'Available',
        verified: true,
        instagramHandle: instagram,
      });
      setActivePersona('talent');
    } else if (track === 'agency') {
      addAgency({
        name: agencyName || fullName || 'New Agency',
        tier: agencyTier,
        city,
        country: 'India',
        establishedYear: 2024,
        rosterCount: 1,
        rating: 5.0,
        escrowStatus: '100% Escrow Protected',
        description: bio || 'Premier talent management agency representing models and creative visionaries.',
        bookerName: fullName || 'Head Booker',
        bookerEmail: email,
        bookerPhone: phone,
        website: portfolioLink || 'https://modelkart.in',
        logo: (agencyName || 'AG').slice(0, 3).toUpperCase(),
        verified: true,
        specialization: 'High Fashion & Editorial',
      });
      setActivePersona('agency');
    } else if (track === 'property') {
      addProperty({
        name: propertyName || 'New Shoot Venue',
        category: propertyCategory,
        city,
        locationDetails: `${city}, India`,
        dailyRateInr: Number(dayRate) || 75000,
        capacity: propertyCapacity,
        squareFeet: 5000,
        heroImage: '/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg',
        galleryImages: ['/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg'],
        amenities: ['Reflection Pool', 'Cyclorama Wall', 'Air-Conditioned Vanity', 'Power Generator'],
        description: bio || 'Luxury photoshoot venue equipped with full production amenities.',
        ownerName: fullName || 'Property Host',
        ownerEmail: email,
        ownerPhone: phone,
        availableFor: ['Photoshoots', 'Ad Films'],
      });
      setActivePersona('property');
    } else {
      // Brand
      setActivePersona('brand');
    }

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#111111] border border-[#D6B779]/50 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B779] text-[20px]">
              how_to_reg
            </span>
            <h2 className="font-serif text-xl text-[#FFFFFF]">
              Join the ModelKart Creative Ecosystem
            </h2>
          </div>
          <button onClick={onClose} className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Step 1: Select Track */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono text-[#D6B779] uppercase tracking-widest block">Step 01 of 02</span>
              <h3 className="font-serif text-2xl text-[#FFFFFF]">Select Your Registration Category</h3>
              <p className="text-xs text-[#E7E3DC] font-light max-w-md mx-auto">
                ModelKart provides specialized verification, escrow workflows and customized dashboards for each participant.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { id: 'talent' as const, title: 'Individual Creative Talent', desc: 'Models, actors, photographers, HMUAs, stylists', icon: 'person' },
                { id: 'agency' as const, title: 'Talent Agency Board', desc: 'Modeling agencies managing multiple represented talents', icon: 'domain' },
                { id: 'property' as const, title: 'Shoot Location / Venue Host', desc: 'Owners of villas, daylight studios, havelis & resorts', icon: 'villa' },
                { id: 'brand' as const, title: 'Brand, Production or Client', desc: 'Fashion labels, ad agencies & casting directors', icon: 'storefront' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTrack(item.id)}
                  className={`p-4 border text-left transition-all cursor-pointer flex gap-3 ${
                    track === item.id
                      ? 'border-[#D6B779] bg-[#D6B779]/10 text-[#D6B779]'
                      : 'border-[#27272C] bg-[#1A1A1E] text-[#E7E3DC] hover:border-[#777777]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl text-[#D6B779]">{item.icon}</span>
                  <div>
                    <div className="font-serif text-base text-[#FFFFFF]">{item.title}</div>
                    <div className="text-[11px] text-[#777777] font-sans mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#27272C]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                Proceed to Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fill Details */}
        {step === 2 && (
          <form onSubmit={handleFinish} className="p-6 md:p-8 space-y-5 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#27272C] pb-3">
              <div>
                <span className="text-[10px] text-[#D6B779] uppercase block">Step 02 of 02</span>
                <h3 className="font-serif text-xl text-[#FFFFFF] capitalize">{track} Onboarding Form</h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#777777] hover:text-[#FFFFFF]"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Primary Name */}
              <div>
                <label className="text-[10px] text-[#777777] uppercase block mb-1">
                  {track === 'agency' ? 'Head Booker Name' : track === 'property' ? 'Host Contact Name' : 'Full Professional Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarohi Sen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] text-[#777777] uppercase block mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. booking@talent.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] text-[#777777] uppercase block mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+91 98200 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                />
              </div>

              {/* Metro City */}
              <div>
                <label className="text-[10px] text-[#777777] uppercase block mb-1">Primary Metro Market *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Goa">Goa</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              {/* Conditional: Talent */}
              {track === 'talent' && (
                <>
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Talent Category</label>
                    <select
                      value={talentCategory}
                      onChange={(e) => setTalentCategory(e.target.value as any)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    >
                      <option value="models-female">Female Model</option>
                      <option value="models-male">Male Model</option>
                      <option value="models-plus-size">Plus Size / Curve</option>
                      <option value="models-commercial">Commercial Model</option>
                      <option value="actors">Actor &amp; Screen Talent</option>
                      <option value="photographers-fashion">Fashion Photographer</option>
                      <option value="makeup-artists">Makeup &amp; Hair Artist</option>
                      <option value="influencers">Digital Influencer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(parseInt(e.target.value) || 178)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    />
                  </div>
                </>
              )}

              {/* Conditional: Agency */}
              {track === 'agency' && (
                <>
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Agency Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elite India, Toabh Management"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Accreditation Tier</label>
                    <select
                      value={agencyTier}
                      onChange={(e) => setAgencyTier(e.target.value as any)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    >
                      <option value="Accredited Tier 1">Accredited Tier 1 (National Major)</option>
                      <option value="Boutique Luxury">Boutique Luxury</option>
                      <option value="Independent Collective">Independent Collective</option>
                    </select>
                  </div>
                </>
              )}

              {/* Conditional: Property */}
              {track === 'property' && (
                <>
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Property / Venue Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Villa Beleza Goa, Samode Palace"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Venue Type</label>
                    <select
                      value={propertyCategory}
                      onChange={(e) => setPropertyCategory(e.target.value as any)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    >
                      <option value="Luxury Villas">Luxury Villas</option>
                      <option value="Photography Studios">Photography Studios</option>
                      <option value="Heritage Havelis & Palaces">Heritage Havelis &amp; Palaces</option>
                      <option value="Outdoor Locations">Outdoor Locations</option>
                    </select>
                  </div>
                </>
              )}

              {/* Conditional: Brand */}
              {track === 'brand' && (
                <>
                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Brand / Studio Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tarun Tahiliani, Vogue India"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#777777] uppercase block mb-1">Company Classification</label>
                    <input
                      type="text"
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] text-[#777777] uppercase block mb-1">Standard Daily Rate (₹)</label>
                <input
                  type="number"
                  value={dayRate}
                  onChange={(e) => setDayRate(parseInt(e.target.value) || 50000)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#777777] uppercase block mb-1">Instagram Handle / Portfolio</label>
                <input
                  type="text"
                  placeholder="@handle or portfolio URL"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Professional Bio / Introduction</label>
              <textarea
                rows={3}
                placeholder="Editorial credits, runway appearances, amenities, or brand history..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272C]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#27272C] text-[#E7E3DC] hover:text-[#FFFFFF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-bold uppercase tracking-wider cursor-pointer"
              >
                Submit &amp; Open Control Center
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
