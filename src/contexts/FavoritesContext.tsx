import React, { createContext, useContext, useState, ReactNode } from "react";

interface FavoriteItem {
  codeProduit: string;
  nomLolly: string;
  nomParfumInspire: string;
  marqueInspire: string;
  imageURL: string;
  genre: string;
  familleOlfactive: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (codeProduit: string) => void;
  isFavorite: (codeProduit: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("lolly-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Listen for favorites updates
  React.useEffect(() => {
    const handleFavoritesUpdate = () => {
      const saved = localStorage.getItem("lolly-favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some(
        (fav) => fav.codeProduit === item.codeProduit,
      );
      if (!exists) {
        const newFavorites = [...prevFavorites, item];
        localStorage.setItem("lolly-favorites", JSON.stringify(newFavorites));
        return newFavorites;
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (codeProduit: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter(
        (item) => item.codeProduit !== codeProduit,
      );
      localStorage.setItem("lolly-favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (codeProduit: string) => {
    return favorites.some((item) => item.codeProduit === codeProduit);
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("lolly-favorites");
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
