import { useState, useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { InfluencerHeader } from "../../components/headers/InfluencerHeader";
import { ProgressSpinner } from "primereact/progressspinner";
import { CampaignCard } from "../../components/Influencer/campaignCard";
import { PromotionSlider } from "../../components/slider";
import { Campaign } from "../../types";
import { CampaignService } from "../../services/Campaign";
export const JobsPage = () => {
  const [campaignListings, setCampaignListings] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const campaignService = new CampaignService();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await campaignService.getAllCampaigns();
        console.log(response);
        setCampaignListings(response);
        setIsLoading(false);
      } catch (error) {
        console.error("İş ilanları getirilirken hata oluştu:", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <InfluencerHeader />
        <AppLayout title="İş İlanları">
          <div className="flex justify-center items-center h-[50vh]">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="4"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <InfluencerHeader />
      <AppLayout title="İş İlanları">
        <div className="flex flex-col gap-8">
          <PromotionSlider />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaignListings.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};
