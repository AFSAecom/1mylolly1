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
import { supabase } from "@/lib/supabaseClient";

interface PerfumeType {
  codeProduit: string;
  nomLolly: string;
  nomParfumInspire: string;
  marqueInspire: string;
  genre: "homme" | "femme" | "mixte";
  saison: "été" | "hiver" | "toutes saisons";
  familleOlfactive: string;
  noteTete: string;
  noteCoeur: string;
  noteFond: string;
  description: string;
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

  // Function to load products directly from Supabase
  const loadProductsFromSupabase = async (page = 1) => {
    try {
      setLoading(true);
      console.log(`🔄 Loading products directly from Supabase (page ${page})...`);

      let query = supabase
        .from("products")
        .select(
          "code_produit, nom_lolly, nom_parfum_inspire, marque_inspire, genre, saison, famille_olfactive, image_url, active",
        )
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      if (!includeInactive) {
        query = query.eq("active", true);
      }
      const { data: productsData, error } = await query;

      if (error) {
        console.error("Error loading products from Supabase:", error);
        // Fallback to default perfumes if Supabase fails
        setCatalogPerfumes(defaultPerfumes);
        return;
      }

      if (productsData && productsData.length > 0) {
        const formattedPerfumes = productsData.map((product) => ({
          codeProduit: product.code_produit,
          nomLolly: product.nom_lolly,
          nomParfumInspire: product.nom_parfum_inspire,
          marqueInspire: product.marque_inspire,
          genre: (product.genre as "homme" | "femme" | "mixte") || "mixte",
          saison:
            (product.saison as "été" | "hiver" | "toutes saisons") ||
            "toutes saisons",
          familleOlfactive: product.famille_olfactive || "Oriental",
          noteTete: "",
          noteCoeur: "",
          noteFond: "",
          description: "",
          imageURL:
            product.image_url ||
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
          active: product.active,
        }));

        console.log(
          `✅ Loaded ${formattedPerfumes.length} products from Supabase`,
        );
        setCatalogPerfumes(formattedPerfumes);
      } else {
        console.log("No products found in Supabase, using default perfumes");
        setCatalogPerfumes(defaultPerfumes);
      }
    } catch (error) {
      console.error("Error loading products from Supabase:", error);
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
      <div className="w-full bg-[#FBF0E9] p-6 rounded-lg">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#805050] mx-auto mb-4"></div>
          <p className="text-[#805050] font-montserrat">
            Chargement du catalogue depuis Supabase...
          </p>
        </div>
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
      normalizeText(perfume.marqueInspire).includes(normalizedSearchTerm) ||
      normalizeText(perfume.noteTete).includes(normalizedSearchTerm) ||
      normalizeText(perfume.noteCoeur).includes(normalizedSearchTerm) ||
      normalizeText(perfume.noteFond).includes(normalizedSearchTerm);

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
    <div className="w-full bg-[#FBF0E9] p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair text-[#805050] mb-4">
          Catalogue de Parfums
        </h2>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AD9C92]"
            size={18}
          />
          <Input
            type="text"
            placeholder="Rechercher par nom, marque, notes olfactives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[#D4C2A1] bg-white focus:border-[#CE8F8A] text-[#805050]"
          />
        </div>

        {/* Filter section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-montserrat text-[#805050] mb-2 flex items-center">
              <Filter size={16} className="mr-2" /> Genre
            </p>
            <Select
              value={selectedGenre || ""}
              onValueChange={(value) =>
                setSelectedGenre(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="border-[#D4C2A1] focus:border-[#CE8F8A]">
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

          <div>
            <p className="text-sm font-montserrat text-[#805050] mb-2 flex items-center">
              <Filter size={16} className="mr-2" /> Saison
            </p>
            <Select
              value={selectedSaison || ""}
              onValueChange={(value) =>
                setSelectedSaison(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="border-[#D4C2A1] focus:border-[#CE8F8A]">
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

          <div>
            <p className="text-sm font-montserrat text-[#805050] mb-2 flex items-center">
              <Filter size={16} className="mr-2" /> Famille Olfactive
            </p>
            <Select
              value={selectedFamille || ""}
              onValueChange={(value) =>
                setSelectedFamille(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="border-[#D4C2A1] focus:border-[#CE8F8A]">
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
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-[#805050]">Filtres actifs:</span>
            {selectedGenre && (
              <Badge className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90">
                Genre: {selectedGenre}
              </Badge>
            )}
            {selectedSaison && (
              <Badge className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90">
                Saison: {selectedSaison}
              </Badge>
            )}
            {selectedFamille && (
              <Badge className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90">
                Famille: {selectedFamille}
              </Badge>
            )}
            {searchTerm && (
              <Badge className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90">
                Recherche: {searchTerm}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[#805050] hover:text-[#CE8F8A] hover:bg-transparent"
            >
              Effacer tous les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Results count and pagination info */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-sm text-[#805050]">
          {filteredPerfumes.length} parfums trouvés
          {totalPages > 1 && (
            <span className="ml-2 text-[#AD9C92]">
              (Page {currentPage} sur {totalPages})
            </span>
          )}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-[#CE8F8A] text-[#805050]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[#805050] px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-[#CE8F8A] text-[#805050]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Perfume grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPerfumes.length > 0 ? (
          currentPerfumes.map((perfume) => (
            <PerfumeCard
              key={perfume.codeProduit}
              codeProduit={perfume.codeProduit}
              imageURL={perfume.imageURL}
              nomLolly={perfume.nomLolly}
              nomParfumInspire={perfume.nomParfumInspire}
              marqueInspire={perfume.marqueInspire}
              genre={perfume.genre}
              saison={perfume.saison}
              familleOlfactive={perfume.familleOlfactive}
              active={perfume.active}
              allowInactiveClick={includeInactive}
              onClick={() => onPerfumeSelect(perfume)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-[#805050]">
              Aucun parfum ne correspond à votre recherche
            </p>
            <Button
              onClick={clearFilters}
              className="mt-4 bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-white"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
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
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex gap-1">
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
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
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
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-[#CE8F8A] text-[#805050]"
          >
            <ChevronRight className="w-4 h-4" />
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
    noteTete: "Café, Poire",
    noteCoeur: "Jasmin, Fleur d'oranger",
    noteFond: "Vanille, Patchouli, Cèdre",
    description:
      "Une fragrance addictive et envoûtante avec des notes gourmandes de café et de vanille.",
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
    noteTete: "Bergamote, Néroli",
    noteCoeur: "Romarin, Persil, Jasmin",
    noteFond: "Bois de cèdre, Musc, Ambre",
    description:
      "Une fragrance fraîche et marine inspirée par la mer Méditerranée.",
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
    noteTete: "Bergamote, Poire, Melon",
    noteCoeur: "Rose de Mai, Jasmin, Magnolia",
    noteFond: "Musc, Bois de cèdre",
    description:
      "Un bouquet floral sophistiqué et élégant aux notes délicates.",
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
    noteTete: "Bergamote, Poivre",
    noteCoeur: "Lavande, Géranium, Poivre de Sichuan",
    noteFond: "Ambroxan, Patchouli, Vétiver",
    description:
      "Une fragrance puissante et masculine avec des notes aromatiques et boisées.",
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
    noteTete: "Cassis, Poire",
    noteCoeur: "Iris, Jasmin, Fleur d'oranger",
    noteFond: "Praline, Vanille, Patchouli",
    description:
      "Une fragrance gourmande et féminine avec des notes sucrées de praline et de vanille.",
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
    noteTete: "Citron de Sicile, Pomme Granny Smith",
    noteCoeur: "Jasmin, Rose Blanche, Bambou",
    noteFond: "Cèdre, Ambre, Musc",
    description:
      "Une fragrance fraîche et légère évoquant la Méditerranée en été.",
    imageURL:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
    active: true,
  },
];

export default PerfumeCatalog;
