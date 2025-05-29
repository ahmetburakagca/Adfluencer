import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { UserService } from "../../services/UserService";
import { CampaignService } from "../../services/Campaign";
import { ContentCreator as ApiContentCreator } from "../../types";

export interface ContentCreator extends ApiContentCreator {
  isSelected: boolean;
}

interface ContentCreatorPickerProps {
  visible: boolean;
  onHide: () => void;
  campaignId: number;
}

export const ContentCreatorPicker = ({
  visible,
  onHide,
  campaignId,
}: ContentCreatorPickerProps) => {
  const toast = useRef<Toast>(null);
  const [selectedCreators, setSelectedCreators] = useState<ContentCreator[]>(
    []
  );
  const [creators, setCreators] = useState<ContentCreator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userService = new UserService();
  const campaignService = new CampaignService();
  const STORAGE_KEY = "contentCreatorFilters";

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setIsLoading(true);
        const savedFilters = localStorage.getItem(STORAGE_KEY);

        if (savedFilters) {
          const response = await userService.searchContentCreators(
            JSON.parse(savedFilters)
          );

          setCreators(
            response.map((creator) => ({
              ...creator,
              isSelected: false,
            }))
          );
        } else {
          const response = await userService.getContentCreators();
          setCreators(
            response.data.map((creator) => ({
              ...creator,
              isSelected: false,
            }))
          );
        }
      } catch (error) {
        console.error("Influencerler getirilirken hata oluştu:", error);
        toast.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "İçerik üreticileri yüklenirken bir hata oluştu",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const handleInviteCreators = async () => {
    if (selectedCreators.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen en az bir içerik üreticisi seçin",
        life: 3000,
      });
      return;
    }

    try {
      for (const creator of selectedCreators) {
        await campaignService.inviteContentCreator(campaignId, creator.id);
      }

      toast.current?.show({
        severity: "success",
        summary: "Başarılı",
        detail: "İçerik üreticileri başarıyla davet edildi",
        life: 3000,
      });

      onHide();
    } catch (error) {
      console.error("Davet işlemi sırasında hata oluştu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "İçerik üreticileri davet edilirken bir hata oluştu",
        life: 3000,
      });
    }
  };

  const creatorModalFooter = (
    <div className="flex justify-end space-x-4">
      <Button
        label="İptal"
        icon="pi pi-times"
        style={{
          background: "#ede9fe",
          color: "#6b21a8",
          border: "1px solid #a78bfa",
          borderRadius: "8px",
          fontWeight: 500,
        }}
        onClick={onHide}
      />
      <Button
        label="Davet Et"
        icon="pi pi-check"
        style={{
          background: "#6b21a8",
          color: "#ede9fe",
          border: "1px solid #a78bfa",
          borderRadius: "8px",
          fontWeight: 500,
        }}
        onClick={handleInviteCreators}
      />
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="İçerik Üreticisi Seç"
        visible={visible}
        headerStyle={{
          color: "#6b21a8",
        }}
        style={{ width: "80vw" }}
        footer={creatorModalFooter}
        onHide={onHide}
      >
        <DataTable
          value={creators}
          selection={selectedCreators}
          onSelectionChange={(e) => setSelectedCreators(e.value)}
          dataKey="id"
          className="p-datatable-sm"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          selectionMode="multiple"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column field="username" header="Kullanıcı Adı" sortable />
          <Column field="followerCount" header="Takipçi Sayısı" sortable />
          <Column field="category" header="Kategori" sortable />
          <Column field="score" header="Skor" sortable />
        </DataTable>
      </Dialog>
    </>
  );
};
