import React, { useState } from 'react';
import { ShootProperty } from '../types/index.ts';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

interface PropertyDetailModalProps {
  property: ShootProperty;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { createBooking } = useTalentAgency();
  const [selectedImage, setSelectedImage] = useState(property.heroImage);
  const [shootDate, setShootDate] = useState('2025-05-24');
  const [daysCount, setDaysCount] = useState(1);
  const [productionType, setProductionType] = useState('Fashion Campaign Lookbook');
  const [clientName, setClientName] = useState('Luxury Atelier House');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const totalCost = property.dailyRateInr * daysCount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBooking({
      type: 'property',
      itemId: property.id,
      itemName: property.name,
      itemImage: property.heroImage,
      providerName: property.ownerName,
      clientName: clientName.trim() || 'Production House',
      projectTitle: productionType.trim() || 'Photoshoot',
      dates: `${shootDate} (${daysCount} days)`,
      totalAmountInr: totalCost,
      status: 'Escrow Funded',
    });

    setBookedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0A0A0C]/90 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#111111] border border-[#D6B779]/40 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1A1E] border-b border-[#27272C]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D6B779] text-[20px]">
              villa
            </span>
            <span className="font-mono text-xs text-[#D6B779] uppercase tracking-wider">
              {property.category} · {property.city}
            </span>
          </div>
          <button onClick={onClose} className="text-[#777777] hover:text-[#FFFFFF] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {bookedSuccess ? (
          <div className="p-12 text-center space-y-4">
            <span className="material-symbols-outlined text-[#287A55] text-5xl">check_circle</span>
            <h3 className="font-serif text-3xl text-[#FFFFFF]">Location Booking Escrow Locked</h3>
            <p className="text-xs text-[#E7E3DC] font-mono max-w-md mx-auto">
              ₹{totalCost.toLocaleString()} held in ModelKart Escrow Vault for {property.name}. Host {property.ownerName} has been alerted for site inspection and permits.
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery Left */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1E] border border-[#27272C]">
                <img
                  src={selectedImage}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {[property.heroImage, ...property.galleryImages].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[16/10] border overflow-hidden cursor-pointer ${
                      selectedImage === img ? 'border-[#D6B779]' : 'border-[#27272C] opacity-70'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-3 pt-4 border-t border-[#27272C]">
                <h3 className="font-serif text-xl text-[#FFFFFF]">Property Overview</h3>
                <p className="text-xs text-[#E7E3DC] font-light leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#D6B779] uppercase block mb-2">
                  Production Amenities &amp; Facilities
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#E7E3DC]">
                  {property.amenities.map((am, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 p-2 bg-[#1A1A1E] border border-[#27272C]">
                      <span className="material-symbols-outlined text-[#D6B779] text-[14px]">check</span>
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Booking Card */}
            <div className="lg:col-span-5 bg-[#1A1A1E] border border-[#27272C] p-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="border-b border-[#27272C] pb-3">
                  <h2 className="font-serif text-2xl text-[#FFFFFF]">{property.name}</h2>
                  <span className="text-xs font-mono text-[#777777]">{property.locationDetails}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-[#111111] border border-[#27272C]">
                    <span className="text-[9px] text-[#777777] block uppercase">Capacity</span>
                    <span className="text-[#FFFFFF]">{property.capacity}</span>
                  </div>
                  <div className="p-2.5 bg-[#111111] border border-[#27272C]">
                    <span className="text-[9px] text-[#777777] block uppercase">Area</span>
                    <span className="text-[#FFFFFF]">{property.squareFeet.toLocaleString()} sq.ft.</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-[9px] text-[#777777] uppercase block mb-1">Production Project Name</label>
                    <input
                      type="text"
                      required
                      value={productionType}
                      onChange={(e) => setProductionType(e.target.value)}
                      className="w-full bg-[#111111] border border-[#27272C] p-2 text-[#FFFFFF] focus:border-[#D6B779] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-[#777777] uppercase block mb-1">Production Client / Agency</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#111111] border border-[#27272C] p-2 text-[#FFFFFF] focus:border-[#D6B779] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-[#777777] uppercase block mb-1">Shoot Date</label>
                      <input
                        type="date"
                        required
                        value={shootDate}
                        onChange={(e) => setShootDate(e.target.value)}
                        className="w-full bg-[#111111] border border-[#27272C] p-2 text-[#FFFFFF] focus:border-[#D6B779] focus:outline-none [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-[#777777] uppercase block mb-1">Days</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={daysCount}
                        onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-[#111111] border border-[#27272C] p-2 text-[#FFFFFF] focus:border-[#D6B779] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Calculation Box */}
                  <div className="p-3 bg-[#111111] border border-[#D6B779]/40 space-y-1.5 mt-4">
                    <div className="flex justify-between text-[#E7E3DC]">
                      <span>Rate: ₹{property.dailyRateInr.toLocaleString()} × {daysCount} day(s)</span>
                      <span>₹{totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#287A55]">
                      <span>ModelKart Production Rider:</span>
                      <span>Included ✓</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#D6B779] pt-1 border-t border-[#27272C]">
                      <span>Total Escrow:</span>
                      <span>₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer mt-4"
                  >
                    Lock Location with Escrow
                  </button>
                </form>

                {/* Host Info */}
                <div className="p-3 bg-[#111111] border border-[#27272C] text-[11px] font-mono text-[#777777]">
                  <div className="text-[#D6B779] font-bold uppercase">Host Contact:</div>
                  <div>{property.ownerName} ({property.ownerEmail})</div>
                  <div>Direct Phone: {property.ownerPhone}</div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
