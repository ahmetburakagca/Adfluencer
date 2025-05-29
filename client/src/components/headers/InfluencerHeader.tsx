import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import {
  Zap,
  User,
  LogOut,
  Menu,
  X,
  Briefcase,
  MessageCircle,
  Mail,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { UserService } from "../../services/UserService";
import { User as UserType } from "../../types";

export const InfluencerHeader = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  };

  const userService = new UserService();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUser(response);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      }
    };
    getCurrentUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/jobs" className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Adfluencer
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/jobs"
              className={`${
                location.pathname === "/jobs"
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-purple-700"
              } transition-colors font-medium flex items-center gap-2`}
            >
              <Briefcase className="w-5 h-5" />
              Kampanyalar
            </Link>
            <Link
              to="/applied-campaigns"
              className={`${
                location.pathname === "/applied-campaigns"
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-purple-700"
              } transition-colors font-medium flex items-center gap-2`}
            >
              <FileText className="w-5 h-5" />
              Başvurularım
            </Link>
            <Link
              to="/get-my-invitations"
              className="text-gray-600 hover:text-purple-700 transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="w-5 h-5" />
              Davetlerim
            </Link>
            <Link
              to="/chat/contentcreator"
              className="text-gray-600 hover:text-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Mesajlar
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="md"
                className="text-gray-600 flex items-center hover:text-purple-700"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl || "public/user.png"}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover mr-2"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mr-2">
                    <span className="text-sm font-bold text-white">
                      {user?.username
                        ?.split(" ")
                        .map((word: string) => word[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                {user?.username}
              </Button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {user?.username}{" "}
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        Influencer
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profilim
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-purple-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/jobs"
                className={`${
                  location.pathname === "/jobs"
                    ? "text-purple-700"
                    : "text-gray-600 hover:text-purple-700"
                } transition-colors font-medium flex items-center gap-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="w-5 h-5" />
                Kampanyalar
              </Link>
              <Link
                to="/applied-campaigns"
                className={`${
                  location.pathname === "/applied-campaigns"
                    ? "text-purple-700"
                    : "text-gray-600 hover:text-purple-700"
                } transition-colors font-medium flex items-center gap-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-5 h-5" />
                Başvurularım
              </Link>
              <Link
                to="/get-my-invitations"
                className="text-gray-600 hover:text-purple-700 transition-colors font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="w-5 h-5" />
                Davetlerim
              </Link>
              <Link
                to="/chat"
                className="text-gray-600 hover:text-purple-700 transition-colors font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                Mesajlar
              </Link>
            </nav>
            <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {user?.username}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                  Influencer
                </span>
              </div>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full text-gray-600 flex items-center justify-center hover:text-purple-700"
                >
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl || "public/user.png"}
                      alt={user.username}
                      className="h-8 w-8 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mr-2">
                      <span className="text-sm font-bold text-white">
                        {user?.username
                          ?.split(" ")
                          .map((word: string) => word[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  Profilim
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-red-600 flex items-center justify-center hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        )}
      </div>

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
            className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </div>
      </Dialog>
    </header>
  );
};
