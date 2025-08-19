// src/components/AdminSpaceView.tsx
import { useState, useEffect, useMemo } from "react";
import type React from "react";
import { motion } from "framer-motion";
// import HomeLayout from "./HomeLayout"; // (supprimé: non utilisé)
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Textarea } from "./ui/textarea";
import LoginDialog from "./auth/LoginDialog";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Package,
  Users,
  BarChart3,
  Settings,
  Archive,
  FileText,
  Download,
  Upload,
  AlertTriangle,
  Edit,
  Plus,
  Search,
  Eye,
  TrendingUp,
  UserPlus,
  LogOut,
  X,
} from "lucide-react";
import PerfumeCatalog from "./catalog/PerfumeCatalog";
import PerfumeDetail from "./catalog/PerfumeDetail";
import { supabase, purgeLocalSupabaseTokens } from "@/lib/supabaseClient";

const AdminSpace: React.FC = () => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [noteTete, setNoteTete] = useState("");
  const [noteCoeur, setNoteCoeur] = useState("");
  const [noteFond, setNoteFond] = useState("");
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [showNewPromotion, setShowNewPromotion] = useState(false);
  const [showEditPromotion, setShowEditPromotion] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [selectedProductForRestock, setSelectedProductForRestock] =
    useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [newUserFormData, setNewUserFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    whatsapp: "",
    dateNaissance: "",
    role: "client",
    password: "",
  });

  // Preview states
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewType, setPreviewType] = useState("");

  // Data
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((sale) => {
      if (!dateFilter.start || !dateFilter.end) return true;
      const saleDate = new Date(sale.date);
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [orders, dateFilter.start, dateFilter.end]);

  // ---- LOAD DATA (inchangé) ----
  const loadData = async () => {
    console.log("🚀 Starting data refresh with RLS diagnostics...");
    try {
      setLoading(true);

      // Users via API
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch("/api/admin/list-users", {
        headers: { Authorization: "Bearer " + accessToken },
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("❌ Error loading users:", error);
        alert("❌ Erreur lors du chargement des utilisateurs: " + (error || response.statusText));
        setUsers([]);
      } else {
        const userData = (await response.json()) || [];
        const formattedUsers = userData.map((user: any) => ({
          id: user.id,
          name: `${user.prenom || "Prénom"} ${user.nom || "Nom"}`,
          email: user.email || "email@example.com",
          role: user.role || "client",
          prenom: user.prenom || "Prénom",
          nom: user.nom || "Nom",
          telephone: user.telephone,
          whatsapp: user.whatsapp,
          dateNaissance: user.date_naissance,
          adresse: user.adresse,
          codeClient: user.code_client,
          isNew: false,
          lastOrder:
            user.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        }));
        setUsers(formattedUsers);
      }

      // Products
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(`*, product_variants(*)`);

        if (!productsError) {
          const formatted = (productsData || []).map((p: any) => ({
            id: p.id,
            codeArticle: p.code_produit,
            name: p.nom_lolly,
            nomParfumInspire: p.nom_parfum_inspire,
            marqueInspire: p.marque_inspire,
            brand: "Lolly",
            price: p.product_variants?.[0]?.prix || 0,
            stock:
              p.product_variants?.reduce((s: number, v: any) => s + (v.stock_actuel || 0), 0) || 0,
            active: p.active,
            imageURL: p.image_url,
            genre: p.genre,
            saison: p.saison,
            familleOlfactive: p.famille_olfactive,
            noteTete: p.note_tete,
            noteCoeur: p.note_coeur,
            noteFond: p.note_fond,
            description: p.description,
            variants:
              p.product_variants?.map((v: any) => ({
                id: v.id,
                size: `${v.contenance}${v.unite}`,
                price: v.prix,
                stock: v.stock_actuel || 0,
                refComplete: v.ref_complete,
                actif: v.actif,
              })) || [],
          }));
          setProducts(formatted);
        } else {
          console.error("❌ Products error:", productsError);
        }
      } catch (err) {
        console.error("❌ Products loading failed:", err);
      }

      // Promotions
      try {
        const { data: promotionsData, error: promotionsError } = await supabase
          .from("promotions")
          .select("*");
        if (!promotionsError) setPromotions(promotionsData || []);
        else console.error("❌ Promotions error:", promotionsError);
      } catch (err) {
        console.error("❌ Promotions loading failed:", err);
      }

      // Orders (inchangé)
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            *,
            client:users!orders_user_id_fkey(prenom, nom),
            conseillere:users!orders_conseillere_id_fkey(prenom, nom),
            order_items(
              *,
              product_variants(
                *,
                products(*)
              )
            )
          `);

        if (ordersError) {
          console.error("❌ Orders error:", ordersError);
          if (
            ordersError.code === "42501" ||
            ordersError.message?.includes("row-level security") ||
            ordersError.message?.includes("policy") ||
            ordersError.message?.includes("permission denied")
          ) {
            const sqlCommands =
              `-- SOLUTION 1\nALTER TABLE orders DISABLE ROW LEVEL SECURITY;\n\n` +
              `-- SOLUTION 2\nCREATE POLICY "Public read access" ON orders FOR SELECT USING (true);\n\n` +
              `SELECT * FROM orders LIMIT 5;`;
            try {
              await navigator.clipboard.writeText(sqlCommands);
            } catch {}
            alert(
              `🔒 PROBLÈME RLS DÉTECTÉ\n\n` +
                `Copié dans le presse-papiers :\n${sqlCommands}`
            );
          } else {
            alert("❌ Erreur lors du chargement des commandes: " + ordersError.message);
          }
          setOrders([]);
        } else {
          const formattedOrders = (ordersData || []).flatMap((order: any) =>
            (order.order_items || []).map((item: any) => ({
              id: `${order.id}-${item.id}`,
              date: order.created_at?.split("T")[0] ?? new Date().toISOString().split("T")[0],
              client:
                order.client &&
                typeof order.client === "object" &&
                !Array.isArray(order.client) &&
                "prenom" in order.client &&
                "nom" in order.client
                  ? `${(order.client as any).prenom} ${(order.client as any).nom}`
                  : "Client inconnu",
              codeClient: order.code_client,
              product: item.product_variants?.products?.nom_lolly ?? "Produit inconnu",
              codeArticle: item.product_variants?.ref_complete ?? "N/A",
              quantity: item.quantity,
              parfumInspire: item.product_variants?.products?.nom_parfum_inspire ?? "N/A",
              marqueInspire: item.product_variants?.products?.marque_inspire ?? "N/A",
              amount: item.total_price,
              conseillere:
                order.conseillere &&
                typeof order.conseillere === "object" &&
                !Array.isArray(order.conseillere) &&
                "prenom" in order.conseillere &&
                "nom" in order.conseillere
                  ? `${(order.conseillere as any).prenom} ${(order.conseillere as any).nom}`
                  : "N/A",
            })),
          );
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error("❌ Orders loading failed:", err);
      }
    } catch (error: any) {
      console.error("💥 RADICAL RELOAD FAILED:", error);
      alert("❌ Erreur critique lors du chargement des données: " + error.message);
    } finally {
      setLoading(false);
      console.log("🏁 RADICAL RELOAD COMPLETED");
    }
  };

  // Rafraîchir après import users (inchangé)
  useEffect(() => {
    const handleUsersImported = async () => {
      setTimeout(async () => {
        await loadData();
      }, 500);
    };
    window.addEventListener("usersImported", handleUsersImported);
    
// Reload smoothly when the tab regains focus (no purge, no full-screen spinner)
useEffect(() => {
  const onFocus = () => {
    // Touch Supabase to ensure session is alive; no UI blocking
    supabase.auth.getUser().catch(() => {});
  };
  window.addEventListener('focus', onFocus);
  return () => window.removeEventListener('focus', onFocus);
}, []);
return () => window.removeEventListener("usersImported", handleUsersImported);
  }, []);

  // Nouveaux événements de vente (inchangé)
  useEffect(() => {
    const handleNewSale = async (e: any) => {
      if (Array.isArray(e.detail?.products)) {
        const entries = e.detail.products.map((p: any, index: number) => ({
          id: `${Date.now()}-${index}-${p.codeArticle}`,
          date: e.detail.date,
          client: e.detail.client,
          codeClient: e.detail.codeClient,
          product: p.product,
          codeArticle: p.codeArticle,
          quantity: p.quantity,
          amount: p.amount,
          conseillere: p.conseillere || "N/A",
        }));
        setOrders((prev) => [...entries, ...prev]);
      } else {
        const sale = { ...e.detail, id: e.detail?.id ?? `${Date.now()}`, quantity: e.detail.quantity };
        setOrders((prev) => [sale, ...prev]);
      }
      try {
        await loadData();
      } catch (error) {
        console.error("❌ Erreur lors du rechargement des commandes:", error);
        alert("❌ Erreur lors du rechargement des commandes depuis Supabase");
      }
    };
    window.addEventListener("newSaleRecorded", handleNewSale);
    return () => window.removeEventListener("newSaleRecorded", handleNewSale);
  }, []);

  // --------- EXPORT / IMPORT utils (inchangé) ----------
  const handleExportExcel = (type: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    try {
      let csvContent = "\uFEFF";
      let headers = "";
      let rows = "";
      const currentDate = new Date().toISOString().split("T")[0];

      if (type === "sales") {
        headers =
          "Date,Client,Code Client,Produit,Code Article,Quantité,Parfum Inspiré,Marque Inspirée,Montant TND,Conseillère\n";
        const filteredSales = orders.filter((sale) => {
          if (!dateFilter.start || !dateFilter.end) return true;
          const saleDate = new Date(sale.date);
          const startDate = new Date(dateFilter.start);
          const endDate = new Date(dateFilter.end);
          return saleDate >= startDate && saleDate <= endDate;
        });
        if (filteredSales.length === 0) {
          alert("Aucune vente à exporter.");
          return;
        }
        filteredSales.forEach((sale) =>
{loading && (
  <div className="fixed top-4 right-4 z-50">
    <div className="px-3 py-2 rounded-lg shadow bg-white/90 text-[#805050] text-sm">
      Actualisation des données…
    </div>
  </div>
)}
 {
          const amount = Number.isFinite(sale.amount) ? sale.amount.toFixed(3) : "0.000";
          rows += `"${sale.date}","${sale.client}","${sale.codeClient}","${sale.product}","${sale.codeArticle}","${sale.quantity}","${sale.parfumInspire}","${sale.marqueInspire}","${amount}","${sale.conseillere}"\n`;
        });
      } else if (type === "clients") {
        headers =
          "Client,Code Client,Email,Articles Achetés,Parfum Inspiré,Marque Inspirée,Prix TND,Date Achat,Statut\n";
        users
          .filter((user) => user.role === "client")
          .forEach((client) => {
            rows += `"${client.name}","${client.codeClient}","${client.email}","L001-30","Black Opium","Yves Saint Laurent","29.900","${client.lastOrder}","Actif"\n`;
          });
      }

      csvContent += headers + rows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${type}_export_${currentDate}.csv`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      alert(`Export ${type} terminé avec succès! Fichier: ${type}_export_${currentDate}.csv`);
    } catch (err) {
      alert("Erreur lors de l’export");
      console.error(err);
    }
  };

  const handleDownloadTemplate = (type: "products" | "users" | "restock") => {
    const templates = {
      products:
        "code_produit,nom_lolly,nom_parfum_inspire,marque_inspire,genre,saison,famille_olfactive,note_tete,note_coeur,note_fond,description,image_url,prix_15ml,stock_15ml,prix_30ml,stock_30ml,prix_50ml,stock_50ml\n" +
        'L001,Élégance Nocturne,Black Opium,Yves Saint Laurent,femme,toutes saisons,Oriental Vanillé,"Café,Poire,Mandarine","Jasmin,Fleur d\'oranger,Vanille","Patchouli,Cèdre,Musc",Une fragrance envoûtante qui mêle l\'intensité du café à la douceur de la vanille,https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80,19.900,10,29.900,15,39.900,8',
      users:
        "nom,prenom,email,role,telephone,whatsapp,date_naissance,adresse,code_client\n" +
        "Dupont,Jean,jean.dupont@email.com,client,+216 20 123 456,+216 20 123 456,1990-01-15,123 Avenue Habib Bourguiba Tunis,C001",
      restock:
        "code_produit,contenance,quantite_a_ajouter,date_reapprovisionnement,remarque\n" +
        "L001,30,10,2024-01-20,Commande fournisseur #123",
    };
    const csvContent = "\uFEFF" + templates[type];
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `template_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ------ Encodage helpers + import (inchangé) ------
  const fixEncoding = (text: any) => {
    if (!text || typeof text !== "string") return text;
    return text
      .replace(/Ã©/g, "é")
      .replace(/Ã¨/g, "è")
      .replace(/Ã /g, "à")
      .replace(/Ã§/g, "ç")
      .replace(/Ã¢/g, "â")
      .replace(/Ã´/g, "ô")
      .replace(/Ã®/g, "î")
      .replace(/Ã»/g, "û")
      .replace(/Ã¹/g, "ù")
      .replace(/Ã«/g, "ë")
      .replace(/Ã¯/g, "ï")
      .replace(/Ã¼/g, "ü")
      .replace(/â€™/g, "'")
      .replace(/â€œ/g, '"')
      .replace(/â€/g, '"');
  };

  // ... (tout le gros bloc handleFilePreview / handleFileImport inchangé)
  // Pour gagner de la place ici, garde **exactement** tes fonctions handleFilePreview et handleFileImport
  // telles qu’elles sont dans ta version actuelle.

  // =======================
  // ✅ GARDE DE SESSION FIABLE
  // =======================
  useEffect(() => {
    let mounted = true;

    // 1) Bootstrap: regarder la session persistée SANS purger
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const session = data.session ?? null;
      setShowLogin(!session);
      setReady(true);
      if (session) {
        await loadData();
      }
    };

    // 2) Ecouter toute évolution d'état d'auth (login, logout, refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setShowLogin(!session);
      if (session) {
        // on recharge les données quand l’utilisateur se connecte
        loadData();
      } else {
        // pas de purge automatique ici – on laisse l’utilisateur se reconnecter
      }
    });

    bootstrap();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    purgeLocalSupabaseTokens(); // purge uniquement à la déconnexion volontaire
    setShowLogin(true);
  };

  const toggleProductStatus = async (productId: number) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const { error } = await supabase
        .from("products")
        .update({ active: !product.active })
        .eq("id", productId);
      if (error) {
        alert("Erreur lors de la mise à jour du statut du produit");
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p)),
      );
      window.dispatchEvent(new CustomEvent("productStatusUpdated", { detail: { id: productId } }));
      alert("Statut du produit mis à jour avec succès!");
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  // Indicateurs stock (inchangé)
  const stockIndicators = useMemo(() => {
    let critique = 0,
      faible = 0,
      ok = 0;
    products.forEach((product) => {
      product.variants.forEach((v: any) => {
        if (v.stock === 0) critique++;
        else if (v.stock < 5) faible++;
        else ok++;
      });
    });
    return { critique, faible, ok };
  }, [products]);

  const filteredProducts = products.filter(
    (p) =>
      searchTerm === "" ||
      p.codeArticle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nomParfumInspire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marqueInspire.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ---------- Rendu ----------
  if (!ready) return <div style={{ padding: 24 }}>Chargement…</div>;

  if (showLogin) {
    return <LoginDialog open={showLogin} onOpenChange={setShowLogin} hideRegistration={true} />;
  }

  
/* Full-screen loading removed by AdminSpaceX_nouveau */


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
              <h2 className="text-3xl font-normal font-playfair text-[#805050] mb-4">
                Espace Administration
              </h2>
              <p className="text-[#AD9C92] font-montserrat">Gérez votre boutique et vos données</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 gap-1 md:gap-0 bg-white border border-[#805050] p-1 md:p-0 h-auto">
              <TabsTrigger value="products" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <Package className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Produits</span>
              </TabsTrigger>
              <TabsTrigger value="stock" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <Archive className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Stock</span>
              </TabsTrigger>
              <TabsTrigger value="catalog" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <Package className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Catalogue</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <Users className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Utilisateurs</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <BarChart3 className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Rapports</span>
              </TabsTrigger>
              <TabsTrigger value="import" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <FileText className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Import/Export</span>
              </TabsTrigger>
              <TabsTrigger value="config" className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]">
                <Settings className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Configuration</span>
              </TabsTrigger>
            </TabsList>

            {/* Products Tab (inchangé) */}
            {/* ... */}

            {/* Stock Tab */}
            <TabsContent value="stock" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair">Gestion du Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="font-semibold text-red-700">Stock Critique</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-2">{stockIndicators.critique}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold text-yellow-700">Stock Faible</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">{stockIndicators.faible}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-green-700">Stock OK</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-2">{stockIndicators.ok}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Variante</TableHead>
                        <TableHead>Stock Actuel</TableHead>
                        <TableHead>Seuil Alerte</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.flatMap((product) =>
                        product.variants.map((variant: any, index: number) => (
                          <TableRow key={`${product.id}-${index}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.codeArticle}</div>
                              </div>
                            </TableCell>
                            <TableCell>{variant.size}</TableCell>
                            <TableCell>{variant.stock}</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  variant.stock === 0 ? "destructive" : variant.stock < 5 ? "secondary" : "default"
                                }
                              >
                                {variant.stock === 0 ? "Rupture" : variant.stock < 5 ? "Faible" : "OK"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-[#805050] hover:bg-[#704040] text-white"
                                  onClick={() => {
                                    setSelectedProductForRestock({
                                      product,
                                      variant,
                                      variantIndex: index,
                                    });
                                    setShowRestock(true);
                                  }}
                                >
                                  Réapprovisionner
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  // ❗️Corrigé: "stock" -> "restock"
                                  onClick={() => handleFileImport("restock")}
                                >
                                  <Upload className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )),
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Les autres tabs et dialogs restent identiques à ta version actuelle */}
            {/* … */}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSpace;
