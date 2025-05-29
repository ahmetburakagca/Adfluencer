import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { LoginSchema } from "./ValidationLogin";

interface LoginFormProps {
  isLoading: boolean;
  handleLogin: (values: LoginFormValues) => Promise<void>;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = ({ isLoading, handleLogin }: LoginFormProps) => {
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-md">
      <div className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            Adfluencer'a Hoş Geldiniz
          </h2>
          <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">
                  Email
                </label>
                <Field
                  as={InputText}
                  name="email"
                  placeholder="mail@example.com"
                  className={classNames("w-full", {
                    "p-invalid": errors.email && touched.email,
                  })}
                />
                {errors.email && touched.email && (
                  <small className="p-error">{errors.email}</small>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">
                  Şifre
                </label>
                <Field
                  as={InputText}
                  name="password"
                  type="password"
                  placeholder="********"
                  className={classNames("w-full", {
                    "p-invalid": errors.password && touched.password,
                  })}
                />
                {errors.password && touched.password && (
                  <small className="p-error">{errors.password}</small>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-700 hover:text-purple-900 hover:underline"
                >
                  Şifremi Unuttum
                </button>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: "linear-gradient(to right, #6b21a8, #581c87)",
                    width: "100%",
                    borderRadius: "50px",
                    border: "none",
                    justifyContent: "center",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span>Giriş Yap</span>
                  )}
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Henüz hesabınız yok mu?{" "}
                  <Link
                    to="/signup"
                    className="text-purple-700 font-medium hover:text-purple-900 hover:underline"
                  >
                    Ücretsiz hesap oluşturun
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
