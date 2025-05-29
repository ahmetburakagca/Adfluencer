export type UserRole = "Adversiter" | "ContentCreator";

export interface User {
  id: number;
  username: string;
  email: string;
  role: number;
  photo?: string;
  photoUrl?: string;
}

export interface ContentCreator extends User {
  role: 1;
  category: string;
  followerCount: number;
  score: number;
  avgLikes: number;
  posts: number;
  totalLikes: number;
  newPostAvgLike: number;
  engagement60Day: number;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  budget?: number;
  status: number;
  maxCapacity: number;
  advertiserId: number;
  advertiser: Adversiter;
  invitations?: Invitation[];
  applications?: Application[];
  isActive: boolean;
}

export interface Adversiter extends User {
  role: 0;
}

export interface CampaignListing {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  shortDescription: string;
  payment: string;
  requirements: string[];
  createdAt: string;
  price: number;
  companyDescription: string;
}

export interface Application {
  id: number;
  title: string;
  campaignId: number;
  advertiserId:number;
  applicationDate: string;
  status: 0 | 1 | 2;
  advertiserName?:string;
}
export type ApplicationStatus = "Beklemede" | "Kabul Edildi" | "Reddedildi";

export interface Invitation {
  id: number;
  campaignId: number;
  contentCreatorId: number;
  status: 0 | 1 | 2;
  advertiserId: number;
}

export interface Agreement {
  id: number;
  campaignId: number;
  contentCreatorId: number;
  advertiserId: number;
  status: 0 | 1;
  currency: string;
  budget: number;
  title: string;
  description: string;
  agreementDate: string;
}

export interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt?: string;
  agreementId: number;
}
