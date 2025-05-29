import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog } from "primereact/dialog";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { UserService } from "../../services/UserService";
import { ContentCreator } from "../../types";
import { ProgressSpinner } from "primereact/progressspinner";
import { LogOut, Users, Star, Folder, Calculator } from "lucide-react";
import { InputNumber } from "primereact/inputnumber";
import { ProfileEditModal } from "../../components/Influencer/profileEditModal";

interface ScoreFormData {
  avgLikes: number;
  posts: number;
  followerCount: number;
  totalLikes: number;
  newPostAvgLike: number;
  engagement60Day: number;
}

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

export const InfluencerProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [scoreLoading, setScoreLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<ContentCreator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreFormData>({
    avgLikes: currentUser?.avgLikes || 0,
    posts: currentUser?.posts || 0,
    followerCount: currentUser?.followerCount || 0,
    totalLikes: currentUser?.totalLikes || 0,
    newPostAvgLike: currentUser?.newPostAvgLike || 0,
    engagement60Day: currentUser?.engagement60Day || 0,
  });

  const userService = new UserService();

  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getCurrentUser();
      setCurrentUser(response as ContentCreator);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleProfileUpdate = async () => {
    await getCurrentUser();
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const calculateScore = async () => {
    try {
      setScoreLoading(true);
      const formData = new FormData();
      formData.append("avgLikes", scoreData.avgLikes.toString());
      formData.append("posts", scoreData.posts.toString());
      formData.append("followerCount", scoreData.followerCount.toString());
      formData.append("totalLikes", scoreData.totalLikes.toString());
      formData.append("newPostAvgLike", scoreData.newPostAvgLike.toString());
      formData.append("engagement60Day", scoreData.engagement60Day.toString());

      await userService.updateUser(currentUser?.id || 0, formData);
      await getCurrentUser();
      setScoreLoading(false);
    } catch (error) {
      console.error("Skor hesaplanırken hata:", error);
    } finally {
      setShowScoreModal(false);
      setScoreLoading(false);
    }
  };

  if (isLoading || scoreLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 gap-8 ">
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-1 p-8 bg-gray-50">
                <div className="flex flex-col items-center text-center">
                  {currentUser?.photoUrl ? (
                    <img
                      src={currentUser.photoUrl || "public/user.png"}
                      alt={currentUser?.username || "Influencer"}
                      className="w-40 h-40 rounded-full object-cover mb-6 ring-4 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 ring-4 ring-white shadow-lg">
                      <span className="text-5xl font-bold text-white">
                        {currentUser?.username
                          ?.split(" ")
                          .map((word: string) => word[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentUser?.username}
                  </h1>
                  <p className="text-gray-600 break-all mb-6">
                    {currentUser?.email}
                  </p>

                  <div className="flex flex-col gap-3 w-full">
                    <Button
                      variant="outline"
                      className="w-full text-lg py-3"
                      onClick={() => setIsEditing(true)}
                    >
                      Profili Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 text-lg py-3"
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      Çıkış Yap
                    </Button>
                  </div>
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
                      {formatFollowerCount(currentUser?.followerCount || 0)}
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
                      {getCategoryLabel(currentUser?.category || "")}
                    </p>
                    <p className="text-sm text-gray-500">İçerik Kategorisi</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <Star className="w-6 h-6 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Skor
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentUser?.score || 0}
                    </p>
                    <p className="text-sm text-gray-500">Performans Puanı</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-lg border-0 rounded-xl overflow-hidden mt-8">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Skorunuzu Yükseltin
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Neden Skor Önemli?
                  </h4>
                  <ul className="space-y-2 text-purple-800">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Markalarla işbirliği şansınızı artırır
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Profesyonel profilinizi güçlendirir
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Rekabet avantajı sağlar
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Nasıl Hesaplanır?
                  </h4>
                  <p className="text-purple-800">
                    Skorunuz, takipçi sayınız, etkileşim oranlarınız ve içerik
                    performansınız gibi faktörlere göre hesaplanır. Düzenli
                    olarak güncelleyerek profilinizi güçlendirin.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-4 text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => setShowScoreModal(true)}
                  >
                    Skorumu Hesapla
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      <ProfileEditModal
        isOpen={isEditing}
        onClose={handleProfileUpdate}
        initialData={{
          id: currentUser?.id || 0,
          username: currentUser?.username || "",
          role: currentUser?.role || 1,
          email: currentUser?.email || "",
          photoUrl: currentUser?.photoUrl || "",
          category: currentUser?.category || "",
          followerCount: currentUser?.followerCount || 0,
          score: currentUser?.score || 0,
          avgLikes: currentUser?.avgLikes || 0,
          posts: currentUser?.posts || 0,
          totalLikes: currentUser?.totalLikes || 0,
          newPostAvgLike: currentUser?.newPostAvgLike || 0,
          engagement60Day: currentUser?.engagement60Day || 0,
        }}
      />

      <Dialog
        header="Çıkış Yap"
        visible={showLogoutConfirm}
        style={{ width: "450px" }}
        onHide={() => setShowLogoutConfirm(false)}
        className="rounded-xl"
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Çıkış yapmak istediğinize emin misiniz?
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Hesabınızdan çıkış yaptıktan sonra tekrar giriş yapmanız
            gerekecektir.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
            İptal
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </div>
      </Dialog>

      <Dialog
        header="Skor Hesaplama"
        visible={showScoreModal}
        style={{ width: "500px" }}
        onHide={() => setShowScoreModal(false)}
        className="rounded-xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowScoreModal(false)}>
              İptal
            </Button>
            <Button
              onClick={calculateScore}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Hesapla
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Takipçi Sayısı
              </label>
              <InputNumber
                value={scoreData.followerCount}
                onValueChange={(e) =>
                  setScoreData({ ...scoreData, followerCount: e.value || 0 })
                }
                mode="decimal"
                min={0}
                className="w-full"
                placeholder="Örn: 3.50"
              />
              <p className="mt-1 text-sm text-gray-500">
                İnstagram hesabınızdaki toplam takipçi sayınız.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son 10 Gönderinin Ortalama Like Sayısı
              </label>
              <InputNumber
                value={scoreData.avgLikes}
                onValueChange={(e) =>
                  setScoreData({ ...scoreData, avgLikes: e.value || 0 })
                }
                mode="decimal"
                min={0}
                className="w-full"
                placeholder="Örn: 3.50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Son 10 gönderinin ortalama like sayısınız.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Sayısı
              </label>
              <InputNumber
                value={scoreData.posts}
                onValueChange={(e) =>
                  setScoreData({ ...scoreData, posts: e.value || 0 })
                }
                mode="decimal"
                min={0}
                className="w-full"
                placeholder="Örn: 40"
              />
              <p className="mt-1 text-sm text-gray-500">
                İnstagram hesabınızdaki toplam gönderi sayınız.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toplam Like Sayısı
              </label>
              <InputNumber
                value={scoreData.totalLikes}
                onValueChange={(e) =>
                  setScoreData({ ...scoreData, totalLikes: e.value || 0 })
                }
                mode="decimal"
                min={0}
                className="w-full"
                placeholder="Örn: 85.00"
              />
              <p className="mt-1 text-sm text-gray-500">
                İnstagram hesabınızdaki toplam like sayınız.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ortalama Like Sayısı
              </label>
              <InputNumber
                value={scoreData.newPostAvgLike}
                onValueChange={(e) =>
                  setScoreData({
                    ...scoreData,
                    newPostAvgLike: e.value || 0,
                  })
                }
                mode="decimal"
                min={0}
                className="w-full"
                placeholder="Örn: 85.00"
              />
              <p className="mt-1 text-sm text-gray-500">
                Son 60 gündeki ortalama like sayısınız.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son 60 Gündeki Etkileşim Oranınız
              </label>
              <InputNumber
                value={scoreData.engagement60Day}
                onValueChange={(e) =>
                  setScoreData({
                    ...scoreData,
                    engagement60Day: e.value || 0,
                  })
                }
                mode="decimal"
                min={0}
                minFractionDigits={2}
                maxFractionDigits={2}
                className="w-full"
                placeholder="Örn: 0.63"
              />
              <p className="mt-1 text-sm text-gray-500">
                Son 60 gündeki etkileşim oranınız.
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
