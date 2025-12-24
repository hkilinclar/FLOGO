
export enum StoreBrand {
  FLO = 'FLO',
  IN_STREET = 'IN STREET',
  REEBOK = 'REEBOK',
  LUMBERJACK = 'LUMBERJACK'
}

export const PRODUCT_BRANDS = [
  "KINETIX",
  "LUMBERJACK",
  "REEBOK",
  "DİĞER"
];

export const STORES = [
  "212 AVM",
  "ARENAPARK AVM",
  "CEVAHİR AVM",
  "FORUM ISTANBUL AVM",
  "MALL OF ISTANBUL AVM",
  "MARMARA FORUM AVM",
  "MARMARA PARK AVM",
  "TAKSİM İSTİKLAL CADDE",
  "VENEZIA AVM",
  "TORİUM AVM",
  "EYUP AXİS AVM",
  "VIALAND AVM",
  "DİĞER"
];

export const VISITORS = [
  "BEYZA TAŞ",
  "BUSE BERİL ERGÜVEN",
  "ELİF AKBAL",
  "FERYA ŞEN",
  "HATİCE NİSA AN",
  "HÜSEYİN KILINÇLAR",
  "NAZLI PALÇİK",
  "UĞUR DEMİR",
  "HANDE DOĞAN",
  "Diğer"
];

export const DEPARTMENTS = [
  "Buying",
  "Grafik",
  "Tasarım",
  "Diğer"
];

export const PRODUCT_GROUPS = [
  "Yağmurluk",
  "Kısa Kaban",
  "Uzun Kaban",
  "Puffer Mont",
  "Puffer Yelek",
  "Teddy",
  "Sweatshirt C Yaka",
  "Sweatshirt Kapşonlu",
  "Sweatshirt Fermuarlı",
  "Sweatshirt Polar",
  "Eşofman Altı",
  "Kısa Kol Tshirt",
  "Diğer"
];

export interface StoreVisit {
  id: string;
  date: string;
  visitorName: string;
  visitorDepartment: string;
  brand: StoreBrand;
  productBrand: string;
  storeName: string;
  generalVisualScore: number;
  generalVisualComments?: string;
  
  // Denetim Soruları
  lineThemeAlignment: string;
  heroPromoVisibility: string;
  apparelStockLevel: string;
  productsInWarehouseNotOnShelf: string;
  
  // Analiz Puanları (Genel)
  classificationBalanceScore: number;
  collectionPerformanceScore: number;

  // Müşteri Geri Bildirim Puanları
  designScore: number;
  qualityScore: number;
  priceScore: number;
  fitScore: number;
  graphicsScore: number;

  // Sorunlu Ürünler
  hasProductProblems: string;
  productProblemDetails?: string;
  problemPhotos?: string[];

  // Görsel Materyal Kullanımı
  seasonalVisualsUsed: string;

  // Saha Geri Bildirimi
  storeGeneralFeedback: string;
  feedbackStaffName: string;
  totalStoreScore: number;

  // Ürün Grupları
  missedProductGroups: string[];
  missedProductGroupsOther?: string;
  topSellingProductGroups: string[];

  stockLevel: number;
  photos: string[];
  aiSummary?: string;
}

export type AppView = 'DASHBOARD' | 'NEW_VISIT' | 'HISTORY' | 'DETAILS';
