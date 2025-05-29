import { BaseService } from "./BaseService";
import { Campaign, Application, Invitation, Agreement } from "../types";

interface CreateCampaignRequest {
  title: string;
  description: string;
  budget: number;
  maxCapacity: number;
}

export class CampaignService extends BaseService {
  constructor() {
    super("https://localhost:5000/Campaigns");
  }

  async createCampaign(campaign: CreateCampaignRequest): Promise<Campaign> {
    return this.post<Campaign>("", campaign);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return this.get<Campaign[]>("all");
  }
  async getAllApplications(): Promise<Application[]> {
    return this.get<Application[]>("/all-applications");
  }

  async inviteContentCreator(
    campaignId: number,
    contentCreatorId: number
  ): Promise<void> {
    return this.post<void>(`/${campaignId}/invite/${contentCreatorId}`);
  }

  async applyToCampaign(
    campaignId: number
  ): Promise<{ status: string; message: string }> {
    return this.post<{ status: string; message: string }>(
      `/${campaignId}/apply`
    );
  }

  async getMyApplications(): Promise<Application[]> {
    return this.get<Application[]>("/my-applications");
  }

  async getCampaignApplications(campaignId: number): Promise<Application[]> {
    return this.get<Application[]>(`/${campaignId}/applications`);
  }

  async updateApplicationStatus(
    campaignId: number,
    applicationId: number,
    status: number
  ): Promise<void> {
    return this.put<void>(
      `/${campaignId}/applications/${applicationId}/status`,
      { status }
    );
  }

  async updateInvitationStatus(
    invitationId: number,
    status: number
  ): Promise<void> {
    return this.put<void>(`/invitations/${invitationId}/status`, { status });
  }

  async getMyInvitations(): Promise<Invitation[]> {
    return this.get<Invitation[]>("/my-invitations");
  }

  async getCampaignInvitations(campaignId: number): Promise<Invitation[]> {
    return this.get<Invitation[]>(`/${campaignId}/invitations`);
  }

  async getMyAgreements(): Promise<Agreement[]> {
    return this.get<Agreement[]>("/my-agreements");
  }

  async updateAgreementPayment(
    agreementId: number,
    paymentData: {
      amount: number;
      currency: string;
      status: number;
    }
  ): Promise<void> {
    return this.put<void>(`/agreements/${agreementId}/payment`, paymentData);
  }

  async validateAgreement(
    agreementId: number,
    validationCode?: string
  ): Promise<void> {
    const params = new URLSearchParams();
    if (validationCode) params.append("validationCode", validationCode);
    return this.get<void>(`/validate-agreement?${params.toString()}`);
  }

  async getUserCampaigns(): Promise<{ data: Campaign[] }> {
    return this.get<{ data: Campaign[] }>(`/my-campaigns`);
  }

  async createMultipleCampaigns(
    campaigns: Partial<Campaign>[]
  ): Promise<Campaign[]> {
    return this.post<Campaign[]>("/multiple", campaigns);
  }
}
