import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { ContentCreator } from "../../types";
import { Badge } from "../ui/Badge";
import { Star, Users, Tag, TrendingUp } from "lucide-react";

export const InfluencerCard = ({
  influencer,
}: {
  influencer: ContentCreator;
}) => {
  return (
    <Link to={`/influencers/${influencer.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 h-full overflow-hidden bg-gradient-to-b from-white to-purple-50 border border-purple-100">
        <div className="px-4 py-3 bg-gradient-to-r from-purple-700 to-purple-500 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <h3 className="text-sm font-medium text-white">
                İçerik Üreticisi
              </h3>
            </div>
            {influencer.score !== null && influencer.score !== 0 && (
              <Badge className="bg-white/20 text-white border border-white/30 flex items-center gap-1">
                <Star className="w-3 h-3" />
                {influencer.score}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-center p-6 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-purple-300/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
            <img
              src={influencer.photo || influencer.photoUrl || "public/user.png"}
              alt={influencer.username}
              className="relative w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-center">
            <h2 className="font-semibold text-lg truncate bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">
              {influencer.username}
            </h2>
            <p className="text-sm text-purple-600/70 truncate">
              {influencer.email}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {influencer.category && (
              <Badge
                variant="default"
                className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200"
              >
                <Tag className="w-3.5 h-3.5" />
                {influencer.category}
              </Badge>
            )}
            {influencer.followerCount && (
              <Badge
                variant="default"
                className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200"
              >
                <Users className="w-3.5 h-3.5" />
                {influencer.followerCount.toLocaleString()} Takipçi
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
