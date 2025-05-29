import { Toast } from "primereact/toast";
import { useRef } from "react";

export const useToast = () => {
  const toast = useRef<Toast>(null);

  const showToast = (
    severity: "success" | "error" | "info" | "warn",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  return { toast, showToast };
};
