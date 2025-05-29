import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { PlusIcon, Megaphone, Users, DollarSign, Info } from "lucide-react";
import { CampaignService } from "../../services/Campaign";
import { Toast } from "primereact/toast";
import { useToast } from "../../utils/toaster";

// Types
interface FormValues {
  title: string;
  description: string;
  budget: number;
  maxCapacity: number;
}

// Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Başlık zorunludur"),
  description: Yup.string().required("Açıklama zorunludur"),
  budget: Yup.number()
    .required("Bütçe zorunludur")
    .min(0, "Bütçe 0'dan büyük olmalıdır"),
  maxCapacity: Yup.number()
    .required("Maksimum kapasite zorunludur")
    .min(1, "En az 1 kişi olmalıdır"),
});

// Components
const FormField = ({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="field">
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    {children}
    {error && <small className="p-error mt-1 block">{error}</small>}
  </div>
);

export const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const campaignService = new CampaignService();
  const { toast, showToast } = useToast();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      budget: 0,
      maxCapacity: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await campaignService.createCampaign(values);
        showToast("success", "Başarılı!", "Kampanya başarıyla oluşturuldu.");
        setTimeout(() => {
          navigate("/campaigns");
        }, 1000);
      } catch (error) {
        console.error("Kampanya oluşturma hatası:", error);
        showToast("error", "Hata!", "Kampanya oluşturulurken bir hata oluştu.");
      }
    },
  });

  const isFormFieldValid = (name: keyof FormValues) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name: keyof FormValues) => {
    return isFormFieldValid(name) ? formik.errors[name] : undefined;
  };

  return (
    <AppLayout title="Yeni Kampanya Oluştur" showBack>
      <Toast ref={toast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className=" border border-purple-100 shadow-lg">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Megaphone className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Yeni Kampanya Oluştur
                </h1>
                <p className="text-gray-600 mt-1">
                  İçerik üreticileri için yeni bir kampanya oluşturun
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    İçerik Üreticileri
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Hedef kitlenize uygun içerik üreticileri ile çalışın
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    Bütçe Yönetimi
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Kampanya bütçenizi etkin şekilde yönetin
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Detaylı Bilgi</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Kampanya detaylarınızı net bir şekilde belirtin
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FormField
                label="Kampanya Başlığı"
                error={getFormErrorMessage("title") as string}
              >
                <InputText
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  className={classNames(
                    "w-full p-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200",
                    {
                      "p-invalid border-red-300 focus:border-red-500 focus:ring-red-200":
                        isFormFieldValid("title"),
                    }
                  )}
                  placeholder="Örn: Yaz Koleksiyonu Tanıtım Kampanyası"
                />
              </FormField>

              <FormField
                label="Kampanya Açıklaması"
                error={getFormErrorMessage("description") as string}
              >
                <InputTextarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  rows={4}
                  className={classNames(
                    "w-full p-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200",
                    {
                      "p-invalid border-red-300 focus:border-red-500 focus:ring-red-200":
                        isFormFieldValid("description"),
                    }
                  )}
                  placeholder="Kampanyanın detaylarını buraya yazın..."
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Kampanya Bütçesi"
                  error={getFormErrorMessage("budget") as string}
                >
                  <InputNumber
                    id="budget"
                    name="budget"
                    value={formik.values.budget}
                    onValueChange={(e) =>
                      formik.setFieldValue("budget", e.value)
                    }
                    mode="currency"
                    currency="TRY"
                    locale="tr-TR"
                    className={classNames(
                      "w-full p-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200",
                      {
                        "p-invalid border-red-300 focus:border-red-500 focus:ring-red-200":
                          isFormFieldValid("budget"),
                      }
                    )}
                  />
                </FormField>

                <FormField
                  label="Maksimum İçerik Üretici Sayısı"
                  error={getFormErrorMessage("maxCapacity") as string}
                >
                  <InputNumber
                    id="maxCapacity"
                    name="maxCapacity"
                    value={formik.values.maxCapacity}
                    onValueChange={(e) =>
                      formik.setFieldValue("maxCapacity", e.value)
                    }
                    min={1}
                    className={classNames(
                      "w-full p-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200",
                      {
                        "p-invalid border-red-300 focus:border-red-500 focus:ring-red-200":
                          isFormFieldValid("maxCapacity"),
                      }
                    )}
                  />
                </FormField>
              </div>

              <CardFooter className="flex justify-end gap-3 pt-6 border-t border-purple-100 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Kampanyayı Oluştur
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </AppLayout>
  );
};
