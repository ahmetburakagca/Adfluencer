export interface SignupFormValues {
  role: number; // 0: influencer, 1: company
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  followerCount?: number | null;
  category?: string | null;
  photo?: File | null;
}
