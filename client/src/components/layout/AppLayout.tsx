import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MiniChat from "../Company/MiniChat";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  requireAuth?: boolean;
}

export const AppLayout = ({
  children,
  title,
  showBack = false,
  requireAuth = true,
}: AppLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isNotChatPage = !location.pathname.includes("/chat/adversiter");

  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {title && (
        <header className="sticky top-0 z-10 bg-white shadow-sm ">
          <div className="flex items-center h-14 px-4">
            {showBack && (
              <button onClick={() => window.history.back()} className="mr-2">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>
      )}
      <main className="flex-1 p-4 pb-20 overflow-auto bg-gray-50">
        {children}
        {user?.role === 0 && isNotChatPage && <MiniChat />}
      </main>
    </div>
  );
};
