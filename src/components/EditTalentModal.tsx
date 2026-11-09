import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { Talent, IndianMetro, TalentMainCategory } from '../types/index.ts';

interface EditTalentModalProps {
  talent: Talent;
  onClose: () => void;
}

export const EditTalentModal: React.FC<EditTalentModalProps> = ({ talent, onClose }) => {
  const { updateTalent, uploadImageFile, addToast } = useTalentAgency();

  const [name, setName] = useState(talent.name);
  const [dayRateInr, setDayRateInr] = useState(talent.dayRateInr);
  const [city, setCity] = useState<IndianMetro>(talent.city);
  const [location, setLocation] = useState(talent.location);
  const [bio, setBio] = useState(talent.bio);
  const [heightCm, setHeightCm] = useState(talent.specs.heightCm);
  const [bustCm, setBustCm] = useState(talent.specs.bustCm);
  const [waistCm, setWaistCm] = useState(talent.specs.waistCm);
  const [hipsCm, setHipsCm] = useState(talent.specs.hipsCm);
  const [availability, setAvailability] = useState(talent.availability);
  const [primaryImage, setPrimaryImage] = useState(talent.primaryImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large', 'Please select an image under 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);
      setPrimaryImage(url);
      addToast('Image Uploaded', 'New portrait image loaded.', 'success');
    } catch (_) {
      addToast('Upload Failed', 'Could not process image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feet = Math.floor(Math.round(heightCm / 2.54) / 12);
    const inches = Math.round(heightCm / 2.54) % 12;

    const updated: Talent = {
      ...talent,
      name: name.trim(),
      dayRateInr: Number(dayRateInr) || talent.dayRateInr,
      city,
      location: location.trim() || city,
      bio: bio.trim(),
      availability,
      primaryImage,
      specs: {
        ...talent.specs,
        heightCm: Number(heightCm),
        heightFt: `${feet}'${inches}"`,
        bustCm: Number(bustCm),
        waistCm: Number(waistCm),
        hipsCm: Number(hipsCm),
      }
    };

    updateTalent(updated);
    addToast('Profile Updated', `${updated.name}'s talent specs updated successfully.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#111111] border border-[#D6B779]/50 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B779] text-[20px]">
              edit
            </span>
            <h2 className="font-serif text-xl text-[#FFFFFF]">
              Edit Talent Specifications &amp; Day Rate
            </h2>
          </div>
          <button onClick={onClose} className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Talent Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Day Rate (₹)</label>
              <input
                type="number"
                required
                min="5000"
                step="1000"
                value={dayRateInr}
                onChange={(e) => setDayRateInr(Number(e.target.value))}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Metro City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as IndianMetro)}
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

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="Available">Available for Optioning</option>
                <option value="Optioned">Optioned for Campaign</option>
                <option value="Booked">Confirmed Booked</option>
              </select>
            </div>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-4 space-y-3">
            <span className="text-[10px] text-[#D6B779] uppercase block tracking-wider">Physical Measurements</span>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="text-[9px] text-[#777777] uppercase block">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-[#27272C] p-1.5 text-[#FFFFFF]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#777777] uppercase block">Bust (cm)</label>
                <input
                  type="number"
                  value={bustCm}
                  onChange={(e) => setBustCm(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-[#27272C] p-1.5 text-[#FFFFFF]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#777777] uppercase block">Waist (cm)</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-[#27272C] p-1.5 text-[#FFFFFF]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#777777] uppercase block">Hips (cm)</label>
                <input
                  type="number"
                  value={hipsCm}
                  onChange={(e) => setHipsCm(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-[#27272C] p-1.5 text-[#FFFFFF]"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload / Update */}
          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">
              Primary Portrait Photo
            </label>
            <div className="flex items-center gap-4 p-3 bg-[#1A1A1E] border border-[#27272C]">
              <img src={primaryImage} alt="" className="w-12 h-16 object-cover border border-[#27272C]" />
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-[#E7E3DC] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-[#D6B779] file:text-[#111111] file:cursor-pointer"
                />
                <span className="text-[10px] text-[#777777] block mt-1">
                  {isUploading ? 'Uploading file...' : 'Supported: JPEG, PNG, WEBP (Max 5MB)'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Bio / Runway Walk Musings</label>
            <textarea
              rows={3}
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
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
