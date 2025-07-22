import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Calendar,
  BarChart3,
  Users,
  Package,
  Search,
  Download,
  LogOut,
  Heart,
  Trash2,
  Home,
} from "lucide-react";
import PerfumeCatalog from "./catalog/PerfumeCatalog";
import PerfumeDetail from "./catalog/PerfumeDetail";
import LoginDialog from "./auth/LoginDialog";
import ClientLoginDialog from "./ClientLoginDialog";
import { useAuth } from "@/contexts/AuthContext";

const ConseillerSpace = () => {
  // Get auth state
  const authContext = useAuth();
  const user = authContext?.user;
  const isAuthenticated = authContext?.isAuthenticated || false;

  // Component state
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPerfume, setSelectedPerfume] = useState<any>(null);
  const [searchClient, setSearchClient] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showClientLogin, setShowClientLogin] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Initialize data
  const [salesData, setSalesData] = useState(() => {
    const savedSales = localStorage.getItem("conseiller-sales");
    if (savedSales) {
      return JSON.parse(savedSales);
    }
    return [
      {
        date: "2024-01-15",
        client: "Marie Dupont",
        article: "L001-30",
        nomParfumInspire: "Black Opium",
        marqueInspire: "Yves Saint Laurent",
        contenance: "30ml",
        prix: 29.9,
      },
      {
        date: "2024-01-14",
        client: "Jean Martin",
        article: "L002-50",
        nomParfumInspire: "Acqua di Gio",
        marqueInspire: "Giorgio Armani",
        contenance: "50ml",
        prix: 39.9,
      },
    ];
  });

  const [filteredSalesData, setFilteredSalesData] = useState(salesData);

  const [conseillereFavorites, setConseillereFavorites] = useState<any[]>(
    () => {
      const saved = localStorage.getItem("conseillere-favorites");
      return saved ? JSON.parse(saved) : [];
    },
  );

  const [clientHistory, setClientHistory] = useState(() => {
    const savedClients = localStorage.getItem("client-history");
    if (savedClients) {
      return JSON.parse(savedClients);
    }
    return [
      {
        codeClient: "C001",
        whatsapp: "0123456789",
        nom: "Marie Dupont",
        achats: [
          {
            date: "2024-01-15",
            article: "L001-30",
            nomParfumInspire: "Black Opium",
            marqueInspire: "Yves Saint Laurent",
            contenance: "30ml",
          },
        ],
      },
    ];
  });

  // Authentication check effect
  useEffect(() => {
    console.log("🔍 ConseillerSpace - Auth state:", {
      isAuthenticated,
      userEmail: user?.email,
      userRole: user?.role,
      hasUser: !!user,
    });

    // Simple authentication logic
    if (!isAuthenticated) {
      console.log("❌ Not authenticated - showing login");
      setShowLogin(true);
      setIsLoading(false);
    } else if (user?.role === "conseillere" || user?.role === "admin") {
      console.log("✅ Access granted for role:", user.role);
      setShowLogin(false);
      setIsLoading(false);
    } else {
      console.log("❌ Wrong role:", user?.role);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Filter sales by date range
  useEffect(() => {
    if (!dateRange.start || !dateRange.end) {
      setFilteredSalesData(salesData);
      return;
    }

    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return saleDate >= startDate && saleDate <= endDate;
    });

    setFilteredSalesData(filtered);
  }, [dateRange.start, dateRange.end, salesData]);

  // Event listeners
  useEffect(() => {
    const handleConseillereFavoriteToggle = (event: any) => {
      const { perfume, action } = event.detail;
      if (action === "add") {
        handleAddToConseillereFavorites(perfume);
      } else {
        handleRemoveFromConseillereFavorites(perfume.codeProduit);
      }
    };

    const handleNewSale = (event: any) => {
      const saleData = event.detail;
      const newSale = {
        date: new Date().toISOString().split("T")[0],
        client: saleData.client,
        article: saleData.codeArticle,
        nomParfumInspire: saleData.nomParfumInspire || "Parfum Inspiré",
        marqueInspire: saleData.marqueInspire || "Marque",
        contenance: saleData.contenance || "30ml",
        prix: saleData.amount,
      };
      setSalesData((prev) => {
        const updated = [newSale, ...prev];
        localStorage.setItem("conseiller-sales", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener(
      "conseillereFavoriteToggle",
      handleConseillereFavoriteToggle,
    );
    window.addEventListener("newSaleRecorded", handleNewSale);

    return () => {
      window.removeEventListener(
        "conseillereFavoriteToggle",
        handleConseillereFavoriteToggle,
      );
      window.removeEventListener("newSaleRecorded", handleNewSale);
    };
  }, []);

  // Handler functions
  const handlePerfumeSelect = (perfume: any) => {
    const detailPerfume = {
      codeProduit: perfume.codeProduit,
      nomLolly: perfume.nomLolly,
      nomParfumInspire: perfume.nomParfumInspire,
      marqueInspire: perfume.marqueInspire,
      genre: perfume.genre,
      saison: perfume.saison,
      familleOlfactive: perfume.familleOlfactive,
      noteTete: perfume.noteTete
        ? perfume.noteTete.split(", ")
        : ["Bergamote", "Citron"],
      noteCoeur: perfume.noteCoeur
        ? perfume.noteCoeur.split(", ")
        : ["Jasmin", "Rose"],
      noteFond: perfume.noteFond
        ? perfume.noteFond.split(", ")
        : ["Musc", "Vanille"],
      description: perfume.description || "Une fragrance élégante et raffinée.",
      imageURL: perfume.imageURL,
      contenances: [
        {
          refComplete: `${perfume.codeProduit}-15`,
          contenance: 15,
          unite: "ml",
          prix: 19.9,
          stockActuel: 25,
          actif: true,
        },
        {
          refComplete: `${perfume.codeProduit}-30`,
          contenance: 30,
          unite: "ml",
          prix: 29.9,
          stockActuel: 18,
          actif: true,
        },
        {
          refComplete: `${perfume.codeProduit}-50`,
          contenance: 50,
          unite: "ml",
          prix: 39.9,
          stockActuel: 10,
          actif: true,
        },
      ],
    };
    setSelectedPerfume(detailPerfume);
  };

  const handleClientLogin = (clientData: any) => {
    setCurrentClient(clientData);
    setShowClientLogin(false);

    if (conseillereFavorites.length > 0) {
      handleAssociateFavoritesToClient(clientData);
    }
  };

  const handleAddToConseillereFavorites = (perfume: any) => {
    const favoriteItem = {
      codeProduit: perfume.codeProduit,
      nomLolly: perfume.nomLolly,
      nomParfumInspire: perfume.nomParfumInspire,
      marqueInspire: perfume.marqueInspire,
      imageURL: perfume.imageURL,
      genre: perfume.genre,
      familleOlfactive: perfume.familleOlfactive,
      addedBy: "conseillere",
      dateAdded: new Date().toISOString(),
    };
    setConseillereFavorites((prev) => {
      const exists = prev.some(
        (fav) => fav.codeProduit === perfume.codeProduit,
      );
      if (!exists) {
        const newFavorites = [...prev, favoriteItem];
        localStorage.setItem(
          "conseillere-favorites",
          JSON.stringify(newFavorites),
        );
        return newFavorites;
      }
      return prev;
    });
  };

  const handleRemoveFromConseillereFavorites = (codeProduit: string) => {
    setConseillereFavorites((prev) => {
      const newFavorites = prev.filter(
        (fav) => fav.codeProduit !== codeProduit,
      );
      localStorage.setItem(
        "conseillere-favorites",
        JSON.stringify(newFavorites),
      );
      return newFavorites;
    });
  };

  const handleAssociateFavoritesToClient = (clientData: any) => {
    const clientFavorites = conseillereFavorites.map((fav) => ({
      codeProduit: fav.codeProduit,
      nomLolly: fav.nomLolly,
      nomParfumInspire: fav.nomParfumInspire,
      marqueInspire: fav.marqueInspire,
      imageURL: fav.imageURL,
      genre: fav.genre,
      familleOlfactive: fav.familleOlfactive,
    }));

    const clientKey = `client-favorites-${clientData.codeClient || clientData.email}`;
    const existingClientFavorites = JSON.parse(
      localStorage.getItem(clientKey) || "[]",
    );
    const mergedFavorites = [...existingClientFavorites];

    clientFavorites.forEach((newFav) => {
      if (
        !mergedFavorites.some(
          (existing) => existing.codeProduit === newFav.codeProduit,
        )
      ) {
        mergedFavorites.push(newFav);
      }
    });

    localStorage.setItem(clientKey, JSON.stringify(mergedFavorites));
    localStorage.setItem("lolly-favorites", JSON.stringify(mergedFavorites));

    setConseillereFavorites([]);
    localStorage.removeItem("conseillere-favorites");
    setShowFavorites(false);
  };

  const filteredClients = clientHistory.filter(
    (client) =>
      client.codeClient.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.whatsapp.includes(searchClient) ||
      client.nom.toLowerCase().includes(searchClient.toLowerCase()),
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF0E9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE8F8A] mx-auto mb-4"></div>
          <p className="text-[#AD9C92]">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || showLogin) {
    return (
      <div className="min-h-screen bg-[#FBF0E9]">
        <LoginDialog
          open={true}
          onOpenChange={setShowLogin}
          onSuccess={() => {
            console.log("🎉 Login successful in ConseillerSpace");
            setShowLogin(false);
          }}
          hideRegistration={true}
        />
      </div>
    );
  }

  // Check role access
  if (user && user.role !== "conseillere" && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FBF0E9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair text-[#805050] mb-4">
            Accès Refusé
          </h2>
          <p className="text-[#AD9C92] mb-4">
            Votre rôle actuel: {user?.role || "non défini"}. Seuls les
            conseillers et administrateurs peuvent accéder à cet espace.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#CE8F8A] text-white hover:bg-[#CE8F8A]/90"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-[#FBF0E9] p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-playfair text-[#805050] mb-4">
                Espace Conseillère
              </h2>
              <p className="text-[#AD9C92] font-montserrat">
                Bienvenue {user?.prenom} {user?.nom} - Gérez vos conseils et
                accompagnez vos clients
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 bg-white p-1 md:p-2 h-auto">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-[#D4C2A1] flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-3 h-auto min-h-[60px] md:min-h-[48px]"
              >
                <BarChart3 className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline text-center">
                  Tableau de bord
                </span>
                <span className="sm:hidden text-center leading-tight">
                  Tableau
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="catalog"
                className="data-[state=active]:bg-[#D4C2A1] flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-3 h-auto min-h-[60px] md:min-h-[48px]"
              >
                <Package className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline text-center">
                  Catalogue produits
                </span>
                <span className="sm:hidden text-center leading-tight">
                  Catalogue
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="data-[state=active]:bg-[#D4C2A1] flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-3 h-auto min-h-[60px] md:min-h-[48px] relative"
              >
                <Heart className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline text-center">
                  Mes Favoris
                </span>
                <span className="sm:hidden text-center leading-tight">
                  Favoris
                </span>
                {conseillereFavorites.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 md:relative md:top-0 md:right-0 md:ml-1 bg-[#CE8F8A] text-white text-xs min-w-[16px] h-4 flex items-center justify-center">
                    {conseillereFavorites.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-[#D4C2A1] flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-3 h-auto min-h-[60px] md:min-h-[48px]"
              >
                <Users className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline text-center">
                  Historique clients
                </span>
                <span className="sm:hidden text-center leading-tight">
                  Historique
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                className="data-[state=active]:bg-[#D4C2A1] flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-3 h-auto min-h-[60px] md:min-h-[48px]"
              >
                <Calendar className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline text-center">
                  Clients du jour
                </span>
                <span className="sm:hidden text-center leading-tight">
                  Clients
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Mes Statistiques de Vente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#FBF0E9] p-4 rounded-lg text-center">
                      <h3 className="text-2xl font-bold text-[#805050]">
                        {filteredSalesData
                          .reduce((sum, sale) => sum + sale.prix, 0)
                          .toFixed(3)}{" "}
                        TND
                      </h3>
                      <p className="text-[#AD9C92]">
                        Ventes période sélectionnée
                      </p>
                    </div>
                    <div className="bg-[#FBF0E9] p-4 rounded-lg text-center">
                      <h3 className="text-2xl font-bold text-[#805050]">
                        {salesData
                          .reduce((sum, sale) => sum + sale.prix, 0)
                          .toFixed(3)}{" "}
                        TND
                      </h3>
                      <p className="text-[#AD9C92]">Ventes totales</p>
                    </div>
                    <div className="bg-[#FBF0E9] p-4 rounded-lg text-center">
                      <h3 className="text-2xl font-bold text-[#805050]">
                        {filteredSalesData.length}
                      </h3>
                      <p className="text-[#AD9C92]">Ventes période</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <Label htmlFor="start-date">Date de début</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, start: e.target.value })
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="end-date">Date de fin</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, end: e.target.value })
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-[#805050]">Date</th>
                          <th className="text-left p-2 text-[#805050]">
                            Client
                          </th>
                          <th className="text-left p-2 text-[#805050]">
                            Article
                          </th>
                          <th className="text-left p-2 text-[#805050]">
                            Parfum Inspiré
                          </th>
                          <th className="text-left p-2 text-[#805050]">Prix</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSalesData.map((sale, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-[#FBF0E9]/50"
                          >
                            <td className="p-2">{sale.date}</td>
                            <td className="p-2">{sale.client}</td>
                            <td className="p-2">{sale.article}</td>
                            <td className="p-2">{sale.nomParfumInspire}</td>
                            <td className="p-2">{sale.prix.toFixed(3)} TND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="catalog">
              {selectedPerfume ? (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPerfume(null)}
                    className="mb-4 text-[#805050] hover:bg-[#CE8F8A]/10"
                  >
                    ← Retour au catalogue
                  </Button>
                  <PerfumeDetail
                    perfume={selectedPerfume}
                    onAddToCart={() => setShowClientLogin(true)}
                    onAddToFavorites={() =>
                      handleAddToConseillereFavorites(selectedPerfume)
                    }
                  />
                </div>
              ) : (
                <PerfumeCatalog onPerfumeSelect={handlePerfumeSelect} />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Mes Favoris ({conseillereFavorites.length})
                  </CardTitle>
                  <CardDescription className="text-[#AD9C92]">
                    Gérez vos parfums favoris et associez-les à un client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {conseillereFavorites.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 text-[#AD9C92] mx-auto mb-4 opacity-50" />
                      <p className="text-[#AD9C92]">Aucun favori ajouté</p>
                      <p className="text-sm text-[#AD9C92] mt-2">
                        Ajoutez des parfums en favoris depuis le catalogue
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-[#805050]">
                          {conseillereFavorites.length} parfum(s) en favoris
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setShowClientLogin(true)}
                            className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-white"
                          >
                            Associer à un client
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setConseillereFavorites([]);
                              localStorage.removeItem("conseillere-favorites");
                            }}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Vider les favoris
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {conseillereFavorites.map((favorite) => (
                          <div
                            key={favorite.codeProduit}
                            className="border rounded-lg p-4 bg-[#FBF0E9] cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={favorite.imageURL}
                                alt={favorite.nomLolly}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-[#805050] truncate">
                                  {favorite.nomLolly}
                                </h4>
                                <p className="text-sm text-[#AD9C92] truncate">
                                  {favorite.nomParfumInspire} -{" "}
                                  {favorite.marqueInspire}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <Badge className="bg-[#D4C2A1] text-[#805050] text-xs">
                                    {favorite.familleOlfactive}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFromConseillereFavorites(
                                        favorite.codeProduit,
                                      );
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Historique des Ventes Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Label htmlFor="search-client">Rechercher un client</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AD9C92] w-4 h-4" />
                      <Input
                        id="search-client"
                        placeholder="Code client, nom, téléphone ou WhatsApp..."
                        value={searchClient}
                        onChange={(e) => setSearchClient(e.target.value)}
                        className="pl-10 border-[#D4C2A1]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredClients.map((client) => (
                      <div
                        key={client.codeClient}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-[#805050]">
                              {client.nom}
                            </h3>
                            <p className="text-sm text-[#AD9C92]">
                              Code: {client.codeClient}
                            </p>
                          </div>
                          <Badge className="bg-[#D4C2A1] text-[#805050]">
                            {client.achats.length} achat(s)
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {client.achats.map((achat, index) => (
                            <div
                              key={index}
                              className="text-sm bg-[#FBF0E9] p-2 rounded space-y-1"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {achat.date}
                                </span>
                                <span>
                                  {achat.article} - {achat.contenance}
                                </span>
                              </div>
                              <div className="text-xs md:text-sm text-[#AD9C92]">
                                {achat.nomParfumInspire} - {achat.marqueInspire}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Clients du Jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#AD9C92] mb-4">
                    Consultez vos rendez-vous et conseils personnalisés pour
                    aujourd'hui
                  </p>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-[#805050]">
                            Marie Dupont
                          </h3>
                          <p className="text-sm text-[#AD9C92]">
                            14:30 - Conseil parfum floral
                          </p>
                        </div>
                        <Badge className="bg-[#CE8F8A] text-white">
                          En cours
                        </Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-[#805050]">
                            Jean Martin
                          </h3>
                          <p className="text-sm text-[#AD9C92]">
                            16:00 - Parfum homme boisé
                          </p>
                        </div>
                        <Badge className="bg-[#D4C2A1] text-[#805050]">
                          Programmé
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ClientLoginDialog
        open={showClientLogin}
        onOpenChange={setShowClientLogin}
        onSuccess={handleClientLogin}
        title="Identification Client"
        description="Identifiez le client pour associer le panier ou les favoris à son compte"
      />
    </div>
  );
};

export default ConseillerSpace;
