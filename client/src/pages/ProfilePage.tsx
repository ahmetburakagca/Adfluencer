import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { InfluencerProfile } from "./ProfilePages/InfluencerProfile";
import { CompanyProfile } from "./ProfilePages/CompanyProfile";
import { UserRole } from "../types";

export const ProfilePage = () => {
  const { user } = useAuth();
  const getUserRole = (role: number): UserRole => {
    return role === 0 ? "Adversiter" : "ContentCreator";
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout title="Profil">
      {getUserRole(Number(user.role)) === "ContentCreator" ? (
        <InfluencerProfile />
      ) : (
        <CompanyProfile />
      )}
    </AppLayout>
  );
};
