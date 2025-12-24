
import React, { useState } from 'react';
import { StoreVisit, StoreBrand, STORES, VISITORS, DEPARTMENTS, PRODUCT_GROUPS, PRODUCT_BRANDS } from '../types';
import { Camera, ChevronRight, ChevronLeft, Save, Trash2, Check, User, MessageSquare, Info, TrendingUp, AlertCircle, Palette, Award, Tag, Maximize, PenTool, Store, Tag as TagIcon } from 'lucide-react';

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
    }, 100);
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
      id: Math.random().toString(36).substr(2, 9),
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
    <div id={id} className="space-y-2 scroll-mt-24">
      <label className="block text-sm font-semibold text-slate-700 leading-tight">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 px-3 rounded-xl border-2 font-medium text-xs transition-all ${value === opt ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-100 bg-white text-slate-400 hover:border-orange-100'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const RatingSelect = ({ id, label, value, onChange, subtitle }: { id: string, label: string, value: number | undefined, onChange: (val: number) => void, subtitle?: string }) => (
    <div id={id} className="space-y-3 scroll-mt-24">
      <div>
        <label className="block text-sm font-semibold text-slate-700 leading-tight">
          {label} <span className="text-rose-500">*</span>
        </label>
        {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-9 rounded-xl flex items-center justify-center font-bold border-2 transition-all ${value === v ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-orange-200 text-xs'}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
        <Icon size={16} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-24 text-slate-800">
      <div className="flex justify-between mb-8 px-4">
        {[1, 2].map(s => (
          <div key={s} className={`h-1.5 flex-1 mx-1 rounded-full ${s <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-8">
        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <SectionHeader icon={Info} title="FLOGO FEEDBACK" />
              <div className="space-y-4">
                <div id="q-brand" className="scroll-mt-24">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">KANAL SEÇİNİZ <span className="text-rose-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[StoreBrand.FLO, StoreBrand.IN_STREET, StoreBrand.REEBOK, StoreBrand.LUMBERJACK].map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, brand });
                          scrollToNext('q-productBrand');
                        }}
                        className={`py-2 px-4 rounded-xl border-2 transition-all font-semibold text-sm ${formData.brand === brand ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div id="q-productBrand" className="scroll-mt-24">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">MARKA SEÇİNİZ <span className="text-rose-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {PRODUCT_BRANDS.map(brand => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, productBrand: brand });
                          if (brand !== 'DİĞER') {
                            scrollToNext('q-store');
                          }
                        }}
                        className={`py-2 px-4 rounded-xl border-2 transition-all font-semibold text-sm ${formData.productBrand === brand ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>

                  {formData.productBrand === 'DİĞER' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <div className="relative">
                        <TagIcon size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Marka Adını Yazınız *"
                          className={`w-full p-3 pl-10 rounded-xl bg-white border-2 focus:border-orange-500 outline-none text-sm shadow-sm transition-all ${!otherProductBrand.trim() ? 'border-orange-200' : 'border-slate-100'}`}
                          value={otherProductBrand}
                          onChange={e => setOtherProductBrand(e.target.value)}
                        />
                        {!otherProductBrand.trim() && <p className="text-[10px] text-orange-600 font-bold italic mt-1">* Bu alan zorunludur.</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div id="q-store" className="scroll-mt-24">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">MAĞAZA SEÇİNİZ <span className="text-rose-500">*</span></label>
                  <select
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none mb-3"
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

                  {storeSelect === 'DİĞER' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <div className="relative">
                        <Store size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Mağaza Adını Yazınız *"
                          className={`w-full p-3 pl-10 rounded-xl bg-white border-2 focus:border-orange-500 outline-none text-sm shadow-sm transition-all ${!otherStore.trim() ? 'border-orange-200' : 'border-slate-100'}`}
                          value={otherStore}
                          onChange={e => setOtherStore(e.target.value)}
                        />
                        {!otherStore.trim() && <p className="text-[10px] text-orange-600 font-bold italic mt-1">* Bu alan zorunludur.</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div id="q-visitor-info" className="grid grid-cols-2 gap-3 scroll-mt-24">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ziyaretçi <span className="text-rose-500">*</span></label>
                    <select
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                      value={formData.visitorName || ''}
                      onChange={e => setFormData({ ...formData, visitorName: e.target.value })}
                    >
                      <option value="">Seçiniz...</option>
                      {VISITORS.map(visitor => (
                        <option key={visitor} value={visitor}>{visitor}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Departman <span className="text-rose-500">*</span></label>
                    <select
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
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

            <div className="space-y-5 pt-6 border-t">
              <SectionHeader icon={Camera} title="Görsel Denetim" />
              <RatingSelect 
                id="q-visualScore"
                label="Mağazanın genel görsel düzenlemesini puanlayınız?"
                value={formData.generalVisualScore}
                onChange={(v) => {
                  setFormData({ ...formData, generalVisualScore: v });
                  scrollToNext('q-visualComments');
                }}
              />
              <div id="q-visualComments" className="space-y-3 scroll-mt-24">
                <label className="block text-sm font-semibold text-slate-700 leading-tight">Görsel düzenleme ile ilgili yorumlarınızı yazınız? <span className="text-rose-500">*</span></label>
                <textarea
                  className={`w-full p-3 rounded-xl bg-slate-50 border min-h-[100px] focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all ${!formData.generalVisualComments?.trim() ? 'border-orange-200 shadow-sm shadow-orange-50' : 'border-slate-200'}`}
                  placeholder="Detaylı yorumlarınızı buraya yazınız..."
                  value={formData.generalVisualComments || ''}
                  onChange={e => setFormData({ ...formData, generalVisualComments: e.target.value })}
                />
                {!formData.generalVisualComments?.trim() && <p className="text-[10px] text-orange-600 font-bold italic">* Bu alan zorunludur.</p>}
              </div>
              <RadioGroup 
                id="q-lineTheme"
                label="Ürünler line/tema bütünlüğüne uygun sergileniyor mu?"
                value={formData.lineThemeAlignment || ''}
                options={['Evet', 'Kısmen', 'Hayır']}
                onChange={(val) => {
                  setFormData({ ...formData, lineThemeAlignment: val });
                  scrollToNext('q-seasonal');
                }}
              />
              <RadioGroup 
                id="q-seasonal"
                label="Yeni sezon / kampanya görselleri kullanılmış mı?"
                value={formData.seasonalVisualsUsed || ''}
                options={['Evet', 'Kısmen', 'Hayır']}
                onChange={(val) => {
                  setFormData({ ...formData, seasonalVisualsUsed: val });
                  scrollToNext('q-heroPromo');
                }}
              />
              <RadioGroup 
                id="q-heroPromo"
                label="Vurgulanması gereken hero-promo ve özellikli ürünler ön planda mıydı?"
                value={formData.heroPromoVisibility || ''}
                options={['Evet', 'Hayır']}
                onChange={(val) => {
                  setFormData({ ...formData, heroPromoVisibility: val });
                  scrollToNext('q-apparelStock');
                }}
              />
              <RadioGroup 
                id="q-apparelStock"
                label="Giyim ürünlerinde mağaza doluluğu yeterli düzeyde mi?"
                value={formData.apparelStockLevel || ''}
                options={['Evet', 'Hayır']}
                onChange={(val) => {
                  setFormData({ ...formData, apparelStockLevel: val });
                  scrollToNext('q-warehouse');
                }}
              />
              <RadioGroup 
                id="q-warehouse"
                label="Depoda olup reyona çıkmayan ürün var mı?"
                value={formData.productsInWarehouseNotOnShelf || ''}
                options={['Evet', 'Hayır']}
                onChange={(val) => {
                  setFormData({ ...formData, productsInWarehouseNotOnShelf: val });
                  scrollToNext('q-stockSlider');
                }}
              />
              
              <div id="q-stockSlider" className="pt-2 pb-2 scroll-mt-24">
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase">Mağazada hissettiğiniz doluluk oranı? <span className="text-rose-500">*</span></label>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                    value={formData.stockLevel || 0} 
                    onChange={e => setFormData({ ...formData, stockLevel: parseInt(e.target.value) })} 
                  />
                  <div className="text-center mt-3"><span className="text-2xl font-black text-orange-600 tracking-tight">%{formData.stockLevel}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t">
              <SectionHeader icon={TrendingUp} title="Performans & Ürün Grupları" />
              <RatingSelect 
                id="q-classBalance"
                label="Mağazadaki klasman (alt/üst/dış giyim) dengesini puanlayınız?"
                value={formData.classificationBalanceScore}
                onChange={(v) => {
                  setFormData({ ...formData, classificationBalanceScore: v });
                  scrollToNext('q-collPerf');
                }}
              />
              <RatingSelect 
                id="q-collPerf"
                label="Mağazadaki ürünlerin müşteri ihtiyaçlarını karşılama performansını puanlayınız?"
                value={formData.collectionPerformanceScore}
                onChange={(v) => {
                  setFormData({ ...formData, collectionPerformanceScore: v });
                  scrollToNext('q-missed');
                }}
              />

              <div id="q-missed" className="space-y-3 scroll-mt-24">
                <label className="block text-sm font-semibold text-slate-700">Karşılayamadığımız ürün grupları? <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_GROUPS.map(group => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => toggleMissedGroup(group)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left text-[11px] font-medium transition-all ${formData.missedProductGroups?.includes(group) ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-orange-100'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${formData.missedProductGroups?.includes(group) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'}`}>
                        {formData.missedProductGroups?.includes(group) && <Check size={10} strokeWidth={4} />}
                      </div>
                      {group}
                    </button>
                  ))}
                </div>
                {(formData.missedProductGroups || []).length === 0 && <p className="text-[10px] text-orange-600 font-bold italic">* En az bir grup seçmelisiniz.</p>}
              </div>

              <div id="q-topSelling" className="space-y-3 scroll-mt-24">
                <label className="block text-sm font-semibold text-slate-700">En çok satın alınan ürün grupları? <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_GROUPS.filter(g => g !== "Diğer").map(group => (
                    <button
                      key={`top-${group}`}
                      type="button"
                      onClick={() => toggleTopSellingGroup(group)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left text-[11px] font-medium transition-all ${formData.topSellingProductGroups?.includes(group) ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-green-100'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${formData.topSellingProductGroups?.includes(group) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 bg-white'}`}>
                        {formData.topSellingProductGroups?.includes(group) && <Check size={10} strokeWidth={4} />}
                      </div>
                      {group}
                    </button>
                  ))}
                </div>
                {(formData.topSellingProductGroups || []).length === 0 && <p className="text-[10px] text-orange-600 font-bold italic">* En az bir grup seçmelisiniz.</p>}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t">
              <SectionHeader icon={Palette} title="Müşteri Algı Analizi" />
              <div className="space-y-4">
                <RatingSelect 
                  id="q-design"
                  label="Müşterilerimizin ürünleri tasarım bakımından beğenisini puanlayınız?" 
                  value={formData.designScore} 
                  onChange={(v) => {
                    setFormData({ ...formData, designScore: v });
                    scrollToNext('q-quality');
                  }} 
                />
                <RatingSelect 
                  id="q-quality"
                  label="Müşterilerimizin ürünleri kalite bakımından beğenisini puanlayınız?" 
                  value={formData.qualityScore} 
                  onChange={(v) => {
                    setFormData({ ...formData, qualityScore: v });
                    scrollToNext('q-price');
                  }} 
                />
                <RatingSelect 
                  id="q-price"
                  label="Müşterilerimizin ürünlerin fiyat uygunluğu bakımından değerlendirmesini puanlayınız?" 
                  subtitle="(10: Çok Uygun - 1: Çok Pahalı)" 
                  value={formData.priceScore} 
                  onChange={(v) => {
                    setFormData({ ...formData, priceScore: v });
                    scrollToNext('q-fit');
                  }} 
                />
                <RatingSelect 
                  id="q-fit"
                  label="Müşterilerimizin ürünleri kalıp/fit bakımından beğenisini puanlayınız?" 
                  value={formData.fitScore} 
                  onChange={(v) => {
                    setFormData({ ...formData, fitScore: v });
                    scrollToNext('q-graphics');
                  }} 
                />
                <RatingSelect 
                  id="q-graphics"
                  label="Müşterilerimizin ürünleri grafik/baskı/nakış bakımından beğenisini puanlayınız?" 
                  value={formData.graphicsScore} 
                  onChange={(v) => {
                    setFormData({ ...formData, graphicsScore: v });
                    scrollToNext('q-hasProblems');
                  }} 
                />
              </div>

              <div className="pt-4 space-y-4">
                <RadioGroup 
                  id="q-hasProblems"
                  label="Tasarım-Kalite-Fiyat-Kalıp-Grafik bakımından sorun yaşadığınız ürünler var mı?"
                  value={formData.hasProductProblems || ''}
                  options={['Evet', 'Hayır']}
                  onChange={(val) => {
                    setFormData({ ...formData, hasProductProblems: val });
                    if (val === 'Hayır') {
                      scrollToNext('q-staffFeedback-section');
                    }
                  }}
                />
                
                {formData.hasProductProblems === 'Evet' && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                    <textarea
                      className={`w-full p-3 rounded-xl bg-white border-2 focus:border-orange-500 outline-none text-sm min-h-[100px] shadow-sm ${!formData.productProblemDetails?.trim() ? 'border-orange-200' : 'border-slate-100'}`}
                      placeholder="Sorunlu model detaylarını yazınız... *"
                      value={formData.productProblemDetails || ''}
                      onChange={e => setFormData({ ...formData, productProblemDetails: e.target.value })}
                    />
                    {!formData.productProblemDetails?.trim() && <p className="text-[10px] text-orange-600 font-bold italic mt-1">* Sorun varsa detay belirtilmelidir.</p>}
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">Sorunlu ürün fotoğrafını ekleyiniz</label>
                      <div className="grid grid-cols-2 gap-3">
                        {formData.problemPhotos?.map((p, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-100">
                            <img src={p} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData({...formData, problemPhotos: formData.problemPhotos?.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm"><Trash2 size={12} className="text-rose-600" /></button>
                          </div>
                        ))}
                        <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-all hover:border-orange-200 group">
                          <Camera size={24} className="group-hover:text-orange-500" />
                          <span className="text-[10px] font-bold mt-1 uppercase">Foto Ekle</span>
                          <input type="file" multiple accept="image/*" onChange={handleProblemPhotoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div id="q-staffFeedback-section" className="space-y-5 pt-6 border-t scroll-mt-24">
              <SectionHeader icon={MessageSquare} title="Saha Geri Bildirimi" />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Genel yorumlar ve alınan geri bildirimler? <span className="text-rose-500">*</span></label>
                <textarea
                  className={`w-full p-3 rounded-xl bg-slate-50 border min-h-[100px] focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all ${!formData.storeGeneralFeedback?.trim() ? 'border-orange-200 shadow-sm' : 'border-slate-200'}`}
                  placeholder="Mağaza ekibinin ilettiği görüşler..."
                  value={formData.storeGeneralFeedback || ''}
                  onChange={e => setFormData({ ...formData, storeGeneralFeedback: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Geri bildirim veren mağaza çalışanı? <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    className={`w-full p-3 pl-10 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all ${!formData.feedbackStaffName?.trim() ? 'border-orange-200' : 'border-slate-200'}`}
                    value={formData.feedbackStaffName || ''}
                    onChange={e => setFormData({ ...formData, feedbackStaffName: e.target.value })}
                  />
                </div>
              </div>
              <RatingSelect 
                id="q-totalScore"
                label="Mağazayı doluluk, görsel düzenleme, ideal sergileme gibi temel faktörleri göz önünde bulundurarak puanlayınız?"
                value={formData.totalStoreScore}
                onChange={(v) => {
                  setFormData({ ...formData, totalStoreScore: v });
                }}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-slate-800 rounded-full" /> 
              Görsel Kanıtlar <span className="text-rose-500">*</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">En az 1 adet fotoğraf yüklenmesi zorunludur.</p>
            <div className="grid grid-cols-2 gap-3">
              {formData.photos?.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100">
                  <img src={p} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData({...formData, photos: formData.photos?.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md backdrop-blur-sm"><Trash2 size={14} className="text-rose-600" /></button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-all hover:border-orange-200 group">
                <div className="p-3 bg-slate-50 rounded-full group-hover:bg-orange-50 transition-colors">
                  <Camera size={28} className="group-hover:text-orange-500" />
                </div>
                <span className="text-[10px] font-bold mt-2 uppercase">Fotoğraf Ekle</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
            {formData.photos && formData.photos.length === 0 && (
              <p className="text-[10px] text-rose-500 font-black italic mt-4 text-center">
                * Raporu bitirmek için lütfen en az bir fotoğraf yükleyiniz.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-6">
          {step === 1 && !isStep1Valid && (
            <p className="text-[10px] text-rose-500 font-bold text-center italic">
              * Lütfen tüm soruları ve puanlamaları eksiksiz tamamlayınız.
            </p>
          )}
          <div className="flex gap-3">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="flex-1 py-3.5 px-6 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                <ChevronLeft size={18} /> Geri
              </button>
            )}
            {step < 2 ? (
              <button 
                type="button"
                onClick={nextStep} 
                disabled={!isStep1Valid} 
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-md transition-all active:scale-95 ${!isStep1Valid ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-50' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-100'}`}
              >
                İleri <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={!isStep2Valid}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all active:scale-95 ${!isStep2Valid ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-50' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}
              >
                <Save size={18} /> Raporu Bitir
              </button>
            )}
          </div>
        </div>
      </div>
      <button type="button" onClick={onCancel} className="w-full mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest py-2">İşlemi İptal Et</button>
    </div>
  );
};
