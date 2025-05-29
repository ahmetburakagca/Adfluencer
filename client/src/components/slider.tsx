import { Zap, Star, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel } from "primereact/carousel";
import { useAuth } from "../context/AuthContext";

const influencerPromotionSlides = [
  {
    icon: <Zap className="w-20 h-20 text-white" />,
    title: "Kolay İş Bulma",
    description: "Binlerce iş ilanı arasından size en uygun olanı bulun",
    gradient: "from-purple-600 to-purple-800",
    stats: "10.000+ Aktif İş İlanı",
  },
  {
    icon: <Star className="w-20 h-20 text-white" />,
    title: "Yüksek Kazanç",
    description: "Yeteneğinize göre belirlenen ücretlerle daha fazla kazanın",
    gradient: "from-yellow-500 to-yellow-700",
    stats: "Ortalama 5.000₺ Kazanç",
  },
  {
    icon: <Users className="w-20 h-20 text-white" />,
    title: "Güvenilir Şirketler",
    description: "Doğrulanmış şirketlerle güvenli işbirliği yapın",
    gradient: "from-blue-500 to-blue-700",
    stats: "500+ Doğrulanmış Şirket",
  },
  {
    icon: <TrendingUp className="w-20 h-20 text-white" />,
    title: "Kariyer Gelişimi",
    description: "Profesyonel ağınızı genişletin ve kariyerinizi ilerletin",
    gradient: "from-green-500 to-green-700",
    stats: "20.000+ Başarılı İşbirliği",
  },
];

const companyPromotionSlides = [
  {
    icon: <Zap className="w-20 h-20 text-white" />,
    title: "Doğru Influencer",
    description:
      "Binlerce influencer arasından ihtiyacınıza en uygun olanı bulun",
    gradient: "from-purple-600 to-purple-800",
    stats: "5.000+ Aktif Influencer",
  },
  {
    icon: <Star className="w-20 h-20 text-white" />,
    title: "Etkili Pazarlama",
    description: "Influencer pazarlaması ile markanızı büyütün",
    gradient: "from-yellow-500 to-yellow-700",
    stats: "Ortalama %300 ROI",
  },
  {
    icon: <Users className="w-20 h-20 text-white" />,
    title: "Güvenilir Influencerlar",
    description: "Doğrulanmış influencerlar ile güvenli işbirliği yapın",
    gradient: "from-blue-500 to-blue-700",
    stats: "1.000+ Doğrulanmış Influencer",
  },
  {
    icon: <TrendingUp className="w-20 h-20 text-white" />,
    title: "Marka Bilinirliği",
    description:
      "Influencer işbirlikleri ile markanızı geniş kitlelere ulaştırın",
    gradient: "from-green-500 to-green-700",
    stats: "50.000+ Başarılı Kampanya",
  },
];

const promotionTemplate = (
  slide: (typeof influencerPromotionSlides | typeof companyPromotionSlides)[0]
) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center p-2 sm:p-8 md:p-12 backdrop-blur-sm bg-gradient-to-br ${slide.gradient} w-full min-h-[280px] sm:min-h-[320px] md:min-h-[340px] rounded-4xl relative overflow-hidden`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mb-3 sm:mb-6 md:mb-8 bg-white/10 p-3 sm:p-5 md:p-6 rounded-full"
      >
        {slide.icon}
      </motion.div>
      <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 text-center px-2">
        {slide.title}
      </h3>
      <p className="text-white/90 text-center mb-3 sm:mb-5 md:mb-6 text-xs sm:text-base md:text-lg px-2 leading-relaxed">
        {slide.description}
      </p>
      <div className="mt-2 sm:mt-3 md:mt-4 px-3 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 bg-white/10 rounded-full">
        <span className="text-white font-semibold text-xs sm:text-base md:text-lg">
          {slide.stats}
        </span>
      </div>
    </motion.div>
  );
};

export const PromotionSlider = () => {
  const { user } = useAuth();
  const isInfluencer = user?.role === "influencer";

  const mainTitle = isInfluencer
    ? "Adfluencer ile Şirketleri ve İlanları Keşfet"
    : "Adfluencer ile Influencerları Keşfet";

  const subtitle = isInfluencer
    ? "Yeteneklerinizi değerlendirin, hayalinizdeki işbirliğini bulun"
    : "İhtiyacınıza uygun influencerları bulun, işbirliği yapın";

  const slides = isInfluencer
    ? influencerPromotionSlides
    : companyPromotionSlides;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/90 to-purple-700/90 py-4 sm:py-8 md:py-10 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
    >
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 w-full">
        <div className="text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2">
            {mainTitle}
          </h2>
          <p className="text-purple-100 text-sm sm:text-lg md:text-xl lg:text-2xl px-2">
            {subtitle}
          </p>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="w-full flex justify-center">
            <Carousel
              value={slides}
              numVisible={1}
              numScroll={1}
              itemTemplate={promotionTemplate}
              circular
              showIndicators={false}
              autoplayInterval={4000}
              className="custom-carousel"
              pt={{
                item: {
                  className: "flex justify-center",
                },
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
