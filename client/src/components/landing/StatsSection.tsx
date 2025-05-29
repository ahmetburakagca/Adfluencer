import { TrendingUp, Users, Zap, Star, Shield } from "lucide-react";

type StatItemProps = {
  number: string;
  label: string;
  icon: React.ElementType;
};

const StatItem = ({ number, label, icon: Icon }: StatItemProps) => {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">{number}</h3>
      <p className="text-gray-500">{label}</p>
    </div>
  );
};

export const StatsSection = () => {
  const stats = [
    { number: "10K+", label: "Aktif Influencer", icon: Users },
    { number: "2.4M+", label: "İçerik Etkileşimi", icon: Zap },
    { number: "98%", label: "Memnuniyet Oranı", icon: Star },
    { number: "1.2K+", label: "Başarılı Kampanya", icon: Shield },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Influencer Rakamlar
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Sayılarla Adfluencer
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Platformumuz büyüyen bir ekosistem ve başarılı işbirlikleri
            oluşturuyor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <StatItem
              key={idx}
              number={stat.number}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
