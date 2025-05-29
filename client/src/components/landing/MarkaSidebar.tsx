import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart2, Shield, Users, Check, Star } from "lucide-react";

export const MarkaSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="hidden md:flex md:w-3/5 bg-gradient-to-r from-purple-700 to-purple-900 text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
      {/* Anasayfaya dön butonu - sol tarafta konumlandırıldı */}
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-md transition-colors self-start mb-6 border border-white/20"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Anasayfaya Dön</span>
      </Link>

      {/* Arkaplan dekoratif elementleri */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Logo ve tagline */}
      <div
        className={`z-10 transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h1 className="text-6xl font-bold">Adfluencer</h1>
        <p className="text-2xl mt-6 text-white/90 max-w-2xl">
          İçerik Üreticileri ve Markalar için Profesyonel İşbirliği Platformu
        </p>
      </div>

      {/* İstatistikler */}
      <div className="z-10 mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 mr-2 text-purple-300" />
            <h4 className="font-bold text-lg">10,000+</h4>
          </div>
          <p className="text-sm text-white/80">Aktif Kullanıcı</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 mr-2 text-purple-300" />
            <h4 className="font-bold text-lg">5,000+</h4>
          </div>
          <p className="text-sm text-white/80">Başarılı Kampanya</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 mr-2 text-purple-300" />
            <h4 className="font-bold text-lg">%100</h4>
          </div>
          <p className="text-sm text-white/80">Güvenli Ödeme</p>
        </div>
      </div>

      {/* Platform Hakkında */}
      <div
        className={`z-10 transition-all duration-700 delay-300 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mt-8 mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Platformumuzla:</h3>
          <ul className="space-y-3 text-base">
            <li className="flex items-start">
              <div className="rounded-full bg-white/20 p-1.5 mr-3 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90">
                İçerik üreticileri ve markalar arasında kolay iletişim
              </p>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-white/20 p-1.5 mr-3 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90">
                Hedef kitlenize uygun içerik üreticileri ile eşleşme
              </p>
            </li>
          </ul>
        </div>

        {/* Kullanıcı yorumu */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 mr-3">
              <img
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt="Testimonial"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-base">Ayşe Yılmaz</p>
              <p className="text-sm text-white/70">Pazarlama Müdürü</p>
            </div>
            <div className="ml-auto flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-4 h-4 text-yellow-300 fill-yellow-300"
                />
              ))}
            </div>
          </div>
          <p className="text-white/90 italic text-base">
            "Adfluencer ile markamız için en doğru influencer'ları bulmak çok
            kolay oldu. Kampanyalarımızın getirisi arttı."
          </p>
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="z-10 mt-auto text-white/70 text-sm">
        <p className="mt-2 text-sm">© 2025 Adfluencer</p>
      </div>
    </div>
  );
};
