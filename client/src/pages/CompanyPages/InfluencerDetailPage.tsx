import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/ui/Card";
import { ContentCreator } from "../../types";
import { ProgressSpinner } from "primereact/progressspinner";
import { UserService } from "../../services/UserService";
import { Users, Folder } from "lucide-react";
import { motion } from "framer-motion";

const userService = new UserService();

const formatFollowerCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const getCategoryLabel = (category: string) => {
  const categories: { [key: string]: string } = {
    beauty: "Güzellik",
    fashion: "Moda",
    lifestyle: "Yaşam Tarzı",
    technology: "Teknoloji",
    gaming: "Oyun",
    food: "Yemek",
    travel: "Seyahat",
    sports: "Spor",
    education: "Eğitim",
    entertainment: "Eğlence",
  };
  return categories[category] || category;
};

export const InfluencerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [influencer, setInfluencer] = useState<ContentCreator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfluencerDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          setError("Influencer ID'si bulunamadı");
          return;
        }

        const response = await userService.getUserById(Number(id));
        setInfluencer(response as ContentCreator);
      } catch (error) {
        console.error("Influencer bilgileri getirilirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencerDetails();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout title="Influencer Detayı" showBack>
        <div className="flex items-center justify-center min-h-screen">
          <ProgressSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Influencer Detayı" showBack>
        <Card>
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Hata</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </Card>
      </AppLayout>
    );
  }

  if (!influencer) {
    return (
      <AppLayout title="Influencer Detayı" showBack>
        <Card>
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold mb-2">
              Influencer Bulunamadı
            </h2>
            <p className="text-gray-600">
              Bu influencer mevcut değil veya kaldırılmış olabilir.
            </p>
          </div>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Influencer Detayı" showBack>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 gap-8">
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-1 p-8 bg-gray-50">
                  <div className="flex flex-col items-center text-center">
                    {influencer.photo ? (
                      <img
                        src={influencer.photo || "public/user.png"}
                        alt={influencer.username}
                        className="w-40 h-40 rounded-full object-cover mb-6 ring-4 ring-white shadow-lg"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 ring-4 ring-white shadow-lg">
                        <span className="text-5xl font-bold text-white">
                          {influencer.username
                            ?.split(" ")
                            .map((word: string) => word[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {influencer.username}
                    </h1>
                    <p className="text-gray-600 break-all mb-6">
                      {influencer.email}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-1">
                        <Users className="w-6 h-6 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Takipçiler
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatFollowerCount(influencer.followerCount || 0)}
                      </p>
                      <p className="text-sm text-gray-500">Toplam Takipçi</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-1">
                        <Folder className="w-6 h-6 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Kategori
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 capitalize">
                        {getCategoryLabel(influencer.category || "")}
                      </p>
                      <p className="text-sm text-gray-500">İçerik Kategorisi</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};
