export type UserRole = "influencer" | "company";

export interface User {
  id: number;
  username: string;
  email: string;
  role: number;
  followerCount: number | null;
  category: string | null;
  score: number | null;
  photoUrl?: string;
}

export interface ContentCreator extends User {
  platforms: string[];
  followers: {
    instagram?: number;
    tiktok?: number;
    youtube?: number;
    twitter?: number;
  };
  engagementRate: number;
}

export interface Influencer extends Omit<User, "role"> {
  role: 1;
  bio: string;
  platforms: string[];
  engagementRate: number;
  previousCampaigns: Campaign[];
}

export interface Company extends Omit<User, "role"> {
  role: 0;
  logo: string;
  about: string;
  industry: string;
  jobListings: string[];
}

export interface JobListing {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo: string;
  title: string;
  shortDescription: string;
  description: string;
  payment: string;
  requirements: string[];
  createdAt: string;
  companyType: string;
  platform: "instagram" | "youtube" | "twitter" | "tiktok";
  price: number;
  companyDescription: string;
}

export interface Campaign {
  status: 0 | 1;
  id: number;
  companyId: number;
  companyName: string;
  title: string;
  platform: string;
  engagement: number;
  date: string;
}

export interface Invitation {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: 0 | 1 | 2;
  campaignId: number;
  contentCreatorId: number;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
}
