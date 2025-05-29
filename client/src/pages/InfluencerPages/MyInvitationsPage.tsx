import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { CampaignService } from "../../services/Campaign";
import { Invitation } from "../../types";
import { AppLayout } from "../../components/layout/AppLayout";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

const MyInvitationsPage = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const campaignService = new CampaignService();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getMyInvitations();
      console.log(response);
      setInvitations(response);
    } catch (error) {
      console.error("Davetler yüklenirken hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Davetler yüklenirken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
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
  const updateStatus = async (invitation: Invitation, status: number) => {
    console.log(invitation.contentCreatorId, invitation.advertiserId, invitation.campaignId);
    const agreementExists = await validateAgreement(invitation.contentCreatorId, invitation.advertiserId, invitation.campaignId);
    console.log(agreementExists);
    if (agreementExists) {
      toast.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Bu davet için zaten bir anlaşma var. Durum değiştirilemez.",
        life: 3000,
      });
      return;
    }
    try {
      const response = await campaignService.updateInvitationStatus(
        invitation.id,
        status
      );
      console.log(response);
      fetchInvitations();
    } catch (error) {
      console.error("Durum güncellenirken hata oluştu:", error);
    }
  };

  const statusBodyTemplate = (rowData: Invitation) => {
    const statusOptions = [
      { label: "Beklemede", value: 0 },
      { label: "Kabul Edildi", value: 1 },
      { label: "Reddedildi", value: 2 },
    ];

    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-sm `}>
          <Dropdown
            value={rowData.status}
            options={statusOptions}
            onChange={(e) => updateStatus(rowData, e.value)}
            optionLabel="label"
            optionValue="value"
          />
        </span>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <Toast ref={toast} />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Davetlerim</h1>
          <DataTable
            value={invitations}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            className="p-datatable-sm"
            emptyMessage="Henüz davet bulunmuyor"
          >
            <Column
              field="title"
              header="Kampanya"
              sortable
              className="min-w-[200px]"
            />
            <Column
              field="description"
              header="Açıklama"
              className="min-w-[300px]"
            />
            <Column field="budget" header="Bütçe" className="min-w-[150px]" />
            <Column
              field="status"
              header="Durum"
              body={statusBodyTemplate}
              sortable
            />
          </DataTable>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyInvitationsPage;
