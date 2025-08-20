import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClientSpace from "./components/ClientSpace";
import ConseillerSpace from "./components/ConseillerSpace";
import AdminSpace from "./components/AdminSpace";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import routes from "tempo-routes";

function App() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Suspense fallback={<p>Loading...</p>}>
            <>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/client" element={<ClientSpace />} />
                <Route path="/advisor" element={<ConseillerSpace />} />
                <Route path="/admin" element={<AdminSpace />} />
              </Routes>
              {tempoRoutes}
            </>
          </Suspense>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
