import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { UserRole } from "./types";
import { getDashboardPath } from "./utils/navigation";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { LandingPage } from "./pages/LandingPage";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import ContentCreatorChatPage from "./pages/InfluencerPages/ChatPage";
import AdversiterChatPage from "./pages/CompanyPages/ChatPage";
import { JobsPage } from "./pages/InfluencerPages/JobsPage";
import { InfluencersPage } from "./pages/CompanyPages/InfluencersPage";
import { InfluencerDetailPage } from "./pages/CompanyPages/InfluencerDetailPage";
import { CreateCampaignPage } from "./pages/CompanyPages/CreateCampaignPage";
import { ProfilePage } from "./pages/ProfilePage";
import Footer from "./components/Footer";
import { PublicHeader } from "./components/headers/PublicHeader";
import { InfluencerHeader } from "./components/headers/InfluencerHeader";
import { CompanyHeader } from "./components/headers/CompanyHeader";
import { MyCampaigns } from "./pages/CompanyPages/MyCampaigns";
import { AppliedCampaigns } from "./pages/InfluencerPages/AppliedCampaigns";
import { CampaignDetailPage } from "./pages/InfluencerPages/CampaignDetailPage";
import { ManageCampaignPage } from "./pages/CompanyPages/ManageCampaignPage";
import MyInvitationsPage from "./pages/InfluencerPages/MyInvitationsPage";
import { MyApplicationPage } from "./pages/CompanyPages/MyApplicationPage";
import SuccessPage from "./pages/CompanyPages/Payment/Success";
import RejectPage from "./pages/CompanyPages/Payment/Reject";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getUserRole = (role: number): UserRole => {
    return role === 0 ? "Adversiter" : "ContentCreator";
  };

  if (user && location.pathname === "/") {
    return (
      <Navigate to={getDashboardPath(getUserRole(Number(user.role)))} replace />
    );
  }

  if (
    user &&
    (location.pathname === "/login" || location.pathname === "/signup")
  ) {
    return (
      <Navigate to={getDashboardPath(getUserRole(Number(user.role)))} replace />
    );
  }

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const renderHeader = () => {
    if (isAuthPage) {
      return null;
    }
    if (!user) {
      return <PublicHeader />;
    }
    return getUserRole(Number(user.role)) === "ContentCreator" ? (
      <InfluencerHeader />
    ) : (
      <CompanyHeader />
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {renderHeader()}
      <main className="flex-1">{children}</main>
      {location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        !user && <Footer />}
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  const getUserRole = (role: number): UserRole => {
    return role === 0 ? "Adversiter" : "ContentCreator";
  };

  const ProtectedRoute = ({
    children,
    allowedRoles,
  }: {
    children: React.ReactNode;
    allowedRoles: UserRole[];
  }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    const userRole = getUserRole(Number(user.role));
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={getDashboardPath(userRole)} replace />;
    }

    return <>{children}</>;
  };

  return (
    <PageLayout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={getDashboardPath(getUserRole(Number(user.role)))}
                replace
              />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/about"
          element={
            user ? (
              <Navigate
                to={getDashboardPath(getUserRole(Number(user.role)))}
                replace
              />
            ) : (
              <About />
            )
          }
        />
        <Route
          path="/pricing"
          element={
            user ? (
              <Navigate
                to={getDashboardPath(getUserRole(Number(user.role)))}
                replace
              />
            ) : (
              <Pricing />
            )
          }
        />

        <Route
          path="/chat/contentcreator"
          element={
            <ProtectedRoute allowedRoles={["ContentCreator"]}>
              <ContentCreatorChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/adversiter"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <AdversiterChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/reject"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <RejectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["ContentCreator"]}>
              <JobsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applied-campaigns"
          element={
            <ProtectedRoute allowedRoles={["ContentCreator"]}>
              <AppliedCampaigns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/influencers"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <InfluencersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/influencers/:id"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <InfluencerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <CreateCampaignPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-campaigns"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <MyCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-campaign"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <ManageCampaignPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <ProtectedRoute allowedRoles={["ContentCreator"]}>
              <CampaignDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/get-my-invitations"
          element={
            <ProtectedRoute allowedRoles={["ContentCreator"]}>
              <MyInvitationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={["Adversiter"]}>
              <MyApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["ContentCreator", "Adversiter"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PageLayout>
  );
};

export default AppRoutes;
