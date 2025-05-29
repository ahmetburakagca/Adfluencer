import { useState } from "react";
import { MarkaSidebar, MobileHeader } from "../components/login";
import { LoginForm } from "../components/login/LoginForm";
import { AuthService } from "../services/AuthService";
import { useToast } from "../utils/toaster";
import { Toast } from "primereact/toast";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authService = new AuthService();
  const { toast, showToast } = useToast();
  const { setUser } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await authService.login(values);
      if (response.status === 200 && response.data.success) {
        showToast("success", "Başarılı", response.data.message);
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      showToast(
        "error",
        "Hata",
        "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
      );
      console.error("Giriş hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <Toast ref={toast} />
      <MarkaSidebar />
      <div className="w-full md:w-3/5 flex flex-col items-center justify-start md:justify-center p-4 lg:p-8">
        <MobileHeader />
        <div
          className={
            "w-full max-w-md py-4 md:py-6 transition-all mt-10 duration-700"
          }
        >
          <LoginForm isLoading={isLoading} handleLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};
