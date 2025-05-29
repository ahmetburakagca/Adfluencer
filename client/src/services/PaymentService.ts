import { BaseService } from "./BaseService";

export class PaymentService extends BaseService {
  constructor() {
    super("https://localhost:5000/payment");
  }

  async pay({
    aggrementId,
    amount,
  }: {
    aggrementId: number;
    amount: number;
  }): Promise<{ url: string }> {
    return await this.post<{ url: string }>("/", {
      aggrementId,
      amount,
      currency: "usd",
      description: "Payment for agreement",
      successUrl: "http://localhost:3000/payment/success",
      cancelUrl: "http://localhost:3000/payment/reject",
    });
  }
}
