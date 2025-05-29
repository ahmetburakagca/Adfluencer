import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const CtaSection = () => {
  return (
    <section className="relative py-20 bg-purple-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Hemen Adfluencer'a Katılın
          </h2>
          <p className="text-xl mb-8 text-white/90">
            İster marka, ister influencer olun, Adfluencer size uygun
            işbirlikleri için doğru adrestir.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-purple-800 font-medium hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Giriş Yap
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white bg-white/10 backdrop-blur text-white font-medium hover:bg-white/20 transition-colors"
            >
              Ücretsiz Hesap Oluştur
            </Link>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            Daha fazla bilgi mi lazım?{" "}
            <a href="#" className="underline">
              Bizimle iletişime geçin
            </a>{" "}
            veya{" "}
            <a href="#" className="underline">
              SSS sayfamızı
            </a>{" "}
            ziyaret edin.
          </p>
        </div>
      </div>
    </section>
  );
};
