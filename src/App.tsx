import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./components/home"));
const ClientSpace = lazy(() => import("./components/ClientSpace"));
const ConseillerSpace = lazy(() => import("./components/ConseillerSpace"));
const AdminSpace = lazy(() => import("./components/AdminSpace"));
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
let tempoRoutes: ReturnType<typeof useRoutes> | null = null;
if (import.meta.env.VITE_TEMPO === "true") {
  const { default: routes } = await import("tempo-routes");
  tempoRoutes = useRoutes(routes);
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <>
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<p>Loading...</p>}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="/client"
                element={
                  <Suspense fallback={<p>Loading...</p>}>
                    <ClientSpace />
                  </Suspense>
                }
              />
              <Route
                path="/conseillere"
                element={
                  <Suspense fallback={<p>Loading...</p>}>
                    <ConseillerSpace />
                  </Suspense>
                }
              />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<p>Loading...</p>}>
                    <AdminSpace />
                  </Suspense>
                }
              />
            </Routes>
            {tempoRoutes && tempoRoutes}
          </>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
