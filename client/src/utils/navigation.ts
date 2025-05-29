import { UserRole } from "../types";

export const getDashboardPath = (role: UserRole): string => {
  return role === "ContentCreator" ? "/jobs" : "/influencers";
};

export const getProfilePath = (role: UserRole): string => {
  return role === "ContentCreator" ? "/profile/influencer" : "/profile/company";
};
