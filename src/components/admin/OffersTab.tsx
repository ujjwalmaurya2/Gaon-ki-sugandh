import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { BumperOffer, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  CheckCircle2,
  Clock,
  Tag,
  Eye,
  X,
  Play,
  Pause,
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
  ShoppingBag,
  Gift
} from 'lucide-react';

export const OffersTab: React.FC = () => {
  const { offers, addOffer, updateOffer, deleteOffer, toggleOfferStatus, showToast } = useStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'scheduled' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<BumperOffer | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<BumperOffer, 'id'>>({
    title: '',
    subtitle: '',
    badgeText: 'BUMPER OFFER',
    offerType: 'percent',
    discountValue: 20,
    minOrderValue: 499,
    applicableCategories: ['all'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'active',
    bannerGradient: 'from-emerald-700 via-emerald-600 to-green-700',
    ctaLabel: 'Shop Bumper Offer',
    isSpotlight: true,
  });

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      subtitle: '',
      badgeText: 'BUMPER OFFER',
      offerType: 'percent',
      discountValue: 25,
      minOrderValue: 499,
      applicableCategories: ['all'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'active',
      bannerGradient: 'from-emerald-700 via-emerald-600 to-green-700',
      ctaLabel: 'Shop Bumper Offer',
      isSpotlight: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (offer: BumperOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      subtitle: offer.subtitle,
      badgeText: offer.badgeText,
      offerType: offer.offerType,
      discountValue: offer.discountValue,
      minOrderValue: offer.minOrderValue,
      applicableCategories: offer.applicableCategories || ['all'],
      startDate: offer.startDate.split('T')[0],
      endDate: offer.endDate.split('T')[0],
      status: offer.status,
      bannerGradient: offer.bannerGradient || 'from-emerald-700 via-emerald-600 to-green-700',
      ctaLabel: offer.ctaLabel || 'Shop Bumper Offer',
      isSpotlight: offer.isSpotlight ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = (offer: BumperOffer) => {
    const copyData: Omit<BumperOffer, 'id'> = {
      ...offer,
      title: `${offer.title} (Copy)`,
      status: 'scheduled',
    };
    addOffer(copyData);
    showToast(`Duplicated "${offer.title}" as scheduled offer`, 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Offer title is required', 'warning');
      return;
    }

    if (editingOffer) {
      updateOffer({
        ...editingOffer,
        ...formData,
      });
    } else {
      addOffer(formData);
    }
    setIsModalOpen(false);
  };

  // Toggle Category Checkbox in Form
  const toggleCategorySelection = (catId: string) => {
    if (catId === 'all') {
      setFormData((prev) => ({
        ...prev,
        applicableCategories: prev.applicableCategories?.includes('all') ? [] : ['all'],
      }));
      return;
    }

    setFormData((prev) => {
      const current = prev.applicableCategories?.filter((c) => c !== 'all') || [];
      if (current.includes(catId as CategoryId)) {
        const next = current.filter((c) => c !== catId);
        return {
          ...prev,
          applicableCategories: next.length === 0 ? ['all'] : next,
        };
      } else {
        return {
          ...prev,
          applicableCategories: [...current, catId as CategoryId],
        };
      }
    });
  };

  // Filtered list
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchStatus = filterStatus === 'all' || o.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.title.toLowerCase().includes(q) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q)) ||
        (o.description && o.description.toLowerCase().includes(q)) ||
        o.badgeText.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [offers, filterStatus, searchQuery]);

  // Metrics
  const activeCount = offers.filter((o) => o.status === 'active').length;
  const scheduledCount = offers.filter((o) => o.status === 'scheduled').length;
  const inactiveCount = offers.filter((o) => o.status === 'inactive').length;

  // Preset Gradients
  const THEME_GRADIENTS = [
    { label: 'Emerald Pure', value: 'from-emerald-700 via-emerald-600 to-green-700' },
    { label: 'Golden Honey', value: 'from-amber-600 via-yellow-600 to-amber-700' },
    { label: 'Desi Mustard', value: 'from-yellow-700 via-amber-600 to-orange-700' },
    { label: 'Saffron Spice', value: 'from-orange-700 via-red-600 to-amber-700' },
    { label: 'Midnight Vedic', value: 'from-slate-900 via-emerald-950 to-stone-900' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
              Bumper Offers & Promotions
            </h2>
            <span className="px-2 py-0.5 bg-brand-yellowPale text-brand-dark text-[10px] font-black rounded uppercase tracking-wider">
              High-Conversion Campaigns
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Configure homepage bumper banners, category discount spotlights, and festival promotional deals.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white font-black text-xs rounded-xl shadow-blinkit flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bumper Offer</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Active Offers</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-brand-dark">{activeCount}</h3>
            <p className="text-[11px] text-brand-green font-bold mt-0.5">Live on customer storefront</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Scheduled Offers</span>
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-brand-dark">{scheduledCount}</h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">Upcoming seasonal sales</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Paused / Expired</span>
            <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
              <Pause className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-brand-dark">{inactiveCount}</h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">Archived campaigns</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Campaign Reach</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-black text-brand-dark">Instant Storefront Spotlight</h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">
              1-click "Shop Offer" filtering
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-brand-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'active', 'scheduled', 'inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all shrink-0 ${
                filterStatus === st
                  ? 'bg-brand-green text-white shadow-xs'
                  : 'bg-brand-bg hover:bg-gray-200 text-brand-dark'
              }`}
            >
              {st} {st === 'all' ? `(${offers.length})` : st === 'active' ? `(${activeCount})` : ''}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full px-3 py-1.5 pl-8 bg-brand-bg border border-brand-border rounded-xl text-xs font-medium outline-none focus:border-brand-green"
          />
          <Tag className="w-3.5 h-3.5 text-brand-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOffers.map((offer) => {
          const isActive = offer.status === 'active';
          const isScheduled = offer.status === 'scheduled';

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs hover:border-brand-green/60 transition-all flex flex-col justify-between"
            >
              {/* Card Banner Preview */}
              <div
                className={`p-4 bg-gradient-to-r ${
                  offer.bannerGradient || 'from-emerald-700 via-emerald-600 to-green-700'
                } text-white relative`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-yellow text-brand-dark shadow-xs">
                    {offer.badgeText}
                  </span>

                  {/* Status Indicator */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40'
                        : isScheduled
                        ? 'bg-blue-400/20 text-blue-200 border border-blue-400/40'
                        : 'bg-gray-400/20 text-gray-300'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm">
                  {offer.title}
                </h3>
                <p className="text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
                  {offer.subtitle}
                </p>

                {/* Offer Metric Tag */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="px-2.5 py-1 bg-white/15 backdrop-blur-xs rounded-lg text-xs font-black flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>
                      {offer.offerType === 'percent'
                        ? `${offer.discountValue}% OFF`
                        : offer.offerType === 'flat'
                        ? `FLAT ₹${offer.discountValue} OFF`
                        : `${offer.discountValue}% SAVINGS`}
                    </span>
                  </div>
                  {offer.minOrderValue ? (
                    <span className="text-[10px] text-white/80">
                      On orders above ₹{offer.minOrderValue}
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/80">No minimum cart value</span>
                  )}
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-xs">
                  {/* Validity Date */}
                  <div className="flex items-center gap-1.5 text-brand-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Valid: {new Date(offer.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} –{' '}
                      {new Date(offer.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Target Categories */}
                  <div className="flex items-center gap-1.5 text-brand-dark font-medium">
                    <Tag className="w-3.5 h-3.5 text-brand-green" />
                    <span className="truncate">
                      Applies to:{' '}
                      <strong className="text-brand-green font-black">
                        {offer.applicableCategories?.includes('all' as any)
                          ? 'All Farm Categories'
                          : offer.applicableCategories?.join(', ')}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-2">
                  {/* Pause / Resume Button */}
                  <button
                    onClick={() =>
                      toggleOfferStatus(offer.id, isActive ? 'inactive' : 'active')
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Make Active</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(offer)}
                      title="Duplicate this offer"
                      className="p-1.5 text-brand-muted hover:text-brand-dark hover:bg-brand-bg rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(offer)}
                      title="Edit offer details"
                      className="px-2.5 py-1.5 bg-brand-bg hover:bg-gray-200 rounded-xl text-xs font-bold text-brand-dark flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete offer "${offer.title}"?`)) {
                          deleteOffer(offer.id);
                        }
                      }}
                      title="Delete offer"
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-bg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-green" />
                <h3 className="text-base font-black text-brand-dark">
                  {editingOffer ? 'Edit Bumper Offer' : 'Create New Bumper Offer'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-brand-muted hover:text-brand-dark rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Live Preview Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-brand-muted">
                  Live Customer Banner Preview:
                </label>
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${formData.bannerGradient} text-white shadow-md space-y-1.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-brand-yellow text-brand-dark shadow-xs">
                      {formData.badgeText || 'BUMPER OFFER'}
                    </span>
                    <span className="text-[10px] font-bold text-white/90">
                      {formData.offerType === 'percent'
                        ? `${formData.discountValue}% OFF`
                        : `₹${formData.discountValue} OFF`}
                    </span>
                  </div>
                  <h4 className="text-base font-black leading-tight drop-shadow-sm">
                    {formData.title || 'Enter Campaign Headline'}
                  </h4>
                  <p className="text-[11px] text-white/90 line-clamp-1">
                    {formData.subtitle || 'Sub-headline describing organic savings'}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-white/80">
                      {formData.minOrderValue
                        ? `Min cart ₹${formData.minOrderValue}`
                        : 'No minimum order required'}
                    </span>
                    <span className="px-3 py-1 bg-white text-brand-dark font-black text-[10px] rounded-lg shadow-xs flex items-center gap-1">
                      <span>{formData.ctaLabel || 'Shop Offer'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-brand-dark mb-1">Campaign Headline *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Organic Harvest Festival Bumper Sale"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="e.g. MEGA DEAL"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-brand-dark mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Flat 30% OFF on all cold-pressed oils & fresh stone flours"
                  className="w-full px-3 py-2 border border-brand-border rounded-xl outline-none focus:border-brand-green"
                />
              </div>

              {/* Offer Type, Discount & Min Cart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Offer Type</label>
                  <select
                    value={formData.offerType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offerType: e.target.value as BumperOffer['offerType'],
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-semibold outline-none focus:border-brand-green bg-white cursor-pointer"
                  >
                    <option value="percent">Percentage (% OFF)</option>
                    <option value="flat">Flat Rupee (₹ OFF)</option>
                    <option value="bogo">Buy 1 Get 1 (BOGO)</option>
                    <option value="bundle">Bundle Combo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">
                    {formData.offerType === 'percent' ? 'Discount %' : 'Discount ₹ Value'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={formData.offerType === 'percent' ? 90 : 5000}
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold text-brand-green outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Min Order ₹</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderValue || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrderValue: parseInt(e.target.value) || undefined })
                    }
                    placeholder="e.g. 599"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Dates & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl outline-none focus:border-brand-green bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl outline-none focus:border-brand-green bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as BumperOffer['status'] })
                    }
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green bg-white cursor-pointer"
                  >
                    <option value="active">Active (Live Now)</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="inactive">Inactive / Paused</option>
                  </select>
                </div>
              </div>

              {/* Category Checkboxes */}
              <div className="space-y-1.5 p-3 bg-brand-bg rounded-xl border border-brand-border">
                <label className="block font-bold text-brand-dark">
                  Target Product Categories
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <label className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-brand-border cursor-pointer text-[11px] font-bold">
                    <input
                      type="checkbox"
                      checked={formData.applicableCategories?.includes('all' as any)}
                      onChange={() => toggleCategorySelection('all')}
                      className="accent-brand-green"
                    />
                    <span>All Products</span>
                  </label>
                  {CATEGORIES.map((cat) => {
                    const isSelected =
                      !formData.applicableCategories?.includes('all' as any) &&
                      formData.applicableCategories?.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-brand-green text-brand-green'
                            : 'bg-white border-brand-border text-brand-dark'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategorySelection(cat.id)}
                          disabled={formData.applicableCategories?.includes('all' as any)}
                          className="accent-brand-green"
                        />
                        <span>{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Theme & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Color Theme</label>
                  <select
                    value={formData.bannerGradient}
                    onChange={(e) => setFormData({ ...formData, bannerGradient: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-semibold outline-none focus:border-brand-green bg-white cursor-pointer"
                  >
                    {THEME_GRADIENTS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaLabel}
                    onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                    placeholder="e.g. Shop Bumper Offer"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-xl font-bold text-brand-dark hover:bg-brand-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green hover:bg-brand-greenDark text-white font-black rounded-xl shadow-blinkit flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingOffer ? 'Save Changes' : 'Create Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
