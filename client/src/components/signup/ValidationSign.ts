import * as Yup from "yup";
export const SignupSchema = Yup.object().shape({
  role: Yup.string().required("Kullanıcı tipi seçiniz"),
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .required("Kullanıcı adı gerekli"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta adresi gerekli"),
  password: Yup.string()
    .max(8, "Şifre en fazla 8 karakter olmalıdır")
    .required("Şifre gerekli"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı gerekli"),
  followerCount: Yup.number()
    .min(0, "Takipçi sayısı negatif olamaz")
    .notRequired(),
  category: Yup.string().notRequired(),
});
