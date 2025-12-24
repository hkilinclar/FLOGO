
import { GoogleGenAI } from "@google/genai";
import { StoreVisit } from "../types";

export const generateVisitSummary = async (visit: StoreVisit): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Mağaza Ziyaret Raporu Özeti Hazırla:
      Kanal: ${visit.brand}
      Marka Odak: ${visit.productBrand}
      Mağaza: ${visit.storeName}
      Ziyaretçi: ${visit.visitorName}
      Departman: ${visit.visitorDepartment}
      Nihai Mağaza Puanı: ${visit.totalStoreScore}/10
      Görsel Düzen Puanı: ${visit.generalVisualScore}/10
      Stok Doluluk (Hissedilen): %${visit.stockLevel}
      
      Saha Geri Bildirimi:
      - Mağaza Çalışanı: ${visit.feedbackStaffName}
      - Çalışan Yorumları: ${visit.storeGeneralFeedback}
      
      Müşteri Algı Verileri:
      - Tasarım: ${visit.designScore}/10, Kalite: ${visit.qualityScore}/10, Fiyat: ${visit.priceScore}/10, Fit: ${visit.fitScore}/10, Grafik: ${visit.graphicsScore}/10
      
      Kritik Ürün Sorunları:
      - Sorunlar: ${visit.productProblemDetails || 'Belirtilmedi'}
      
      Operasyonel Durum:
      - Karşılanamayan Talepler: ${visit.missedProductGroups.join(', ')}
      - En Çok Satan Ürün Grupları: ${visit.topSellingProductGroups.join(', ')}
      
      Lütfen bu verileri analiz et. Özellikle mağaza personeli ${visit.feedbackStaffName} tarafından iletilen "${visit.storeGeneralFeedback}" geri bildirimini ve ziyaretçinin verdiği ${visit.totalStoreScore}/10 puanı dikkate alarak bir yönetici özeti oluştur. Mağazanın zayıf ve güçlü yanlarını özetle.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Özet oluşturulamadı.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Yapay zeka özeti şu an hazırlanamıyor.";
  }
};