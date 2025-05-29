import { Card } from "../ui/Card";
import { Users, Star, Folder, Calculator } from "lucide-react";

export const AIInfluencerInfo = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold text-purple-900 mb-2">
            Yapay Zeka Destekli Influencer Analizi
          </h2>
          <p className="text-gray-700 mb-4 text-sm">
            Platformumuz, gelişmiş yapay zeka algoritmaları kullanarak
            influencer'ları kapsamlı bir şekilde analiz eder. Her influencer
            için:
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Users className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Takipçi Analizi
                </h3>
              </div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Takipçi sayısı ve artış oranı
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Takipçi kalitesi ve gerçeklik oranı
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Star className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Etkileşim Analizi
                </h3>
              </div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Son 60 gün etkileşim oranı
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Ortalama beğeni ve yorum
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Folder className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  İçerik Analizi
                </h3>
              </div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Gönderi sıklığı ve kalitesi
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  İçerik kategorisi ve tutarlılık
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Calculator className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Performans Analizi
                </h3>
              </div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Genel performans skoru
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Trend ve büyüme analizi
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h3 className="font-semibold text-purple-900 mb-1.5 text-sm">
              Neden Önemli?
            </h3>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                Markalarla işbirliği şansınızı artırır
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                Profesyonel profilinizi güçlendirir
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                Rekabet avantajı sağlar
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-bold text-purple-900 mb-2">
            AI Skor Sistemi
          </h3>
          <p className="text-gray-700 mb-4 text-sm">
            Her influencer, yapay zeka tarafından 0-100 arasında
            değerlendirilir. Bu skor:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 bg-green-100 text-green-800 rounded text-center font-medium flex items-center justify-center text-sm">
                90-100
              </div>
              <span className="text-gray-700 text-sm">
                = Mükemmel Performans
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 bg-blue-100 text-blue-800 rounded text-center font-medium flex items-center justify-center text-sm">
                70-89
              </div>
              <span className="text-gray-700 text-sm">
                = Çok İyi Performans
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 bg-yellow-100 text-yellow-800 rounded text-center font-medium flex items-center justify-center text-sm">
                50-69
              </div>
              <span className="text-gray-700 text-sm">= İyi Performans</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 bg-orange-100 text-orange-800 rounded text-center font-medium flex items-center justify-center text-sm">
                30-49
              </div>
              <span className="text-gray-700 text-sm">= Orta Performans</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 bg-red-100 text-red-800 rounded text-center font-medium flex items-center justify-center text-sm">
                0-29
              </div>
              <span className="text-gray-700 text-sm">
                = Geliştirilmesi Gereken
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-xs">
            AI skoru, tüm metriklerin yapay zeka tarafından analiz edilmesi
            sonucu belirlenir ve influencer'ın genel performansını yansıtır.
          </p>
        </div>
      </div>
    </Card>
  );
};
