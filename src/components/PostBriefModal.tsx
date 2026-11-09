import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { TalentMainCategory, IndianMetro } from '../types/index.ts';

interface PostBriefModalProps {
  onClose: () => void;
}

const CATEGORY_CHOICES: { value: TalentMainCategory; label: string }[] = [
  { value: 'models-female', label: 'Female Model (Runway / Editorial)' },
  { value: 'models-male', label: 'Male Model (High Fashion / Commercial)' },
  { value: 'models-commercial', label: 'Commercial Campaign Model' },
  { value: 'models-plus-size', label: 'Plus Size / Curve High Fashion' },
  { value: 'models-fitness', label: 'Fitness & Athletic Model' },
  { value: 'actors', label: 'Actor & Screen Talent' },
  { value: 'influencers', label: 'Fashion & Digital Influencer' },
  { value: 'photographers-fashion', label: 'Fashion Photographer' },
  { value: 'makeup-artists', label: 'Makeup & Hair Artist' },
  { value: 'fashion-stylists', label: 'Wardrobe & Fashion Stylist' },
];

export const PostBriefModal: React.FC<PostBriefModalProps> = ({ onClose }) => {
  const { postCastingBrief, addToast } = useTalentAgency();

  const [formData, setFormData] = useState({
    title: '',
    brandOrPublication: '',
    category: 'models-female' as TalentMainCategory,
    city: 'Mumbai' as IndianMetro,
    location: 'Mehboob Studios, Bandra, Mumbai',
    shootDates: 'Nov 20 - Nov 22, 2025',
    budgetMaxInr: 175000,
    talentRequirements: '',
    postedBy: 'Casting Director',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.brandOrPublication.trim()) {
      return;
    }

    const maxBudget = Number(formData.budgetMaxInr) || 150000;
    const minBudget = Math.round(maxBudget * 0.75);

    postCastingBrief({
      title: formData.title.trim(),
      brandOrProduction: formData.brandOrPublication.trim(),
      talentCategory: formData.category,
      location: formData.location.trim() || `${formData.city}, India`,
      city: formData.city,
      shootDates: formData.shootDates.trim(),
      budgetMinInr: minBudget,
      budgetMaxInr: maxBudget,
      deadline: 'Nov 30, 2025',
      talentRequirements: formData.talentRequirements.trim() || 'Verified portfolio credits, professional runway stride or editorial lookbook presence.',
      status: 'Open for Submissions',
      postedBy: formData.postedBy.trim() || formData.brandOrPublication.trim(),
    });

    addToast('Casting Brief Broadcasted', `"${formData.title}" posted to verified agencies.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#121214] border border-[#D6B779]/40 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B779] text-[20px]">
              campaign
            </span>
            <h2 className="font-serif text-lg text-[#FAF8F5]">
              Broadcast Verified Casting Brief
            </h2>
          </div>
          <button onClick={onClose} className="text-[#99907c] hover:text-[#FAF8F5] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="text-[10px] uppercase text-[#99907c] block mb-1">
              Campaign / Show Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sabyasachi Royal Heritage Winter Campaign"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase text-[#99907c] block mb-1">
                Brand / Production House *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vogue India, Tarun Tahiliani"
                value={formData.brandOrPublication}
                onChange={(e) => setFormData({ ...formData, brandOrPublication: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#99907c] block mb-1">
                Discipline Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TalentMainCategory })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
              >
                {CATEGORY_CHOICES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase text-[#99907c] block mb-1">
                Primary Metro City
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value as IndianMetro })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Goa">Goa</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Udaipur">Udaipur</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#99907c] block mb-1">
                Shoot Dates
              </label>
              <input
                type="text"
                value={formData.shootDates}
                onChange={(e) => setFormData({ ...formData, shootDates: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase text-[#99907c] block mb-1">
                Talent Budget (₹ INR)
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={formData.budgetMaxInr}
                onChange={(e) => setFormData({ ...formData, budgetMaxInr: parseInt(e.target.value) || 100000 })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#99907c] block mb-1">
                Casting Director Name
              </label>
              <input
                type="text"
                value={formData.postedBy}
                onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
                className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-[#99907c] block mb-1">
              Talent Casting Requirements &amp; Measurements
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Female Runway 178-182cm, verified high-fashion runway stride, dark hair, Indian or international passport."
              value={formData.talentRequirements}
              onChange={(e) => setFormData({ ...formData, talentRequirements: e.target.value })}
              className="w-full bg-[#1A1A1E] border border-[#27272C] px-3 py-2 text-[#FAF8F5] focus:outline-none focus:border-[#D6B779]"
            />
          </div>

          <div className="p-3 bg-[#1A1A1E] border border-[#D6B779]/30 text-[11px] text-[#C8C5BD]">
            <span className="text-[#D6B779] font-bold">Escrow Guarantee:</span> This brief will be instantly dispatched to verified partner agencies (Anima, Inega, Toabh). You can review comp-cards and fund escrow upon optioning.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#27272C] text-[#C8C5BD] hover:text-[#FAF8F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-bold uppercase tracking-wider cursor-pointer"
            >
              Publish Casting Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
