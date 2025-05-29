import { Link } from "react-router-dom";
import { ChevronRight, Star, Zap } from "lucide-react";

interface HeroSectionProps {
  isVisible: boolean;
}

export const HeroSection = ({ isVisible }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-purple-700 to-purple-900 text-white py-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/2 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="mb-6 inline-flex items-center py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-300" />
                Yeni Nesil İşbirliği Platformu
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Markaları ve İçerik Üreticilerini
              <span className="bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Buluşturuyoruz
              </span>
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-lg">
              Adfluencer, markaların doğru influencer'ları bulmasını ve içerik
              üreticilerinin harika iş fırsatlarına erişmesini sağlayan
              platformdur.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-purple-800 font-medium hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Giriş Yap
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white text-white font-medium hover:bg-white/10 transition-colors"
              >
                Ücretsiz Hesap Oluştur
              </Link>
              <span className="text-white/80 ml-2">
                Test edin, hiçbir kart bilgisi gerekmez.
              </span>
            </div>
            <div className="mt-8 flex items-center text-white/70 text-sm">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "women" : "men"
                    }/${20 + i}.jpg`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-primary"
                  />
                ))}
              </div>
              <span>
                <strong className="text-white font-medium">4,320+</strong>{" "}
                memnun kullanıcı
              </span>
              <div className="mx-4">•</div>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-300 fill-yellow-300"
                    />
                  ))}
                </div>
                <span className="ml-2">
                  <strong className="text-white font-medium">4.9/5</strong> puan
                </span>
              </div>
            </div>
          </div>
          <HeroImage isVisible={isVisible} />
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          className="fill-current text-white"
        >
          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

// Hero bölümündeki resim ve floating kartlar
const HeroImage = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <div
      className={`hidden md:block transition-all duration-1000 delay-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-50 rounded-2xl transform rotate-3"></div>
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80"
          alt="İşbirliği"
          className="relative rounded-2xl shadow-2xl"
        />
        {/* Floating labels */}
        <FloatingMetricCard />
        <FloatingRatingCard />
      </div>
    </div>
  );
};

// Floating büyüme kart bileşeni
const FloatingMetricCard = () => {
  return (
    <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 flex items-center w-64">
      <div className="bg-green-100 rounded-full p-2 mr-3">
        <TrendingUp className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">Son 30 gün</p>
        <p className="text-gray-900 font-bold">+124% Büyüme</p>
      </div>
    </div>
  );
};

// Floating yıldız derecelendirme kartı
const FloatingRatingCard = () => {
  return (
    <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-xl p-3 flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4 text-yellow-400 fill-yellow-400"
          />
        ))}
      </div>
    </div>
  );
};

// TrendingUp ikonunu içe aktaralım (eksik kalmış)
import { TrendingUp } from "lucide-react";
