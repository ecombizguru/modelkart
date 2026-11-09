import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { TalentMainCategory, IndianMetro, EyeHue, HairComplexion } from '../types/index.ts';

interface AddTalentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_HIGH_FASHION_PHOTOS = [
  { label: 'Runway Gown Avant-Garde', url: '/src/assets/images/model_runway_avant_garde_female_1794220876249.jpg' },
  { label: 'Tailored Editorial Menswear', url: '/src/assets/images/model_haute_couture_editorial_male_1794220876487.jpg' },
  { label: 'Fine Jewelry & Beauty Portrait', url: '/src/assets/images/model_beauty_portrait_glam_1794220876398.jpg' },
  { label: 'Indian High Fashion Runway', url: '/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg' },
  { label: 'Editorial Glamour Pose', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Classic Editorial Male', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80' },
];

const CATEGORY_OPTIONS: { value: TalentMainCategory; label: string }[] = [
  { value: 'models-female', label: 'Female Model' },
  { value: 'models-male', label: 'Male Model' },
  { value: 'models-commercial', label: 'Commercial Model' },
  { value: 'models-plus-size', label: 'Plus Size Model' },
  { value: 'models-fitness', label: 'Fitness Model' },
  { value: 'models-kids', label: 'Kids Model' },
  { value: 'actors', label: 'Actor / Performer' },
  { value: 'influencers', label: 'Fashion & Lifestyle Influencer' },
  { value: 'photographers-fashion', label: 'Fashion Photographer' },
  { value: 'makeup-artists', label: 'Makeup Artist (HMUA)' },
  { value: 'fashion-stylists', label: 'Fashion Stylist' },
];

const METRO_CITIES: IndianMetro[] = [
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Goa',
  'Jaipur',
  'Udaipur',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'International'
];

export const AddTalentModal: React.FC<AddTalentModalProps> = ({ onClose, onSuccess }) => {
  const { agencies, selectedAgencyId, addTalent, uploadImageFile, addToast } = useTalentAgency();

  const [targetAgencyId, setTargetAgencyId] = useState(selectedAgencyId);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'models-female' as TalentMainCategory,
    gender: 'female' as 'female' | 'male' | 'non-binary',
    city: 'Mumbai' as IndianMetro,
    location: 'Bandra West, Mumbai',
    editorialHeadline: '',
    dayRateInr: 65000,
    currency: 'INR' as 'INR' | 'USD' | 'EUR',
    rateHours: '8h / Full Day',
    heightCm: 178,
    bustCm: 84,
    waistCm: 61,
    hipsCm: 89,
    shoeEu: 39,
    eyeHue: 'Deep Brown' as EyeHue,
    hairComplexion: 'Raven Black' as HairComplexion,
    primaryImage: PRESET_HIGH_FASHION_PHOTOS[3].url,
    customImageUrl: '',
    bio: '',
    creditsInput: 'Vogue India, Lakmé Fashion Week, Sabyasachi Editorial',
    passport: true,
    runwayWalk: true,
    sensitivities: false,
  });

  const [error, setError] = useState('');

  const targetAgency = agencies.find(a => a.id === targetAgencyId) || agencies[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide model/talent name.');
      return;
    }

    const finalImage = formData.customImageUrl.trim() || formData.primaryImage;
    const credits = formData.creditsInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    // Compute feet inches
    const totalInches = Math.round(formData.heightCm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    const heightFt = `${feet}'${inches}"`;

    const catObj = CATEGORY_OPTIONS.find(c => c.value === formData.category);
    const categoryLabel = catObj ? catObj.label : 'Model';

    addTalent({
      agencyId: targetAgency.id,
      agencyName: targetAgency.name,
      name: formData.name.trim(),
      category: formData.category,
      categoryLabel,
      location: formData.location.trim() || formData.city,
      city: formData.city,
      editorialHeadline: formData.editorialHeadline.trim() || 'Runway & High Fashion Editorial Muse',
      dayRateInr: Number(formData.dayRateInr) || 50000,
      currency: formData.currency,
      rateHours: formData.rateHours,
      rating: 4.96,
      primaryImage: finalImage,
      lookbookImages: [finalImage],
      representation: 'agency',
      specs: {
        heightCm: Number(formData.heightCm),
        heightFt,
        bustCm: Number(formData.bustCm),
        waistCm: Number(formData.waistCm),
        hipsCm: Number(formData.hipsCm),
        shoeEu: Number(formData.shoeEu),
        eyeHue: formData.eyeHue,
        hairComplexion: formData.hairComplexion,
        gender: formData.gender,
      },
      capabilities: {
        internationalPassport: formData.passport,
        runwayVerified: formData.runwayWalk,
        sensitivitiesLogged: formData.sensitivities,
      },
      skills: ['Runway Walk', 'High-Fashion Editorial', 'Print Campaign'],
      editorialCredits: credits.length > 0 ? credits : ['Lakmé Fashion Week', 'Harper’s Bazaar India'],
      languages: ['English', 'Hindi'],
      bio: formData.bio.trim() || 'Verified professional fashion talent represented by certified agency on ModelKart.',
      availability: 'Available',
      verified: true,
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#121214] border border-[#D4AF37]/40 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D4AF37] text-[20px]">
              person_add
            </span>
            <h2 className="font-headline-sm text-lg text-[#FAF8F5]">
              List New Model / Talent on Roster
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#99907c] hover:text-[#FAF8F5] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Agency & Primary Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Listing Agency *
              </label>
              <select
                value={targetAgencyId}
                onChange={(e) => setTargetAgencyId(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              >
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name} ({agency.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Model Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Viviane Moreau"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Discipline / Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TalentMainCategory })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Primary Metro City
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value as IndianMetro })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              >
                {METRO_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Location Label
              </label>
              <input
                type="text"
                placeholder="e.g. Bandra West, Mumbai"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Gender Classification
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="female">Female Board</option>
                <option value="male">Male Board</option>
                <option value="non-binary">Non-Binary / Fluid Board</option>
              </select>
            </div>

            {/* Editorial Headline */}
            <div className="md:col-span-3">
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Editorial Headline &amp; Signature Credit
              </label>
              <input
                type="text"
                placeholder="e.g. Runway Muse &amp; Sabyasachi Campaign • Vogue India Cover"
                value={formData.editorialHeadline}
                onChange={(e) => setFormData({ ...formData, editorialHeadline: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Rates and Physical Specs Grid */}
          <div className="bg-[#1A1A1E] border border-[#27272C] p-4 space-y-4">
            <span className="font-label-caps text-[10px] uppercase text-[#D4AF37] tracking-widest block border-b border-[#27272C] pb-2">
              Comp-Card Physical Specs &amp; Day Rates
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Day Rate (₹) *
                </label>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={formData.dayRateInr}
                  onChange={(e) => setFormData({ ...formData, dayRateInr: parseInt(e.target.value) || 50000 })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  min="150"
                  max="210"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 178 })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Bust / Chest (cm)
                </label>
                <input
                  type="number"
                  min="60"
                  max="140"
                  value={formData.bustCm}
                  onChange={(e) => setFormData({ ...formData, bustCm: parseInt(e.target.value) || 84 })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Waist (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="120"
                  value={formData.waistCm}
                  onChange={(e) => setFormData({ ...formData, waistCm: parseInt(e.target.value) || 60 })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Hips (cm)
                </label>
                <input
                  type="number"
                  min="60"
                  max="140"
                  value={formData.hipsCm}
                  onChange={(e) => setFormData({ ...formData, hipsCm: parseInt(e.target.value) || 90 })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Shoe (EU)
                </label>
                <input
                  type="number"
                  min="35"
                  max="48"
                  value={formData.shoeEu}
                  onChange={(e) => setFormData({ ...formData, shoeEu: parseInt(e.target.value) || 40 })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Eye Hue
                </label>
                <select
                  value={formData.eyeHue}
                  onChange={(e) => setFormData({ ...formData, eyeHue: e.target.value as any })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Emerald Green">Emerald Green</option>
                  <option value="Ice Blue">Ice Blue</option>
                  <option value="Deep Brown">Deep Brown</option>
                  <option value="Obsidian Black">Obsidian Black</option>
                  <option value="Hazel">Hazel</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Hair Complexion
                </label>
                <select
                  value={formData.hairComplexion}
                  onChange={(e) => setFormData({ ...formData, hairComplexion: e.target.value as any })}
                  className="w-full bg-[#121214] border border-[#27272C] px-2.5 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Platinum">Platinum Blonde</option>
                  <option value="Brunette">Brunette</option>
                  <option value="Raven Black">Raven Black</option>
                  <option value="Copper / Red">Copper / Red</option>
                  <option value="Honey Blonde">Honey Blonde</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photo Selection */}
          <div>
            <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-2">
              Select Curated High-Fashion Editorial Photo
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_HIGH_FASHION_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, primaryImage: p.url, customImageUrl: '' });
                  }}
                  className={`aspect-[4/5] border overflow-hidden relative cursor-pointer ${
                    formData.primaryImage === p.url && !formData.customImageUrl
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]'
                      : 'border-[#27272C] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-[#0A0A0C]/90 text-[8px] font-mono text-[#FAF8F5] p-1 truncate">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Upload Portrait File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      addToast('File Too Large', 'Please upload a photo under 5MB.', 'error');
                      return;
                    }
                    setIsUploading(true);
                    try {
                      const url = await uploadImageFile(file);
                      setFormData(prev => ({ ...prev, primaryImage: url, customImageUrl: url }));
                      addToast('Photo Uploaded', 'New model portrait loaded.', 'success');
                    } catch (_) {
                      addToast('Upload Failed', 'Could not process photo file.', 'error');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="w-full text-[11px] text-[#FAF8F5] file:mr-2 file:py-1 file:px-2.5 file:border-0 file:text-[10px] file:font-mono file:bg-[#D4AF37] file:text-[#0A0A0C] file:cursor-pointer"
                />
                <span className="text-[9px] text-[#777777] block mt-1">
                  {isUploading ? 'Uploading file...' : 'JPEG, PNG, WEBP (Max 5MB)'}
                </span>
              </div>

              <div>
                <label className="font-label-caps text-[9px] uppercase text-[#99907c] block mb-1">
                  Or Custom Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://... (direct image link)"
                  value={formData.customImageUrl}
                  onChange={(e) => setFormData({ ...formData, customImageUrl: e.target.value })}
                  className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Bio & Credits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Talent Bio &amp; Runway Walk Persona
              </label>
              <textarea
                rows={3}
                placeholder="Model background, runway training, magazine musings..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                Editorial Credits (comma separated)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Vogue France, Prada Fall Campaign, Dazed Cover"
                value={formData.creditsInput}
                onChange={(e) => setFormData({ ...formData, creditsInput: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Capabilities Checkboxes */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-[#d0c5af]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.passport}
                onChange={(e) => setFormData({ ...formData, passport: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              International Passport Valid
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.runwayWalk}
                onChange={(e) => setFormData({ ...formData, runwayWalk: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              Runway Walk Verified
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sensitivities}
                onChange={(e) => setFormData({ ...formData, sensitivities: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              Skin/Hair Sensitivities Logged
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-[#C8C5BD] hover:text-[#FAF8F5] border border-[#27272C] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-label-caps text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Add Model to {targetAgency.name}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
