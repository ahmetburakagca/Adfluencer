import { AppLayout } from "../../../components/layout/AppLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { CheckCircle2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="Ödeme Başarılı">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Ödeme Başarıyla Tamamlandı
              </h1>

              <p className="text-gray-600 mb-8">
                Ödemeniz başarıyla gerçekleştirildi. Kampanyanız artık aktif
                durumda.
              </p>

              <Button
                onClick={() => navigate("/my-campaigns")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 mx-auto"
              >
                <Home className="w-5 h-5" />
                Kampanyalarıma Dön
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SuccessPage;
