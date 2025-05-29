import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Invitation as InvitationType, User } from "../../types";
import { CampaignService } from "../../services/Campaign";
import { UserService } from "../../services/UserService";
import { Card } from "primereact/card";

const InvitedContentCreators = ({ campaignId }: { campaignId: number }) => {
  const [invitations, setInvitations] = useState<InvitationType[]>([]);
  const [creators, setCreators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const campaignService = new CampaignService();
  const userService = new UserService();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await campaignService.getCampaignInvitations(
          campaignId
        );
        const creatorIds = response.map(
          (invitation) => invitation.contentCreatorId
        );

        const creatorPromises = creatorIds.map((id) =>
          userService.getUserById(id)
        );
        const contentCreators = await Promise.all(creatorPromises);

        setCreators(contentCreators);
        setInvitations(response);
        setLoading(false);
      } catch (error) {
        console.error("Davetler yüklenirken hata oluştu:", error);
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [campaignId]);

  const getStatusSeverity = (status: number) => {
    switch (status) {
      case 0:
        return "success";
      case 1:
        return "danger";
      case 2:
      default:
        return "warning";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return "Kabul Edildi";
      case 2:
        return "Reddedildi";
      default:
        return "Beklemede";
    }
  };

  const statusBodyTemplate = (rowData: InvitationType) => {
    return (
      <Tag
        value={getStatusLabel(rowData.status)}
        severity={getStatusSeverity(rowData.status)}
        className="px-3 py-1"
      />
    );
  };

  const getStats = () => {
    const total = invitations.length;
    const accepted = invitations.filter((inv) => inv.status === 1).length;
    const rejected = invitations.filter((inv) => inv.status === 2).length;
    const pending = invitations.filter((inv) => inv.status === 0).length;

    return [
      {
        title: "Toplam Davet",
        value: total,
        icon: "pi pi-users",
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Kabul Edilen",
        value: accepted,
        icon: "pi pi-check-circle",
        color: "bg-green-50 text-green-600",
      },
      {
        title: "Reddedilen",
        value: rejected,
        icon: "pi pi-times-circle",
        color: "bg-red-50 text-red-600",
      },
      {
        title: "Bekleyen",
        value: pending,
        icon: "pi pi-clock",
        color: "bg-yellow-50 text-yellow-600",
      },
    ];
  };

  const creatorNameBodyTemplate = (rowData: InvitationType) => {
    const creator = creators.find((c) => c.id === rowData.contentCreatorId);
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
          {creator?.photo ? (
            <img
              src={creator.photo}
              alt={creator.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <i className="pi pi-user text-gray-500 text-xl" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {creator ? creator.username : "Bilinmeyen Kullanıcı"}
          </span>
          <span className="text-sm text-gray-500">
            @{creator?.username?.toLowerCase()}
          </span>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: InvitationType) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          className="hover:bg-red-50 transition-colors"
          aria-label="Daveti İptal Et"
          tooltip="Daveti İptal Et"
          tooltipOptions={{ position: "top" }}
          onClick={() => console.log("İptal edildi:", rowData.id)}
        />
      </div>
    );
  };

  const emptyMessageTemplate = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <i className="pi pi-users text-4xl mb-3" />
        <p className="text-lg font-medium">Henüz davet bulunmamaktadır</p>
        <p className="text-sm">
          İçerik üreticileri davet etmek için yukarıdaki butonu
          kullanabilirsiniz
        </p>
      </div>
    );
  };

  const loadingTemplate = () => {
    return (
      <div className="flex items-center justify-center py-8">
        <i className="pi pi-spin pi-spinner text-2xl text-gray-500" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#ede9fe]  rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <i className="pi pi-info-circle text-[#6b21a8] text-xl mt-1" />
          <div>
            <h3 className="text-[#6b21a8] font-medium mb-1">
              İçerik Üretici Davetleri Hakkında
            </h3>
            <p className="text-[#6b21a8] text-sm">
              Bu sayfada kampanyanıza davet ettiğiniz içerik üreticilerinin
              listesini görebilirsiniz. Davet durumlarını takip edebilir,
              gerekirse davetleri iptal edebilirsiniz. Kabul edilen davetler
              yeşil, reddedilenler kırmızı ve bekleyen davetler sarı renkte
              gösterilir.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getStats().map((stat, index) => (
          <Card key={index} className="shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <i className={`${stat.icon} text-xl`} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="card shadow-sm border border-gray-100 rounded-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#6b21a8]">
                Davet Edilen İçerik Üreticileri
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Kampanyaya davet edilen içerik üreticilerinin listesi ve
                durumları
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                icon="pi pi-refresh"
                rounded
                outlined
                severity="secondary"
                tooltip="Listeyi Yenile"
                tooltipOptions={{ position: "top" }}
                onClick={() => window.location.reload()}
              />
              <Button
                icon="pi pi-filter"
                rounded
                outlined
                severity="secondary"
                tooltip="Filtrele"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="pi pi-list" />
            <span>
              Aşağıdaki tabloda içerik üreticilerinin davet durumlarını
              görebilirsiniz. Her satırda içerik üreticisinin profil fotoğrafı,
              kullanıcı adı ve davet durumu yer alır.
            </span>
          </div>
        </div>

        <DataTable
          value={invitations}
          loading={loading}
          loadingIcon={loadingTemplate()}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage={emptyMessageTemplate()}
          className="p-4"
          rowClassName={() => "hover:bg-gray-50 transition-colors"}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          paginatorClassName="border-t border-gray-100"
        >
          <Column
            field="contentCreatorId"
            header={
              <div className="flex flex-col">
                <span>İçerik Üretici</span>
                <span className="text-xs text-gray-500 font-normal">
                  Kullanıcı adı ve profil bilgileri
                </span>
              </div>
            }
            body={creatorNameBodyTemplate}
            sortable
            className="py-4"
          />
          <Column
            field="status"
            header={
              <div className="flex flex-col">
                <span>Durum</span>
                <span className="text-xs text-gray-500 font-normal">
                  Davet durumu ve yanıt
                </span>
              </div>
            }
            body={statusBodyTemplate}
            sortable
            className="py-4"
          />
          <Column
            body={actionBodyTemplate}
            header={
              <div className="flex flex-col">
                <span>İşlemler</span>
                <span className="text-xs text-gray-500 font-normal">
                  Davet yönetimi
                </span>
              </div>
            }
            exportable={false}
            style={{ minWidth: "8rem" }}
            className="py-4"
          />
        </DataTable>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="pi pi-question-circle" />
            <span>
              Davet durumlarını değiştirmek veya yeni davetler eklemek için üst
              menüdeki ilgili butonları kullanabilirsiniz.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitedContentCreators;
