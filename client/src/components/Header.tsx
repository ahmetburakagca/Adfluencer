import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

interface HeaderProps {
  userType?: UserRole;
}

export const Header = ({ userType }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Adfluencer</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                {userType === "ContentCreator" && (
                  <>
                    <Link
                      to="/jobs"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      İş İlanları
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Profilim
                    </Link>
                  </>
                )}
                {userType === "Adversiter" && (
                  <>
                    <Link
                      to="/influencers"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Influencer'lar
                    </Link>
                    <Link
                      to="/create-job"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      İş İlanı Oluştur
                    </Link>
                  </>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
