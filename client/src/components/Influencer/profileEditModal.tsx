import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../../utils/toaster";
import { UserService } from "../../services/UserService";
import { categories } from "../../data/constant";
import { ContentCreator } from "../../types";
import * as Yup from "yup";
import { classNames } from "primereact/utils";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ContentCreator;
  onSuccess?: () => void;
}

interface FormState {
  photo: File | null;
  username: string;
  email: string;
  category: string;
  followerCount: string;
  score: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Kullanıcı adı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta adresi zorunludur"),
  category: Yup.string().required("Kategori seçimi zorunludur"),
  followerCount: Yup.string()
    .required("Takipçi sayısı zorunludur")
    .matches(/^\d+$/, "Takipçi sayısı sayısal olmalıdır"),
});

export const ProfileEditModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: ProfileEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState(initialData?.photoUrl || "");
  const { showToast } = useToast();
  const userService = new UserService();

  const [formState, setFormState] = useState<FormState>({
    photo: null,
    username: initialData?.username || "",
    email: initialData?.email || "",
    category: initialData?.category || "",
    followerCount: initialData?.followerCount?.toString() || "0",
    score: initialData?.score || 0,
  });

  const validateField = async (name: string, value: string) => {
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setFormErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { value: string; name: string }
  ) => {
    if ("target" in e) {
      const { name, value, files } = e.target;

      if (files?.[0]) {
        setFormState((prev) => ({ ...prev, photo: files[0] }));
        setPreviewUrl(URL.createObjectURL(files[0]));
        return;
      }

      const newValue = value;
      setFormState((prev) => ({ ...prev, [name]: newValue }));
      validateField(name, newValue);
    } else {
      setFormState((prev) => ({ ...prev, [e.name]: e.value }));
      validateField(e.name, e.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) return;

    try {
      await validationSchema.validate(formState, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFormErrors(errors);
        return;
      }
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "photo" && value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === "string") {
            formData.append(key, value);
          }
        }
      });

      await userService.updateUser(initialData.id, formData);
      showToast("success", "Başarılı", "Profil başarıyla güncellendi");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      showToast("error", "Hata", "Profil güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooter = () => (
    <div className="flex justify-end gap-2">
      <Button
        label="İptal"
        icon="pi pi-times"
        onClick={onClose}
        disabled={isLoading}
        style={{ backgroundColor: "#6b21a8", borderColor: "#6b21a8" }}
      />
      <Button
        label="Kaydet"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={isLoading}
        autoFocus
        style={{ backgroundColor: "#6b21a8", borderColor: "#6b21a8" }}
      />
    </div>
  );

  return (
    <Dialog
      header="Profili Düzenle"
      visible={isOpen}
      style={{ width: "450px" }}
      onHide={onClose}
      footer={renderFooter()}
      className="p-fluid"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="photo" className="block mb-2">
            Profil Resmi
          </label>
          <div className="flex flex-col items-center gap-4">
            <img
              src={previewUrl || "public/user.png"}
              alt="Profil önizleme"
              className="w-32 h-32 rounded-full object-cover"
            />
            <InputText
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>

        {[
          { id: "username", label: "Kullanıcı Adı", type: "text" },
          { id: "email", label: "E-posta", type: "email" },
          { id: "followerCount", label: "Takipçi Sayısı", type: "number" },
        ].map(({ id, label, type }) => (
          <div key={id} className="field">
            <label htmlFor={id} className="block mb-2">
              {label}
            </label>
            <InputText
              id={id}
              name={id}
              type={type}
              value={formState[id as keyof Omit<FormState, "photo">]}
              onChange={handleInputChange}
              placeholder={`${label} girin`}
              className={classNames("w-full", {
                "p-invalid": formErrors[id],
                "border-red-500": formErrors[id],
              })}
            />
            {formErrors[id] && (
              <small className="p-error">{formErrors[id]}</small>
            )}
          </div>
        ))}

        <div className="field">
          <label htmlFor="category" className="block mb-2">
            Kategori
          </label>
          <Dropdown
            id="category"
            name="category"
            value={formState.category}
            options={categories}
            onChange={(e) =>
              handleInputChange({ name: "category", value: e.value })
            }
            placeholder="Kategori seçin"
            className={classNames("w-full", {
              "p-invalid": formErrors.category,
              "border-red-500": formErrors.category,
            })}
          />
          {formErrors.category && (
            <small className="p-error">{formErrors.category}</small>
          )}
        </div>
      </form>
    </Dialog>
  );
};
