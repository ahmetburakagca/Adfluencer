import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { SignupFormValues } from "./type";
import { useRef } from "react";
import { SignupSchema } from "./ValidationSign";
import { InputNumber } from "primereact/inputnumber";

interface SignupFormProps {
  isLoading: boolean;
  onSubmit: (values: SignupFormValues) => Promise<void>;
}

const categories = [
  { name: "Moda", code: "fashion" },
  { name: "Güzellik", code: "beauty" },
  { name: "Seyahat", code: "travel" },
  { name: "Yemek", code: "food" },
  { name: "Spor", code: "sports" },
  { name: "Teknoloji", code: "tech" },
  { name: "Oyun", code: "gaming" },
  { name: "Eğitim", code: "education" },
  { name: "Spor", code: "sports" },
  { name: "Müzik", code: "music" },
];

export const SignupForm = ({ isLoading, onSubmit }: SignupFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialValues: SignupFormValues = {
    role: 0,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    followerCount: null,
    category: null,
    photo: null,
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-md px-4 sm:px-0">
      <div className="relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
            Hesap Oluşturun
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Adfluencer platformuna katılmak için kayıt olun
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values, setFieldValue, resetForm }) => (
            <Form className="space-y-5">
              <div className="flex justify-center space-x-4 mb-4">
                <label className="flex items-center">Kullanıcı Tipi *</label>

                <div>
                  <RadioButton
                    inputId="influencer"
                    name="role"
                    value={1}
                    checked={values.role === 1}
                    onChange={(e) => {
                      setFieldValue("role", e.value);
                      resetForm({
                        values: { ...initialValues, role: e.value },
                      });
                    }}
                  />
                  <label htmlFor="influencer" className="ml-2">
                    İçerik Üreticisi
                  </label>
                </div>
                <div>
                  <RadioButton
                    inputId="company"
                    name="role"
                    value={0}
                    checked={values.role === 0}
                    onChange={(e) => {
                      setFieldValue("role", e.value);
                      resetForm({
                        values: { ...initialValues, role: e.value },
                      });
                    }}
                  />
                  <label htmlFor="company" className="ml-2">
                    Şirket
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">
                  Kullanıcı Adı*
                </label>
                <Field
                  as={InputText}
                  name="username"
                  placeholder="Kullanıcı Adı"
                  className={classNames("w-full", {
                    "p-invalid": errors.username && touched.username,
                  })}
                />
                {errors.username && touched.username && (
                  <small className="p-error">{errors.username}</small>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">
                  E-posta*
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

              {values.role === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 pl-1">
                      Takipçi Sayısı
                    </label>
                    <InputNumber
                      name="followerCount"
                      min={0}
                      placeholder="Takipçi sayısı"
                      value={values.followerCount}
                      onChange={(e) => setFieldValue("followerCount", e.value)}
                      className={classNames("w-full", {
                        "p-invalid":
                          errors.followerCount && touched.followerCount,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 pl-1">
                      Kategori
                    </label>
                    <Dropdown
                      value={values.category}
                      options={categories}
                      optionLabel="name"
                      optionValue="code"
                      placeholder="Kategori seçin"
                      className="w-full"
                      onChange={(e) => setFieldValue("category", e.value)}
                    />
                    {errors.category && touched.category && (
                      <small className="p-error">{errors.category}</small>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">
                  Profil Fotoğrafı
                </label>
                <input
                  ref={fileInputRef}
                  id="photo-upload"
                  type="file"
                  name="photo"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    setFieldValue(
                      "photo",
                      event.currentTarget.files
                        ? event.currentTarget.files[0]
                        : null
                    );
                  }}
                />
                <Button
                  type="button"
                  icon="pi pi-image"
                  className="w-full"
                  style={{
                    background: "#ede9fe",
                    color: "#6b21a8",
                    border: "1px solid #a78bfa",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {values.photo ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
                </Button>
                {values.photo && (
                  <div className="mt-2 text-sm text-gray-600">
                    Seçilen dosya:{" "}
                    <span className="font-medium">{values.photo.name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 pl-1">
                    Şifre*
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 pl-1">
                    Şifre (Tekrar)
                  </label>
                  <Field
                    as={InputText}
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    className={classNames("w-full", {
                      "p-invalid":
                        errors.confirmPassword && touched.confirmPassword,
                    })}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <small className="p-error">{errors.confirmPassword}</small>
                  )}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => console.log("Butona tıklandı!")}
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
                    <span>Hesap Oluştur</span>
                  )}
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Zaten hesabınız var mı?{" "}
                  <Link
                    to="/login"
                    className="text-purple-700 font-medium hover:text-purple-900 hover:underline"
                  >
                    Giriş yapın
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
