import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { ShootProperty, IndianMetro, PropertyCategory } from '../types/index.ts';

interface EditPropertyModalProps {
  property: ShootProperty;
  onClose: () => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property, onClose }) => {
  const { updateProperty, uploadImageFile, addToast } = useTalentAgency();

  const [name, setName] = useState(property.name);
  const [category, setCategory] = useState<PropertyCategory>(property.category);
  const [city, setCity] = useState<IndianMetro>(property.city);
  const [locationDetails, setLocationDetails] = useState(property.locationDetails);
  const [dailyRateInr, setDailyRateInr] = useState(property.dailyRateInr);
  const [capacity, setCapacity] = useState(property.capacity);
  const [squareFeet, setSquareFeet] = useState(property.squareFeet);
  const [description, setDescription] = useState(property.description);
  const [amenitiesInput, setAmenitiesInput] = useState(property.amenities.join(', '));
  const [heroImage, setHeroImage] = useState(property.heroImage);
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
      setHeroImage(url);
      addToast('Image Uploaded', 'New venue hero photo updated.', 'success');
    } catch (_) {
      addToast('Upload Failed', 'Could not process venue image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amenities = amenitiesInput.split(',').map(s => s.trim()).filter(Boolean);

    const updated: ShootProperty = {
      ...property,
      name: name.trim(),
      category,
      city,
      locationDetails: locationDetails.trim() || `${city}, India`,
      dailyRateInr: Number(dailyRateInr) || property.dailyRateInr,
      capacity: capacity.trim() || property.capacity,
      squareFeet: Number(squareFeet) || property.squareFeet,
      description: description.trim(),
      heroImage,
      amenities: amenities.length > 0 ? amenities : property.amenities
    };

    updateProperty(updated);
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
              Edit Shoot Venue Specifications
            </h2>
          </div>
          <button onClick={onClose} className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Venue Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
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
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Day Rate (₹)</label>
              <input
                type="number"
                required
                min="10000"
                step="5000"
                value={dailyRateInr}
                onChange={(e) => setDailyRateInr(Number(e.target.value))}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as IndianMetro)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              >
                <option value="Goa">Goa</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#777777] uppercase block mb-1">Crew Capacity</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Amenities (comma-separated)</label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full bg-[#1A1A1E] border border-[#27272C] p-2 text-[#FFFFFF] focus:outline-none focus:border-[#D6B779]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Venue Hero Photo</label>
            <div className="flex items-center gap-4 p-3 bg-[#1A1A1E] border border-[#27272C]">
              <img src={heroImage} alt="" className="w-16 h-12 object-cover border border-[#27272C]" />
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-[#E7E3DC] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-[#D6B779] file:text-[#111111] file:cursor-pointer"
                />
                <span className="text-[10px] text-[#777777] block mt-1">
                  {isUploading ? 'Uploading file...' : 'Upload high-resolution property photography'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#777777] uppercase block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Save Location Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
