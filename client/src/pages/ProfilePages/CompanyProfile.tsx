import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog } from "primereact/dialog";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { UserService } from "../../services/UserService";
import { User } from "../../types";
import { ProgressSpinner } from "primereact/progressspinner";
import { LogOut, Building2, Mail } from "lucide-react";
import { ProfileEditModal } from "../../components/Company/profileEditModal";

export const CompanyProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userService = new UserService();

  const getCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      setCurrentUser(response);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
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
        <div className="grid grid-cols-1 gap-8">
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-1 p-8 bg-gray-50">
                <div className="flex flex-col items-center text-center">
                  {currentUser?.photoUrl ? (
                    <img
                      src={currentUser.photoUrl || "public/user.png"}
                      alt={currentUser?.username || "Şirket"}
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
                  <ProfileEditModal
                    isOpen={isEditing}
                    onClose={() => {
                      setIsEditing(false);
                      getCurrentUser();
                    }}
                    initialData={{
                      id: currentUser?.id || 0,
                      username: currentUser?.username || "",
                      role: currentUser?.role || 0,
                      email: currentUser?.email || "",
                      photoUrl: currentUser?.photoUrl || "",
                    }}
                  />

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <Building2 className="w-6 h-6 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Şirket
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentUser?.username}
                    </p>
                    <p className="text-sm text-gray-500">Şirket Adı</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <Mail className="w-6 h-6 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        E-posta
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 break-all">
                      {currentUser?.email}
                    </p>
                    <p className="text-sm text-gray-500">İletişim</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

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
    </div>
  );
};
