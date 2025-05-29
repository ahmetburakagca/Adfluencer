import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { CampaignService } from "../../services/Campaign";
import { AppLayout } from "../../components/layout/AppLayout";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Status seçenekleri için interface
interface StatusOption {
  label: string;
  value: number;
  severity: string;
}

// Backend'den gelen Application tipini genişletiyoruz
interface ApplicationWithCreator {
  id: number;
  campaignId: number;
  campaignName: string;
  contentCreator: {
    id: number;
    username: string;
    photoUrl: string;
  };
  status: number;
  applicationDate: string;
  advertiserId: number;
}

const MyApplicationPage = () => {
  const [applications, setApplications] = useState<ApplicationWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [disabledStatusIds, setDisabledStatusIds] = useState<Set<number>>(new Set());
  const toast = useRef<Toast>(null);
  const campaignService = new CampaignService();
  const navigate = useNavigate();

  // Status seçenekleri
  const statusOptions: StatusOption[] = [
    { label: "Beklemede", value: 0, severity: "warning" },
    { label: "Kabul Edildi", value: 1, severity: "success" },
    { label: "Reddedildi", value: 2, severity: "danger" }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAllApplications();
      console.log(response);  
      // Mapping: response'daki alanları tabloya uygun hale getir
      const mapped = response.map((item: any) => ({
        id: item.id,
        campaignId: item.campaignId,
        campaignName: item.campaignName || item.title, // fallback for title
        contentCreator: {
          id: item.contentCreator?.id,
          username: item.contentCreator?.username,
          photoUrl: item.contentCreator?.photoUrl,
        },
        status: item.status,
        applicationDate: item.applicationDate,
        advertiserId: item.advertiserId,
      }));
      setApplications(mapped);
    } catch (error) {
      console.error("Başvurular yüklenirken hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Başvurular yüklenirken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusSeverity = (status: number) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.severity || "info";
  };

  const getStatusLabel = (status: number) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || "Bilinmiyor";
  };

  // validate-agreement endpointine istek atan fonksiyon
  const validateAgreement = async (userId1: number, userId2: number, campaignId: number) => {
    try {
      const response = await axios.get("https://localhost:5000/Campaigns/validate-agreement", {
        params: { userId1, userId2, campaignId }
      });
      return response.data?.isMatch === true;
    } catch (error) {
      console.error("validate-agreement hatası:", error);
      return false;
    }
  };

  const handleStatusChange = async (newStatus: number, application: ApplicationWithCreator) => {
    // validate-agreement kontrolü
    console.log(application.contentCreator.id, application.advertiserId, application.campaignId);
    const agreementExists = await validateAgreement(application.contentCreator.id, application.advertiserId, application.campaignId);
    console.log(agreementExists);
    if (agreementExists) {
      toast.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Bu başvuru için zaten bir anlaşma var. Durum değiştirilemez.",
        life: 3000,
      });
      setDisabledStatusIds(prev => new Set([...prev, application.id]));
      return;
    }
    try {
      await campaignService.updateApplicationStatus(
        application.campaignId,
        application.id,
        newStatus
      );
      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Başvuru durumu güncellendi",
        life: 3000,
      });
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === application.id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Durum güncellenirken hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Durum güncellenirken bir hata oluştu",
        life: 3000,
      });
    }
  };

  const contentCreatorBodyTemplate = (rowData: ApplicationWithCreator) => {
    return (
      <div
        className="flex items-center gap-2 cursor-pointer hover:underline"
        onClick={() => navigate(`/influencers/${rowData.contentCreator.id}`)}
        title="Profili Gör"
      >
        <img
          src={rowData.contentCreator?.photoUrl || "/default-avatar.png"}
          alt={rowData.contentCreator?.username}
          className="w-8 h-8 rounded-full"
        />
        <span>{rowData.contentCreator?.username}</span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: ApplicationWithCreator) => {
    const isDisabled = disabledStatusIds.has(rowData.id);
    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => handleStatusChange(e.value, rowData)}
        optionLabel="label"
        className="w-full md:w-14rem"
        pt={{
          root: { className: 'min-w-[200px]' }
        }}
        disabled={isDisabled}
      />
    );
  };

  // Başvuru tarihi için formatlayıcı
  const applicationDateBodyTemplate = (rowData: ApplicationWithCreator) => {
    const date = new Date(rowData.applicationDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <Toast ref={toast} />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Gelen Başvurular</h1>
          <DataTable
            value={applications}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            className="p-datatable-sm"
            emptyMessage="Henüz başvuru bulunmuyor"
          >
            <Column
              field="campaignName"
              header="Kampanya"
              sortable
              className="min-w-[200px]"
            />
            <Column
              header="İçerik Üretici"
              body={contentCreatorBodyTemplate}
              className="min-w-[200px]"
            />
            <Column
              field="status"
              header="Durum"
              body={statusBodyTemplate}
              sortable
              className="min-w-[150px]"
            />
            <Column
              field="applicationDate"
              header="Başvuru Tarihi"
              body={applicationDateBodyTemplate}
              sortable
              className="min-w-[200px]"
            />
          </DataTable>
        </div>
      </div>
    </AppLayout>
  );
};

export { MyApplicationPage };
