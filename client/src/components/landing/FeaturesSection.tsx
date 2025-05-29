import { ArrowRight, Check, Shield } from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
};

const FeatureCard = ({
  icon,
  title,
  description,
  benefits,
}: FeatureCardProps) => {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 group">
      <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {benefits.map((item, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span className="text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="inline-flex items-center text-primary hover:underline font-medium"
      >
        Daha fazla bilgi <ArrowRight className="ml-1 h-4 w-4" />
      </a>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Doğru Eşleşmeler",
      description:
        "Gelişmiş algoritmamız, markaların ihtiyaçlarına en uygun influencer'ları bulmasını sağlar.",
      benefits: [
        "İlgi alanı eşleştirme",
        "Hedef kitle analizi",
        "Performans tahminleri",
      ],
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      title: "Kolay Yönetim",
      description:
        "Kampanyalarınızı oluşturun, yönetin ve sonuçları tek bir platformdan takip edin.",
      benefits: [
        "Takvim entegrasyonu",
        "Otomatik raporlama",
        "İş akışı yönetimi",
      ],
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Analitik Veriler",
      description:
        "Detaylı performans analizleri ile kampanyalarınızın etkisini ölçümleyin.",
      benefits: [
        "Gerçek zamanlı istatistikler",
        "Özelleştirilebilir raporlar",
        "ROI hesaplamaları",
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Neden Bizi Seçmelisiniz
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Neden <span className="text-primary">Adfluencer</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Markalar ve influencer'lar için tamamen özelleştirilmiş bir platform
            ile her iki tarafa da değer katıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
