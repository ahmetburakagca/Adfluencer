import { useLocation } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Campaign } from "../../types";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { ContentCreatorPicker } from "../../components/Company/ContentCreatorPicker";
import InvitedContentCreators from "../../components/Company/InvitedContentCreators";
import { classNames } from "primereact/utils";
import { MdCampaign } from "react-icons/md";

interface FormErrors {
  title?: string;
  description?: string;
  budget?: string;
  maxCapacity?: string;
}

export const ManageCampaignPage = () => {
  const toast = useRef<Toast>(null);
  const { campaign } = useLocation().state as { campaign: Campaign };
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    budget: campaign.budget || 0,
    status: campaign.status,
    maxCapacity: campaign.maxCapacity,
    isActive: campaign.isActive,
  });

  const statusOptions = [
    { label: "Aktif", value: 0 },
    { label: "Pasif", value: 1 },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Kampanya başlığı zorunludur";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Kampanya açıklaması zorunludur";
    }

    if (formData.budget <= 0) {
      newErrors.budget = "Bütçe 0'dan büyük olmalıdır";
    }

    if (formData.maxCapacity <= 0) {
      newErrors.maxCapacity = "Maksimum kapasite 0'dan büyük olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Hata mesajını temizle
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Lütfen form alanlarını kontrol ediniz",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // API çağrısı burada yapılacak
      console.log("Form data:", formData);
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Kampanya başarıyla güncellendi",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Kampanya güncellenirken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Kampanya Yönetimi">
      <Toast ref={toast} />
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#6b21a8] mb-2 flex items-center gap-2">
              <MdCampaign className="text-4xl" />
              Kampanya Detayları
            </h1>
            <p className="text-gray-600">
              İçerik üreticileri ile çalışmak için davet ettiğiniz içerik
              üreticilerinin listesini görebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="field">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kampanya Başlığı
              </label>
              <InputText
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={classNames("w-full", {
                  "p-invalid": errors.title,
                })}
                aria-describedby="title-error"
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <small id="title-error" className="p-error block mt-1">
                  {errors.title}
                </small>
              )}
            </div>

            <div className="field">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Durum
              </label>
              <Dropdown
                id="status"
                name="status"
                value={formData.status}
                options={statusOptions}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.value }))
                }
                className="w-full"
                aria-label="Kampanya durumu"
              />
            </div>

            <div className="field">
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bütçe
              </label>
              <InputNumber
                id="budget"
                name="budget"
                value={formData.budget}
                onValueChange={(e) =>
                  setFormData((prev) => ({ ...prev, budget: e.value || 0 }))
                }
                mode="currency"
                currency="TRY"
                locale="tr-TR"
                className={classNames("w-full", {
                  "p-invalid": errors.budget,
                })}
                aria-describedby="budget-error"
                aria-invalid={!!errors.budget}
              />
              {errors.budget && (
                <small id="budget-error" className="p-error block mt-1">
                  {errors.budget}
                </small>
              )}
            </div>

            <div className="field">
              <label
                htmlFor="maxCapacity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maksimum Kapasite
              </label>
              <InputNumber
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onValueChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxCapacity: e.value || 0,
                  }))
                }
                min={1}
                className={classNames("w-full", {
                  "p-invalid": errors.maxCapacity,
                })}
                aria-describedby="maxCapacity-error"
                aria-invalid={!!errors.maxCapacity}
              />
              {errors.maxCapacity && (
                <small id="maxCapacity-error" className="p-error block mt-1">
                  {errors.maxCapacity}
                </small>
              )}
            </div>
          </div>

          <div className="field">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Kampanya Açıklaması
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={classNames("w-full", {
                "p-invalid": errors.description,
              })}
              aria-describedby="description-error"
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <small id="description-error" className="p-error block mt-1">
                {errors.description}
              </small>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              label="İçerik Üreticisi Davet Et"
              icon="pi pi-users"
              style={{
                background: "#ede9fe",
                color: "#6b21a8",
                border: "1px solid #a78bfa",
                borderRadius: "8px",
                fontWeight: 500,
              }}
              onClick={() => setShowCreatorModal(true)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              label="Değişiklikleri Kaydet"
              icon="pi pi-check"
              style={{
                background: "#6b21a8",
                color: "#ede9fe",
                border: "1px solid #a78bfa",
                borderRadius: "8px",
                fontWeight: 500,
              }}
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </form>
      </Card>

      <ContentCreatorPicker
        campaignId={campaign.id}
        visible={showCreatorModal}
        onHide={() => setShowCreatorModal(false)}
      />
      <InvitedContentCreators campaignId={campaign.id} />
    </AppLayout>
  );
};
