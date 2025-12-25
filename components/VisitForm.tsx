
import React, { useState } from 'react';
import { StoreVisit, StoreBrand, STORES, VISITORS, DEPARTMENTS, PRODUCT_GROUPS, PRODUCT_BRANDS } from '../types';
/* Added UserCheck and Plus imports to resolve errors on lines 565 and 611 */
import { Camera, ChevronRight, ChevronLeft, Save, Trash2, Check, User, MessageSquare, Info, TrendingUp, AlertCircle, Palette, Award, Tag, Maximize, PenTool, Store, Tag as TagIcon, LayoutGrid, UserCheck, Plus } from 'lucide-react';

interface VisitFormProps {
  onSave: (visit: StoreVisit) => void;
  onCancel: () => void;
}

export const VisitForm: React.FC<VisitFormProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [storeSelect, setStoreSelect] = useState('');
  const [otherStore, setOtherStore] = useState('');
  const [otherProductBrand, setOtherProductBrand] = useState('');
  
  const [formData, setFormData] = useState<Partial<StoreVisit>>({
    brand: StoreBrand.FLO,
    productBrand: '',
    generalVisualScore: undefined,
    generalVisualComments: '',
    lineThemeAlignment: '',
    heroPromoVisibility: '',
    apparelStockLevel: '',
    productsInWarehouseNotOnShelf: '',
    classificationBalanceScore: undefined,
    collectionPerformanceScore: undefined,
    designScore: undefined,
    qualityScore: undefined,
    priceScore: undefined,
    fitScore: undefined,
    graphicsScore: undefined,
    hasProductProblems: '',
    productProblemDetails: '',
    problemPhotos: [],
    seasonalVisualsUsed: '',
    storeGeneralFeedback: '',
    feedbackStaffName: '',
    totalStoreScore: undefined,
    missedProductGroups: [],
    missedProductGroupsOther: '',
    topSellingProductGroups: [],
    stockLevel: 80,
    photos: [],
    date: new Date().toISOString(),
    storeName: '',
    visitorName: '',
    visitorDepartment: ''
  });

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToNext = (nextId: string) => {
    setTimeout(() => {
      const element = document.getElementById(nextId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            photos: [...(prev.photos || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleProblemPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            problemPhotos: [...(prev.problemPhotos || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const toggleMissedGroup = (group: string) => {
    const current = formData.missedProductGroups || [];
    if (current.includes(group)) {
      setFormData({ ...formData, missedProductGroups: current.filter(g => g !== group) });
    } else {
      setFormData({ ...formData, missedProductGroups: [...current, group] });
    }
  };

  const toggleTopSellingGroup = (group: string) => {
    const current = formData.topSellingProductGroups || [];
    if (current.includes(group)) {
      setFormData({ ...formData, topSellingProductGroups: current.filter(g => g !== group) });
    } else {
      setFormData({ ...formData, topSellingProductGroups: [...current, group] });
    }
  };

  const handleSubmit = () => {
    const finalStoreName = storeSelect === 'DİĞER' ? otherStore : storeSelect;
    const finalProductBrand = formData.productBrand === 'DİĞER' ? otherProductBrand : (formData.productBrand || '');
    
    const finalVisit: StoreVisit = {
      id: `V-${Date.now().toString(36).toUpperCase()}`,
      visitorName: formData.visitorName || '',
      visitorDepartment: formData.visitorDepartment || '',
      brand: formData.brand as StoreBrand,
      productBrand: finalProductBrand,
      storeName: finalStoreName,
      generalVisualScore: formData.generalVisualScore || 0,
      generalVisualComments: formData.generalVisualComments || '',
      lineThemeAlignment: formData.lineThemeAlignment || '',
      heroPromoVisibility: formData.heroPromoVisibility || '',
      apparelStockLevel: formData.apparelStockLevel || '',
      productsInWarehouseNotOnShelf: formData.productsInWarehouseNotOnShelf || '',
      classificationBalanceScore: formData.classificationBalanceScore || 0,
      collectionPerformanceScore: formData.collectionPerformanceScore || 0,
      designScore: formData.designScore || 0,
      qualityScore: formData.qualityScore || 0,
      priceScore: formData.priceScore || 0,
      fitScore: formData.fitScore || 0,
      graphicsScore: formData.graphicsScore || 0,
      hasProductProblems: formData.hasProductProblems || '',
      productProblemDetails: formData.productProblemDetails || '',
      problemPhotos: formData.problemPhotos || [],
      seasonalVisualsUsed: formData.seasonalVisualsUsed || '',
      storeGeneralFeedback: formData.storeGeneralFeedback || '',
      feedbackStaffName: formData.feedbackStaffName || '',
      totalStoreScore: formData.totalStoreScore || 0,
      missedProductGroups: formData.missedProductGroups || [],
      missedProductGroupsOther: formData.missedProductGroupsOther || '',
      topSellingProductGroups: formData.topSellingProductGroups || [],
      stockLevel: formData.stockLevel || 0,
      photos: formData.photos || [],
      date: formData.date || new Date().toISOString(),
    };
    onSave(finalVisit);
  };

  const isStoreValid = storeSelect === 'DİĞER' ? otherStore.trim() !== '' : storeSelect !== '';
  const isProductBrandValid = formData.productBrand === 'DİĞER' ? otherProductBrand.trim() !== '' : !!formData.productBrand;

  const isStep1Valid = 
    isStoreValid && 
    !!formData.visitorName && 
    !!formData.visitorDepartment && 
    isProductBrandValid &&
    formData.generalVisualScore !== undefined &&
    !!formData.generalVisualComments?.trim() &&
    !!formData.lineThemeAlignment &&
    !!formData.heroPromoVisibility &&
    !!formData.apparelStockLevel &&
    !!formData.productsInWarehouseNotOnShelf &&
    formData.classificationBalanceScore !== undefined &&
    formData.collectionPerformanceScore !== undefined &&
    (formData.missedProductGroups || []).length > 0 &&
    (formData.topSellingProductGroups || []).length > 0 &&
    formData.designScore !== undefined &&
    formData.qualityScore !== undefined &&
    formData.priceScore !== undefined &&
    formData.fitScore !== undefined &&
    formData.graphicsScore !== undefined &&
    !!formData.hasProductProblems &&
    (formData.hasProductProblems !== 'Evet' || !!formData.productProblemDetails?.trim()) &&
    !!formData.seasonalVisualsUsed &&
    !!formData.storeGeneralFeedback?.trim() &&
    !!formData.feedbackStaffName?.trim() &&
    formData.totalStoreScore !== undefined;

  const isStep2Valid = (formData.photos || []).length > 0;

  const RadioGroup = ({ id, label, value, options, onChange }: { id: string, label: string, value: string, options: string[], onChange: (val: string) => void }) => (
    <div id={id} className="space-y-3 scroll-mt-24 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-3 px-3 rounded-2xl border-2 font-bold text-xs transition-all active:scale-95 ${value === opt ? 'border-orange-500 bg-white text-orange-700 shadow-sm' : 'border-transparent bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const RatingSelect = ({ id, label, value, onChange, subtitle }: { id: string, label: string, value: number | undefined, onChange: (val: number) => void, subtitle?: string }) => (
    <div id={id} className="space-y-4 scroll-mt-24 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
      <div>
        <label className="block text-sm font-bold text-slate-800 leading-tight">
          {label} <span className="text-rose-500">*</span>
        </label>
        {subtitle && <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wider">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-11 rounded-xl flex items-center justify-center font-black border-2 transition-all active:scale-90 ${value === v ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 text-xs'}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, desc }: { icon: any, title: string, desc?: string }) => (
    <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-2xl text-white shadow-lg">
                <Icon size={18} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
        </div>
        {desc && <p className="text-[10px] text-slate-400 font-medium ml-12 uppercase tracking-widest">{desc}</p>}
    </div>
  );

  return (
    <div className="pb-32 animate-fade-in">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-10 px-4">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full font-black text-sm transition-all duration-500 ${step >= s ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-200 text-slate-400'}`}>
                {s}
                {step > s && <Check size={16} strokeWidth={4} className="absolute inset-0 m-auto" />}
            </div>
            {s === 1 && <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-700 ${step > s ? 'bg-orange-500' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] p-6 shadow-sm border border-slate-100 space-y-12">
        {step === 1 && (
          <div className="space-y-12">
            {/* Store Identification */}
            <div className="space-y-6">
              <SectionHeader icon={Info} title="TEMEL BİLGİLER" desc="Ziyaret kapsamını belirleyiniz" />
              <div className="space-y-6">
                <div id="q-brand" className="scroll-mt-24">
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">ZİYARET EDİLEN KANAL <span className="text-rose-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[StoreBrand.FLO, StoreBrand.IN_STREET, StoreBrand.REEBOK, StoreBrand.LUMBERJACK].map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, brand });
                          scrollToNext('q-productBrand');
                        }}
                        className={`py-4 px-4 rounded-2xl border-2 transition-all font-black text-xs active:scale-95 ${formData.brand === brand ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div id="q-productBrand" className="scroll-mt-24 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">ZİYARET EDİLEN MARKA <span className="text-rose-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {PRODUCT_BRANDS.map(brand => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, productBrand: brand });
                          if (brand !== 'DİĞER') scrollToNext('q-store');
                        }}
                        className={`py-3 px-3 rounded-xl border-2 transition-all font-bold text-[11px] active:scale-95 ${formData.productBrand === brand ? 'border-slate-900 bg-slate-900 text-white' : 'border-transparent bg-white text-slate-500'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>

                  {formData.productBrand === 'DİĞER' && (
                    <div className="animate-in fade-in slide-in-from-top-2 relative">
                      <TagIcon size={16} className="absolute left-4 top-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Marka Adını Yazınız..."
                        className="w-full p-4 pl-12 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                        value={otherProductBrand}
                        onChange={e => setOtherProductBrand(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div id="q-store" className="scroll-mt-24">
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">MAĞAZA SEÇİMİ <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Store size={18} className="absolute left-4 top-4 text-slate-400 pointer-events-none" />
                    <select
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                        value={storeSelect}
                        onChange={e => {
                        setStoreSelect(e.target.value);
                        scrollToNext('q-visitor-info');
                        }}
                    >
                        <option value="">Mağaza Seçiniz...</option>
                        {STORES.map(store => (
                        <option key={store} value={store}>{store}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-slate-400"><ChevronRight size={18} className="rotate-90" /></div>
                  </div>

                  {storeSelect === 'DİĞER' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <input
                          type="text"
                          placeholder="Mağaza Adını Yazınız..."
                          className="w-full p-4 rounded-2xl bg-white border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                          value={otherStore}
                          onChange={e => setOtherStore(e.target.value)}
                        />
                    </div>
                  )}
                </div>

                <div id="q-visitor-info" className="grid grid-cols-2 gap-4 scroll-mt-24 p-5 bg-orange-50/50 rounded-[2rem] border border-orange-100">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-orange-900/40 uppercase tracking-widest">ZİYARETÇİ</label>
                    <select
                      className="w-full p-3 rounded-xl bg-white border border-orange-100 text-[11px] font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                      value={formData.visitorName || ''}
                      onChange={e => setFormData({ ...formData, visitorName: e.target.value })}
                    >
                      <option value="">Seçiniz...</option>
                      {VISITORS.map(visitor => (
                        <option key={visitor} value={visitor}>{visitor}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-orange-900/40 uppercase tracking-widest">DEPARTMAN</label>
                    <select
                      className="w-full p-3 rounded-xl bg-white border border-orange-100 text-[11px] font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                      value={formData.visitorDepartment || ''}
                      onChange={e => setFormData({ ...formData, visitorDepartment: e.target.value })}
                    >
                      <option value="">Seçiniz...</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Inspection Section */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <SectionHeader icon={Camera} title="GÖRSEL DENETİM" desc="Mağaza atmosferi ve standartlar" />
              <div className="space-y-6">
                  <RatingSelect 
                    id="q-visualScore"
                    label="Mağazanın genel görsel düzenlemesini nasıl buldunuz?"
                    value={formData.generalVisualScore}
                    onChange={(v) => {
                    setFormData({ ...formData, generalVisualScore: v });
                    scrollToNext('q-visualComments');
                    }}
                />
                
                <div id="q-visualComments" className="space-y-3 scroll-mt-24 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <label className="block text-sm font-bold text-slate-800">Görsel Düzenleme Yorumları <span className="text-rose-500">*</span></label>
                    <textarea
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 min-h-[120px] focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                    placeholder="Eksikler, başarılar veya spesifik notlar..."
                    value={formData.generalVisualComments || ''}
                    onChange={e => setFormData({ ...formData, generalVisualComments: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <RadioGroup id="q-lineTheme" label="Line/Tema Bütünlüğü Uygun mu?" value={formData.lineThemeAlignment || ''} options={['Evet', 'Kısmen', 'Hayır']} onChange={(val) => { setFormData({ ...formData, lineThemeAlignment: val }); scrollToNext('q-seasonal'); }} />
                    <RadioGroup id="q-seasonal" label="Yeni Sezon Görselleri Var mı?" value={formData.seasonalVisualsUsed || ''} options={['Evet', 'Kısmen', 'Hayır']} onChange={(val) => { setFormData({ ...formData, seasonalVisualsUsed: val }); scrollToNext('q-heroPromo'); }} />
                    <RadioGroup id="q-heroPromo" label="Hero/Promo Ürünler Ön Planda mı?" value={formData.heroPromoVisibility || ''} options={['Evet', 'Hayır']} onChange={(val) => { setFormData({ ...formData, heroPromoVisibility: val }); scrollToNext('q-apparelStock'); }} />
                    <RadioGroup id="q-apparelStock" label="Giyim Doluluğu Yeterli mi?" value={formData.apparelStockLevel || ''} options={['Evet', 'Hayır']} onChange={(val) => { setFormData({ ...formData, apparelStockLevel: val }); scrollToNext('q-warehouse'); }} />
                    <RadioGroup id="q-warehouse" label="Depoda Olup Reyonda Olmayan Ürün Var mı?" value={formData.productsInWarehouseNotOnShelf || ''} options={['Evet', 'Hayır']} onChange={(val) => { setFormData({ ...formData, productsInWarehouseNotOnShelf: val }); scrollToNext('q-stockSlider'); }} />
                </div>
                
                <div id="q-stockSlider" className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl scroll-mt-24">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] mb-6 text-orange-400">HİSSEDİLEN MAĞAZA DOLULUĞU <span className="text-rose-500">*</span></label>
                    <div className="px-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">
                            <span>Boş</span>
                            <span>Dengeli</span>
                            <span>Full</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5" 
                            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500" 
                            value={formData.stockLevel || 0} 
                            onChange={e => setFormData({ ...formData, stockLevel: parseInt(e.target.value) })} 
                        />
                        <div className="text-center mt-6">
                            <span className="text-5xl font-black text-white tracking-tighter">%{formData.stockLevel}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Product Performance Section */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <SectionHeader icon={TrendingUp} title="SATIŞ & PERFORMANS" desc="Satan ve satmayan ürün analizi" />
              <div className="space-y-6">
                <RatingSelect id="q-classBalance" label="Alt/Üst/Dış Giyim Klasman Dengesi?" value={formData.classificationBalanceScore} onChange={(v) => { setFormData({ ...formData, classificationBalanceScore: v }); scrollToNext('q-collPerf'); }} />
                <RatingSelect id="q-collPerf" label="İhtiyaç Karşılama Performansı?" value={formData.collectionPerformanceScore} onChange={(v) => { setFormData({ ...formData, collectionPerformanceScore: v }); scrollToNext('q-missed'); }} />

                <div id="q-missed" className="space-y-4 scroll-mt-24 p-6 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-rose-500" />
                        <label className="block text-sm font-black text-rose-900 uppercase tracking-tight">SATMAYAN / EKSİK GRUPLAR <span className="text-rose-500">*</span></label>
                    </div>
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">Müşterinin bulamadığı veya rağbet görmeyenler</p>
                    <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_GROUPS.map(group => (
                        <button
                        key={group}
                        type="button"
                        onClick={() => toggleMissedGroup(group)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left text-[11px] font-bold transition-all active:scale-95 ${formData.missedProductGroups?.includes(group) ? 'border-rose-500 bg-white text-rose-700 shadow-sm' : 'border-transparent bg-rose-100/50 text-rose-400'}`}
                        >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.missedProductGroups?.includes(group) ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-200 bg-white'}`}>
                            {formData.missedProductGroups?.includes(group) && <Check size={12} strokeWidth={4} />}
                        </div>
                        {group}
                        </button>
                    ))}
                    </div>
                </div>

                <div id="q-topSelling" className="space-y-4 scroll-mt-24 p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-emerald-500" />
                        <label className="block text-sm font-black text-emerald-900 uppercase tracking-tight">EN ÇOK SATAN GRUPLAR <span className="text-rose-500">*</span></label>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Mağazanın yıldız kategorileri</p>
                    <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_GROUPS.filter(g => g !== "Diğer").map(group => (
                        <button
                        key={`top-${group}`}
                        type="button"
                        onClick={() => toggleTopSellingGroup(group)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left text-[11px] font-bold transition-all active:scale-95 ${formData.topSellingProductGroups?.includes(group) ? 'border-emerald-500 bg-white text-emerald-700 shadow-sm' : 'border-transparent bg-emerald-100/50 text-emerald-400'}`}
                        >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.topSellingProductGroups?.includes(group) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-200 bg-white'}`}>
                            {formData.topSellingProductGroups?.includes(group) && <Check size={12} strokeWidth={4} />}
                        </div>
                        {group}
                        </button>
                    ))}
                    </div>
                </div>
              </div>
            </div>

            {/* Customer Perception Section */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <SectionHeader icon={Palette} title="MÜŞTERİ ALGISI" desc="Ürünlere yönelik geri bildirimler" />
              <div className="space-y-6">
                <RatingSelect id="q-design" label="Tasarım Beğenisi" value={formData.designScore} onChange={(v) => { setFormData({ ...formData, designScore: v }); scrollToNext('q-quality'); }} />
                <RatingSelect id="q-quality" label="Kalite Algısı" value={formData.qualityScore} onChange={(v) => { setFormData({ ...formData, qualityScore: v }); scrollToNext('q-price'); }} />
                <RatingSelect id="q-price" label="Fiyat Uygunluğu" subtitle="(10: Çok Uygun - 1: Pahalı)" value={formData.priceScore} onChange={(v) => { setFormData({ ...formData, priceScore: v }); scrollToNext('q-fit'); }} />
                <RatingSelect id="q-fit" label="Kalıp / Fit Memnuniyeti" value={formData.fitScore} onChange={(v) => { setFormData({ ...formData, fitScore: v }); scrollToNext('q-graphics'); }} />
                <RatingSelect id="q-graphics" label="Grafik / Baskı Beğenisi" value={formData.graphicsScore} onChange={(v) => { setFormData({ ...formData, graphicsScore: v }); scrollToNext('q-hasProblems'); }} />

                <div className="pt-4">
                  <RadioGroup 
                    id="q-hasProblems"
                    label="Sorun Yaşanan Spesifik Modeller Var mı?"
                    value={formData.hasProductProblems || ''}
                    options={['Evet', 'Hayır']}
                    onChange={(val) => {
                        setFormData({ ...formData, hasProductProblems: val });
                        if (val === 'Hayır') scrollToNext('q-staffFeedback-section');
                    }}
                  />
                  
                  {formData.hasProductProblems === 'Evet' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 space-y-5 p-5 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                        <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest">SORUNLU MODEL DETAYLARI <span className="text-rose-500">*</span></label>
                        <textarea
                            className="w-full p-4 rounded-2xl bg-white border border-rose-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm font-medium min-h-[100px]"
                            placeholder="Ürün kodu, renk veya detaylı sorun tanımı..."
                            value={formData.productProblemDetails || ''}
                            onChange={e => setFormData({ ...formData, productProblemDetails: e.target.value })}
                        />
                        
                        <div className="space-y-3">
                        <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest">SORUNLU ÜRÜN FOTOĞRAFI</label>
                        <div className="grid grid-cols-2 gap-3">
                            {formData.problemPhotos?.map((p, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-white">
                                <img src={p} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setFormData({...formData, problemPhotos: formData.problemPhotos?.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 p-2 bg-white/90 rounded-full shadow-lg"><Trash2 size={12} className="text-rose-600" /></button>
                            </div>
                            ))}
                            <label className="aspect-square border-2 border-dashed border-rose-200 rounded-2xl flex flex-col items-center justify-center text-rose-300 cursor-pointer hover:bg-white transition-all group">
                            <Camera size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">Ekle</span>
                            <input type="file" multiple accept="image/*" onChange={handleProblemPhotoUpload} className="hidden" />
                            </label>
                        </div>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Staff Feedback Section */}
            <div id="q-staffFeedback-section" className="space-y-8 pt-8 border-t border-slate-100 scroll-mt-24">
              <SectionHeader icon={MessageSquare} title="SAHA GERİ BİLDİRİMİ" desc="Personel ve genel görüşler" />
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-tight">Genel Saha Yorumları <span className="text-rose-500">*</span></label>
                    <textarea
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 min-h-[120px] focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                        placeholder="Personelin en çok ilettiği konular..."
                        value={formData.storeGeneralFeedback || ''}
                        onChange={e => setFormData({ ...formData, storeGeneralFeedback: e.target.value })}
                    />
                </div>
                
                <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-400">
                        {/* Fixed typo: UserCheck was used on line 565 but not available in some contexts, but it's imported now */}
                        <UserCheck size={20} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GERİ BİLDİRİM VEREN PERSONEL</label>
                        <input
                            type="text"
                            placeholder="Ad Soyad"
                            className="w-full bg-transparent outline-none font-bold text-slate-900 border-b border-slate-100 pb-1"
                            value={formData.feedbackStaffName || ''}
                            onChange={e => setFormData({ ...formData, feedbackStaffName: e.target.value })}
                        />
                    </div>
                </div>

                <RatingSelect 
                    id="q-totalScore"
                    label="Mağazanın bu haftaki genel performans skoru nedir?"
                    subtitle="Doluluk, görsel düzen ve müşteri algısı dahil"
                    value={formData.totalStoreScore}
                    onChange={(v) => {
                    setFormData({ ...formData, totalStoreScore: v });
                    }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 text-orange-500">
                    <Camera size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Görsel Kanıtlar</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">En az 1 adet fotoğraf zorunludur.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {formData.photos?.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                  <img src={p} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData({...formData, photos: formData.photos?.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-lg"><Trash2 size={14} className="text-rose-600" /></button>
                </div>
              ))}
              <label className="aspect-square border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 cursor-pointer hover:bg-slate-50 transition-all hover:border-orange-200 group">
                <Plus size={32} className="group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black mt-3 uppercase tracking-widest">Ekle</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-6">
          {step === 1 && !isStep1Valid && (
            <div className="flex items-center justify-center gap-2 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600">
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Eksik Alanlar Mevcut</span>
            </div>
          )}
          <div className="flex gap-4">
            {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="flex-1 py-5 px-6 rounded-[1.5rem] bg-slate-100 text-slate-600 font-black flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                <ChevronLeft size={18} /> Geri
              </button>
            )}
            {step < 2 ? (
              <button 
                type="button"
                onClick={nextStep} 
                disabled={!isStep1Valid} 
                className={`flex-1 py-5 px-6 rounded-[1.5rem] font-black flex items-center justify-center gap-2 text-white shadow-xl transition-all active:scale-95 text-xs uppercase tracking-widest ${!isStep1Valid ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}
              >
                İLERİ <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={!isStep2Valid}
                className={`flex-1 py-5 px-6 rounded-[1.5rem] font-black flex items-center justify-center gap-2 text-white shadow-2xl transition-all active:scale-95 text-xs uppercase tracking-widest ${!isStep2Valid ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}
              >
                <Save size={18} /> RAPORU TAMAMLA
              </button>
            )}
          </div>
          <button 
            type="button" 
            onClick={onCancel} 
            className="w-full py-4 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] hover:text-rose-500 transition-colors"
          >
            ZİYARETİ İPTAL ET
          </button>
        </div>
      </div>
    </div>
  );
};
