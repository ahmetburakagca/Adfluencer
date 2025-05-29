import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarkaSidebar } from "../components/login";
import { SignupForm } from "../components/signup/SignupForm";
import { Button } from "primereact/button";
import { SignupFormValues } from "../components/signup/type";
import { AuthService } from "../services/AuthService";
import { Toast } from "primereact/toast";
import { useToast } from "../utils/toaster";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const authService = new AuthService();
  const { toast, showToast } = useToast();

  const handleSignup = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", values.role.toString());

      if (values.category) {
        formData.append("category", values.category);
      }

      if (values.photo) {
        formData.append("photo", values.photo);
      }

      if (values.followerCount) {
        formData.append("followerCount", values.followerCount.toString());
      }

      const response = (await authService.register(formData)) as {
        status: number;
      };

      if (response.status === 200) {
        showToast("success", "Başarılı", "Kayıt işlemi başarıyla tamamlandı");
        navigate("/login");
      } else {
        showToast("error", "Hata", "Kayıt sırasında bir hata oluştu");
      }
    } catch {
      showToast("error", "Hata", "Kayıt sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <Toast ref={toast} position="top-right" />
      <MarkaSidebar />
      <div className="w-full md:w-3/5 flex flex-col items-center justify-start md:justify-center p-4 lg:p-8 overflow-y-auto">
        <div className="flex justify-center items-center"></div>
        <div
          className={
            "w-full max-w-md py-4 md:py-6 transition-all duration-700 "
          }
        >
          <SignupForm isLoading={isLoading} onSubmit={handleSignup} />
        </div>
        <div className="md:hidden fixed top-4 left-4 z-10">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate("/")}
            className="p-button-rounded p-button-text"
            style={{
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
              color: "purple",
              fontSize: "1.5rem",
              padding: "0.5rem",
            }}
          />
        </div>
      </div>
    </div>
  );
};
