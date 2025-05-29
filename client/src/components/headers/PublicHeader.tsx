import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Adfluencer
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-purple-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/about"
              className="text-gray-600 hover:text-purple-700 transition-colors font-medium"
            >
              Hakkımızda
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-purple-700 transition-colors font-medium"
            >
              Nasıl Çalışır ?{" "}
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="md">
                  Giriş Yap
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-900"
                >
                  Kayıt Ol
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/about"
              className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              to="/pricing"
              className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Nasıl Çalışır ?
            </Link>
            <div className="pt-2 pb-4">
              <div className="flex flex-col space-y-2 px-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full justify-center"
                  >
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full justify-center bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-900"
                  >
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
