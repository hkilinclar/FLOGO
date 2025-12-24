
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
  Zap
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
        return 'bg-orange-50 text-orange-600';
      case StoreBrand.IN_STREET:
        return 'bg-slate-900 text-yellow-400';
      case StoreBrand.REEBOK:
        return 'bg-blue-50 text-blue-700';
      case StoreBrand.LUMBERJACK:
        return 'bg-emerald-50 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <header className="flex justify-between items-center px-2 pt-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Hoş Geldiniz,</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Bugün hangi mağazayı ziyaret ediyoruz?</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
          <User size={24} className="text-slate-400" />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="p-2 bg-orange-50 w-fit rounded-xl mb-3">
            <BarChart3 size={20} className="text-orange-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{visits.length}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Toplam Ziyaret</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="p-2 bg-blue-50 w-fit rounded-xl mb-3">
            <CheckCircle2 size={20} className="text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {visits.filter(v => (v.totalStoreScore || 0) >= 8).length}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Başarılı Saha</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Son Ziyaretler</h2>
          <button onClick={() => setView('HISTORY')} className="text-orange-600 text-[10px] font-black uppercase tracking-widest">Tüm Geçmiş</button>
        </div>
        <div className="space-y-3">
          {visits.slice(0, 3).map((v) => (
            <div 
              key={v.id} 
              onClick={() => { setSelectedVisit(v); setView('DETAILS'); }}
              className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer active:scale-95 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${getBrandStyle(v.brand)}`}>
                {v.brand[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{v.storeName}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{new Date(v.date).toLocaleDateString('tr-TR')}</p>
                  <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">{v.productBrand}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                 <div className="flex items-center gap-1 text-orange-600 font-black text-xs bg-orange-50 px-2.5 py-1 rounded-full">
                    <Star size={10} fill="currentColor"/> {v.totalStoreScore || v.generalVisualScore}
                 </div>
                 <ChevronRight className="text-slate-300" size={16} />
              </div>
            </div>
          ))}
          {visits.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm italic font-medium">Henüz bir ziyaret kaydı oluşturulmadı.</div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setView('NEW_VISIT')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-orange-500 rounded-full shadow-2xl shadow-orange-200 flex items-center justify-center text-white active:scale-90 transition-all z-50 border-4 border-white"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );

  const renderDetails = (visit: StoreVisit) => {
    const getIcon = (val: string) => {
      if (val === 'Evet') return <CheckCircle2 size={16} className="text-green-500" />;
      if (val === 'Kısmen') return <AlertCircle size={16} className="text-amber-500" />;
      return <XCircle size={16} className="text-rose-500" />;
    };

    const ScoreTag = ({ icon: Icon, label, score, colorClass }: any) => (
      <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${colorClass}`}>
        <Icon size={16} className="opacity-70" />
        <span className="text-[9px] font-black uppercase text-center leading-tight tracking-tighter">{label}</span>
        <span className="text-sm font-black">{score}/10</span>
      </div>
    );

    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setView('DASHBOARD')} className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={20} className="text-slate-600"/></button>
          <h1 className="text-lg font-black tracking-tight uppercase">Ziyaret Analizi</h1>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-7 text-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${getBrandStyle(visit.brand)}`}>
              {visit.brand[0]}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{visit.storeName}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><Calendar size={10}/> {new Date(visit.date).toLocaleDateString('tr-TR')}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><User size={10}/> {visit.visitorName}</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-orange-600 uppercase"><Zap size={10}/> {visit.productBrand}</span>
              </div>
            </div>
          </div>

          {visit.aiSummary && (
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-2 mb-3 text-orange-400">
                <Sparkles size={18} fill="currentColor" />
                <span className="font-black text-xs uppercase tracking-widest">Yapay Zeka Saha Özeti</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-line">{visit.aiSummary}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-6">
            <div className="space-y-1.5 text-center border-r border-slate-50">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Görsel Puan</p>
              <p className="text-lg font-black text-slate-800">{visit.generalVisualScore}</p>
            </div>
            <div className="space-y-1.5 text-center border-r border-slate-50">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hissedilen Doluluk</p>
              <p className="text-lg font-black text-slate-800">%{visit.stockLevel}</p>
            </div>
            <div className="space-y-1.5 text-center">
              <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Nihai Puan</p>
              <p className="text-xl font-black text-orange-600">{visit.totalStoreScore}</p>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MessageSquare size={14} className="text-orange-500" /> Personel Geri Bildirimi
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-bold italic">"{visit.storeGeneralFeedback}"</p>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <UserCheck size={12} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Kaynak: {visit.feedbackStaffName}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Star size={16} className="text-amber-500" /> Müşteri Algısı
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <ScoreTag icon={Palette} label="Tasarım" score={visit.designScore} colorClass="bg-purple-50 text-purple-700 border-purple-100" />
              <ScoreTag icon={Award} label="Kalite" score={visit.qualityScore} colorClass="bg-blue-50 text-blue-700 border-blue-100" />
              <ScoreTag icon={Tag} label="Fiyat" score={visit.priceScore} colorClass="bg-emerald-50 text-emerald-700 border-emerald-100" />
              <ScoreTag icon={Maximize} label="Fit" score={visit.fitScore} colorClass="bg-orange-50 text-orange-700 border-orange-100" />
              <ScoreTag icon={PenTool} label="Grafik" score={visit.graphicsScore} colorClass="bg-pink-50 text-pink-700 border-pink-100" />
              <ScoreTag icon={TrendingUp} label="Koleksiyon" score={visit.collectionPerformanceScore} colorClass="bg-indigo-50 text-indigo-700 border-indigo-100" />
            </div>
          </div>

          {visit.hasProductProblems === 'Evet' && (
            <div className="space-y-4 bg-rose-50 p-5 rounded-3xl border border-rose-100">
              <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={16}/> Kritik Ürün Sorunları
              </h3>
              <p className="text-xs text-rose-600 font-bold bg-white p-4 rounded-2xl border border-rose-100 leading-relaxed">
                {visit.productProblemDetails}
              </p>
              {visit.problemPhotos && visit.problemPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {visit.problemPhotos.map((p, i) => (
                    <img key={i} src={p} className="aspect-square object-cover rounded-2xl shadow-sm border border-rose-200" />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operasyonel Çetele</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Line/Tema Bütünlüğü</span>
                <span className="flex items-center gap-1.5 text-xs font-black">{getIcon(visit.lineThemeAlignment)} {visit.lineThemeAlignment}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Hero/Promo Vurgusu</span>
                <span className="flex items-center gap-1.5 text-xs font-black">{getIcon(visit.heroPromoVisibility)} {visit.heroPromoVisibility}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Sezon Görselleri</span>
                <span className="flex items-center gap-1.5 text-xs font-black">{getIcon(visit.seasonalVisualsUsed)} {visit.seasonalVisualsUsed}</span>
              </div>
            </div>
          </div>

          {visit.photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Mağaza Fotoğrafları</h3>
              <div className="grid grid-cols-2 gap-3">
                {visit.photos.map((p, i) => (
                  <img key={i} src={p} className="aspect-square object-cover rounded-3xl shadow-sm border border-slate-100" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto overflow-x-hidden bg-slate-50">
      {isSummarizing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 font-black text-white text-sm uppercase tracking-[0.2em] drop-shadow-md">Rapor Analiz Ediliyor...</p>
        </div>
      )}

      {view === 'DASHBOARD' && renderDashboard()}
      {view === 'NEW_VISIT' && <VisitForm onSave={saveVisit} onCancel={() => setView('DASHBOARD')} />}
      {view === 'HISTORY' && (
        <div className="space-y-4">
           <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setView('DASHBOARD')} className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100"><ArrowLeft size={20}/></button>
            <h1 className="text-lg font-black uppercase tracking-tight">Geçmiş Kayıtlar</h1>
          </div>
          {visits.map(v => (
             <div 
             key={v.id} 
             onClick={() => { setSelectedVisit(v); setView('DETAILS'); }}
             className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer"
           >
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${getBrandStyle(v.brand)}`}>
               {v.brand[0]}
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-slate-800 text-sm">{v.storeName}</h3>
               <div className="flex items-center gap-2">
                 <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(v.date).toLocaleDateString('tr-TR')}</p>
                 <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">{v.productBrand}</span>
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-orange-600 font-black text-xs bg-orange-50 px-3 py-1.5 rounded-full">
                <Star size={10} fill="currentColor"/> {v.totalStoreScore}
             </div>
             <ChevronRight className="text-slate-200" size={20} />
           </div>
          ))}
        </div>
      )}
      {view === 'DETAILS' && selectedVisit && renderDetails(selectedVisit)}

      <nav className="fixed bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-lg rounded-[2rem] border border-white/10 px-8 py-4 flex justify-between items-center z-40 max-w-lg mx-auto shadow-2xl">
        <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'DASHBOARD' ? 'text-orange-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <LayoutDashboard size={22} strokeWidth={view === 'DASHBOARD' ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">Panel</span>
        </button>
        <button onClick={() => setView('HISTORY')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'HISTORY' ? 'text-orange-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <History size={22} strokeWidth={view === 'HISTORY' ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">Geçmiş</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-all">
          <MapPin size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Harita</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
