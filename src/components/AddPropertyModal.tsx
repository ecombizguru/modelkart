import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { IndianMetro, PropertyCategory } from '../types/index.ts';

interface AddPropertyModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose, onSuccess }) => {
  const { addProperty, uploadImageFile, addToast } = useTalentAgency();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Luxury Villas');
  const [city, setCity] = useState<IndianMetro>('Goa');
  const [locationDetails, setLocationDetails] = useState('');
  const [dailyRateInr, setDailyRateInr] = useState(85000);
  const [capacity, setCapacity] = useState('Up to 40 Crew');
  const [squareFeet, setSquareFeet] = useState(6500);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('Reflection Pool, 3-Phase Power, HMUA Vanity Room, Cyclorama Wall');
  const [heroImage, setHeroImage] = useState('/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large', 'Please upload a photo under 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);
      setHeroImage(url);
      addToast('Photo Uploaded', 'Venue hero photography loaded.', 'success');
    } catch (_) {
      addToast('Upload Failed', 'Could not process venue image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const amenities = amenitiesInput.split(',').map(s => s.trim()).filter(Boolean);

    addProperty({
      name: name.trim(),
      category,
      city,
      locationDetails: locationDetails.trim() || `${city}, India`,
      dailyRateInr: Number(dailyRateInr) || 85000,
      capacity: capacity.trim() || 'Up to 30 Crew',
      squareFeet: Number(squareFeet) || 5000,
      heroImage: heroImage || '/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg',
      galleryImages: [heroImage || '/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg'],
      amenities: amenities.length > 0 ? amenities : ['Daylight Studio', 'Vanity Room', 'Power Generator'],
      description: description.trim() || 'Architectural property designed for luxury editorial and film productions.',
      ownerName: ownerName.trim() || 'Property Host',
      ownerEmail: ownerEmail.trim() || 'host@modelkart.in',
      ownerPhone: ownerPhone.trim() || '+91 98000 00000',
      availableFor: ['Photoshoots', 'Ad Films'],
    });

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#111111] border border-[#D6B779]/40 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B779] text-[20px]">
              villa
            </span>
            <h2 className="font-serif text-xl text-[#FFFFFF]">
              List Your Photoshoot Location or Studio
            </h2>
          </div>
          <button onClick={onClose} className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Property / Venue Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Casa Mirador Luxury Cliffside Villa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Venue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="Luxury Villas">Luxury Villas</option>
                <option value="Photography Studios">Photography Studios</option>
                <option value="Heritage Havelis & Palaces">Heritage Havelis &amp; Palaces</option>
                <option value="Outdoor Locations">Outdoor Locations</option>
                <option value="Resorts & Hotels">Resorts &amp; Hotels</option>
                <option value="Rooftops">Rooftops</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Metro Market *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="Goa">Goa</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Alibaug">Alibaug</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Udaipur">Udaipur</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Neighborhood / Address</label>
              <input
                type="text"
                placeholder="e.g. Assagao, North Goa"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Daily Rental Price (₹) *</label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={dailyRateInr}
                onChange={(e) => setDailyRateInr(parseInt(e.target.value) || 50000)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Max Crew Capacity</label>
              <input
                type="text"
                placeholder="e.g. Up to 40 Crew"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Built-Up Area (sq.ft.)</label>
              <input
                type="number"
                value={squareFeet}
                onChange={(e) => setSquareFeet(parseInt(e.target.value) || 5000)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Host Contact Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Devika Singhal"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Host Contact Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. host@villa.in"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Production Amenities (comma separated)</label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Venue Hero Photography</label>
            <div className="flex items-center gap-4 p-3 bg-[#1A1A1E] border border-[#27272C]">
              <img src={heroImage} alt="" className="w-16 h-12 object-cover border border-[#27272C]" />
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-[#E7E3DC] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-[#D6B779] file:text-[#111111] file:cursor-pointer"
                />
                <span className="text-[10px] text-[#777777] block mt-1">
                  {isUploading ? 'Uploading venue image...' : 'Upload architectural / daylight photo (Max 5MB)'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Description &amp; Architectural Features</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Natural light orientation, pool dimensions, ceiling heights, generator specifications..."
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
              Publish Location to Marketplace
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
