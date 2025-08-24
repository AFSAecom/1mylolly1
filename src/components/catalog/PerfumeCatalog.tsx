import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PerfumeCard from "./PerfumeCard";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

interface PerfumeType {
  codeProduit: string;
  nomLolly: string;
  nomParfumInspire: string;
  marqueInspire: string;
  genre: "homme" | "femme" | "mixte";
  saison: "été" | "hiver" | "toutes saisons";
  familleOlfactive: string;
  imageURL: string;
  active: boolean;
}

interface PerfumeCatalogProps {
  perfumes?: PerfumeType[];
  onPerfumeSelect?: (perfume: PerfumeType) => void;
  includeInactive?: boolean;
}

const PerfumeCatalog = ({
  perfumes,
  onPerfumeSelect = () => {},
  includeInactive = false,
}: PerfumeCatalogProps) => {
  // All useState hooks must be called before any early returns
  const [catalogPerfumes, setCatalogPerfumes] = useState<PerfumeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedSaison, setSelectedSaison] = useState<string | null>(null);
  const [selectedFamille, setSelectedFamille] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Function to load products directly from Supabase with timeout
  const loadProductsFromSupabase = async (page = 1) => {
    setLoading(true);
    console.log(`🔄 Loading products directly from Supabase (page ${page})...`);
    try {
      let query: any = supabase
        .from("products")
        .select(
          "code_produit, nom_lolly, nom_parfum_inspire, marque_inspire, genre, saison, famille_olfactive, image_url, active",
        )
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      if (!includeInactive) {
        query = query.eq("active", true);
      }

      // Create a timeout promise that rejects after 8 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000),
      );

      // Race the Supabase query against the timeout
      const result: any = await Promise.race([query, timeoutPromise]);

      const productsData = result?.data;
      const error = result?.error;

      if (error || !productsData) {
        console.error("Error loading products from Supabase:", error);
        // Fallback to default perfumes if Supabase fails
        setCatalogPerfumes(defaultPerfumes);
        return;
      }

      if (productsData.length > 0) {
        const formattedPerfumes = productsData.map((product: any) => ({
          codeProduit: product.code_produit,
          nomLolly: product.nom_lolly,
          nomParfumInspire: product.nom_parfum_inspire,
          marqueInspire: product.marque_inspire,
          genre: (product.genre as "homme" | "femme" | "mixte") || "mixte",
          saison:
            (product.saison as "été" | "hiver" | "toutes saisons") ||
            "toutes saisons",
          familleOlfactive: product.famille_olfactive || "Oriental",
          imageURL:
            product.image_url ||
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
          active: product.active,
        }));
        console.log(`✅ Loaded ${formattedPerfumes.length} products from Supabase`);
        setCatalogPerfumes(formattedPerfumes);
      } else {
        console.log("No products found in Supabase, using default perfumes");
        setCatalogPerfumes(defaultPerfumes);
      }
    } catch (error) {
      console.error("Timeout or error loading products from Supabase:", error);
      setCatalogPerfumes(defaultPerfumes);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    if (perfumes) {
      setCatalogPerfumes(perfumes);
      setLoading(false);
    } else {
      loadProductsFromSupabase();
    }
  }, [perfumes, includeInactive]);

  // Listen for catalog updates and clear events
  useEffect(() => {
    const handleCatalogUpdate = (event: any) => {
      console.log(
        "🔄 Catalog update event received, reloading from Supabase...",
      );
      loadProductsFromSupabase();
    };

    const handleCatalogClear = (event: any) => {
      console.log("🗑️ Catalog clear event received, clearing and reloading...");
      setCatalogPerfumes([]);
      loadProductsFromSupabase();
    };

    // Listen for various update events
    window.addEventListener("catalogUpdated", handleCatalogUpdate);
    window.addEventListener("catalogCleared", handleCatalogClear);
    window.addEventListener("productUpdated", handleCatalogUpdate);
    window.addEventListener("productsImported", handleCatalogUpdate);
    window.addEventListener("stockUpdated", handleCatalogUpdate);
    window.addEventListener("productStatusUpdated", handleCatalogUpdate);

    return () => {
      window.removeEventListener("catalogUpdated", handleCatalogUpdate);
      window.removeEventListener("catalogCleared", handleCatalogClear);
      window.removeEventListener("productUpdated", handleCatalogUpdate);
      window.removeEventListener("productsImported", handleCatalogUpdate);
      window.removeEventListener("stockUpdated", handleCatalogUpdate);
      window.removeEventListener("productStatusUpdated", handleCatalogUpdate);
    };
  }, []);

  const allPerfumes = perfumes || catalogPerfumes;
  const visiblePerfumes = includeInactive
    ? allPerfumes
    : allPerfumes.filter((p) => p.active);

  // Show loading state
  if (loading && !perfumes) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <p>Chargement du catalogue depuis Supabase...</p>
      </div>
    );
  }

  // Get unique olfactory families for filter
  const uniqueFamilies = [
    ...new Set(visiblePerfumes.map((p) => p.familleOlfactive)),
  ];

  // Function to normalize text for search (handle accented characters)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
  };

  const filteredPerfumes = visiblePerfumes.filter((perfume) => {
    // Search term filter with accent handling
    const normalizedSearchTerm = normalizeText(searchTerm);
    const searchMatch =
      searchTerm === "" ||
      normalizeText(perfume.nomLolly).includes(normalizedSearchTerm) ||
      normalizeText(perfume.nomParfumInspire).includes(normalizedSearchTerm) ||
      normalizeText(perfume.marqueInspire).includes(normalizedSearchTerm);

    // Genre filter
    const genreMatch =
      selectedGenre === null || perfume.genre === selectedGenre;

    // Season filter
    const saisonMatch =
      selectedSaison === null || perfume.saison === selectedSaison;

    // Olfactory family filter
    const familleMatch =
      selectedFamille === null || perfume.familleOlfactive === selectedFamille;

    return searchMatch && genreMatch && saisonMatch && familleMatch;
  });

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
  };

  const handleSaisonSelect = (saison: string) => {
    setSelectedSaison(selectedSaison === saison ? null : saison);
  };

  const handleFamilleSelect = (famille: string) => {
    setSelectedFamille(selectedFamille === famille ? null : famille);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre(null);
    setSelectedSaison(null);
    setSelectedFamille(null);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPerfumes = filteredPerfumes.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    await loadProductsFromSupabase(page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Catalogue de Parfums</h2>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un parfum..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-[#D4C2A1] bg-white focus:border-[#CE8F8A] text-[#805050]"
        />
      </div>

      {/* Filter section */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Genre filter */}
        <div>
          <Label>Genre</Label>
          <Select
            value={selectedGenre || "all"}
            onValueChange={(value) =>
              setSelectedGenre(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="border-[#D4C2A1]">
              <SelectValue placeholder="Tous les genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les genres</SelectItem>
              <SelectItem value="homme">Homme</SelectItem>
              <SelectItem value="femme">Femme</SelectItem>
              <SelectItem value="mixte">Mixte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Saison filter */}
        <div>
          <Label>Saison</Label>
          <Select
            value={selectedSaison || "all"}
            onValueChange={(value) =>
              setSelectedSaison(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="border-[#D4C2A1]">
              <SelectValue placeholder="Toutes les saisons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les saisons</SelectItem>
              <SelectItem value="été">Été</SelectItem>
              <SelectItem value="hiver">Hiver</SelectItem>
              <SelectItem value="toutes saisons">Toutes saisons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Famille Olfactive filter */}
        <div>
          <Label>Famille Olfactive</Label>
          <Select
            value={selectedFamille || "all"}
            onValueChange={(value) =>
              setSelectedFamille(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="border-[#D4C2A1]">
              <SelectValue placeholder="Toutes les familles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les familles</SelectItem>
              {uniqueFamilies.map((famille) => (
                <SelectItem key={famille} value={famille}>
                  {famille}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedGenre || selectedSaison || selectedFamille || searchTerm) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span>Filtres actifs:</span>
          {selectedGenre && <Badge>Genre: {selectedGenre}</Badge>}
          {selectedSaison && <Badge>Saison: {selectedSaison}</Badge>}
          {selectedFamille && <Badge>Famille: {selectedFamille}</Badge>}
          {searchTerm && <Badge>Recherche: {searchTerm}</Badge>}
          <Button
            variant="outline"
            className="ml-2"
            onClick={clearFilters}
          >
            Effacer tous les filtres
          </Button>
        </div>
      )}

      {/* Results count and pagination info */}
      <div className="flex items-center justify-between mb-4">
        <span>{filteredPerfumes.length} parfums trouvés</span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} sur {totalPages}
          </span>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-[#CE8F8A] text-[#805050]"
          >
            <ChevronLeft />
          </Button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-[#CE8F8A] text-[#805050]"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      {/* Perfume grid */}
      {currentPerfumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPerfumes.map((perfume) => (
            <PerfumeCard
              key={perfume.codeProduit}
              perfume={perfume}
              onClick={() => onPerfumeSelect(perfume)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>Aucun parfum ne correspond à votre recherche</p>
          <Button variant="link" onClick={clearFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="border-[#CE8F8A] text-[#805050]"
          >
            Premier
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-[#CE8F8A] text-[#805050]"
          >
            <ChevronLeft />
          </Button>
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant="outline"
                onClick={() => handlePageChange(pageNum as number)}
                className={
                  currentPage === pageNum
                    ? "bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-white"
                    : "border-[#CE8F8A] text-[#805050]"
                }
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-[#CE8F8A] text-[#805050]"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="border-[#CE8F8A] text-[#805050]"
          >
            Dernier
          </Button>
        </div>
      )}
    </div>
  );
};

// Mock data for default display
const defaultPerfumes: PerfumeType[] = [
  {
    codeProduit: "L001",
    nomLolly: "Élégance Nocturne",
    nomParfumInspire: "Black Opium",
    marqueInspire: "Yves Saint Laurent",
    genre: "femme",
    saison: "toutes saisons",
    familleOlfactive: "Oriental Vanillé",
    imageURL:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
    active: true,
  },
  {
    codeProduit: "L002",
    nomLolly: "Aura Marine",
    nomParfumInspire: "Acqua di Gio",
    marqueInspire: "Giorgio Armani",
    genre: "homme",
    saison: "été",
    familleOlfactive: "Aromatique Aquatique",
    imageURL:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400&q=80",
    active: true,
  },
  {
    codeProduit: "L003",
    nomLolly: "Séduction Florale",
    nomParfumInspire: "J'adore",
    marqueInspire: "Dior",
    genre: "femme",
    saison: "toutes saisons",
    familleOlfactive: "Floral Fruité",
    imageURL:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
    active: true,
  },
  {
    codeProduit: "L004",
    nomLolly: "Boisé Intense",
    nomParfumInspire: "Sauvage",
    marqueInspire: "Dior",
    genre: "homme",
    saison: "toutes saisons",
    familleOlfactive: "Aromatique Fougère",
    imageURL:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
    active: true,
  },
  {
    codeProduit: "L005",
    nomLolly: "Douceur Gourmande",
    nomParfumInspire: "La Vie Est Belle",
    marqueInspire: "Lancôme",
    genre: "femme",
    saison: "hiver",
    familleOlfactive: "Gourmand Floral",
    imageURL:
      "https://images.unsplash.com/photo-1615529162924-f8605388461d?w=400&q=80",
    active: true,
  },
  {
    codeProduit: "L006",
    nomLolly: "Fraîcheur Citrus",
    nomParfumInspire: "Light Blue",
    marqueInspire: "Dolce & Gabbana",
    genre: "mixte",
    saison: "été",
    familleOlfactive: "Citrus Aromatique",
    imageURL:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
    active: true,
  },
];

export default PerfumeCatalog;
