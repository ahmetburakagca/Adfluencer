import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Campaign } from "../../types";
import { CheckCircle, Building2, FileText, ListChecks } from "lucide-react";
import { CampaignService } from "../../services/Campaign";
import { Toast } from "primereact/toast";

interface LocationState {
  campaign: Campaign;
}

export const CampaignDetailPage = () => {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const campaignService = new CampaignService();

  const campaign = (location.state as LocationState)?.campaign;

  if (!campaign) {
    navigate("/jobs");
    return null;
  }

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await campaignService.applyToCampaign(campaign.id);
      if (response.status === "error") {
        toast.current?.show({
          severity: "error",
          summary: "Hata!",
          detail: "Başvurunuz zaten gönderildi",
          life: 3000,
        });
      } else {
        setIsApplied(true);
        toast.current?.show({
          severity: "success",
          summary: "Başarılı!",
          detail: "Başvurunuz başarıyla gönderildi",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Başvuru yapılırken hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata!",
        detail: "Başvuru yapılırken bir hata oluştu.",
        life: 3000,
      });
    } finally {
      setIsApplying(false);
    }
  };

  const header = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
      <div className="flex-shrink-0">
        <img
          src={campaign.advertiser.photoUrl}
          alt={campaign.advertiser.username}
          className="w-20 h-20 rounded-xl shadow-lg border-4 border-white"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {campaign.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="w-4 h-4" />
          <p className="font-medium">{campaign.advertiser.username}</p>
        </div>
      </div>
    </div>
  );

  const footer = isApplied ? (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl text-center w-full border border-green-100">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
      <p className="font-semibold text-lg text-green-800">Başvurunuz Alındı!</p>
      <p className="text-sm mt-2 text-green-700">
        Başvurunuz değerlendirilecek ve size geri dönüş yapılacaktır.
      </p>
    </div>
  ) : (
    <Button
      loading={isApplying}
      onClick={handleApply}
      label={isApplying ? "Başvuruluyor..." : "Başvur"}
      className="p-button-primary w-full py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      icon={isApplying ? undefined : "pi pi-send"}
    />
  );

  return (
    <AppLayout title="İş Detayı" showBack>
      <Toast ref={toast} position="top-right" />
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <Card header={header} footer={footer} className="shadow-xl border-0">
          <div className="p-6">
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                <span className="text-blue-600 font-medium">Bütçe:</span>
                <Tag
                  value={campaign.budget}
                  severity="success"
                  className="text-sm"
                />
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                <span className="text-purple-600 font-medium">Kapasite:</span>
                <Tag
                  value={campaign.maxCapacity}
                  severity="info"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  İş Tanımı
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {campaign.description}
                </p>
              </div>
            </div>

            <Divider className="my-8" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Gereksinimler
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <ul className="space-y-3">
                  {campaign.applications?.map((application, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>{application.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
