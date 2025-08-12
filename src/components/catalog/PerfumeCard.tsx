import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";

interface PerfumeCardProps {
  codeProduit?: string;
  imageURL?: string;
  nomLolly?: string;
  nomParfumInspire?: string;
  marqueInspire?: string;
  genre?: "homme" | "femme" | "mixte";
  saison?: "été" | "hiver" | "toutes saisons";
  familleOlfactive?: string;
  active?: boolean;
  onClick?: () => void;
  /**
   * Allow clicking on inactive products. Useful in admin views where
   * details of inactive items should remain accessible.
   */
  allowInactiveClick?: boolean;
}

const PerfumeCard = ({
  codeProduit = "L001",
  imageURL = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
  nomLolly = "Élégance Nocturne",
  nomParfumInspire = "Black Opium",
  marqueInspire = "Yves Saint Laurent",
  genre = "femme",
  saison = "toutes saisons",
  familleOlfactive = "Oriental Vanillé",
  active = true,
  onClick = () => {},
  allowInactiveClick = false,
}: PerfumeCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();

    const favoriteItem = {
      codeProduit,
      nomLolly,
      nomParfumInspire,
      marqueInspire,
      imageURL,
      genre,
      familleOlfactive,
    };

    const isCurrentlyFavorite = isFavorite(codeProduit);
    const action = isCurrentlyFavorite ? "remove" : "add";

    if (isCurrentlyFavorite) {
      removeFromFavorites(codeProduit);
    } else {
      addToFavorites(favoriteItem);
    }

    // Dispatch event for conseillère favorites
    const conseillereFavoriteEvent = new CustomEvent(
      "conseillereFavoriteToggle",
      {
        detail: {
          perfume: favoriteItem,
          action: action,
        },
      },
    );
    window.dispatchEvent(conseillereFavoriteEvent);
  };
  // Map genre to color
  const genreColorMap = {
    homme: "bg-blue-100 text-blue-800",
    femme: "bg-pink-100 text-pink-800",
    mixte: "bg-purple-100 text-purple-800",
  };

  // Map saison to color
  const saisonColorMap = {
    été: "bg-yellow-100 text-yellow-800",
    hiver: "bg-blue-100 text-blue-800",
    "toutes saisons": "bg-green-100 text-green-800",
  };

  return (
    <div className="relative">
      <Card
        className={`w-full max-w-[280px] overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer bg-white ${
          !active
            ? `opacity-50 grayscale${allowInactiveClick ? "" : " pointer-events-none"}`
            : ""
        }`}
        onClick={onClick}
      >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={imageURL}
          alt={nomLolly}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-[#CE8F8A] text-white text-xs px-2 py-1 rounded">
          {codeProduit}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
          onClick={handleAddToFavorites}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite(codeProduit) ? "fill-[#CE8F8A] text-[#CE8F8A]" : "text-[#CE8F8A]"}`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-playfair text-lg font-semibold text-[#805050] mb-1">
          {nomLolly}
        </h3>

        <div className="text-sm text-gray-600 mb-2">
          Inspiré de <span className="font-medium">{nomParfumInspire}</span>
        </div>

        <div className="text-xs text-gray-500 mb-3">{marqueInspire}</div>

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className={`text-xs ${genreColorMap[genre]}`}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </Badge>

          <Badge
            variant="outline"
            className={`text-xs ${saisonColorMap[saison]}`}
          >
            {saison.charAt(0).toUpperCase() + saison.slice(1)}
          </Badge>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="text-xs font-medium text-[#AD9C92]">
            Famille: {familleOlfactive}
          </span>
        </div>
      </CardContent>
    </Card>
    {!active && (
      <div className="pointer-events-none absolute inset-0 backdrop-blur-sm flex items-center justify-center text-red-600 font-bold text-sm">
        Produit inactif
      </div>
    )}
  </div>
  );
};

export default PerfumeCard;
