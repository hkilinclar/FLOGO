import React, { useState, useEffect } from 'react';
import { AppView, StoreVisit, StoreBrand } from './types';
import { VisitForm } from './components/VisitForm';
import { generateVisitSummary } from './services/geminiService';
import { 
  Plus, 
  History, 
  BarChart3, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
  Star,
  MessageSquare,
  AlertCircle,
  XCircle,
  TrendingUp,
  Tag,
  Palette,
  Award,
  Maximize,
  PenTool,
  UserCheck,
  Zap,
  Package,
  ArrowUpRight,
  Clock
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [visits, setVisits] = useState<StoreVisit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<StoreVisit | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('flo_visits');
    if (saved) setVisits(JSON.parse(saved));
  }, []);

  const saveVisit = async (visit: StoreVisit) => {
    setIsSummarizing(true);
    setView('DASHBOARD');

    const summary = await generateVisitSummary(visit);
    const finalVisit = { ...visit, aiSummary: summary };
    
    const updated = [finalVisit, ...visits];
    setVisits(updated);
    localStorage.setItem('flo_visits', JSON.stringify(updated));
    setIsSummarizing(false);
  };

  const getBrandStyle = (brand: StoreBrand) => {
    switch (brand) {
      case StoreBrand.FLO:
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case StoreBrand.IN_STREET:
        return 'bg-slate-900 text-yellow-400 border-slate-800';
      case StoreBrand.REEBOK:
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case StoreBrand.LUMBERJACK:
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center py-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            FLOGO <span className="text-orange-500 text-xs font-black px-2 py-0.5 bg-orange-50 rounded-full">PRO</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Store Intelligence Hub</p>
        </div>
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
            <User size={24} className="text-slate-300" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-orange-200 transition-all">
          <div className="p-2.5 bg-orange-50 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 size={22} className="text-orange-600" />
          </div>
          <p className="text-4xl font-black text-slate-900 leading-none">{visits.length}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ziyaretler</span>
            <ArrowUpRight size={10} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-200 transition-all">
          <div className="p-2.5 bg-blue-50 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
            <Award size={22} className="text-blue-600" />
          </div>
          <p className="text-4xl font-black text-slate-900 leading-none">
            {visits.filter(v => (v.totalStoreScore || 0) >= 8).length}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mükemmel Skor</span>
          </div>
        </div>
      </section>

      {/* Main Action */}
      <section 
        onClick={() => setView('NEW_VISIT')}
        className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200 flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all overflow-hidden relative"
      >
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-1">Yeni Mağaza Ziyareti</h3>
          <p className="text-slate-400 text-xs font-medium">Mağazanı seç ve raporunu saniyeler içinde tamamla.</p>
        </div>
        <div className="relative z-10 w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-all">
          <Plus size={28} strokeWidth={3} />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
      </section>

      {/* History Feed */}
      <section className="space-y-5">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Son Raporlar</h2>
          </div>
          <button onClick={() => setView('HISTORY')} className="text-slate-900 text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">Tümünü Gör</button>
        </div>
        <div className="space-y-4">
          {visits.slice(0, 3).map((v) => (
            <div 
              key={v.id} 
              onClick={() => { setSelectedVisit(v); setView('DETAILS'); }}
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer active:scale-95 hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border ${getBrandStyle(v.brand)}`}>
                {v.brand[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{v.storeName}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
                    <Clock size={10} />
                    {new Date(v.date).toLocaleDateString('tr-TR')}
                  </div>
                  <span className="text-[9px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold uppercase tracking-wider">{v.productBrand}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-600 font-black text-sm px-2 py-1">
                       {v.totalStoreScore}
                    </div>
                    <div className="text-[8px] font-bold text-slate-300 uppercase leading-none">Puan</div>
                 </div>
                 <ChevronRight className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </div>
          ))}
          {visits.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
              <Package size={32} className="mx-auto mb-3 opacity-20" />
              Henüz bir ziyaret kaydı oluşturulmadı.
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderDetails = (visit: StoreVisit) => {
    const getIcon = (val: string) => {
      if (val === 'Evet') return <CheckCircle2 size={16} className="text-emerald-500" />;
      if (val === 'Kısmen') return <AlertCircle size={16} className="text-amber-500" />;
      return <XCircle size={16} className="text-rose-500" />;
    };

    const ScoreTag = ({ icon: Icon, label, score, colorClass }: any) => (
      <div className={`p-4 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${colorClass}`}>
        <Icon size={18} className="opacity-80" />
        <span className="text-[9px] font-black uppercase text-center leading-tight tracking-widest">{label}</span>
        <span className="text-lg font-black">{score}<span className="text-[10px] opacity-40">/10</span></span>
      </div>
    );

    return (
      <div className="space-y-6 pb-32 animate-fade-in">
        <header className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setView('DASHBOARD')} 
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all"
          >
            <ArrowLeft size={20} className="text-slate-600"/>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Rapor Detayı</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{visit.id}</p>
          </div>
        </header>

        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 space-y-8 text-slate-800 relative overflow-hidden">
          {/* Brand & Store Header */}
          <section className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black border-2 shadow-sm ${getBrandStyle(visit.brand)}`}>
                {visit.brand[0]}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{visit.storeName}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full"><Calendar size={12}/> {new Date(visit.date).toLocaleDateString('tr-TR')}</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full"><User size={12}/> {visit.visitorName}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-3xl text-center shadow-lg shadow-orange-200">
               <div className="text-[10px] font-black uppercase tracking-tighter opacity-70 mb-0.5">Skor</div>
               <div className="text-2xl font-black">{visit.totalStoreScore}</div>
            </div>
          </section>

          {/* AI Insights Card */}
          {visit.aiSummary && (
            <section className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 shadow-xl relative group">
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <div className="p-2 bg-orange-400/10 rounded-xl">
                    <Sparkles size={18} fill="currentColor" />
                </div>
                <span className="font-black text-xs uppercase tracking-[0.2em]">Yapay Zeka Analizi</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                {visit.aiSummary}
              </p>
              <div className="absolute top-4 right-4 animate-pulse opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"></div>
              </div>
            </section>
          )}

          {/* Core Metrics Grid */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Görsel Düzen</p>
              <p className="text-3xl font-black text-slate-800">{visit.generalVisualScore}<span className="text-xs text-slate-300">/10</span></p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Doluluk</p>
              <p className="text-3xl font-black text-slate-800">%{visit.stockLevel}</p>
            </div>
          </section>

          {/* Staff Feedback Card */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <MessageSquare size={14} className="text-orange-500" /> Saha Sesi
            </h3>
            <div className="bg-orange-50/50 p-6 rounded-[2.5rem] border border-orange-100/50">
              <p className="text-sm text-slate-700 leading-relaxed font-bold italic text-center">
                "{visit.storeGeneralFeedback}"
              </p>
              <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-orange-100">
                <UserCheck size={14} className="text-orange-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{visit.feedbackStaffName}</span>
              </div>
            </div>
          </section>

          {/* Customer Perception Grid */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-500" /> Müşteri Algısı
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <ScoreTag icon={Palette} label="Tasarım" score={visit.designScore} colorClass="bg-purple-50 text-purple-700 border-purple-100" />
              <ScoreTag icon={Award} label="Kalite" score={visit.qualityScore} colorClass="bg-blue-50 text-blue-700 border-blue-100" />
              <ScoreTag icon={Tag} label="Fiyat" score={visit.priceScore} colorClass="bg-emerald-50 text-emerald-700 border-emerald-100" />
              <ScoreTag icon={Maximize} label="Fit" score={visit.fitScore} colorClass="bg-orange-50 text-orange-700 border-orange-100" />
              <ScoreTag icon={PenTool} label="Grafik" score={visit.graphicsScore} colorClass="bg-pink-50 text-pink-700 border-pink-100" />
              <ScoreTag icon={Zap} label="Odak" score={visit.collectionPerformanceScore} colorClass="bg-yellow-50 text-yellow-700 border-yellow-100" />
            </div>
          </section>

          {/* Critical Issues Section */}
          {visit.hasProductProblems === 'Evet' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                <h3 className="text-xs font-black text-rose-600 uppercase tracking-[0.2em]">Kritik Sorunlar</h3>
              </div>
              <div className="bg-rose-50 p-6 rounded-[2.5rem] border border-rose-100">
                <p className="text-sm text-rose-700 font-bold bg-white/60 p-5 rounded-3xl border border-rose-200 leading-relaxed mb-4">
                  {visit.productProblemDetails}
                </p>
                {visit.problemPhotos && visit.problemPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {visit.problemPhotos.map((p, i) => (
                      <div key={i} className="relative group overflow-hidden rounded-2xl shadow-sm">
                        <img src={p} className="aspect-square object-cover w-full group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Operational Checklist */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Operasyonel Kontrol</h3>
            <div className="space-y-2">
              {[
                { label: 'Line/Tema Bütünlüğü', val: visit.lineThemeAlignment },
                { label: 'Hero/Promo Vurgusu', val: visit.heroPromoVisibility },
                { label: 'Sezon Görselleri', val: visit.seasonalVisualsUsed }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase text-slate-900">{item.val}</span>
                    {getIcon(item.val)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photo Gallery */}
          {visit.photos.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Görsel Kanıtlar</h3>
              <div className="grid grid-cols-2 gap-4">
                {visit.photos.map((p, i) => (
                  <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                    <img src={p} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-32 px-5 pt-6 max-w-lg mx-auto bg-slate-50 selection:bg-orange-100 overflow-x-hidden">
      {isSummarizing && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl flex flex-col items-center justify-center z-[100] p-10">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] relative">
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-[2rem] animate-spin"></div>
            <Sparkles size={32} className="text-orange-500 animate-pulse" />
          </div>
          <p className="mt-8 font-black text-white text-sm uppercase tracking-[0.3em] text-center max-w-[200px] leading-relaxed">
            Yapay Zeka Saha Verilerini Analiz Ediyor...
          </p>
        </div>
      )}

      {view === 'DASHBOARD' && renderDashboard()}
      {view === 'NEW_VISIT' && <VisitForm onSave={saveVisit} onCancel={() => setView('DASHBOARD')} />}
      {view === 'HISTORY' && (
        <div className="space-y-6 animate-fade-in">
           <header className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('DASHBOARD')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all">
                <ArrowLeft size={20}/>
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Geçmiş Kayıtlar</h1>
          </header>
          <div className="space-y-4">
            {visits.map(v => (
              <div 
                key={v.id} 
                onClick={() => { setSelectedVisit(v); setView('DETAILS'); }}
                className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border ${getBrandStyle(v.brand)}`}>
                  {v.brand[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{v.storeName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(v.date).toLocaleDateString('tr-TR')}</p>
                    <span className="text-[9px] bg-slate-50 px-2 py-0.5 rounded-full text-slate-600 font-bold uppercase border border-slate-100">{v.productBrand}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 text-orange-600 font-black text-sm px-2 py-1 bg-orange-50 rounded-xl">
                      <Star size={12} fill="currentColor"/> {v.totalStoreScore}
                   </div>
                   <ChevronRight className="text-slate-200 group-hover:text-slate-400 transition-all" size={20} />
                </div>
              </div>
            ))}
            {visits.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400 text-sm font-medium">Henüz bir ziyaret kaydı bulunmuyor.</div>
            )}
          </div>
        </div>
      )}
      {view === 'DETAILS' && selectedVisit && renderDetails(selectedVisit)}

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-6 right-6 glass-panel rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-40 max-w-lg mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <button 
          onClick={() => setView('DASHBOARD')} 
          className={`flex flex-col items-center gap-1.5 transition-all group ${view === 'DASHBOARD' ? 'text-orange-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1 rounded-lg transition-colors ${view === 'DASHBOARD' ? 'bg-orange-50' : ''}`}>
            <LayoutDashboard size={22} strokeWidth={view === 'DASHBOARD' ? 3 : 2} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Panel</span>
        </button>
        <button 
          onClick={() => setView('HISTORY')} 
          className={`flex flex-col items-center gap-1.5 transition-all group ${view === 'HISTORY' ? 'text-orange-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1 rounded-lg transition-colors ${view === 'HISTORY' ? 'bg-orange-50' : ''}`}>
             <History size={22} strokeWidth={view === 'HISTORY' ? 3 : 2} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Geçmiş</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-all group">
          <div className="p-1 rounded-lg">
             <MapPin size={22} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Harita</span>
        </button>
      </nav>
    </div>
  );
};

export default App;