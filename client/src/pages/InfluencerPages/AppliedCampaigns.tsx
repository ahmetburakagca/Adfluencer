import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CheckCircle2, XCircle, Clock3, Briefcase } from "lucide-react";
import { CampaignService } from "../../services/Campaign";
import { UserService } from "../../services/UserService";
import { Application } from "../../types";
import { useNavigate } from "react-router-dom";

type ApplicationStatus = "Beklemede" | "Kabul Edildi" | "Reddedildi";

export const AppliedCampaigns = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const campaignService = new CampaignService();
  const userService=new UserService();
  const navigate = useNavigate();

  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await campaignService.getMyApplications();
      console.log(response)

      // 1. Tüm advertiserId'leri topla
      const advertiserIds = [...new Set(response.map(app => app.advertiserId))];

      // 2. Her advertiserId için user çek
      const advertiserMap: Record<number, string> = {};
      await Promise.all(
        advertiserIds.map(async (id) => {
          const res = await userService.getUserById(id);
          advertiserMap[id] = res.username;
        })
      );

      // 3. advertiserName alanını eşleştir
      const enriched = response.map(app => ({
        ...app,
        advertiserName: advertiserMap[app.advertiserId] || "Bilinmiyor"
      }));
      console.log(enriched)

      setApplications(enriched);
    } catch (error) {
      console.error("Başvuru verileri alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchApplications();
  }, []);

  const getStatusText = (status: 0 | 1 | 2): ApplicationStatus => {
    const statusMap: Record<number, ApplicationStatus> = {
      0: "Beklemede",
      1: "Kabul Edildi",
      2: "Reddedildi",
    };
    return statusMap[status];
  };

  const getStatusCounts = () => {
    return applications.reduce(
      (acc, application) => {
        const status = getStatusText(application.status);
        acc[status]++;
        return acc;
      },
      { Beklemede: 0, "Kabul Edildi": 0, Reddedildi: 0 } as Record<
        ApplicationStatus,
        number
      >
    );
  };

  const statusCounts = getStatusCounts();
  
  

  const emptyTemplate = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Henüz Başvuru Yapmadınız
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Şu anda başvurduğunuz bir kampanya bulunmuyor. Hemen yeni kampanyaları
          keşfedin ve başvurunuzu yapın!
        </p>
        <Button
          onClick={() => navigate("/jobs")}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
        >
          <Briefcase className="w-5 h-5" />
          Kampanyaları Keşfet
        </Button>
      </div>
    );
  };
  const statusMap: Record<0 | 1 | 2, ApplicationStatus> = {
  0: "Beklemede",
  1: "Kabul Edildi",
  2: "Reddedildi",
};

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Başvurduğum Kampanyalar
          </h1>
          <p className="text-gray-600">
            Kampanya başvurularınızı ve durumlarını buradan takip edebilirsiniz.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Geri Dön
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bekleyen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statusCounts.Beklemede}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kabul Edilen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statusCounts["Kabul Edildi"]}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reddedilen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statusCounts.Reddedildi}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          value={applications}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage={emptyTemplate}
          className="p-datatable-custom"
          loading={loading}
        >
          <Column
            field="title"
            header="Kampanya"
            sortable
            className="font-medium"
          />
          <Column field="advertiserName" header="Şirket" sortable />
          <Column
            field="status"
            header="Durum"
            sortable
            body={(rowData) => {
              const status = getStatusText(rowData.status);
              const statusConfig = {
                Beklemede: {
                  icon: <Clock3 className="w-4 h-4 text-yellow-600" />,
                  className: "bg-yellow-50 text-yellow-700",
                },
                "Kabul Edildi": {
                  icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
                  className: "bg-green-50 text-green-700",
                },
                Reddedildi: {
                  icon: <XCircle className="w-4 h-4 text-red-600" />,
                  className: "bg-red-50 text-red-700",
                },
              };

              return (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm flex items-center gap-1.5 ${statusConfig[status].className}`}
                  >
                    {statusConfig[status].icon}
                    {status}
                  </span>
                </div>
              );
            }}
          />
        </DataTable>
      </div>
    </div>
  );
};
