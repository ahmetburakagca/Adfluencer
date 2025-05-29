import { X, Filter } from "lucide-react";
import { Button } from "../ui/Button";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-purple/theme.css";

type FilterState = {
  category: string;
  minFollowers: number | undefined;
  maxFollowers: number | undefined;
  minScore: number | undefined;
  maxScore: number | undefined;
};

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  username: string;
  categories: Array<{ label: string; value: string }>;
  handleFilterChange: (
    field: keyof FilterState,
    value: string | number | undefined
  ) => void;
  handleUsernameChange: (value: string) => void;
  handleSearch: () => void;
  handleResetFilters: () => void;
  handleFilterReset: (field: keyof FilterState) => void;
}

export const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  username,
  categories,
  handleFilterChange,
  handleUsernameChange,
  handleSearch,
  handleResetFilters,
  handleFilterReset,
}: FilterSidebarProps) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-[-4px_0_16px_rgba(107,70,193,0.08)] transform transition-transform duration-300 ease-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50/80 to-white">
          <div className="flex items-center gap-2.5">
            <Filter className="w-5 h-5 text-purple-700" />
            <h2 className="text-xl font-semibold text-purple-900">Filtreler</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-purple-600" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50/50 to-white">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === undefined || value === "") return null;
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full text-sm border border-purple-200 shadow-sm"
                >
                  <span className="text-purple-800 font-medium">
                    {key}: {value}
                  </span>
                  <X
                    className="w-4 h-4 text-purple-500 hover:text-purple-700 cursor-pointer transition-colors"
                    onClick={() => handleFilterReset(key as keyof FilterState)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-purple-50/20 to-white">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-900">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-300 text-purple-900 outline-none transition-all duration-200"
                placeholder="Kullanıcı adı ile ara..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-900">
                Kategori
              </label>
              <Dropdown
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.value)}
                options={categories}
                optionLabel="label"
                optionValue="value"
                placeholder="Kategori seçiniz"
                className="w-full"
                pt={{
                  root: { className: "border border-purple-200 rounded-lg" },
                  input: { className: "px-4 py-2.5 text-purple-900" },
                  trigger: { className: "px-4 py-2.5" },
                  panel: {
                    className: "border border-purple-200 rounded-lg shadow-lg",
                  },
                  item: {
                    className: "px-4 py-2 hover:bg-purple-50 text-purple-900",
                  },
                  emptyMessage: { className: "px-4 py-2 text-purple-400" },
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-900">
                Takipçi Aralığı
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={filters.minFollowers ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minFollowers",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-300 text-purple-900 outline-none transition-all duration-200"
                  placeholder="Min"
                  min={0}
                />
                <input
                  type="number"
                  value={filters.maxFollowers ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxFollowers",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-300 text-purple-900 outline-none transition-all duration-200"
                  placeholder="Max"
                  min={0}
                />
              </div>
            </div>

            {/* Score Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-900">
                Skor Aralığı
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={filters.minScore ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minScore",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-300 text-purple-900 outline-none transition-all duration-200"
                  placeholder="Min"
                  min={0}
                  max={100}
                />
                <input
                  type="number"
                  value={filters.maxScore ?? ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxScore",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-300 text-purple-900 outline-none transition-all duration-200"
                  placeholder="Max"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-100 p-6 bg-white">
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={handleResetFilters}
            >
              Sıfırla
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
              onClick={handleSearch}
            >
              Uygula
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
