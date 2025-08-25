import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import PerfumeCatalog from "./catalog/PerfumeCatalog";
import { Button } from "./ui/button";
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  User,
  LogIn,
  Home,
  LogOut,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDialog from "./cart/CartDialog";
import LoginDialog from "./auth/LoginDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PerfumeDetail = React.lazy(() => import("./catalog/PerfumeDetail"));

// Order History Component
const OrderHistory = () => {
  const [orders, setOrders] = React.useState(() => {
    const savedOrders = localStorage.getItem("client-orders");
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
    // Default mock orders that reset on app reload
    return [
      {
        id: 1,
        date: "2024-01-15",
        client: "Marie Dupont",
        codeClient: "C001",
        items: [
          {
            product: "Élégance Nocturne",
            nomParfumInspire: "Black Opium",
            codeArticle: "L001-30",
            amount: 29.9,
            quantity: 1,
          },
        ],
        totalAmount: 29.9,
        status: "Livrée",
      },
      {
        id: 2,
        date: "2024-01-10",
        client: "Marie Dupont",
        codeClient: "C001",
        items: [
          {
            product: "Aura Marine",
            nomParfumInspire: "Acqua di Gio",
            codeArticle: "L002-50",
            amount: 39.9,
            quantity: 1,
          },
        ],
        totalAmount: 39.9,
        status: "En cours",
      },
    ];
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders = localStorage.getItem("client-orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    };

    // Listen for new orders from cart
    const handleNewOrder = () => {
      const savedOrders = localStorage.getItem("client-orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("orderCompleted", handleNewOrder);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("orderCompleted", handleNewOrder);
    };
  }, []);

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#AD9C92]">Aucune commande pour le moment</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-[#805050]">
                  Commande #{order.id.toString().padStart(3, "0")}
                </h4>
                <p className="text-sm text-[#AD9C92]">
                  {new Date(order.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${
                  order.status === "Livrée"
                    ? "text-green-600"
                    : order.status === "Confirmée"
                      ? "text-blue-600"
                      : "text-orange-600"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <div>
                      {item.product} - {item.codeArticle}
                    </div>
                    {item.nomParfumInspire && (
                      <div className="text-xs text-[#AD9C92] italic">
                        Inspiré de {item.nomParfumInspire}
                      </div>
                    )}
                  </div>
                  <span>{item.amount.toFixed(3)} TND</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Total</span>
                <span>{order.totalAmount.toFixed(3)} TND</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const ClientSpace = () => {
  const [selectedPerfume, setSelectedPerfume] = useState<any>(null);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const { getTotalItems } = useCart();
  const { favorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated, user, updateUser, signOut, login } = useAuth();

  // Check role-based access - only allow clients and admins
  React.useEffect(() => {
    if (isAuthenticated && user && user.role === "conseillere") {
      alert(
        "Accès non autorisé. Les conseillères doivent utiliser leur espace dédié.",
      );
      window.location.href = "/advisor";
    }
  }, [isAuthenticated, user]);

  // Listen for login dialog events from other components
  React.useEffect(() => {
    const handleOpenLoginDialog = () => {
      setShowLogin(true);
    };

    const handleRedirectToAccount = () => {
      setShowAccount(true);
      setSelectedPerfume(null);
      setShowFavorites(false);
    };

    const handleNavigateToCatalog = () => {
      setSelectedPerfume(null);
      setShowFavorites(false);
      setShowAccount(false);
      setShowCart(false);
    };

    window.addEventListener("openLoginDialog", handleOpenLoginDialog);
    window.addEventListener("redirectToAccount", handleRedirectToAccount);
    window.addEventListener("navigateToCatalog", handleNavigateToCatalog);
    return () => {
      window.removeEventListener("openLoginDialog", handleOpenLoginDialog);
      window.removeEventListener("redirectToAccount", handleRedirectToAccount);
      window.removeEventListener("navigateToCatalog", handleNavigateToCatalog);
    };
  }, []);

  const handlePerfumeSelect = (perfume: any) => {
    // Convert catalog perfume to detail format
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
          refComplete: `${perfume.codeProduit}-15ml`,
          contenance: 15,
          unite: "ml",
          prix: 19.9,
          stockActuel: 25,
          actif: true,
        },
        {
          refComplete: `${perfume.codeProduit}-30ml`,
          contenance: 30,
          unite: "ml",
          prix: 29.9,
          stockActuel: 18,
          actif: true,
        },
        {
          refComplete: `${perfume.codeProduit}-50ml`,
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

  const handleBackToCatalog = () => {
    setSelectedPerfume(null);
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setSelectedPerfume(null);
    setShowAccount(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF0E9] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-24 h-24 mb-4 rounded-full bg-white flex items-center justify-center shadow-md p-2">
            <img
              src="/logo-lolly.png"
              alt="Lolly"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-playfair text-[#805050] mb-4 text-center">
            Le Compas Olfactif
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-playfair text-[#805050] mb-2">
                {selectedPerfume ? selectedPerfume.nomLolly : "Espace Client"}
              </h2>
              <p className="text-[#AD9C92] font-montserrat">
                {selectedPerfume
                  ? "Détails du parfum"
                  : "Découvrez notre collection exclusive de parfums"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAccount(true);
                      setSelectedPerfume(null);
                      setShowFavorites(false);
                    }}
                    className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon Compte
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      setShowAccount(false);
                    }}
                    className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowLogin(true)}
                  className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleShowFavorites}
                className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <Heart className="w-4 h-4 mr-2" />
                Favoris ({favorites.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCart(true)}
                className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Panier ({getTotalItems()})
              </Button>
            </div>
          </div>

          {selectedPerfume ? (
            <div>
              <Button
                variant="ghost"
                onClick={handleBackToCatalog}
                className="mb-4 text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au catalogue
              </Button>
              <Suspense fallback={<div>Chargement...</div>}>
                <PerfumeDetail perfume={selectedPerfume} />
              </Suspense>
            </div>
          ) : showFavorites ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => setShowFavorites(false)}
                className="mb-4 text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au catalogue
              </Button>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-playfair text-[#805050] mb-4">
                  Mes Favoris ({favorites.length})
                </h3>
                {favorites.length === 0 ? (
                  <p className="text-[#AD9C92] text-center py-8">
                    Aucun favori pour le moment
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite.codeProduit}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            const perfumeData = {
                              codeProduit: favorite.codeProduit,
                              nomLolly: favorite.nomLolly,
                              nomParfumInspire: favorite.nomParfumInspire,
                              marqueInspire: favorite.marqueInspire,
                              imageURL: favorite.imageURL,
                              genre: favorite.genre,
                              familleOlfactive: favorite.familleOlfactive,
                              saison: "toutes saisons",
                              noteTete: ["Bergamote", "Citron"],
                              noteCoeur: ["Jasmin", "Rose"],
                              noteFond: ["Musc", "Vanille"],
                              description:
                                "Une fragrance élégante et raffinée.",
                              contenances: [
                                {
                                  refComplete: `${favorite.codeProduit}-15ml`,
                                  contenance: 15,
                                  unite: "ml",
                                  prix: 19.9,
                                  stockActuel: 25,
                                  actif: true,
                                },
                                {
                                  refComplete: `${favorite.codeProduit}-30ml`,
                                  contenance: 30,
                                  unite: "ml",
                                  prix: 29.9,
                                  stockActuel: 10,
                                  actif: true,
                                },
                                {
                                  refComplete: `${favorite.codeProduit}-50ml`,
                                  contenance: 50,
                                  unite: "ml",
                                  prix: 39.9,
                                  stockActuel: 5,
                                  actif: true,
                                },
                              ],
                            };
                            setSelectedPerfume(perfumeData);
                            setShowFavorites(false);
                            setShowAccount(false);
                          }}
                        >
                          <img
                            src={favorite.imageURL}
                            alt={favorite.nomLolly}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium text-[#805050] mb-1">
                            {favorite.nomLolly}
                          </h4>
                          <p className="text-sm text-[#AD9C92]">
                            {favorite.nomParfumInspire}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(favorite.codeProduit);
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : showAccount ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => setShowAccount(false)}
                className="mb-4 text-[#805050] hover:bg-[#CE8F8A]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au catalogue
              </Button>
              <div className="bg-white p-6 rounded-lg">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="favorites">Favoris</TabsTrigger>
                    <TabsTrigger value="orders">Commandes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <h3 className="text-xl font-playfair text-[#805050] mb-4">
                      Mon Profil
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-[#805050]">
                            Prénom
                          </Label>
                          {isEditing ? (
                            <Input
                              value={editedUser?.prenom || ""}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  prenom: e.target.value,
                                })
                              }
                              className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                            />
                          ) : (
                            <p className="text-[#AD9C92]">{user?.prenom}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#805050]">
                            Nom
                          </Label>
                          {isEditing ? (
                            <Input
                              value={editedUser?.nom || ""}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  nom: e.target.value,
                                })
                              }
                              className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                            />
                          ) : (
                            <p className="text-[#AD9C92]">{user?.nom}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-[#805050]">
                          Email
                        </Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editedUser?.email || ""}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                email: e.target.value,
                              })
                            }
                            className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                          />
                        ) : (
                          <p className="text-[#AD9C92]">{user?.email}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-[#805050]">
                          Code Client
                        </Label>
                        <p className="text-[#AD9C92] bg-gray-100 p-2 rounded">
                          {user?.codeClient}
                        </p>
                        <span className="text-xs text-gray-500">
                          Ce champ ne peut pas être modifié
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-[#805050]">
                            Téléphone
                          </Label>
                          {isEditing ? (
                            <Input
                              value={editedUser?.telephone || ""}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  telephone: e.target.value,
                                })
                              }
                              placeholder="+216 12345678"
                              className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                            />
                          ) : (
                            <p className="text-[#AD9C92]">
                              {user?.telephone
                                ? `+216 ${user.telephone}`
                                : "Non renseigné"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#805050]">
                            WhatsApp
                          </Label>
                          {isEditing ? (
                            <Input
                              value={editedUser?.whatsapp || ""}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
                                  whatsapp: e.target.value,
                                })
                              }
                              placeholder="+216 12345678"
                              className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                            />
                          ) : (
                            <p className="text-[#AD9C92]">
                              {user?.whatsapp
                                ? `+216 ${user.whatsapp}`
                                : "Non renseigné"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-[#805050]">
                          Adresse
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editedUser?.adresse || ""}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                adresse: e.target.value,
                              })
                            }
                            className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                          />
                        ) : (
                          <p className="text-[#AD9C92]">
                            {user?.adresse || "Non renseignée"}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-6">
                        {isEditing ? (
                          <>
                            <Button
                              onClick={() => {
                                updateUser(editedUser);
                                setIsEditing(false);
                              }}
                              className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-white"
                            >
                              Sauvegarder
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                setEditedUser(null);
                              }}
                              className="border-[#CE8F8A] text-[#805050]"
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => {
                              setIsEditing(true);
                              setEditedUser({ ...user });
                            }}
                            className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-white"
                          >
                            Modifier mes informations
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="favorites">
                    <h3 className="text-xl font-playfair text-[#805050] mb-4">
                      Mes Favoris ({favorites.length})
                    </h3>
                    {favorites.length === 0 ? (
                      <p className="text-[#AD9C92] text-center py-8">
                        Aucun favori pour le moment
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map((favorite) => (
                          <div
                            key={favorite.codeProduit}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
                          >
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                const perfumeData = {
                                  codeProduit: favorite.codeProduit,
                                  nomLolly: favorite.nomLolly,
                                  nomParfumInspire: favorite.nomParfumInspire,
                                  marqueInspire: favorite.marqueInspire,
                                  imageURL: favorite.imageURL,
                                  genre: favorite.genre,
                                  familleOlfactive: favorite.familleOlfactive,
                                  saison: "toutes saisons",
                                  noteTete: ["Bergamote", "Citron"],
                                  noteCoeur: ["Jasmin", "Rose"],
                                  noteFond: ["Musc", "Vanille"],
                                  description:
                                    "Une fragrance élégante et raffinée.",
                                  contenances: [
                                    {
                                      refComplete: `${favorite.codeProduit}-15ml`,
                                      contenance: 15,
                                      unite: "ml",
                                      prix: 19.9,
                                      stockActuel: 25,
                                      actif: true,
                                    },
                                    {
                                      refComplete: `${favorite.codeProduit}-30ml`,
                                      contenance: 30,
                                      unite: "ml",
                                      prix: 29.9,
                                      stockActuel: 10,
                                      actif: true,
                                    },
                                    {
                                      refComplete: `${favorite.codeProduit}-50ml`,
                                      contenance: 50,
                                      unite: "ml",
                                      prix: 39.9,
                                      stockActuel: 5,
                                      actif: true,
                                    },
                                  ],
                                };
                                setSelectedPerfume(perfumeData);
                                setShowAccount(false);
                              }}
                            >
                              <img
                                src={favorite.imageURL}
                                alt={favorite.nomLolly}
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                              <h4 className="font-medium text-[#805050] mb-1">
                                {favorite.nomLolly}
                              </h4>
                              <p className="text-sm text-[#AD9C92]">
                                {favorite.nomParfumInspire}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromFavorites(favorite.codeProduit);
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="orders">
                    <h3 className="text-xl font-playfair text-[#805050] mb-4">
                      Historique des Commandes
                    </h3>
                    <OrderHistory />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <PerfumeCatalog onPerfumeSelect={handlePerfumeSelect} />
          )}
        </motion.div>
      </div>

      <CartDialog open={showCart} onOpenChange={setShowCart} />
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} login={login} />
    </div>
  );
};

export default ClientSpace;
