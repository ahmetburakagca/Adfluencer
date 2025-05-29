import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Campaign } from "../../types";

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  return (
    <Link
      to={`/campaign/${campaign.id}`}
      state={{ campaign }}
      className="block transition-all duration-300 hover:scale-[1.02]"
      aria-label={`${campaign.title} kampanyasına git`}
    >
      <Card className="overflow-hidden border rounded-xl border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={campaign.advertiser.photoUrl || "/public/user.png"}
                alt={`${campaign.advertiser.username} profil fotoğrafı`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg text-gray-900 truncate">
                {campaign.title}
              </h2>
              <p className="text-sm text-gray-600 truncate">
                {campaign.advertiser.username}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {campaign.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              {campaign.budget}
            </Badge>
            <span className="text-xs text-gray-500">Detayları görüntüle →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
