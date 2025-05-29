import { useState, useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/ui/Card";
import { ProgressSpinner } from "primereact/progressspinner";
import { InfluencerCard } from "../../components/Company/influencerCard";
import { AIInfluencerInfo } from "../../components/Company/AIInfluencerInfo";
import { FilterSidebar } from "../../components/Company/FilterSidebar";
import { UserService } from "../../services/UserService";
import { ContentCreator } from "../../types";
import { Filter } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { categories } from "../../data/constant";

const userService = new UserService();

const STORAGE_KEY = "influencer_filters";

type FilterState = {
  category: string;
  minFollowers: number | undefined;
  maxFollowers: number | undefined;
  minScore: number | undefined;
  maxScore: number | undefined;
};

export const InfluencersPage = () => {
  const [contentCreators, setContentCreators] = useState<ContentCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          category: "",
          minFollowers: undefined,
          maxFollowers: undefined,
          minScore: undefined,
          maxScore: undefined,
        };
  });

  const handleFilterChange = (
    field: keyof FilterState,
    value: string | number | undefined
  ) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const handleFilterReset = async (field: keyof FilterState) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: field === "category" ? "" : undefined,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
      return newFilters;
    });

    setIsLoading(true);
    setContentCreators([]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const creators = await userService.searchContentCreators({
        ...filters,
        [field]: field === "category" ? "" : undefined,
      });

      if (username.trim()) {
        const filteredCreators = creators.filter((creator) =>
          creator.username.toLowerCase().includes(username.toLowerCase())
        );
        setContentCreators(filteredCreators);
      } else {
        setContentCreators(creators);
      }
    } catch (error) {
      console.error("Filtreli arama hatası:", error);
      setContentCreators([]);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setContentCreators([]);

    try {
      if (username.trim()) {
        const isValid = await userService.validateUser(username);
        console.log(isValid);
        if (!isValid) {
          setContentCreators([]);
          setIsLoading(false);
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const creators = await userService.searchContentCreators(filters);

      if (username.trim()) {
        const filteredCreators = creators.filter((creator) =>
          creator.username.toLowerCase().includes(username.toLowerCase())
        );
        setContentCreators(filteredCreators);
      } else {
        setContentCreators(creators);
      }
    } catch (error) {
      console.error("Filtreli arama hatası:", error);
      setContentCreators([]);
    }
    setIsLoading(false);
  };

  const handleResetFilters = async () => {
    const defaultFilters = {
      category: "",
      minFollowers: undefined,
      maxFollowers: undefined,
      minScore: undefined,
      maxScore: undefined,
    };

    setFilters(defaultFilters);
    setUsername("");
    localStorage.removeItem(STORAGE_KEY);
    setIsLoading(true);
    setContentCreators([]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await userService.getContentCreators();
      setContentCreators(response.data);
    } catch (error) {
      console.error("Influencerler getirilirken hata oluştu:", error);
      setContentCreators([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setIsLoading(true);
        const savedFilters = localStorage.getItem(STORAGE_KEY);

        if (savedFilters) {
          const creators = await userService.searchContentCreators(
            JSON.parse(savedFilters)
          );
          setContentCreators(creators);
        } else {
          const response = await userService.getContentCreators();
          setContentCreators(response.data);
        }
      } catch (error) {
        console.error("Influencerler getirilirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppLayout title="Influencerler">
          <div className="flex flex-col gap-4">
            <AIInfluencerInfo />

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Yükleniyor...</div>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsSidebarOpen(true)}
                disabled
              >
                <Filter className="w-4 h-4" />
                Filtrele
              </Button>
            </div>

            <div className="flex justify-center items-center h-[50vh]">
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="4"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </div>
          </div>
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppLayout title="Influencerler">
        <div className="flex flex-col gap-4">
          <AIInfluencerInfo />

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-purple-900">
                Influencerler
              </h2>
              {Object.entries(filters).some(
                ([, value]) => value !== undefined && value !== ""
              ) && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-600 font-medium">
                      Filtreler
                    </span>
                    <div className="h-4 w-px bg-gray-300" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">
                        {
                          categories.find(
                            (cat) => cat.value === filters.category
                          )?.label
                        }
                      </span>
                    )}
                    {filters.minFollowers && (
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">
                        Min Takipçi: {filters.minFollowers}
                      </span>
                    )}
                    {filters.maxFollowers && (
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">
                        Max Takipçi: {filters.maxFollowers}
                      </span>
                    )}
                    {filters.minScore && (
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">
                        Min Skor: {filters.minScore}
                      </span>
                    )}
                    {filters.maxScore && (
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">
                        Max Skor: {filters.maxScore}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Filter className="w-4 h-4" />
              Filtrele
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentCreators.length > 0 ? (
                  contentCreators.map((influencer) => (
                    <InfluencerCard
                      key={influencer.id}
                      influencer={influencer}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <div className="text-center py-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Influencer Bulunamadı
                        </h3>
                        <p className="text-gray-600">
                          Aradığınız kriterlere uygun influencer
                          bulunmamaktadır.
                        </p>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>

          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            filters={filters}
            username={username}
            categories={categories}
            handleFilterChange={handleFilterChange}
            handleUsernameChange={setUsername}
            handleSearch={() => {
              handleSearch();
              setIsSidebarOpen(false);
            }}
            handleResetFilters={() => {
              handleResetFilters();
              setIsSidebarOpen(false);
            }}
            handleFilterReset={handleFilterReset}
          />
        </div>
      </AppLayout>
    </div>
  );
};
