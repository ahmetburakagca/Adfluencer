import { useEffect, useState } from "react";
import { Check, Zap, Star, MessageSquare } from "lucide-react";

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"influencer" | "brand">(
    "influencer"
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white">
      <section className="relative min-h-[40vh] flex items-center py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1
              className={`text-5xl md:text-7xl font-extrabold mb-6 leading-tight transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              Nasıl Çalışır?
            </h1>
            <p
              className={`text-xl md:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              Markalar ve influencer'lar için esnek ve adil bir işbirliği
              platformu
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-white/10 rounded-full p-1 backdrop-blur-sm">
              <button
                onClick={() => setSelectedTab("influencer")}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedTab === "influencer"
                    ? "bg-purple-500 text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Influencer
              </button>
              <button
                onClick={() => setSelectedTab("brand")}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedTab === "brand"
                    ? "bg-purple-500 text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Marka
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {selectedTab === "influencer" ? (
              <>
                <div
                  className={`bg-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">
                    Influencer'lar İçin
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Profil Oluştur
                        </h3>
                        <p className="text-white/80">
                          Ücretsiz hesap oluşturun ve profilinizi detaylı bir
                          şekilde doldurun
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">2</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          İlanları Keşfet
                        </h3>
                        <p className="text-white/80">
                          Size uygun marka ilanlarını görüntüleyin ve
                          detaylarını inceleyin
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">3</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Başvuru Yap
                        </h3>
                        <p className="text-white/80">
                          İlgilendiğiniz ilanlara başvurun ve teklifinizi iletin
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">4</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Anlaşma Yap
                        </h3>
                        <p className="text-white/80">
                          Marka ile anlaşma sağlayın ve işbirliğinizi başlatın
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`bg-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-1000 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">Avantajlar</h2>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Ücretsiz hesap oluşturma</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Sınırsız ilan görüntüleme</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Esnek fiyat teklifi verme</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Güvenli ödeme sistemi</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>7/24 destek hizmeti</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`bg-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">Markalar İçin</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Hesap Oluştur
                        </h3>
                        <p className="text-white/80">
                          Marka hesabınızı oluşturun ve doğrulama işlemini
                          tamamlayın
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">2</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          İlan Oluştur
                        </h3>
                        <p className="text-white/80">
                          Kampanya detaylarınızı ve bütçenizi belirterek ilan
                          oluşturun
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">3</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Başvuruları İncele
                        </h3>
                        <p className="text-white/80">
                          Gelen başvuruları değerlendirin ve uygun
                          influencer'ları seçin
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                        <span className="text-purple-300">4</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          İşbirliği Başlat
                        </h3>
                        <p className="text-white/80">
                          Seçtiğiniz influencer ile anlaşma yapın ve kampanyayı
                          başlatın
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`bg-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-1000 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-6">Avantajlar</h2>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Ücretsiz hesap oluşturma</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Sınırsız ilan oluşturma</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Detaylı influencer arama</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Güvenli ödeme sistemi</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>Kampanya yönetim araçları</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Platform Özellikleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Hızlı Eşleştirme",
                description:
                  "Akıllı algoritmalar ile en uygun influencer/marka eşleştirmesi",
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Güvenli İletişim",
                description:
                  "Platform üzerinden güvenli mesajlaşma ve dosya paylaşımı",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Değerlendirme Sistemi",
                description:
                  "İşbirliği sonrası karşılıklı değerlendirme ve puanlama",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white/10 rounded-xl p-6 backdrop-blur-sm transition-all duration-1000 delay-${
                  index * 100
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
