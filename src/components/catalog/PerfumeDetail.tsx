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
import { supabase } from "@/lib/supabaseClient";
import { getPublicImageUrl } from "@/lib/imageUtils";

interface PerfumeSummary {
  codeProduit: string;
  nomLolly: string;
  nomParfumInspire: string;
  marqueInspire: string;
  genre: "homme" | "femme" | "mixte";
  saison: "été" | "hiver" | "toutes saisons";
  familleOlfactive: string;
  imageURL: string;
}

interface PerfumeDetailData extends PerfumeSummary {
  noteTete: string[];
  noteCoeur: string[];
  noteFond: string[];
  description: string;
  contenances: {
    refComplete: string;
    contenance: number;
    unite: string;
    prix: number;
    stockActuel: number;
    actif: boolean;
  }[];
}

interface PerfumeDetailProps {
  perfume?: PerfumeSummary;
  onAddToCart?: (refComplete: string, quantity: number) => void;
  onAddToFavorites?: (codeProduit: string) => void;
}

const PerfumeDetail: React.FC<PerfumeDetailProps> = ({
  perfume,
  onAddToCart = () => {},
  onAddToFavorites = () => {},
}) => {
  const defaultPerfume: PerfumeDetailData = {
    codeProduit: "L001",
    nomLolly: "Élégance Nocturne",
    nomParfumInspire: "Black Opium",
    marqueInspire: "Yves Saint Laurent",
    genre: "femme",
    saison: "toutes saisons",
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
        refComplete: "L001-15ml",
        contenance: 15,
        unite: "ml",
        prix: 19.9,
        stockActuel: 25,
        actif: true,
      },
      {
        refComplete: "L001-30ml",
        contenance: 30,
        unite: "ml",
        prix: 29.9,
        stockActuel: 18,
        actif: true,
      },
      {
        refComplete: "L001-50ml",
        contenance: 50,
        unite: "ml",
        prix: 39.9,
        stockActuel: 10,
        actif: true,
      },
      {
        refComplete: "L001-100ml",
        contenance: 100,
        unite: "ml",
        prix: 59.9,
        stockActuel: 0,
        actif: false,
      },
    ],
  };

  const [currentPerfume, setCurrentPerfume] =
    useState<PerfumeDetailData>(perfume ? { ...defaultPerfume, ...perfume } : defaultPerfume);

  const [imageUpdateKey, setImageUpdateKey] = useState(() => Date.now());

  React.useEffect(() => {
    setCurrentPerfume(perfume ? { ...defaultPerfume, ...perfume } : defaultPerfume);
    setImageUpdateKey(Date.now());
  }, [perfume]);

  React.useEffect(() => {
    const fetchDetails = async () => {
      if (!perfume?.codeProduit) return;
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          note_tete,
          note_coeur,
          note_fond,
          description,
          image_url,
          product_variants(ref_complete, contenance, unite, prix, stock_actuel, actif)
        `
        )
        .eq("code_produit", perfume.codeProduit)
        .single();

      if (error) {
        console.error("Error loading product details:", error);
        return;
      }

      if (data) {
        setCurrentPerfume((prev) => ({
          ...prev,
          noteTete: data.note_tete || [],
          noteCoeur: data.note_coeur || [],
          noteFond: data.note_fond || [],
          description: data.description || "",
          imageURL: data.image_url
            ? getPublicImageUrl(data.image_url)
            : prev.imageURL,
          contenances:
            data.product_variants?.map((v: any) => ({
              refComplete: v.ref_complete,
              contenance: v.contenance,
              unite: v.unite,
              prix: v.prix,
              stockActuel: v.stock_actuel,
              actif: v.actif,
            })) || [],
        }));
        setImageUpdateKey(Date.now());
      }
    };

    fetchDetails();
  }, [perfume]);

  const imageKey = `${currentPerfume.codeProduit}-${imageUpdateKey}-${currentPerfume.imageURL?.split("?")[0]}`;

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
                loading="lazy"
                decoding="async"
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

            <div className="mb-6 text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Code produit:&nbsp;</span>
                {currentPerfume.codeProduit}
              </div>
              <div>
                <span className="font-medium">Nom Lolly:&nbsp;</span>
                {currentPerfume.nomLolly}
              </div>
              <div>
                <span className="font-medium">Parfum inspiré:&nbsp;</span>
                {currentPerfume.nomParfumInspire}
              </div>
              <div>
                <span className="font-medium">Marque inspirée:&nbsp;</span>
                {currentPerfume.marqueInspire}
              </div>
              <div>
                <span className="font-medium">Genre:&nbsp;</span>
                {currentPerfume.genre}
              </div>
              <div>
                <span className="font-medium">Saison:&nbsp;</span>
                {currentPerfume.saison}
              </div>
              <div>
                <span className="font-medium">Famille olfactive:&nbsp;</span>
                {currentPerfume.familleOlfactive}
              </div>
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
