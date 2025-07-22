import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDialog from "@/components/cart/CartDialog";

interface PerfumeDetailProps {
  perfume?: {
    codeProduit: string;
    nomLolly: string;
    nomParfumInspire: string;
    marqueInspire: string;
    genre: "homme" | "femme" | "mixte";
    saison: "été" | "hiver" | "toutes saisons";
    familleOlfactive: string;
    noteTete: string[];
    noteCoeur: string[];
    noteFond: string[];
    description: string;
    imageURL: string;
    contenances: {
      refComplete: string;
      contenance: number;
      unite: string;
      prix: number;
      stockActuel: number;
      actif: boolean;
    }[];
  };
  onAddToCart?: (refComplete: string, quantity: number) => void;
  onAddToFavorites?: (codeProduit: string) => void;
}

const PerfumeDetail: React.FC<PerfumeDetailProps> = ({
  perfume,
  onAddToCart = () => {},
  onAddToFavorites = () => {},
}) => {
  // Function to load the latest product data
  const loadProductData = (providedPerfume?: typeof perfume) => {
    const defaultPerfume = {
      codeProduit: "L001",
      nomLolly: "Élégance Nocturne",
      nomParfumInspire: "Black Opium",
      marqueInspire: "Yves Saint Laurent",
      genre: "femme" as const,
      saison: "toutes saisons" as const,
      familleOlfactive: "Oriental Vanillé",
      noteTete: ["Café", "Poire", "Mandarine"],
      noteCoeur: ["Jasmin", "Fleur d'oranger", "Vanille"],
      noteFond: ["Patchouli", "Cèdre", "Musc"],
      description:
        "Une fragrance envoûtante qui mêle l'intensité du café à la douceur de la vanille, créant une signature olfactive addictive et mystérieuse.",
      imageURL:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80",
      contenances: [
        {
          refComplete: "L001-15",
          contenance: 15,
          unite: "ml",
          prix: 19.9,
          stockActuel: 25,
          actif: true,
        },
        {
          refComplete: "L001-30",
          contenance: 30,
          unite: "ml",
          prix: 29.9,
          stockActuel: 18,
          actif: true,
        },
        {
          refComplete: "L001-50",
          contenance: 50,
          unite: "ml",
          prix: 39.9,
          stockActuel: 10,
          actif: true,
        },
        {
          refComplete: "L001-100",
          contenance: 100,
          unite: "ml",
          prix: 59.9,
          stockActuel: 0,
          actif: false,
        },
      ],
    };

    // Always try to load the most recent data from localStorage first
    const savedProducts = localStorage.getItem("admin-products");
    if (savedProducts) {
      try {
        const adminProducts = JSON.parse(savedProducts);
        const targetCodeProduit =
          providedPerfume?.codeProduit || defaultPerfume.codeProduit;
        const matchingProduct = adminProducts.find(
          (p: any) => p.codeArticle === targetCodeProduit,
        );
        if (matchingProduct) {
          const updatedPerfume = {
            ...defaultPerfume,
            codeProduit: matchingProduct.codeArticle || targetCodeProduit,
            nomLolly: matchingProduct.name || defaultPerfume.nomLolly,
            nomParfumInspire:
              matchingProduct.nomParfumInspire ||
              defaultPerfume.nomParfumInspire,
            marqueInspire:
              matchingProduct.marqueInspire || defaultPerfume.marqueInspire,
            imageURL: matchingProduct.imageURL || defaultPerfume.imageURL,
            contenances:
              matchingProduct.variants?.map((variant: any) => ({
                refComplete: `${matchingProduct.codeArticle}-${variant.size}`,
                contenance: parseInt(variant.size.replace("ml", "")),
                unite: "ml",
                prix: variant.price,
                stockActuel: variant.stock,
                actif: variant.stock > 0,
              })) || defaultPerfume.contenances,
          };
          return updatedPerfume;
        }
      } catch (error) {
        console.error("Error parsing admin products:", error);
      }
    }

    // If provided perfume exists and no localStorage data, use it
    if (providedPerfume) return providedPerfume;

    return defaultPerfume;
  };

  // Load product data from localStorage if not provided
  const [productData, setProductData] = useState(() =>
    loadProductData(perfume),
  );

  // State to force image re-render with timestamp
  const [imageUpdateKey, setImageUpdateKey] = useState(() => Date.now());

  // Function to refresh product data from localStorage
  const refreshProductData = React.useCallback(() => {
    const updatedData = loadProductData(perfume);
    setProductData(updatedData);
    setImageUpdateKey(Date.now()); // Use timestamp for unique key
  }, [perfume]);

  // Listen for product updates and refresh data
  React.useEffect(() => {
    const handleProductUpdate = (event: any) => {
      console.log("Product update event received:", event.detail);
      // Force immediate refresh of product data
      const updatedData = loadProductData(perfume);
      setProductData(updatedData);
      // Force component re-render to update image with timestamp
      setImageUpdateKey(Date.now());
    };

    const handleStockUpdate = (event: any) => {
      console.log("Stock update event received:", event.detail);
      // Force immediate refresh of product data
      const updatedData = loadProductData(perfume);
      setProductData(updatedData);
      // Force component re-render to update image with timestamp
      setImageUpdateKey(Date.now());
    };

    // Also listen for localStorage changes (in case of direct updates)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "admin-products") {
        console.log("localStorage admin-products changed");
        // Force immediate refresh of product data
        const updatedData = loadProductData(perfume);
        setProductData(updatedData);
        // Force component re-render to update image with timestamp
        setImageUpdateKey(Date.now());
      }
    };

    // Refresh data on component mount to ensure we have the latest
    const initialData = loadProductData(perfume);
    setProductData(initialData);

    // Set up a polling mechanism to check for updates every 500ms
    const pollInterval = setInterval(() => {
      const currentData = loadProductData(perfume);
      if (JSON.stringify(currentData) !== JSON.stringify(productData)) {
        setProductData(currentData);
        setImageUpdateKey(Date.now());
      }
    }, 500);

    window.addEventListener("productUpdated", handleProductUpdate);
    window.addEventListener("stockUpdated", handleStockUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("productUpdated", handleProductUpdate);
      window.removeEventListener("stockUpdated", handleStockUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [perfume, productData]);

  // Use productData directly as currentPerfume
  const currentPerfume = productData;

  // Create a unique key for image that forces re-render
  const imageKey = `${currentPerfume.codeProduit}-${imageUpdateKey}-${currentPerfume.imageURL?.split("?")[0]}`;

  // Add cache busting parameter to image URL
  const imageUrlWithCacheBust = `${currentPerfume.imageURL}${currentPerfume.imageURL?.includes("?") ? "&" : "?"}t=${imageUpdateKey}`;
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = () => {
    if (selectedSize) {
      const selectedContenance = currentPerfume.contenances.find(
        (c) => c.refComplete === selectedSize,
      );
      if (selectedContenance) {
        addToCart(
          {
            refComplete: selectedSize,
            codeProduit: currentPerfume.codeProduit,
            nomLolly: currentPerfume.nomLolly,
            nomParfumInspire: currentPerfume.nomParfumInspire,
            contenance: selectedContenance.contenance,
            unite: selectedContenance.unite,
            prix: selectedContenance.prix,
            imageURL: currentPerfume.imageURL,
          },
          quantity,
        );
        setShowCart(true);
      }
      onAddToCart(selectedSize, quantity);
    }
  };

  const handleAddToFavorites = () => {
    const favoriteItem = {
      codeProduit: currentPerfume.codeProduit,
      nomLolly: currentPerfume.nomLolly,
      nomParfumInspire: currentPerfume.nomParfumInspire,
      marqueInspire: currentPerfume.marqueInspire,
      imageURL: currentPerfume.imageURL,
      genre: currentPerfume.genre,
      familleOlfactive: currentPerfume.familleOlfactive,
    };

    if (isFavorite(currentPerfume.codeProduit)) {
      removeFromFavorites(currentPerfume.codeProduit);
    } else {
      addToFavorites(favoriteItem);
    }

    // Dispatch event for conseillère favorites
    const conseillereFavoriteEvent = new CustomEvent(
      "conseillereFavoriteToggle",
      {
        detail: {
          perfume: favoriteItem,
          action: isFavorite(currentPerfume.codeProduit) ? "remove" : "add",
        },
      },
    );
    window.dispatchEvent(conseillereFavoriteEvent);

    onAddToFavorites(currentPerfume.codeProduit);
  };

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case "homme":
        return "bg-blue-100 text-blue-800";
      case "femme":
        return "bg-pink-100 text-pink-800";
      case "mixte":
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };

  const getSaisonColor = (saison: string) => {
    switch (saison) {
      case "été":
        return "bg-yellow-100 text-yellow-800";
      case "hiver":
        return "bg-blue-100 text-blue-800";
      case "toutes saisons":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const activeContenances = currentPerfume.contenances.filter(
    (item) => item.actif,
  );

  return (
    <div className="bg-[#FBF0E9] p-4 md:p-6 rounded-xl max-w-6xl mx-auto">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Image Section */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-[#CE8F8A]/10 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-[280px] aspect-square">
              <img
                key={imageKey}
                src={imageUrlWithCacheBust}
                alt={currentPerfume.nomLolly}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // Fallback to original URL if cache-busted version fails
                  const target = e.target as HTMLImageElement;
                  if (target.src !== currentPerfume.imageURL) {
                    target.src = currentPerfume.imageURL;
                  }
                }}
              />
            </div>
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white/80 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
              <span className="font-medium text-[#805050] text-sm">
                {currentPerfume.codeProduit}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-4 md:p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl lg:text-3xl font-playfair text-[#805050] mb-1">
                    {currentPerfume.nomLolly}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base lg:text-lg font-medium text-gray-700">
                    Inspiré de {currentPerfume.nomParfumInspire} -{" "}
                    {currentPerfume.marqueInspire}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-[#CE8F8A]/20 flex-shrink-0"
                  onClick={handleAddToFavorites}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite(currentPerfume.codeProduit) ? "fill-[#CE8F8A] text-[#CE8F8A]" : "text-[#CE8F8A]"}`}
                  />
                </Button>
              </div>
            </CardHeader>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge
                className={`${getGenreColor(currentPerfume.genre)} font-medium`}
              >
                {currentPerfume.genre}
              </Badge>
              <Badge
                className={`${getSaisonColor(currentPerfume.saison)} font-medium`}
              >
                {currentPerfume.saison}
              </Badge>
              <Badge className="bg-[#D4C2A1] text-[#805050] font-medium">
                {currentPerfume.familleOlfactive}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Notes de tête
                </h3>
                <div className="flex flex-wrap gap-1">
                  {currentPerfume.noteTete.map((note, index) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Notes de cœur
                </h3>
                <div className="flex flex-wrap gap-1">
                  {currentPerfume.noteCoeur.map((note, index) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Notes de fond
                </h3>
                <div className="flex flex-wrap gap-1">
                  {currentPerfume.noteFond.map((note, index) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{currentPerfume.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Contenances disponibles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {activeContenances.map((item) => (
                  <Button
                    key={item.refComplete}
                    variant={
                      selectedSize === item.refComplete ? "default" : "outline"
                    }
                    className={
                      selectedSize === item.refComplete
                        ? "bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-xs sm:text-sm"
                        : "border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10 text-xs sm:text-sm"
                    }
                    onClick={() => setSelectedSize(item.refComplete)}
                  >
                    {item.contenance} {item.unite} - {item.prix.toFixed(3)} TND
                  </Button>
                ))}
              </div>
            </div>

            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>

              <Button
                className="bg-[#805050] hover:bg-[#805050]/90 text-white w-full sm:w-auto text-sm"
                disabled={!selectedSize}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ajouter au panier
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      <CartDialog open={showCart} onOpenChange={setShowCart} />
    </div>
  );
};

export default PerfumeDetail;
