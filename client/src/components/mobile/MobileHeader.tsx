import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const MobileHeader = () => {
  return (
    <Link
      to="/"
      className="md:hidden fixed top-4 left-4 flex items-center px-4 py-2.5 text-purple-700 font-bold text-xl hover:opacity-80 transition-opacity cursor-pointer"
    >
      <ArrowLeft height={24} width={24} />
    </Link>
  );
};
