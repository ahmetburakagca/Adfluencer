import { useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Campaign } from "../../types";
import { CampaignService } from "../../services/Campaign";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../utils/toaster";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { MdCampaign } from "react-icons/md";
export const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const campaignService = new CampaignService();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      if (!user?.id) return;
      const response: { data: Campaign[] } =
        await campaignService.getUserCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error("Kampanyalar yüklenirken hata oluştu:", error);
      showToast("error", "Hata!", "Kampanyalar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800";
      case 1:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Aktif";
      case 1:
        return "Pasif";
      default:
        return "Bilinmiyor";
    }
  };

  const formatMoney = (value: number | undefined) => {
    if (!value) return "0 TL";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AppLayout title="Kampanyalarım">
      <Toast ref={toast} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-8 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#6b21a8] mb-2 flex items-center gap-2">
                <MdCampaign className="text-4xl" />
                Kampanyalarım
              </h1>
              <p className="text-gray-600">
                İçerik üreticileri ile çalışmak için kampanyalarınızı yönetin
              </p>
            </div>
            <Link to="/create-campaign">
              <Button
                variant="primary"
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5" />
                Yeni Kampanya
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="text-center py-12">
            <CardBody>
              <div className="flex flex-col items-center rounded-xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Henüz kampanyanız yok
                </h3>
                <p className="text-gray-600 mb-6">
                  İçerik üreticileri ile çalışmak için hemen yeni bir kampanya
                  oluşturun.
                </p>
                <Link to="/create-campaign">
                  <Button
                    variant="primary"
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Kampanya Oluştur
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="h-full hover:shadow-lg  transition-all duration-300 cursor-pointer border border-purple-100"
                  onClick={() =>
                    navigate("/manage-campaign", {
                      state: { campaign },
                    })
                  }
                >
                  <CardHeader className="border-b border-purple-100  rounded-xl p-4 bg-purple-50">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {campaign.title}
                      </h3>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {getStatusText(campaign.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4">
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {campaign.description}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700 bg-purple-50 p-3 rounded-lg">
                        <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                        <span className="font-medium">
                          {formatMoney(campaign.budget)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-purple-50 p-3 rounded-lg">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        <span className="font-medium">
                          Maks. {campaign.maxCapacity} içerik üretici
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
