import React, { useState } from 'react';
import { TalentAgencyProvider, useTalentAgency } from './context/TalentAgencyContext.tsx';
import { Header } from './components/Header.tsx';
import { TopTicker } from './components/TopTicker.tsx';
import { HomePageView } from './components/HomePageView.tsx';
import { TalentDiscoveryView } from './components/TalentDiscoveryView.tsx';
import { AgencyDirectoryView } from './components/AgencyDirectoryView.tsx';
import { PropertyDiscoveryView } from './components/PropertyDiscoveryView.tsx';
import { CastingCallsView } from './components/CastingCallsView.tsx';
import { BrandsView } from './components/BrandsView.tsx';
import { DashboardsView } from './components/DashboardsView.tsx';
import { CompCardModal } from './components/CompCardModal.tsx';
import { PropertyDetailModal } from './components/PropertyDetailModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { MultiStepRegistrationModal } from './components/MultiStepRegistrationModal.tsx';
import { AddTalentModal } from './components/AddTalentModal.tsx';
import { AddPropertyModal } from './components/AddPropertyModal.tsx';
import { PostBriefModal } from './components/PostBriefModal.tsx';
import { ShortlistDrawer } from './components/ShortlistDrawer.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { EditTalentModal } from './components/EditTalentModal.tsx';
import { EditPropertyModal } from './components/EditPropertyModal.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { Footer } from './components/Footer.tsx';

function ModelKartRoot() {
  const [activeTab, setActiveTab] = useState<'home' | 'talent' | 'agencies' | 'locations' | 'casting' | 'brands' | 'dashboards'>('home');

  const {
    activeTalentForCompCard,
    setActiveTalentForCompCard,
    activePropertyForDetails,
    setActivePropertyForDetails,
    activeTalentForBooking,
    setActiveTalentForBooking,
    editingTalent,
    setEditingTalent,
    editingProperty,
    setEditingProperty,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAddTalentModalOpen,
    setIsAddTalentModalOpen,
    isAddPropertyModalOpen,
    setIsAddPropertyModalOpen,
    isPostBriefModalOpen,
    setIsPostBriefModalOpen,
    setSelectedAgencyId,
    setActivePersona,
    setFilters,
    shortlist,
    talents
  } = useTalentAgency();

  const handleOpenAgencyDashboard = (agencyId: string) => {
    setSelectedAgencyId(agencyId);
    setActivePersona('agency');
    setActiveTab('dashboards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAgencyRoster = (agencyName: string) => {
    setFilters({ agencyFilter: agencyName });
    setActiveTab('talent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#D6B779] selection:text-[#111111]">
      
      {/* Sticky Luxury Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="w-full pt-20 flex-1 flex flex-col">
        {/* Ticker strip */}
        <TopTicker />

        {/* Dynamic Route View */}
        {activeTab === 'home' && (
          <HomePageView onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {activeTab === 'talent' && (
          <TalentDiscoveryView />
        )}

        {activeTab === 'agencies' && (
          <AgencyDirectoryView
            onSelectAgency={handleSelectAgencyRoster}
            onOpenAgencyDashboard={handleOpenAgencyDashboard}
          />
        )}

        {activeTab === 'locations' && (
          <PropertyDiscoveryView />
        )}

        {activeTab === 'casting' && (
          <CastingCallsView />
        )}

        {activeTab === 'brands' && (
          <BrandsView onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {activeTab === 'dashboards' && (
          <DashboardsView />
        )}
      </main>

      {/* Floating Shortlist Tray */}
      <ShortlistDrawer
        onOpenBookingModalForFirst={() => {
          if (shortlist.length > 0) {
            const firstModel = talents.find(t => t.id === shortlist[0]);
            if (firstModel) setActiveTalentForBooking(firstModel);
          }
        }}
      />

      {/* Digital Comp-Card Modal */}
      {activeTalentForCompCard && (
        <CompCardModal
          talent={activeTalentForCompCard}
          onClose={() => setActiveTalentForCompCard(null)}
        />
      )}

      {/* Edit Talent Profile Modal */}
      {editingTalent && (
        <EditTalentModal
          talent={editingTalent}
          onClose={() => setEditingTalent(null)}
        />
      )}

      {/* Property Details Modal */}
      {activePropertyForDetails && (
        <PropertyDetailModal
          property={activePropertyForDetails}
          onClose={() => setActivePropertyForDetails(null)}
        />
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}

      {/* Direct Booking Modal */}
      {activeTalentForBooking && (
        <BookingModal
          talent={activeTalentForBooking}
          onClose={() => setActiveTalentForBooking(null)}
        />
      )}

      {/* Multi-Step 4-Way Onboarding Registration Modal */}
      {isRegisterModalOpen && (
        <MultiStepRegistrationModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={() => {
            setActiveTab('dashboards');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* User Login & Authentication Modal */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => {
            setActiveTab('dashboards');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Add Model to Agency Roster Modal */}
      {isAddTalentModalOpen && (
        <AddTalentModal
          onClose={() => setIsAddTalentModalOpen(false)}
          onSuccess={() => {
            setActiveTab('dashboards');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Add Photoshoot Location Modal */}
      {isAddPropertyModalOpen && (
        <AddPropertyModal
          onClose={() => setIsAddPropertyModalOpen(false)}
          onSuccess={() => {
            setActiveTab('locations');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Post a Casting Brief Modal */}
      {isPostBriefModalOpen && (
        <PostBriefModal
          onClose={() => setIsPostBriefModalOpen(false)}
        />
      )}

      {/* Luxury Editorial Toast Feedback */}
      <ToastContainer />

      {/* Editorial Luxury Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAgencyRegister={() => {
          setIsRegisterModalOpen(true);
        }}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ModelKart App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111111] text-[#FAF8F5] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 mb-4 text-[#D6B779] flex items-center justify-center border border-[#D6B779]/40 rounded-full text-xl font-serif">
            ✦
          </div>
          <h1 className="font-serif text-3xl mb-2 text-[#FAF8F5] tracking-widest">MODELKART</h1>
          <p className="text-sm text-[#A8A29E] max-w-md mb-6 font-sans">
            The session encountered an unexpected interruption. Click below to refresh and restore your active talent and booking boards.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase tracking-wider font-bold cursor-pointer hover:bg-[#E8CF7A]"
          >
            Restore Session
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <TalentAgencyProvider>
        <ModelKartRoot />
      </TalentAgencyProvider>
    </ErrorBoundary>
  );
}
