import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HomeLayout from "./HomeLayout";
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
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  LogOut,
  X,
} from "lucide-react";
import PerfumeCatalog from "./catalog/PerfumeCatalog";
import PerfumeDetail from "./catalog/PerfumeDetail";
import { supabase } from "../lib/supabase";

const AdminSpace = () => {
  const { register } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [showLogin, setShowLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [showNewPromotion, setShowNewPromotion] = useState(false);
  const [showEditPromotion, setShowEditPromotion] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedProductForRestock, setSelectedProductForRestock] =
    useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
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
  const [previewFile, setPreviewFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewType, setPreviewType] = useState("");

  // State for products from Supabase
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [orders, setOrders] = useState([]);

  // Enhanced data loading with RLS diagnostics
  const loadData = async () => {
    console.log("🚀 Starting data refresh with RLS diagnostics...");

    try {
      setLoading(true);

      // STEP 1: Load users with comprehensive RLS error handling
      console.log("👥 Loading users from Supabase...");

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("📊 Raw users data from Supabase:", usersData);
      console.log("❓ Users error:", usersError);

      if (usersError) {
        console.error("❌ Error loading users:", usersError);

        // Check if it's an RLS error
        if (
          usersError.code === "42501" ||
          usersError.message?.includes("row-level security") ||
          usersError.message?.includes("policy") ||
          usersError.message?.includes("permission denied")
        ) {
          console.log("🔒 RLS Error detected! Showing RLS diagnostic info...");

          // Show detailed RLS error with solutions
          const rlsErrorMessage =
            `🔒 PROBLÈME RLS (Row Level Security) DÉTECTÉ\n\n` +
            `❌ Erreur: ${usersError.message}\n\n` +
            `🔧 SOLUTIONS RECOMMANDÉES:\n\n` +
            `SOLUTION 1 (Recommandée pour développement):\n` +
            `Désactiver RLS sur la table users:\n` +
            `ALTER TABLE users DISABLE ROW LEVEL SECURITY;\n\n` +
            `SOLUTION 2 (Alternative):\n` +
            `Créer une politique d'accès public:\n` +
            `CREATE POLICY "Public read access" ON users FOR SELECT USING (true);\n\n` +
            `📋 ÉTAPES À SUIVRE:\n` +
            `1. Ouvrez l'éditeur SQL de Supabase\n` +
            `2. Exécutez une des commandes SQL ci-dessus\n` +
            `3. Revenez ici et cliquez sur "Actualiser"\n\n` +
            `💡 Ces commandes SQL sont copiées dans le presse-papiers.`;

          // Copy SQL commands to clipboard
          const sqlCommands = `-- SOLUTION 1: Désactiver RLS (recommandé pour développement)\nALTER TABLE users DISABLE ROW LEVEL SECURITY;\n\n-- OU SOLUTION 2: Créer une politique d'accès public\nCREATE POLICY "Public read access" ON users FOR SELECT USING (true);\n\n-- Vérifier que la table existe et contient des données\nSELECT * FROM users LIMIT 5;`;

          try {
            await navigator.clipboard.writeText(sqlCommands);
            console.log("📋 SQL commands copied to clipboard");
          } catch (clipboardError) {
            console.log("⚠️ Could not copy to clipboard:", clipboardError);
          }

          alert(rlsErrorMessage);
        } else {
          // Other types of errors
          alert(
            "❌ Erreur lors du chargement des utilisateurs: " +
              usersError.message,
          );
        }
        setUsers([]);
      } else {
        // Always process the data, even if it's an empty array
        const userData = usersData || [];
        console.log(
          "✅ Processing users data:",
          userData.length,
          "users found",
        );

        if (userData.length > 0) {
          console.log("📋 Sample user data:", userData[0]);
        }

        const formattedUsers = userData.map((user) => {
          return {
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
              user.created_at?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
          };
        });

        console.log("✅ Formatted users:", formattedUsers.length);
        console.log("📋 Formatted users data:", formattedUsers);
        setUsers(formattedUsers);
      }

      // STEP 3: Load products (simplified)
      console.log("📦 Loading products...");
      try {
        const { data: productsData, error: productsError } =
          await supabase.from("products").select(`
            *,
            product_variants(*)
          `);

        if (productsError) {
          console.error("❌ Products error:", productsError);
        } else {
          const formattedProducts = (productsData || []).map((product) => ({
            id: product.id,
            codeArticle: product.code_produit,
            name: product.nom_lolly,
            nomParfumInspire: product.nom_parfum_inspire,
            marqueInspire: product.marque_inspire,
            brand: "Lolly",
            price: product.product_variants?.[0]?.prix || 0,
            stock:
              product.product_variants?.reduce(
                (sum, v) => sum + (v.stock_actuel || 0),
                0,
              ) || 0,
            active: product.active,
            imageURL: product.image_url,
            genre: product.genre,
            saison: product.saison,
            familleOlfactive: product.famille_olfactive,
            noteTete: product.note_tete,
            noteCoeur: product.note_coeur,
            noteFond: product.note_fond,
            description: product.description,
            variants:
              product.product_variants?.map((v) => ({
                id: v.id,
                size: `${v.contenance}${v.unite}`,
                price: v.prix,
                stock: v.stock_actuel || 0,
                refComplete: v.ref_complete,
                actif: v.actif,
              })) || [],
          }));
          setProducts(formattedProducts);
          console.log("✅ Products loaded:", formattedProducts.length);
        }
      } catch (err) {
        console.error("❌ Products loading failed:", err);
      }

      // STEP 4: Load promotions (simplified)
      console.log("🎯 Loading promotions...");
      try {
        const { data: promotionsData, error: promotionsError } = await supabase
          .from("promotions")
          .select("*");

        if (promotionsError) {
          console.error("❌ Promotions error:", promotionsError);
        } else {
          setPromotions(promotionsData || []);
          console.log("✅ Promotions loaded:", (promotionsData || []).length);
        }
      } catch (err) {
        console.error("❌ Promotions loading failed:", err);
      }

      // STEP 5: Load orders (simplified)
      console.log("📋 Loading orders...");
      try {
        const { data: ordersData, error: ordersError } = await supabase.from(
          "orders",
        ).select(`
            *,
            users!orders_user_id_fkey(prenom, nom),
            users!orders_conseillere_id_fkey(prenom, nom),
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
        } else {
          const formattedOrders = (ordersData || []).map((order) => ({
            id: order.id,
            date:
              order.created_at?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
            client:
              order.users &&
              typeof order.users === "object" &&
              !Array.isArray(order.users) &&
              "prenom" in order.users &&
              "nom" in order.users
                ? `${(order.users as { prenom: string; nom: string }).prenom} ${(order.users as { prenom: string; nom: string }).nom}`
                : "Client inconnu",
            codeClient: order.code_client,
            product:
              order.order_items?.[0]?.product_variants?.products?.nom_lolly ||
              "Produit inconnu",
            codeArticle:
              order.order_items?.[0]?.product_variants?.ref_complete || "N/A",
            amount: order.total_amount,
            conseillere:
              order.users &&
              typeof order.users === "object" &&
              !Array.isArray(order.users) &&
              "prenom" in order.users &&
              "nom" in order.users
                ? `${(order.users as { prenom: string; nom: string }).prenom} ${(order.users as { prenom: string; nom: string }).nom}`
                : "N/A",
          }));
          setOrders(formattedOrders);
          console.log("✅ Orders loaded:", formattedOrders.length);
        }
      } catch (err) {
        console.error("❌ Orders loading failed:", err);
      }
    } catch (error) {
      console.error("💥 RADICAL RELOAD FAILED:", error);
      alert(
        "❌ Erreur critique lors du chargement des données: " + error.message,
      );
    } finally {
      setLoading(false);
      console.log("🏁 RADICAL RELOAD COMPLETED");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("🚀 Initial data load triggered by authentication");
      loadData();
    }
  }, [isAuthenticated]);

  // Add effect to listen for user import events
  useEffect(() => {
    const handleUsersImported = async (event) => {
      console.log("📥 Users imported event received:", event.detail);
      // Wait a bit for database to be consistent
      setTimeout(async () => {
        console.log("🔄 Reloading users after import event...");
        await loadData();
      }, 500);
    };

    window.addEventListener("usersImported", handleUsersImported);

    return () => {
      window.removeEventListener("usersImported", handleUsersImported);
    };
  }, []);

  const handleExportExcel = (type) => {
    // Create CSV content with UTF-8 BOM for Excel compatibility
    let csvContent = "\uFEFF"; // UTF-8 BOM
    let headers = "";
    let rows = "";
    const currentDate = new Date().toISOString().split("T")[0];

    if (type === "sales") {
      headers =
        "Date,Client,Code Client,Produit,Code Article,Marque Inspirée,Montant TND,Conseillère\n";
      const filteredSales = orders.filter((sale) => {
        if (!dateFilter.start || !dateFilter.end) return true;
        const saleDate = new Date(sale.date);
        const startDate = new Date(dateFilter.start);
        const endDate = new Date(dateFilter.end);
        return saleDate >= startDate && saleDate <= endDate;
      });

      filteredSales.forEach((sale) => {
        rows += `"${sale.date}","${sale.client}","${sale.codeClient}","${sale.product}","${sale.codeArticle}","Yves Saint Laurent","${sale.amount.toFixed(3)}","${sale.conseillere}"\n`;
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

    // Create blob with CSV MIME type and UTF-8 encoding
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${type}_export_${currentDate}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    alert(
      `Export ${type} terminé avec succès! Fichier: ${type}_export_${currentDate}.csv`,
    );
  };

  const handleDownloadTemplate = (type) => {
    const templates = {
      products:
        "code_produit,nom_lolly,nom_parfum_inspire,marque_inspire,genre,saison,famille_olfactive,note_tete,note_coeur,note_fond,description,image_url,prix_15ml,stock_15ml,prix_30ml,stock_30ml,prix_50ml,stock_50ml\n" +
        'L001,Élégance Nocturne,Black Opium,Yves Saint Laurent,femme,toutes saisons,Oriental Vanillé,"Café,Poire,Mandarine","Jasmin,Fleur d\'oranger,Vanille","Patchouli,Cèdre,Musc",Une fragrance envoûtante qui mêle l\'intensité du café à la douceur de la vanille,https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80,19.900,10,29.900,15,39.900,8\n' +
        'L002,Mystère Oriental,La Vie Est Belle,Lancôme,femme,toutes saisons,Floral Fruité,"Poire,Cassis,Bergamote","Iris,Jasmin,Fleur d\'oranger","Praline,Vanille,Patchouli",Un parfum joyeux et gourmand qui célèbre la beauté de la vie,https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80,19.900,12,29.900,20,39.900,10',
      users:
        "nom,prenom,email,role,telephone,whatsapp,date_naissance,adresse,code_client\n" +
        "Dupont,Jean,jean.dupont@email.com,client,+216 20 123 456,+216 20 123 456,1990-01-15,123 Avenue Habib Bourguiba Tunis,C001\n" +
        "Martin,Marie,marie.martin@email.com,client,+216 25 987 654,+216 25 987 654,1985-05-20,456 Rue de la République Sfax,C002\n" +
        "Ben Ali,Fatma,fatma.benali@email.com,conseillere,+216 22 555 777,+216 22 555 777,1988-03-10,789 Avenue de la Liberté Sousse,C003\n" +
        "Trabelsi,Ahmed,ahmed.trabelsi@email.com,client,+216 98 444 333,+216 98 444 333,1992-12-05,321 Rue Ibn Khaldoun Monastir,C004",
      restock:
        "code_produit,contenance,quantite_a_ajouter,date_reapprovisionnement,remarque\n" +
        "L001,30,10,2024-01-20,Commande fournisseur #123\n" +
        "L002,50,5,2024-01-20,Réapprovisionnement urgent",
    };

    // Create proper CSV content with UTF-8 BOM
    const csvContent = "\uFEFF" + templates[type]; // Add UTF-8 BOM
    const fileExtension = ".csv";
    const mimeType = "text/csv;charset=utf-8;";

    const blob = new Blob([csvContent], {
      type: mimeType,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `template_${type}${fileExtension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  // Helper function to fix encoding issues
  const fixEncoding = (text) => {
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

  // Function to clear catalog and reload from Supabase
  const clearAndReloadCatalog = async () => {
    try {
      console.log("🗑️ Clearing existing catalog data...");

      // Clear localStorage
      localStorage.removeItem("admin-products");
      localStorage.removeItem("catalog-products");
      localStorage.removeItem("perfume-catalog");

      // Clear local state
      setProducts([]);

      console.log("📥 Loading fresh data from Supabase...");

      // Force reload from Supabase
      await loadData();

      // Dispatch events to update all components
      const catalogClearEvent = new CustomEvent("catalogCleared", {
        detail: { timestamp: Date.now() },
      });
      window.dispatchEvent(catalogClearEvent);

      const catalogUpdateEvent = new CustomEvent("catalogUpdated", {
        detail: { products, source: "supabase" },
      });
      window.dispatchEvent(catalogUpdateEvent);

      alert(
        "✅ Catalogue effacé et rechargé depuis Supabase!\n\n" +
          "- Données locales supprimées\n" +
          "- Nouvelles données chargées depuis Supabase\n" +
          "- Catalogue mis à jour dans tous les espaces\n\n" +
          "Le catalogue affiche maintenant uniquement les données de Supabase.",
      );
    } catch (error) {
      console.error("Error clearing and reloading catalog:", error);
      alert("❌ Erreur lors du rechargement du catalogue depuis Supabase");
    }
  };

  // Check authentication and role
  const { user: authUser, isAuthenticated: authIsAuthenticated } = useAuth();

  React.useEffect(() => {
    console.log("🔍 Admin space useEffect triggered:", {
      authIsAuthenticated,
      authUser: authUser
        ? { email: authUser.email, role: authUser.role }
        : null,
    });

    if (authIsAuthenticated && authUser) {
      console.log("🔍 Admin space access check:", {
        email: authUser.email,
        role: authUser.role,
        isAdmin: authUser.role === "admin",
      });

      // Force admin access for development admin user
      if (
        authUser.email === "admin@lecompasolfactif.com" ||
        authUser.role === "admin"
      ) {
        setIsAuthenticated(true);
        setShowLogin(false);
        console.log("✅ Admin access granted for:", authUser.email);
        return; // Important: return early to prevent further execution
      } else {
        console.log(
          "❌ Access denied for user:",
          authUser.email,
          "Role:",
          authUser.role,
        );
        alert(
          `Accès non autorisé. Votre rôle actuel: ${authUser.role}. Seuls les administrateurs peuvent accéder à cet espace.`,
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
        return;
      }
    } else if (!authIsAuthenticated) {
      console.log("🔐 User not authenticated, showing login");
      setIsAuthenticated(false);
      setShowLogin(true);
    }
  }, [authIsAuthenticated, authUser]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  const toggleProductStatus = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const { error } = await supabase
        .from("products")
        .update({ active: !product.active })
        .eq("id", productId);

      if (error) {
        console.error("Error updating product status:", error);
        alert("Erreur lors de la mise à jour du statut du produit");
        return;
      }

      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p)),
      );

      alert("Statut du produit mis à jour avec succès!");
    } catch (error) {
      console.error("Error toggling product status:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user role:", error);
        alert("Erreur lors de la mise à jour du rôle");
        return;
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      alert("Rôle utilisateur mis à jour avec succès!");
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Erreur lors de la mise à jour du rôle");
    }
  };

  // Calculate stock indicators
  const stockIndicators = React.useMemo(() => {
    let critique = 0;
    let faible = 0;
    let ok = 0;

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.stock === 0) {
          critique++;
        } else if (variant.stock < 5) {
          faible++;
        } else {
          ok++;
        }
      });
    });

    return { critique, faible, ok };
  }, [products]);

  const filteredProducts = products.filter(
    (product) =>
      searchTerm === "" ||
      product.codeArticle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nomParfumInspire
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.marqueInspire.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleFilePreview = (type) => {
    console.log(`🔍 Starting file preview for type: ${type}`);

    // Reset preview state
    setPreviewFile(null);
    setPreviewData([]);
    setPreviewHeaders([]);
    setPreviewType("");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "restock" ? ".csv" : ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setPreviewFile(file);
        setPreviewType(type);

        const reader = new FileReader();
        reader.onload = (event) => {
          console.log(`📄 File loaded for preview: ${file.name}`);
          let content = event.target?.result as string;

          if (!content) {
            console.error("❌ No content found in file");
            alert("❌ Erreur: Le fichier semble vide ou illisible");
            return;
          }

          console.log(`📄 Raw content length: ${content.length}`);
          console.log(`📄 First 200 chars:`, content.substring(0, 200));

          // Fix encoding issues for special characters
          content = fixEncoding(content);

          // Enhanced CSV parsing for preview
          const parseCSVLine = (line) => {
            const result = [];
            let current = "";
            let inQuotes = false;
            let i = 0;

            while (i < line.length) {
              const char = line[i];

              if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                  // Escaped quote
                  current += '"';
                  i += 2;
                } else {
                  // Toggle quote state
                  inQuotes = !inQuotes;
                  i++;
                }
              } else if (char === "," && !inQuotes) {
                // Field separator
                result.push(fixEncoding(current.trim()));
                current = "";
                i++;
              } else {
                current += char;
                i++;
              }
            }

            // Add the last field
            result.push(fixEncoding(current.trim()));
            return result;
          };

          const cleanContent = content
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();
          const lines = cleanContent.split("\n").filter((line) => line.trim());

          if (lines.length > 0) {
            console.log(`📊 Processing ${lines.length} lines for preview`);

            const headers = parseCSVLine(lines[0]).map((h) =>
              fixEncoding(h.replace(/"/g, "").trim()),
            );

            console.log("📋 Preview headers:", headers);
            setPreviewHeaders(headers);

            const data = [];
            const maxRows = Math.min(lines.length - 1, 10); // Preview first 10 data rows

            for (let i = 1; i <= maxRows; i++) {
              if (lines[i] && lines[i].trim()) {
                const values = parseCSVLine(lines[i]).map((v) =>
                  fixEncoding(v.replace(/"/g, "").trim()),
                );
                const rowData = {};
                headers.forEach((header, index) => {
                  rowData[header] = values[index] || "";
                });
                data.push(rowData);
                console.log(`📊 Preview row ${i}:`, rowData);
              }
            }

            console.log(`✅ Preview data prepared: ${data.length} rows`);
            setPreviewData(data);
            setPreviewType(type);
          } else {
            console.error("❌ No lines found in CSV file");
            alert("❌ Erreur: Le fichier CSV semble vide ou mal formaté");
          }
        };

        reader.onerror = () => {
          alert(`❌ Erreur lors de la lecture du fichier ${file.name}`);
        };

        // Try to read with proper encoding detection
        try {
          reader.readAsText(file, "UTF-8");
        } catch (error) {
          console.warn(
            "UTF-8 reading failed, trying with default encoding:",
            error,
          );
          reader.readAsText(file);
        }
      }
    };
    input.click();
  };

  const handleFileImport = async (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "restock" ? ".csv" : ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          let content = event.target?.result as string;

          // Fix encoding issues for special characters
          content = fixEncoding(content);

          if (type === "produits") {
            // Parse CSV content for products with comprehensive handling
            console.log(
              "Raw CSV content (first 500 chars):",
              content.substring(0, 500),
            );
            console.log("Content encoding check:", {
              hasUTF8BOM: content.charCodeAt(0) === 0xfeff,
              firstChars: content
                .substring(0, 10)
                .split("")
                .map((c) => c.charCodeAt(0)),
              containsSpecialChars: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(
                content,
              ),
            });

            // Remove BOM if present
            if (content.charCodeAt(0) === 0xfeff) {
              content = content.substring(1);
            }

            // Handle different line endings and clean the content
            const cleanContent = content
              .replace(/\r\n/g, "\n")
              .replace(/\r/g, "\n")
              .trim();
            const lines = cleanContent
              .split("\n")
              .filter((line) => line.trim());

            console.log("Number of lines found:", lines.length);
            console.log("First line (headers):", lines[0]);
            if (lines.length > 1) {
              console.log("Second line (first data):", lines[1]);
              console.log(
                "Second line chars:",
                lines[1]
                  .split("")
                  .map((c) => `${c}(${c.charCodeAt(0)})`)
                  .slice(0, 20),
              );
            }

            if (lines.length < 2) {
              alert("❌ Fichier CSV invalide: pas assez de lignes de données");
              return;
            }

            // Enhanced CSV parsing with proper quote and delimiter handling
            const parseCSVLine = (line) => {
              const result = [];
              let current = "";
              let inQuotes = false;
              let i = 0;

              while (i < line.length) {
                const char = line[i];

                if (char === '"') {
                  if (inQuotes && line[i + 1] === '"') {
                    // Escaped quote
                    current += '"';
                    i += 2;
                  } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                    i++;
                  }
                } else if (char === "," && !inQuotes) {
                  // Field separator
                  result.push(fixEncoding(current.trim()));
                  current = "";
                  i++;
                } else {
                  current += char;
                  i++;
                }
              }

              // Add the last field
              result.push(fixEncoding(current.trim()));
              return result;
            };

            // Clean and normalize headers
            const rawHeaders = parseCSVLine(lines[0]).map((h) =>
              h.replace(/"/g, "").trim(),
            );

            // Create a mapping of normalized headers to original headers
            const headerMapping = {};
            const normalizeHeader = (header) => {
              return header
                .toLowerCase()
                .replace(/[àáâãäå]/g, "a")
                .replace(/[èéêë]/g, "e")
                .replace(/[ìíîï]/g, "i")
                .replace(/[òóôõö]/g, "o")
                .replace(/[ùúûü]/g, "u")
                .replace(/[ç]/g, "c")
                .replace(/[ñ]/g, "n")
                .replace(/[^a-z0-9]/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_|_$/g, "");
            };

            rawHeaders.forEach((header) => {
              const normalized = normalizeHeader(header);
              headerMapping[normalized] = header;
            });

            console.log("Raw headers:", rawHeaders);
            console.log("Header mapping:", headerMapping);
            console.log("Headers count:", rawHeaders.length);

            const headers = rawHeaders;

            const importedProducts = [];
            let updatedCount = 0;
            let addedCount = 0;
            let errorCount = 0;

            for (let i = 1; i < lines.length; i++) {
              try {
                const values = parseCSVLine(lines[i]).map((v) =>
                  v.replace(/"/g, "").trim(),
                );
                console.log(`Line ${i} values:`, values);
                console.log(`Line ${i} values count:`, values.length);

                if (values.length < headers.length) {
                  console.warn(
                    `Line ${i} has insufficient columns:`,
                    values.length,
                    "vs",
                    headers.length,
                  );
                  // Pad with empty strings if needed
                  while (values.length < headers.length) {
                    values.push("");
                  }
                }

                const productData = {};
                headers.forEach((header, index) => {
                  productData[header] = values[index] || "";
                });

                console.log(`Product data for line ${i}:`, productData);
                console.log(`Product data keys:`, Object.keys(productData));
                console.log(`Product data values:`, Object.values(productData));

                // Map CSV headers to product structure with validation
                // Debug: log the productData to see what we're working with
                console.log(
                  `Processing line ${i}, productData keys:`,
                  Object.keys(productData),
                );
                console.log(`ProductData values:`, productData);

                // Enhanced header mapping with better normalization
                const normalizeKey = (key) => {
                  return key
                    .toLowerCase()
                    .replace(/[àáâãäå]/g, "a")
                    .replace(/[èéêë]/g, "e")
                    .replace(/[ìíîï]/g, "i")
                    .replace(/[òóôõö]/g, "o")
                    .replace(/[ùúûü]/g, "u")
                    .replace(/[ç]/g, "c")
                    .replace(/[ñ]/g, "n")
                    .replace(/[^a-z0-9]/g, "_")
                    .replace(/_+/g, "_")
                    .replace(/^_|_$/g, "");
                };

                const findValue = (possibleKeys) => {
                  console.log(`Looking for keys:`, possibleKeys);
                  console.log(`Available data keys:`, Object.keys(productData));

                  // First try exact matches (case-insensitive)
                  for (const key of possibleKeys) {
                    for (const dataKey of Object.keys(productData)) {
                      if (
                        dataKey.toLowerCase() === key.toLowerCase() &&
                        productData[dataKey] &&
                        productData[dataKey].trim()
                      ) {
                        console.log(
                          `Found exact match: ${dataKey} = ${productData[dataKey]}`,
                        );
                        return fixEncoding(productData[dataKey].trim());
                      }
                    }
                  }

                  // Then try partial matches
                  for (const key of possibleKeys) {
                    for (const dataKey of Object.keys(productData)) {
                      if (
                        dataKey.toLowerCase().includes(key.toLowerCase()) &&
                        productData[dataKey] &&
                        productData[dataKey].trim()
                      ) {
                        console.log(
                          `Found partial match: ${dataKey} = ${productData[dataKey]}`,
                        );
                        return fixEncoding(productData[dataKey].trim());
                      }
                    }
                  }

                  // Finally try normalized matches
                  const normalizedProductData = {};
                  Object.keys(productData).forEach((key) => {
                    const normalizedKey = normalizeKey(key);
                    normalizedProductData[normalizedKey] = productData[key];
                  });

                  for (const key of possibleKeys) {
                    const normalizedKey = normalizeKey(key);
                    if (
                      normalizedProductData[normalizedKey] &&
                      normalizedProductData[normalizedKey].trim()
                    ) {
                      console.log(
                        `Found normalized match: ${normalizedKey} = ${normalizedProductData[normalizedKey]}`,
                      );
                      return fixEncoding(
                        normalizedProductData[normalizedKey].trim(),
                      );
                    }
                  }

                  console.log(`No match found for keys:`, possibleKeys);
                  return null;
                };

                // Enhanced field mapping with Supabase column names as priority
                const codeArticle =
                  findValue([
                    "code_produit",
                    "Code Article",
                    "code_article",
                    "Code",
                    "code",
                    "Code Produit",
                    "Reference",
                    "reference",
                    "Ref",
                    "ref",
                  ]) || `L${Date.now()}_${i}`;

                const nomLolly =
                  findValue([
                    "nom_lolly",
                    "Nom Lolly",
                    "Nom",
                    "nom",
                    "Nom Produit",
                    "nom_produit",
                    "Name",
                    "name",
                    "Produit",
                    "produit",
                    "Product",
                    "product",
                  ]) || "Produit Importé";

                const nomParfumInspire =
                  findValue([
                    "nom_parfum_inspire",
                    "Nom Parfum Inspiré",
                    "nom_parfum_inspire",
                    "Parfum Inspiré",
                    "parfum_inspire",
                    "Nom Parfum Inspire",
                    "Parfum Inspire",
                    "parfum inspire",
                    "Parfum",
                    "parfum",
                    "Inspiration",
                    "inspiration",
                    "Original",
                    "original",
                  ]) || "Parfum Importé";

                const marqueInspire =
                  findValue([
                    "marque_inspire",
                    "Marque Inspirée",
                    "Marque Inspiree",
                    "marque_inspiree",
                    "marque inspire",
                    "Marque",
                    "marque",
                    "Brand",
                    "brand",
                    "Marque Originale",
                    "marque_originale",
                    "Original Brand",
                    "original_brand",
                  ]) || "Marque Importée";

                console.log(
                  `Mapped values - Code: ${codeArticle}, Nom: ${nomLolly}, Parfum: ${nomParfumInspire}, Marque: ${marqueInspire}`,
                );

                // Enhanced validation with better fallback handling
                const hasDefaultValues =
                  nomLolly === "Produit Importé" &&
                  nomParfumInspire === "Parfum Importé" &&
                  marqueInspire === "Marque Importée";

                if (hasDefaultValues) {
                  console.warn(
                    `Line ${i}: All values are defaults, attempting alternative mapping`,
                  );
                  console.log("Available headers:", Object.keys(productData));
                  console.log("Available values:", Object.values(productData));

                  // Try to find any non-empty values to help debug
                  const nonEmptyValues = {};
                  Object.keys(productData).forEach((key) => {
                    if (productData[key] && productData[key].trim()) {
                      nonEmptyValues[key] = fixEncoding(
                        productData[key].trim(),
                      );
                    }
                  });
                  console.log("Non-empty values found:", nonEmptyValues);

                  // Try alternative mapping based on column position
                  const values = Object.values(nonEmptyValues);
                  if (values.length >= 3) {
                    // Assume first few non-empty values are the main product info
                    const altNomLolly = values[0] || nomLolly;
                    const altParfumInspire = values[1] || nomParfumInspire;
                    const altMarqueInspire = values[2] || marqueInspire;

                    console.log(
                      `Alternative mapping: ${altNomLolly}, ${altParfumInspire}, ${altMarqueInspire}`,
                    );

                    // Use alternative values if they're different
                    const finalNomLolly =
                      altNomLolly !== "Produit Importé"
                        ? altNomLolly
                        : nomLolly;
                    const finalParfumInspire =
                      altParfumInspire !== "Parfum Importé"
                        ? altParfumInspire
                        : nomParfumInspire;
                    const finalMarqueInspire =
                      altMarqueInspire !== "Marque Importée"
                        ? altMarqueInspire
                        : marqueInspire;
                  }

                  // Skip this line only if absolutely no meaningful data
                  if (Object.keys(nonEmptyValues).length === 0) {
                    console.warn(
                      `Skipping line ${i} - no meaningful data found`,
                    );
                    errorCount++;
                    continue;
                  }
                }

                // Extract additional fields with Supabase column names as priority
                const genre =
                  findValue([
                    "genre",
                    "Genre",
                    "Sexe",
                    "sexe",
                    "Gender",
                    "gender",
                    "Pour",
                    "pour",
                  ]) || "mixte";

                const saison =
                  findValue([
                    "saison",
                    "Saison",
                    "Season",
                    "season",
                    "Période",
                    "periode",
                    "Temps",
                    "temps",
                  ]) || "toutes saisons";

                const familleOlfactive =
                  findValue([
                    "famille_olfactive",
                    "Famille Olfactive",
                    "Famille",
                    "famille",
                    "Family",
                    "family",
                    "Type",
                    "type",
                    "Categorie",
                    "categorie",
                    "Category",
                    "category",
                  ]) || "Oriental";

                // Extract price and stock information directly from CSV
                const prix15ml = parseFloat(
                  findValue([
                    "prix_15ml",
                    "Prix 15ml",
                    "prix15ml",
                    "Price 15ml",
                  ]) || "19.900",
                );
                const stock15ml = parseInt(
                  findValue([
                    "stock_15ml",
                    "Stock 15ml",
                    "stock15ml",
                    "Stock15ml",
                  ]) || "0",
                );
                const prix30ml = parseFloat(
                  findValue([
                    "prix_30ml",
                    "Prix 30ml",
                    "prix30ml",
                    "Price 30ml",
                  ]) || "29.900",
                );
                const stock30ml = parseInt(
                  findValue([
                    "stock_30ml",
                    "Stock 30ml",
                    "stock30ml",
                    "Stock30ml",
                  ]) || "0",
                );
                const prix50ml = parseFloat(
                  findValue([
                    "prix_50ml",
                    "Prix 50ml",
                    "prix50ml",
                    "Price 50ml",
                  ]) || "39.900",
                );
                const stock50ml = parseInt(
                  findValue([
                    "stock_50ml",
                    "Stock 50ml",
                    "stock50ml",
                    "Stock50ml",
                  ]) || "0",
                );

                // Extract notes with Supabase column names as priority
                const noteTeteRaw =
                  findValue([
                    "note_tete",
                    "Notes Tête",
                    "notes_tete",
                    "Notes de Tête",
                    "notes_de_tete",
                    "Note Tete",
                    "Top Notes",
                    "top_notes",
                    "Notes Hautes",
                    "notes_hautes",
                    "Tête",
                    "tete",
                  ]) || "Bergamote, Citron";

                const noteCoeurRaw =
                  findValue([
                    "note_coeur",
                    "Notes Coeur",
                    "notes_coeur",
                    "Notes de Coeur",
                    "notes_de_coeur",
                    "Note Coeur",
                    "Heart Notes",
                    "heart_notes",
                    "Middle Notes",
                    "middle_notes",
                    "Notes Moyennes",
                    "notes_moyennes",
                    "Coeur",
                    "coeur",
                  ]) || "Jasmin, Rose";

                const noteFondRaw =
                  findValue([
                    "note_fond",
                    "Notes Fond",
                    "notes_fond",
                    "Notes de Fond",
                    "notes_de_fond",
                    "Note Fond",
                    "Base Notes",
                    "base_notes",
                    "Notes Basses",
                    "notes_basses",
                    "Fond",
                    "fond",
                  ]) || "Musc, Vanille";

                // Parse notes with proper encoding handling
                const parseNotes = (notesString) => {
                  return fixEncoding(notesString)
                    .split(/[,;]/)
                    .map((n) => fixEncoding(n.trim()))
                    .filter((n) => n && n.length > 0);
                };

                const noteTete = parseNotes(noteTeteRaw);
                const noteCoeur = parseNotes(noteCoeurRaw);
                const noteFond = parseNotes(noteFondRaw);

                const description =
                  findValue([
                    "description",
                    "Description",
                    "Desc",
                    "desc",
                    "Details",
                    "details",
                    "Info",
                    "info",
                    "Commentaire",
                    "commentaire",
                  ]) || "Produit importé depuis CSV";

                const imageUrl =
                  findValue([
                    "image_url",
                    "Image URL",
                    "imageURL",
                    "Image",
                    "image",
                    "Photo",
                    "photo",
                    "URL Image",
                    "url_image",
                  ]) ||
                  "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80";

                console.log(
                  `Final mapped data - Genre: ${genre}, Saison: ${saison}, Famille: ${familleOlfactive}`,
                );
                console.log(
                  `Notes - Tête: ${JSON.stringify(noteTete)}, Coeur: ${JSON.stringify(noteCoeur)}, Fond: ${JSON.stringify(noteFond)}`,
                );

                // Create variants with extracted price and stock data
                const variants = [
                  {
                    size: "15ml",
                    price: prix15ml,
                    stock: stock15ml,
                    refComplete: `${codeArticle}-15ml`,
                    actif: true,
                  },
                  {
                    size: "30ml",
                    price: prix30ml,
                    stock: stock30ml,
                    refComplete: `${codeArticle}-30ml`,
                    actif: true,
                  },
                  {
                    size: "50ml",
                    price: prix50ml,
                    stock: stock50ml,
                    refComplete: `${codeArticle}-50ml`,
                    actif: true,
                  },
                ];

                // Create product with properly encoded data
                const newProduct = {
                  id: Date.now() + i,
                  codeArticle: fixEncoding(codeArticle),
                  name: fixEncoding(nomLolly),
                  nomParfumInspire: fixEncoding(nomParfumInspire),
                  marqueInspire: fixEncoding(marqueInspire),
                  brand: "Lolly",
                  genre: fixEncoding(genre),
                  saison: fixEncoding(saison),
                  familleOlfactive: fixEncoding(familleOlfactive),
                  noteTete,
                  noteCoeur,
                  noteFond,
                  description: fixEncoding(description),
                  active: true,
                  imageURL: fixEncoding(imageUrl),
                  variants,
                };

                // Calculate total stock and price
                const totalStock = newProduct.variants.reduce(
                  (sum, v) => sum + (v.stock || 0),
                  0,
                );
                const defaultPrice =
                  newProduct.variants.find((v) => v.size === "30ml")?.price ||
                  29.9;

                newProduct.stock = totalStock;
                newProduct.price = defaultPrice;

                console.log(`Processed product:`, newProduct);
                importedProducts.push(newProduct);
              } catch (error) {
                console.error(`Error processing line ${i}:`, error);
                errorCount++;
              }
            }

            console.log(
              `Import summary: ${importedProducts.length} products processed, ${errorCount} errors`,
            );

            if (importedProducts.length === 0) {
              alert(
                "❌ Aucun produit valide trouvé dans le fichier CSV.\n\nVérifiez que votre fichier contient les colonnes suivantes:\n- Code Article\n- Nom Lolly\n- Nom Parfum Inspiré\n- Marque Inspirée\n- Prix 15ml, Prix 30ml, Prix 50ml\n- Stock 15ml, Stock 30ml, Stock 50ml",
              );
              return;
            }

            // Import products to Supabase with better error handling and upsert logic
            console.log(
              "Starting import of",
              importedProducts.length,
              "products to Supabase",
            );

            // First, get all existing product codes to avoid duplicates
            const { data: existingProducts, error: existingError } =
              await supabase.from("products").select("id, code_produit");

            if (existingError) {
              console.error("Error fetching existing products:", existingError);
              alert("❌ Erreur lors de la vérification des produits existants");
              return;
            }

            const existingCodes = new Set(
              existingProducts?.map((p) => p.code_produit) || [],
            );
            console.log("Existing product codes:", Array.from(existingCodes));

            // Track codes in current batch to prevent duplicates within the same import
            const batchCodes = new Set();

            for (const newProduct of importedProducts) {
              try {
                console.log(
                  "Processing product:",
                  newProduct.codeArticle,
                  newProduct.name,
                );

                // Check for duplicates within the current batch
                if (batchCodes.has(newProduct.codeArticle)) {
                  console.log(
                    "Duplicate code in batch, skipping:",
                    newProduct.codeArticle,
                  );
                  errorCount++;
                  continue;
                }
                batchCodes.add(newProduct.codeArticle);

                // Extract price and stock information directly from the product variants
                const prix15ml =
                  newProduct.variants.find((v) => v.size === "15ml")?.price ||
                  19.9;
                const stock15ml =
                  newProduct.variants.find((v) => v.size === "15ml")?.stock ||
                  0;
                const prix30ml =
                  newProduct.variants.find((v) => v.size === "30ml")?.price ||
                  29.9;
                const stock30ml =
                  newProduct.variants.find((v) => v.size === "30ml")?.stock ||
                  0;
                const prix50ml =
                  newProduct.variants.find((v) => v.size === "50ml")?.price ||
                  39.9;
                const stock50ml =
                  newProduct.variants.find((v) => v.size === "50ml")?.stock ||
                  0;

                // Prepare data for Supabase with proper encoding
                const productData = {
                  code_produit: fixEncoding(newProduct.codeArticle),
                  nom_lolly: fixEncoding(newProduct.name),
                  nom_parfum_inspire: fixEncoding(newProduct.nomParfumInspire),
                  marque_inspire: fixEncoding(newProduct.marqueInspire),
                  genre: fixEncoding(newProduct.genre),
                  saison: fixEncoding(newProduct.saison),
                  famille_olfactive: fixEncoding(newProduct.familleOlfactive),
                  note_tete: newProduct.noteTete.map((note) =>
                    fixEncoding(note),
                  ),
                  note_coeur: newProduct.noteCoeur.map((note) =>
                    fixEncoding(note),
                  ),
                  note_fond: newProduct.noteFond.map((note) =>
                    fixEncoding(note),
                  ),
                  description: fixEncoding(newProduct.description),
                  image_url: newProduct.imageURL,
                  active: true,
                  prix_15ml: prix15ml,
                  stock_15ml: stock15ml,
                  prix_30ml: prix30ml,
                  stock_30ml: stock30ml,
                  prix_50ml: prix50ml,
                  stock_50ml: stock50ml,
                };

                if (existingCodes.has(newProduct.codeArticle)) {
                  console.log(
                    "Updating existing product:",
                    newProduct.codeArticle,
                  );

                  // Find the existing product
                  const existingProduct = existingProducts.find(
                    (p) => p.code_produit === newProduct.codeArticle,
                  );

                  if (existingProduct) {
                    // Update existing product
                    const { error: updateError } = await supabase
                      .from("products")
                      .update(productData)
                      .eq("id", existingProduct.id);

                    if (updateError) {
                      console.error("Error updating product:", updateError);
                      errorCount++;
                      continue;
                    }

                    // Delete existing variants first to avoid conflicts
                    await supabase
                      .from("product_variants")
                      .delete()
                      .eq("product_id", existingProduct.id);

                    // Create new variants
                    for (const variant of newProduct.variants) {
                      const { error: variantError } = await supabase
                        .from("product_variants")
                        .insert({
                          product_id: existingProduct.id,
                          ref_complete: fixEncoding(
                            `${newProduct.codeArticle}-${variant.size}`,
                          ),
                          contenance: parseInt(variant.size),
                          unite: "ml",
                          prix: variant.price,
                          stock_actuel: variant.stock,
                          actif: true,
                        });

                      if (variantError) {
                        console.error("Error creating variant:", variantError);
                        errorCount++;
                      }
                    }
                    updatedCount++;
                  }
                } else {
                  console.log("Creating new product:", newProduct.codeArticle);

                  // Create new product
                  const { data: createdProduct, error: createError } =
                    await supabase
                      .from("products")
                      .insert(productData)
                      .select()
                      .single();

                  if (createError) {
                    console.error("Error creating product:", createError);
                    if (createError.code === "23505") {
                      // Unique constraint violation - this shouldn't happen with our pre-check
                      console.log(
                        "Unexpected duplicate key detected:",
                        newProduct.codeArticle,
                      );
                      // Try to update instead
                      const { data: existingProduct } = await supabase
                        .from("products")
                        .select("id")
                        .eq("code_produit", newProduct.codeArticle)
                        .single();

                      if (existingProduct) {
                        const { error: updateError } = await supabase
                          .from("products")
                          .update(productData)
                          .eq("id", existingProduct.id);

                        if (!updateError) {
                          updatedCount++;
                          console.log(
                            "Successfully updated after duplicate error:",
                            newProduct.codeArticle,
                          );
                        } else {
                          errorCount++;
                        }
                      } else {
                        errorCount++;
                      }
                    } else {
                      errorCount++;
                    }
                    continue;
                  }

                  if (createdProduct) {
                    console.log("Created product with ID:", createdProduct.id);
                    // Add to existing codes set to prevent future duplicates in this batch
                    existingCodes.add(newProduct.codeArticle);

                    // Create variants
                    for (const variant of newProduct.variants) {
                      const { error: variantError } = await supabase
                        .from("product_variants")
                        .insert({
                          product_id: createdProduct.id,
                          ref_complete: fixEncoding(
                            `${newProduct.codeArticle}-${variant.size}`,
                          ),
                          contenance: parseInt(variant.size),
                          unite: "ml",
                          prix: variant.price,
                          stock_actuel: variant.stock,
                          actif: true,
                        });

                      if (variantError) {
                        console.error("Error creating variant:", variantError);
                        errorCount++;
                      }
                    }
                    addedCount++;
                  }
                }
              } catch (error) {
                console.error("Error importing product:", error);
                errorCount++;
              }
            }

            console.log(
              "Import completed. Added:",
              addedCount,
              "Updated:",
              updatedCount,
            );

            // Force reload data from Supabase
            console.log("Reloading data after import...");
            await loadData();

            // Validate that special characters were properly imported
            console.log("Validating special character import...");
            const { data: validationData } = await supabase
              .from("products")
              .select("nom_lolly, nom_parfum_inspire, marque_inspire")
              .limit(5);

            if (validationData) {
              console.log(
                "Sample imported data for validation:",
                validationData,
              );
              const hasSpecialChars = validationData.some((product) =>
                /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(
                  `${product.nom_lolly} ${product.nom_parfum_inspire} ${product.marque_inspire}`,
                ),
              );
              console.log(
                "Special characters detected in imported data:",
                hasSpecialChars,
              );
            }

            // Dispatch event to update other components
            const importEvent = new CustomEvent("productsImported", {
              detail: {
                addedCount,
                updatedCount,
                totalProcessed: importedProducts.length,
              },
            });
            window.dispatchEvent(importEvent);

            // Show detailed import results with encoding fix confirmation
            const successMessage = `✅ Import produits terminé avec gestion intelligente des doublons!\n\nFichier: ${file.name}\nProduits ajoutés: ${addedCount}\nProduits mis à jour: ${updatedCount}\nErreurs/Doublons ignorés: ${errorCount}\nTotal traité: ${importedProducts.length}\n\n🔧 Améliorations appliquées:\n- Détection préalable des doublons\n- Gestion intelligente des codes existants\n- Mise à jour automatique des produits existants\n- Caractères spéciaux (é, è, à, ç, etc.) corrigés\n- Encodage UTF-8 optimisé\n- Prévention des doublons dans le même batch\n\nLes produits ont été importés dans Supabase et sont maintenant visibles dans:\n- Le catalogue\n- L'espace admin\n- Les fiches produit\n- Tous les espaces utilisateur`;

            console.log("Import completed successfully:", {
              addedCount,
              updatedCount,
              errorCount,
              totalProcessed: importedProducts.length,
              existingCodesCount: existingCodes.size,
              batchCodesCount: batchCodes.size,
            });

            if (errorCount > 0) {
              alert(
                successMessage +
                  `\n\n⚠️ ${errorCount} erreurs détectées. Vérifiez la console pour plus de détails.\n\nLes erreurs peuvent inclure:\n- Doublons dans le fichier CSV\n- Problèmes de format de données\n- Erreurs de base de données`,
              );
            } else {
              alert(successMessage);
            }

            // Log CSV format help
            console.log("Format CSV attendu (colonnes Supabase):");
            console.log(
              "code_produit,nom_lolly,nom_parfum_inspire,marque_inspire,genre,saison,famille_olfactive,note_tete,note_coeur,note_fond,description,image_url",
            );
            console.log("Exemple:");
            console.log(
              'L001,Élégance Nocturne,Black Opium,Yves Saint Laurent,femme,toutes saisons,Oriental Vanillé,"Café,Poire,Mandarine","Jasmin,Fleur d\'oranger,Vanille","Patchouli,Cèdre,Musc",Description exemple,https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
            );
          } else if (type === "utilisateurs") {
            // Parse CSV content for users with comprehensive handling
            console.log(
              "Raw CSV content (first 500 chars):",
              content.substring(0, 500),
            );

            // Remove BOM if present
            if (content.charCodeAt(0) === 0xfeff) {
              content = content.substring(1);
            }

            // Handle different line endings and clean the content
            const cleanContent = content
              .replace(/\r\n/g, "\n")
              .replace(/\r/g, "\n")
              .trim();
            const lines = cleanContent
              .split("\n")
              .filter((line) => line.trim());

            console.log("Number of lines found:", lines.length);
            console.log("First line (headers):", lines[0]);
            if (lines.length > 1) {
              console.log("Second line (first data):", lines[1]);
            }

            if (lines.length < 2) {
              alert("❌ Fichier CSV invalide: pas assez de lignes de données");
              return;
            }

            // Enhanced CSV parsing with proper quote and delimiter handling
            const parseCSVLine = (line) => {
              const result = [];
              let current = "";
              let inQuotes = false;
              let i = 0;

              while (i < line.length) {
                const char = line[i];

                if (char === '"') {
                  if (inQuotes && line[i + 1] === '"') {
                    // Escaped quote
                    current += '"';
                    i += 2;
                  } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                    i++;
                  }
                } else if (char === "," && !inQuotes) {
                  // Field separator
                  result.push(fixEncoding(current.trim()));
                  current = "";
                  i++;
                } else {
                  current += char;
                  i++;
                }
              }

              // Add the last field
              result.push(fixEncoding(current.trim()));
              return result;
            };

            // Clean and normalize headers
            const rawHeaders = parseCSVLine(lines[0]).map((h) =>
              h.replace(/"/g, "").trim(),
            );

            console.log("Raw headers:", rawHeaders);
            console.log("Headers count:", rawHeaders.length);

            const headers = rawHeaders;
            const importedUsers = [];
            let updatedCount = 0;
            let addedCount = 0;
            let errorCount = 0;

            // First, get all existing user emails to avoid duplicates
            const { data: existingUsers, error: existingError } = await supabase
              .from("users")
              .select("id, email");

            if (existingError) {
              console.error("Error fetching existing users:", existingError);
              alert(
                "❌ Erreur lors de la vérification des utilisateurs existants",
              );
              return;
            }

            const existingEmails = new Set(
              existingUsers?.map((u) => u.email.toLowerCase()) || [],
            );
            console.log("Existing user emails:", Array.from(existingEmails));

            // Track emails in current batch to prevent duplicates within the same import
            const batchEmails = new Set();

            for (let i = 1; i < lines.length; i++) {
              try {
                const values = parseCSVLine(lines[i]).map((v) =>
                  v.replace(/"/g, "").trim(),
                );
                console.log(`Line ${i} values:`, values);
                console.log(`Line ${i} values count:`, values.length);

                if (values.length < headers.length) {
                  console.warn(
                    `Line ${i} has insufficient columns:`,
                    values.length,
                    "vs",
                    headers.length,
                  );
                  // Pad with empty strings if needed
                  while (values.length < headers.length) {
                    values.push("");
                  }
                }

                const userData = {};
                headers.forEach((header, index) => {
                  userData[header] = values[index] || "";
                });

                console.log(`User data for line ${i}:`, userData);

                // Enhanced field mapping with better normalization
                const findValue = (possibleKeys) => {
                  console.log(`Looking for keys:`, possibleKeys);
                  console.log(`Available data keys:`, Object.keys(userData));

                  // First try exact matches (case-insensitive)
                  for (const key of possibleKeys) {
                    for (const dataKey of Object.keys(userData)) {
                      if (
                        dataKey.toLowerCase() === key.toLowerCase() &&
                        userData[dataKey] &&
                        userData[dataKey].trim()
                      ) {
                        console.log(
                          `Found exact match: ${dataKey} = ${userData[dataKey]}`,
                        );
                        return fixEncoding(userData[dataKey].trim());
                      }
                    }
                  }

                  // Then try partial matches
                  for (const key of possibleKeys) {
                    for (const dataKey of Object.keys(userData)) {
                      if (
                        dataKey.toLowerCase().includes(key.toLowerCase()) &&
                        userData[dataKey] &&
                        userData[dataKey].trim()
                      ) {
                        console.log(
                          `Found partial match: ${dataKey} = ${userData[dataKey]}`,
                        );
                        return fixEncoding(userData[dataKey].trim());
                      }
                    }
                  }

                  console.log(`No match found for keys:`, possibleKeys);
                  return null;
                };

                // Map CSV fields to user structure with validation
                const prenom =
                  findValue([
                    "prenom",
                    "Prénom",
                    "firstname",
                    "first_name",
                    "First Name",
                  ]) || "Prénom";

                const nom =
                  findValue([
                    "nom",
                    "Nom",
                    "lastname",
                    "last_name",
                    "Last Name",
                    "surname",
                  ]) || "Nom";

                const email =
                  findValue([
                    "email",
                    "Email",
                    "e-mail",
                    "E-mail",
                    "mail",
                    "Mail",
                  ]) || `import${i}@test.com`;

                const role =
                  findValue(["role", "Role", "Rôle", "type", "Type"]) ||
                  "client";

                const telephone = findValue([
                  "telephone",
                  "Téléphone",
                  "phone",
                  "Phone",
                  "tel",
                  "Tel",
                ]);

                const whatsapp = findValue([
                  "whatsapp",
                  "WhatsApp",
                  "whats_app",
                  "Whats App",
                ]);

                const dateNaissance = findValue([
                  "date_naissance",
                  "Date Naissance",
                  "date_de_naissance",
                  "birthdate",
                  "birth_date",
                  "Birth Date",
                ]);

                const adresse = findValue([
                  "adresse",
                  "Adresse",
                  "address",
                  "Address",
                ]);

                const codeClient =
                  findValue([
                    "code_client",
                    "Code Client",
                    "client_code",
                    "Client Code",
                    "code",
                    "Code",
                  ]) ||
                  `C${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

                console.log(
                  `Mapped values - Prénom: ${prenom}, Nom: ${nom}, Email: ${email}, Role: ${role}`,
                );

                // Validate required fields
                if (!email || email === `import${i}@test.com`) {
                  console.warn(
                    `Line ${i}: No valid email found, using default`,
                  );
                }

                // Check for duplicates within the current batch
                const emailLower = email.toLowerCase();
                if (batchEmails.has(emailLower)) {
                  console.log("Duplicate email in batch, skipping:", email);
                  errorCount++;
                  continue;
                }
                batchEmails.add(emailLower);

                const newUser = {
                  name: `${prenom} ${nom}`.trim() || "Utilisateur Importé",
                  email: email,
                  role: role,
                  prenom: prenom,
                  nom: nom,
                  telephone: telephone,
                  whatsapp: whatsapp,
                  dateNaissance: dateNaissance,
                  adresse: adresse,
                  codeClient: codeClient,
                  isNew: true,
                  lastOrder: new Date().toISOString().split("T")[0],
                };

                console.log(`Processed user:`, newUser);
                importedUsers.push(newUser);
              } catch (error) {
                console.error(`Error processing line ${i}:`, error);
                errorCount++;
              }
            }

            console.log(
              `Import summary: ${importedUsers.length} users processed, ${errorCount} errors`,
            );

            if (importedUsers.length === 0) {
              alert(
                "❌ Aucun utilisateur valide trouvé dans le fichier CSV.\n\nVérifiez que votre fichier contient les colonnes suivantes:\n- nom\n- prenom\n- email\n- role (optionnel)\n- telephone (optionnel)\n- whatsapp (optionnel)\n- date_naissance (optionnel)\n- adresse (optionnel)\n- code_client (optionnel)",
              );
              return;
            }

            // Import users to Supabase with automatic ID generation by database
            console.log(
              "🚀 Starting import of",
              importedUsers.length,
              "users to Supabase - IDs will be auto-generated by database",
            );

            // Create a comprehensive set of existing emails (case-insensitive)
            const existingEmailsSet = new Set(
              existingUsers?.map((u) => u.email.toLowerCase().trim()) || [],
            );
            console.log(
              "📧 Existing emails in database:",
              Array.from(existingEmailsSet),
            );

            // Process each user individually with enhanced error handling
            for (
              let userIndex = 0;
              userIndex < importedUsers.length;
              userIndex++
            ) {
              const newUser = importedUsers[userIndex];
              try {
                console.log(
                  `📝 Processing user ${userIndex + 1}/${importedUsers.length}:`,
                  newUser.email,
                  newUser.name,
                );

                // Clean and validate email with enhanced validation
                const cleanEmail = fixEncoding(newUser.email || "")
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, ""); // Remove any whitespace

                if (
                  !cleanEmail ||
                  !cleanEmail.includes("@") ||
                  cleanEmail.length < 5
                ) {
                  console.warn(
                    `❌ Invalid email for user: ${newUser.name} - Email: '${cleanEmail}'`,
                  );
                  errorCount++;
                  continue;
                }

                // Enhanced duplicate check - check both existing database and current batch
                if (existingEmailsSet.has(cleanEmail)) {
                  console.log(
                    "🔄 Email exists in database, updating user:",
                    cleanEmail,
                  );

                  // Find the existing user
                  const existingUser = existingUsers.find(
                    (u) => u.email.toLowerCase().trim() === cleanEmail,
                  );

                  if (existingUser) {
                    // Update existing user (exclude email and id from update)
                    const updateData = {
                      nom: fixEncoding(newUser.nom || "Nom").trim(),
                      prenom: fixEncoding(newUser.prenom || "Prénom").trim(),
                      role: (newUser.role || "client").toLowerCase(),
                      telephone: newUser.telephone
                        ? fixEncoding(newUser.telephone).trim()
                        : null,
                      whatsapp: newUser.whatsapp
                        ? fixEncoding(newUser.whatsapp).trim()
                        : null,
                      date_naissance: newUser.dateNaissance || null,
                      adresse: newUser.adresse
                        ? fixEncoding(newUser.adresse).trim()
                        : null,
                      code_client: fixEncoding(
                        newUser.codeClient ||
                          `C${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
                      ).trim(),
                    };

                    const { error: updateError } = await supabase
                      .from("users")
                      .update(updateData)
                      .eq("id", existingUser.id);

                    if (!updateError) {
                      console.log(
                        `✅ Successfully updated existing user: ${cleanEmail}`,
                      );
                      updatedCount++;
                    } else {
                      console.error("❌ Error updating user:", updateError);
                      errorCount++;
                    }
                  } else {
                    console.warn(
                      `⚠️ User found in email set but not in user array: ${cleanEmail}`,
                    );
                    errorCount++;
                  }
                } else {
                  console.log("➕ Creating new user:", cleanEmail);

                  // Prepare user data for Supabase insertion (ID will be auto-generated)
                  const newUserData = {
                    email: cleanEmail,
                    nom: fixEncoding(newUser.nom || "Nom").trim(),
                    prenom: fixEncoding(newUser.prenom || "Prénom").trim(),
                    role: (newUser.role || "client").toLowerCase(),
                    telephone: newUser.telephone
                      ? fixEncoding(newUser.telephone).trim()
                      : null,
                    whatsapp: newUser.whatsapp
                      ? fixEncoding(newUser.whatsapp).trim()
                      : null,
                    date_naissance: newUser.dateNaissance || null,
                    adresse: newUser.adresse
                      ? fixEncoding(newUser.adresse).trim()
                      : null,
                    code_client: fixEncoding(
                      newUser.codeClient ||
                        `C${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
                    ).trim(),
                  };

                  console.log(
                    `🔍 New user data prepared for Supabase auto-ID generation:`,
                    newUserData,
                  );

                  // Insert new user with retry logic
                  let insertAttempts = 0;
                  const maxAttempts = 3;
                  let insertSuccess = false;

                  while (insertAttempts < maxAttempts && !insertSuccess) {
                    insertAttempts++;
                    console.log(
                      `🔄 Insert attempt ${insertAttempts}/${maxAttempts} for user: ${cleanEmail}`,
                    );

                    const { data: insertedUser, error: insertError } =
                      await supabase
                        .from("users")
                        .insert(newUserData)
                        .select("id, email")
                        .single();

                    if (!insertError && insertedUser) {
                      console.log(
                        `✅ Successfully created user: ${cleanEmail} with ID: ${insertedUser.id}`,
                      );
                      existingEmailsSet.add(cleanEmail); // Add to our tracking set
                      addedCount++;
                      insertSuccess = true;
                    } else {
                      console.error(
                        `❌ Insert attempt ${insertAttempts} failed:`,
                        insertError,
                      );

                      // Handle duplicate key errors with enhanced recovery
                      if (
                        insertError?.code === "23505" ||
                        insertError?.message?.includes("duplicate") ||
                        insertError?.message?.includes("unique") ||
                        insertError?.message?.includes("already exists")
                      ) {
                        console.log(
                          `🔄 Duplicate detected on attempt ${insertAttempts}, trying recovery...`,
                        );

                        // Try to find and update the existing user
                        const { data: existingUserData, error: findError } =
                          await supabase
                            .from("users")
                            .select("id, email")
                            .eq("email", cleanEmail)
                            .single();

                        if (!findError && existingUserData) {
                          console.log(
                            `🔍 Found existing user for update: ${cleanEmail}`,
                          );
                          const updateData = { ...newUserData };
                          delete updateData.email; // Don't update email

                          const { error: updateError } = await supabase
                            .from("users")
                            .update(updateData)
                            .eq("id", existingUserData.id);

                          if (!updateError) {
                            console.log(
                              `✅ Successfully updated duplicate user: ${cleanEmail}`,
                            );
                            existingEmailsSet.add(cleanEmail);
                            updatedCount++;
                            insertSuccess = true;
                          } else {
                            console.error(
                              "❌ Error updating duplicate user:",
                              updateError,
                            );
                          }
                        } else {
                          console.error(
                            "❌ Could not find existing user for duplicate recovery:",
                            findError,
                          );
                        }
                      }

                      // If this was the last attempt and we still failed
                      if (insertAttempts === maxAttempts && !insertSuccess) {
                        console.error(
                          `💥 Failed to insert user after ${maxAttempts} attempts:`,
                          cleanEmail,
                        );
                        errorCount++;
                      }
                    }

                    // Small delay between attempts to avoid race conditions
                    if (insertAttempts < maxAttempts && !insertSuccess) {
                      await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                  }
                }
              } catch (error) {
                console.error(
                  `💥 Unexpected error importing user ${userIndex + 1}:`,
                  error,
                );
                console.error("💥 User data:", newUser);
                errorCount++;
              }
            }

            console.log(
              "Import completed. Added:",
              addedCount,
              "Updated:",
              updatedCount,
            );

            // Force reload users from Supabase with delay to ensure data is committed
            console.log("🔄 Reloading data after import...");

            // Add a small delay to ensure database transactions are committed
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await loadData();

            // Force a re-render by updating the component state
            console.log("🔄 Forcing component re-render...");

            // Dispatch event to update other components
            const userImportEvent = new CustomEvent("usersImported", {
              detail: {
                addedCount: addedCount,
                updatedCount: updatedCount,
                totalProcessed: importedUsers.length,
              },
            });
            window.dispatchEvent(userImportEvent);

            // Show detailed import results
            const successMessage = `✅ Import utilisateurs terminé avec génération automatique d'ID par la base de données!\n\nFichier: ${file.name}\nUtilisateurs ajoutés: ${addedCount}\nUtilisateurs mis à jour: ${updatedCount}\nErreurs/Doublons ignorés: ${errorCount}\nTotal traité: ${importedUsers.length}\n\n🔧 Système automatique Supabase:\n- IDs UUID générés automatiquement par la base de données\n- Codes clients générés par trigger de base de données\n- Vérification préalable complète des emails existants\n- Logique de retry avec 3 tentatives par utilisateur\n- Récupération automatique en cas de conflit\n- Mise à jour intelligente des utilisateurs existants\n- Validation email renforcée\n- Caractères spéciaux (é, è, à, ç, etc.) corrigés\n\nLes utilisateurs ont été importés dans Supabase et sont maintenant visibles dans:\n- La gestion des utilisateurs\n- L'espace admin\n- Les rapports\n- Tous les espaces utilisateur`;

            console.log("Import completed successfully:", {
              addedCount,
              updatedCount,
              errorCount,
              totalProcessed: importedUsers.length,
              existingEmailsCount: existingEmails.size,
              batchEmailsCount: batchEmails.size,
            });

            if (errorCount > 0) {
              alert(
                successMessage +
                  `\n\n⚠️ ${errorCount} erreurs détectées. Vérifiez la console pour plus de détails.\n\nLes erreurs peuvent inclure:\n- Doublons dans le fichier CSV\n- Problèmes de format de données\n- Erreurs de base de données`,
              );
            } else {
              alert(successMessage);
            }

            // Log CSV format help
            console.log("Format CSV attendu (colonnes Supabase):");
            console.log(
              "nom,prenom,email,role,telephone,whatsapp,date_naissance,adresse,code_client",
            );
            console.log("Exemple:");
            console.log(
              "Dupont,Jean,jean@email.com,client,0123456789,0123456789,1990-01-01,123 Rue de la Paix Paris,C001",
            );
          } else if (type === "restock") {
            // Parse CSV content for restock with Supabase structure
            const lines = content.split("\n").filter((line) => line.trim());
            const headers = lines[0]
              .split(",")
              .map((h) => h.trim().replace(/"/g, ""));

            const restockData = [];
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i]
                .split(",")
                .map((v) => v.trim().replace(/"/g, ""));
              if (values.length < headers.length) continue;

              const stockData = {};
              headers.forEach((header, index) => {
                stockData[header] = values[index];
              });

              restockData.push({
                codeArticle:
                  stockData["code_produit"] || stockData["Code Article"],
                contenance:
                  parseInt(stockData["contenance"] || stockData["Variante"]) ||
                  30,
                quantite:
                  parseInt(
                    stockData["quantite_a_ajouter"] ||
                      stockData["Quantité à Ajouter"],
                  ) || 0,
              });
            }

            let updatedProductsCount = 0;
            let totalQuantityAdded = 0;

            // Update stock in Supabase
            for (const stockItem of restockData) {
              try {
                // Find product by code
                const { data: product } = await supabase
                  .from("products")
                  .select("id")
                  .eq("code_produit", stockItem.codeArticle)
                  .single();

                if (product) {
                  // Find variant by contenance
                  const { data: variant } = await supabase
                    .from("product_variants")
                    .select("*")
                    .eq("product_id", product.id)
                    .eq("contenance", stockItem.contenance)
                    .single();

                  if (variant && stockItem.quantite > 0) {
                    // Update stock
                    const { error } = await supabase
                      .from("product_variants")
                      .update({
                        stock_actuel:
                          (variant.stock_actuel || 0) + stockItem.quantite,
                      })
                      .eq("id", variant.id);

                    if (!error) {
                      totalQuantityAdded += stockItem.quantite;
                      updatedProductsCount++;

                      // Record stock movement
                      await supabase.from("stock_movements").insert({
                        product_variant_id: variant.id,
                        type: "entree",
                        quantity: stockItem.quantite,
                        reason: "Import réapprovisionnement",
                        created_by: authUser?.id,
                      });
                    }
                  }
                }
              } catch (error) {
                console.error("Error updating stock:", error);
              }
            }

            // Force reload data from Supabase
            await loadData();

            // Dispatch event to update other components
            const restockEvent = new CustomEvent("stockUpdated", {
              detail: {
                updatedProductsCount,
                totalQuantityAdded,
                totalProcessed: restockData.length,
              },
            });
            window.dispatchEvent(restockEvent);

            alert(
              `✅ Import réapprovisionnement réussi!\n\nFichier: ${file.name}\nProduits mis à jour: ${updatedProductsCount}\nQuantité totale ajoutée: ${totalQuantityAdded} unités\nArticles traités: ${restockData.length}\n\nLes stocks ont été correctement actualisés dans Supabase et l'application:\n- Base de données Supabase\n- Gestion du stock\n- Indicateurs de stock\n- Fiches produit\n- Catalogue\n- Tous les espaces`,
            );
          } else {
            alert(
              `📁 Fichier ${file.name} sélectionné pour import ${type}\n\nTraitement en cours...`,
            );
          }
        };

        reader.onerror = () => {
          alert(
            `❌ Erreur lors de la lecture du fichier ${file.name}\n\nVeuillez vérifier le format du fichier et réessayer.`,
          );
        };

        reader.readAsText(file, "UTF-8");
      }
    };
    input.click();
  };

  // Show login dialog if not authenticated
  if (!authIsAuthenticated || showLogin) {
    return (
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onSuccess={() => {
          console.log("🔐 Login successful, checking user role...");
          // The useEffect will handle the role check after login
        }}
        hideRegistration={true}
      />
    );
  }

  // Show loading while checking authentication or loading data
  if ((authIsAuthenticated && authUser && !isAuthenticated) || loading) {
    return (
      <div className="min-h-screen bg-[#FBF0E9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#805050] mx-auto mb-4"></div>
          <p className="text-[#805050] font-montserrat">
            {loading
              ? "Chargement des données..."
              : "Vérification des autorisations..."}
          </p>
        </div>
      </div>
    );
  }

  // Block access if user is authenticated but not admin
  if (
    authIsAuthenticated &&
    authUser &&
    authUser.role !== "admin" &&
    authUser.email !== "admin@lecompasolfactif.com"
  ) {
    return (
      <div className="min-h-screen bg-[#FBF0E9] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-playfair text-[#805050] mb-4">
            Accès Refusé
          </h2>
          <p className="text-[#AD9C92] mb-6">
            Seuls les administrateurs peuvent accéder à cet espace.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#805050] hover:bg-[#704040] text-white px-6 py-2 rounded"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

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
                Espace Administration
              </h2>
              <p className="text-[#AD9C92] font-montserrat">
                Gérez votre boutique et vos données
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-[#CE8F8A] text-[#805050] hover:bg-[#CE8F8A]/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 gap-1 md:gap-0 bg-white border border-[#805050] p-1 md:p-0 h-auto">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <Package className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Produits</span>
              </TabsTrigger>
              <TabsTrigger
                value="stock"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <Archive className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Stock</span>
              </TabsTrigger>
              <TabsTrigger
                value="catalog"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <Package className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Catalogue</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <Users className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Utilisateurs</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <BarChart3 className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Rapports</span>
              </TabsTrigger>
              <TabsTrigger
                value="import"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <FileText className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Import/Export</span>
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="data-[state=active]:bg-[#805050] data-[state=active]:text-white flex flex-col md:flex-row items-center justify-center text-xs md:text-sm p-1 md:p-2 h-auto min-h-[60px] md:min-h-[40px]"
              >
                <Settings className="w-4 h-4 mb-1 md:mb-0 md:mr-2 flex-shrink-0" />
                <span className="text-center leading-tight">Configuration</span>
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center justify-between">
                    Gestion des Produits
                    <Button
                      onClick={() => setShowNewProduct(true)}
                      className="bg-[#805050] hover:bg-[#704040] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Produit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-[#805050]"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#805050] text-[#805050]"
                      onClick={async () => {}}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code Article</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Parfum Inspiré</TableHead>
                        <TableHead>Marque Inspirée</TableHead>
                        <TableHead>Prix (TND)</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.codeArticle}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.nomParfumInspire}</TableCell>
                          <TableCell>{product.marqueInspire}</TableCell>
                          <TableCell>
                            {(product.price || 0).toFixed(3)} TND
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                (product.stock || 0) < 5
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {product.variants
                                ? product.variants.reduce(
                                    (sum, v) => sum + (v.stock || 0),
                                    0,
                                  )
                                : product.stock || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={product.active}
                                onCheckedChange={() =>
                                  toggleProductStatus(product.id)
                                }
                              />
                              <Badge
                                variant={
                                  product.active ? "default" : "secondary"
                                }
                                className={
                                  product.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {product.active ? "Actif" : "Inactif"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setEditFormData({
                                    codeArticle: product.codeArticle,
                                    name: product.name,
                                    nomParfumInspire: product.nomParfumInspire,
                                    marqueInspire: product.marqueInspire,
                                    imageURL:
                                      product.imageURL ||
                                      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
                                  });
                                  setImagePreview(
                                    product.imageURL ||
                                      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
                                  );
                                  setShowEditProduct(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowProductPreview(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stock Tab */}
            <TabsContent value="stock" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair">
                    Gestion du Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="font-semibold text-red-700">
                            Stock Critique
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                          {stockIndicators.critique}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold text-yellow-700">
                            Stock Faible
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">
                          {stockIndicators.faible}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-green-700">
                            Stock OK
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          {stockIndicators.ok}
                        </p>
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
                        product.variants.map((variant, index) => (
                          <TableRow key={`${product.id}-${index}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.codeArticle}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{variant.size}</TableCell>
                            <TableCell>{variant.stock}</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  variant.stock === 0
                                    ? "destructive"
                                    : variant.stock < 5
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {variant.stock === 0
                                  ? "Rupture"
                                  : variant.stock < 5
                                    ? "Faible"
                                    : "OK"}
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
                                  onClick={() => handleFileImport("stock")}
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

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center justify-between">
                    Gestion des Utilisateurs
                    <Button
                      className="bg-[#805050] hover:bg-[#704040] text-white"
                      onClick={() => setShowNewUser(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nouvel Utilisateur
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-between items-center">
                    <div className="text-sm text-[#AD9C92]">
                      {loading
                        ? "Chargement des données depuis Supabase..."
                        : `${users.length} utilisateur(s) trouvé(s) dans Supabase`}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          console.log("🔄 Manual refresh triggered");
                          console.log(
                            "🔄 Current users state before refresh:",
                            users,
                          );
                          await loadData();
                          console.log("🔄 Users state after refresh:", users);
                          alert(
                            `Données actualisées depuis Supabase! ${users.length} utilisateurs chargés.`,
                          );
                        }}
                        variant="outline"
                        size="sm"
                        className="border-[#805050] text-[#805050]"
                      >
                        Actualiser
                      </Button>
                      <Button
                        onClick={async () => {
                          console.log(
                            "🔍 Testing direct Supabase connection with RLS diagnostics...",
                          );
                          try {
                            const { data, error } = await supabase
                              .from("users")
                              .select("*")
                              .limit(10);

                            console.log("📊 Direct Supabase test result:", {
                              data,
                              error,
                            });

                            if (error) {
                              // Enhanced RLS error detection
                              if (
                                error.code === "42501" ||
                                error.message?.includes("row-level security") ||
                                error.message?.includes("policy") ||
                                error.message?.includes("permission denied")
                              ) {
                                const rlsMessage =
                                  `🔒 PROBLÈME RLS CONFIRMÉ\n\n` +
                                  `❌ Erreur: ${error.message}\n\n` +
                                  `🔧 SOLUTION IMMÉDIATE:\n` +
                                  `Exécutez cette commande SQL dans Supabase:\n\n` +
                                  `ALTER TABLE users DISABLE ROW LEVEL SECURITY;\n\n` +
                                  `📋 Commande copiée dans le presse-papiers!`;

                                // Copy SQL to clipboard
                                try {
                                  await navigator.clipboard.writeText(
                                    "ALTER TABLE users DISABLE ROW LEVEL SECURITY;",
                                  );
                                } catch (clipboardError) {
                                  console.log(
                                    "⚠️ Could not copy to clipboard:",
                                    clipboardError,
                                  );
                                }

                                alert(rlsMessage);
                              } else {
                                alert(
                                  `❌ Erreur de connexion Supabase: ${error.message}`,
                                );
                              }
                            } else {
                              alert(
                                `✅ Connexion Supabase OK! ${data?.length || 0} utilisateurs trouvés dans la base.\n\n` +
                                  `Le problème RLS semble résolu!`,
                              );
                            }
                          } catch (err) {
                            console.error("💥 Connection test failed:", err);
                            alert(
                              `❌ Test de connexion échoué: ${err.message}`,
                            );
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-500"
                      >
                        Test RLS
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8 bg-white rounded border">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#805050] mx-auto mb-4"></div>
                      <p className="text-[#AD9C92] font-medium">
                        Chargement des utilisateurs depuis Supabase...
                      </p>
                      <p className="text-xs text-[#AD9C92] mt-2">
                        Connexion à la base de données en cours...
                      </p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded border">
                      <Users className="w-12 h-12 text-[#AD9C92] mx-auto mb-4" />
                      <p className="text-[#AD9C92] font-medium mb-2">
                        Aucun utilisateur trouvé dans Supabase
                      </p>
                      <p className="text-sm text-[#AD9C92] mb-4">
                        Cela peut être dû à un problème RLS (Row Level
                        Security). Utilisez le bouton "Test RLS" pour
                        diagnostiquer.
                      </p>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                        <h4 className="font-medium text-yellow-800 mb-2">
                          🔒 Problème RLS possible
                        </h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Si c'est un problème RLS, exécutez cette commande SQL
                          dans Supabase :
                        </p>
                        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-3">
                          ALTER TABLE users DISABLE ROW LEVEL SECURITY;
                        </div>
                        <Button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                "ALTER TABLE users DISABLE ROW LEVEL SECURITY;",
                              );
                              alert(
                                "📋 Commande SQL copiée dans le presse-papiers!\n\nCollez-la dans l'éditeur SQL de Supabase.",
                              );
                            } catch (err) {
                              console.log("Could not copy to clipboard:", err);
                              alert(
                                "Commande SQL: ALTER TABLE users DISABLE ROW LEVEL SECURITY;",
                              );
                            }
                          }}
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          📋 Copier la commande SQL
                        </Button>
                      </div>

                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => setShowNewUser(true)}
                          className="bg-[#805050] hover:bg-[#704040] text-white"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Créer le premier utilisateur
                        </Button>
                        <Button
                          onClick={async () => {
                            console.log("🔄 Force reload triggered");
                            setLoading(true);
                            await loadData();
                            setLoading(false);
                          }}
                          variant="outline"
                          className="border-[#805050] text-[#805050]"
                        >
                          Recharger depuis Supabase
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Code Client</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Dernière Commande</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                              {user.isNew && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 bg-[#CE8F8A] text-white"
                                >
                                  Nouveau
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "admin" ? "default" : "outline"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-[#AD9C92]">
                                {user.codeClient || "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">Actif</Badge>
                            </TableCell>
                            <TableCell>{user.lastOrder}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowEditUser(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={user.role}
                                  onValueChange={(newRole) =>
                                    handleRoleChange(user.id, newRole)
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Rôle" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="client">
                                      Client
                                    </SelectItem>
                                    <SelectItem value="conseillere">
                                      Conseillère
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#805050] font-playfair">
                      Rapports de Ventes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form id="sales-report-form" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date de début</Label>
                          <Input
                            type="date"
                            value={dateFilter.start}
                            onChange={(e) =>
                              setDateFilter({
                                ...dateFilter,
                                start: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Date de fin</Label>
                          <Input
                            type="date"
                            value={dateFilter.end}
                            onChange={(e) =>
                              setDateFilter({
                                ...dateFilter,
                                end: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => handleExportExcel("sales")}
                        className="w-full bg-[#805050] hover:bg-[#704040] text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter en Excel
                      </Button>
                    </form>

                    <Table className="mt-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Code Client</TableHead>
                          <TableHead>Produit</TableHead>
                          <TableHead>Code Article</TableHead>
                          <TableHead>Marque Inspirée</TableHead>
                          <TableHead>Montant (TND)</TableHead>
                          <TableHead>Conseillère</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.client}</TableCell>
                            <TableCell>{sale.codeClient}</TableCell>
                            <TableCell>{sale.product}</TableCell>
                            <TableCell>{sale.codeArticle}</TableCell>
                            <TableCell>Yves Saint Laurent</TableCell>
                            <TableCell>{sale.amount.toFixed(3)} TND</TableCell>
                            <TableCell>{sale.conseillere}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#805050] font-playfair">
                      Rapports Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form id="new-promotion-form" className="space-y-4">
                      <Button
                        onClick={() => handleExportExcel("clients")}
                        className="w-full bg-[#805050] hover:bg-[#704040] text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter Clients
                      </Button>
                    </form>

                    <Table className="mt-6">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Code Client</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Articles Achetés</TableHead>
                          <TableHead>Parfum Inspiré</TableHead>
                          <TableHead>Marque Inspirée</TableHead>
                          <TableHead>Prix (TND)</TableHead>
                          <TableHead>Date d'Achat</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users
                          .filter((user) => user.role === "client")
                          .map((client) => (
                            <TableRow key={client.id}>
                              <TableCell>
                                {client.name}
                                {client.isNew && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 bg-[#CE8F8A] text-white"
                                  >
                                    Nouveau Client
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{client.codeClient}</TableCell>
                              <TableCell>{client.email}</TableCell>
                              <TableCell>L001-30</TableCell>
                              <TableCell>Black Opium</TableCell>
                              <TableCell>Yves Saint Laurent</TableCell>
                              <TableCell>29.900</TableCell>
                              <TableCell>2024-01-15</TableCell>
                              <TableCell>
                                <Badge variant="default">Actif</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Import/Export Tab */}
            <TabsContent value="import" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#805050] font-playfair">
                      Modèles de Fichiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => handleDownloadTemplate("products")}
                      className="w-full bg-[#805050] hover:bg-[#704040] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger Modèle Produits
                    </Button>
                    <Button
                      onClick={() => handleDownloadTemplate("users")}
                      className="w-full bg-[#805050] hover:bg-[#704040] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger Modèle Utilisateurs
                    </Button>
                    <Button
                      onClick={() => handleDownloadTemplate("restock")}
                      className="w-full bg-[#805050] hover:bg-[#704040] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger Modèle Réapprovisionnement (.csv)
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#805050] font-playfair">
                      Import de Données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Importer Produits</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleFilePreview("produits")}
                          className="flex-1 bg-[#CE8F8A] hover:bg-[#B87F7A] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Prévisualiser
                        </Button>
                        <Button
                          onClick={() => handleFileImport("produits")}
                          className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Importer
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Importer Utilisateurs</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleFilePreview("utilisateurs")}
                          className="flex-1 bg-[#CE8F8A] hover:bg-[#B87F7A] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Prévisualiser
                        </Button>
                        <Button
                          onClick={() => handleFileImport("utilisateurs")}
                          className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Importer
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Import Réapprovisionnement en Masse</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleFilePreview("restock")}
                          className="flex-1 bg-[#CE8F8A] hover:bg-[#B87F7A] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Prévisualiser
                        </Button>
                        <Button
                          onClick={() => handleFileImport("restock")}
                          className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Importer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center justify-between">
                    Prévisualisation Import
                    {previewFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewFile(null);
                          setPreviewData([]);
                          setPreviewHeaders([]);
                          setPreviewType("");
                        }}
                        className="text-[#805050] border-[#805050]"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Effacer
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!previewFile ? (
                    <div className="border-2 border-dashed border-[#805050] rounded-lg p-8 text-center">
                      <FileText className="w-12 h-12 text-[#805050] mx-auto mb-4" />
                      <p className="text-[#AD9C92] font-montserrat">
                        Cliquez sur &quot;Prévisualiser&quot; pour voir le
                        contenu de votre fichier avant l'import
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-[#FBF0E9] p-3 rounded">
                        <div>
                          <p className="font-medium text-[#805050]">
                            📁 {previewFile.name}
                          </p>
                          <p className="text-sm text-[#AD9C92]">
                            Type: {previewType} • Taille:{" "}
                            {(previewFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Badge className="bg-[#CE8F8A] text-white">
                          {previewData.length} lignes prévisualisées
                        </Badge>
                      </div>

                      {previewData.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto max-h-96">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-[#805050]">
                                  {previewHeaders.map((header, index) => (
                                    <TableHead
                                      key={index}
                                      className="text-white font-medium"
                                    >
                                      {header}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {previewData.map((row, rowIndex) => (
                                  <TableRow
                                    key={rowIndex}
                                    className={
                                      rowIndex % 2 === 0
                                        ? "bg-white"
                                        : "bg-[#FBF0E9]"
                                    }
                                  >
                                    {previewHeaders.map((header, colIndex) => (
                                      <TableCell
                                        key={colIndex}
                                        className="text-sm"
                                      >
                                        {row[header] || "-"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="bg-[#FBF0E9] p-3 text-center text-sm text-[#AD9C92]">
                            Aperçu des 10 premières lignes • Utilisez
                            &quot;Importer&quot; pour traiter tout le fichier
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center">
                          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-yellow-700 font-medium">
                            Aucune donnée détectée dans le fichier
                          </p>
                          <p className="text-sm text-yellow-600 mt-1">
                            Vérifiez le format de votre fichier CSV
                          </p>
                        </div>
                      )}

                      {previewData.length > 0 && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleFileImport(previewType)}
                            className="bg-[#805050] hover:bg-[#704040] text-white"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Procéder à l'import complet
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleDownloadTemplate(
                                previewType === "produits"
                                  ? "products"
                                  : previewType === "utilisateurs"
                                    ? "users"
                                    : "restock",
                              )
                            }
                            className="border-[#805050] text-[#805050]"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger le modèle
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Catalog Tab */}
            <TabsContent value="catalog">
              {selectedProduct ? (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProduct(null)}
                    className="mb-4 text-[#805050] hover:bg-[#CE8F8A]/10"
                  >
                    ← Retour au catalogue
                  </Button>
                  <PerfumeDetail
                    perfume={{
                      codeProduit: selectedProduct.codeArticle,
                      nomLolly: selectedProduct.name,
                      nomParfumInspire: selectedProduct.nomParfumInspire,
                      marqueInspire: selectedProduct.marqueInspire,
                      genre: selectedProduct.genre || "mixte",
                      saison: selectedProduct.saison || "toutes saisons",
                      familleOlfactive:
                        selectedProduct.familleOlfactive || "Oriental",
                      noteTete: selectedProduct.noteTete || [
                        "Bergamote",
                        "Citron",
                      ],
                      noteCoeur: selectedProduct.noteCoeur || [
                        "Jasmin",
                        "Rose",
                      ],
                      noteFond: selectedProduct.noteFond || ["Musc", "Vanille"],
                      description:
                        selectedProduct.description ||
                        "Une fragrance élégante et raffinée.",
                      imageURL:
                        selectedProduct.imageURL ||
                        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
                      contenances: selectedProduct.variants.map(
                        (variant, index) => ({
                          refComplete:
                            variant.refComplete ||
                            `${selectedProduct.codeArticle}-${variant.size}`,
                          contenance: parseInt(variant.size),
                          unite: "ml",
                          prix: variant.price,
                          stockActuel: variant.stock,
                          actif:
                            variant.actif !== undefined ? variant.actif : true,
                        }),
                      ),
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-playfair text-[#805050]">
                      Catalogue des Produits
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={clearAndReloadCatalog}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        🗑️ Effacer et Recharger depuis Supabase
                      </Button>
                      <Button
                        onClick={async () => {
                          console.log("Actualisation du catalogue...");
                          await loadData();
                          // Dispatch event to update catalog
                          const catalogUpdateEvent = new CustomEvent(
                            "catalogUpdated",
                            {
                              detail: { products },
                            },
                          );
                          window.dispatchEvent(catalogUpdateEvent);
                          alert(
                            "Catalogue actualisé avec les dernières données de Supabase!",
                          );
                        }}
                        className="bg-[#805050] hover:bg-[#704040] text-white"
                      >
                        Actualiser le Catalogue
                      </Button>
                    </div>
                  </div>
                  <PerfumeCatalog
                    key={`catalog-${products.length}-${Date.now()}`}
                    onPerfumeSelect={(perfume) => {
                      // Find the actual product from our products array
                      const actualProduct = products.find(
                        (p) => p.codeArticle === perfume.codeProduit,
                      );
                      if (actualProduct) {
                        setSelectedProduct(actualProduct);
                      } else {
                        // Fallback for products not in our array
                        const adminProduct = {
                          id: Date.now(),
                          codeArticle: perfume.codeProduit,
                          name: perfume.nomLolly,
                          nomParfumInspire: perfume.nomParfumInspire,
                          marqueInspire: perfume.marqueInspire,
                          brand: "Lolly",
                          price: 29.9,
                          stock: 0,
                          active: true,
                          genre: perfume.genre,
                          saison: perfume.saison,
                          familleOlfactive: perfume.familleOlfactive,
                          noteTete: perfume.noteTete,
                          noteCoeur: perfume.noteCoeur,
                          noteFond: perfume.noteFond,
                          description: perfume.description,
                          imageURL: perfume.imageURL,
                          variants: (perfume as any).contenances?.map(
                            (c: any) => ({
                              size: `${c.contenance}${c.unite}`,
                              price: c.prix,
                              stock: c.stockActuel,
                              refComplete: c.refComplete,
                              actif: c.actif,
                            }),
                          ) || [
                            { size: "30ml", price: 29.9, stock: 0 },
                            { size: "50ml", price: 39.9, stock: 0 },
                          ],
                        };
                        setSelectedProduct(adminProduct);
                      }
                    }}
                  />
                </div>
              )}
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#805050] font-playfair">
                      Paramètres Généraux
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Nom de la boutique</Label>
                      <Input defaultValue="Le Compas Olfactif" />
                    </div>
                    <div>
                      <Label>Email de contact</Label>
                      <Input defaultValue="contact@lecompasolfactif.fr" />
                    </div>
                    <div>
                      <Label>Téléphone</Label>
                      <Input defaultValue="+33 1 23 45 67 89" />
                    </div>
                    <div>
                      <Label>Adresse</Label>
                      <Textarea defaultValue="123 Rue des Parfums, 75001 Paris" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-[#805050] font-playfair">
                      Paramètres de Vente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>TVA (%)</Label>
                      <Input type="number" defaultValue="20" />
                    </div>
                    <div>
                      <Label>Frais de livraison (TND)</Label>
                      <Input type="number" defaultValue="15.000" step="0.001" />
                    </div>
                    <div>
                      <Label>Livraison gratuite à partir de (TND)</Label>
                      <Input
                        type="number"
                        defaultValue="150.000"
                        step="0.001"
                      />
                    </div>
                    <div>
                      <Label>Logo de la boutique</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        className="border-[#D4C2A1]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-[#805050] hover:bg-[#704040] text-white">
                        Sauvegarder les paramètres
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Notifications email</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-[#805050] font-playfair flex items-center justify-between">
                    Promotions
                    <Button
                      onClick={() => setShowNewPromotion(true)}
                      className="bg-[#805050] hover:bg-[#704040] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle Promotion
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {promotions.map((promotion) => (
                      <Card
                        key={promotion.id}
                        className="border border-[#CE8F8A]"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-[#805050]">
                                {promotion.nom}
                              </h4>
                              <p className="text-sm text-[#AD9C92]">
                                -{promotion.pourcentage_reduction}%{" "}
                                {promotion.description}
                              </p>
                              <p className="text-xs text-[#AD9C92]">
                                Du {promotion.date_debut} au{" "}
                                {promotion.date_fin}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Switch
                                checked={promotion.active}
                                onCheckedChange={async (checked) => {
                                  const { error } = await supabase
                                    .from("promotions")
                                    .update({ active: checked })
                                    .eq("id", promotion.id);

                                  if (!error) {
                                    await loadData();
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPromotion(promotion);
                                  setShowEditPromotion(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {promotions.length === 0 && (
                      <p className="text-center text-[#AD9C92] py-4">
                        Aucune promotion active
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* New Product Dialog */}
      <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
        <DialogContent className="sm:max-w-[800px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Nouveau Produit
            </DialogTitle>
            <DialogDescription className="text-[#AD9C92]">
              Ajouter un nouveau produit au catalogue
            </DialogDescription>
          </DialogHeader>
          <form id="new-product-form" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code Article</Label>
                <Input
                  name="codeArticle"
                  placeholder="L001"
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Nom Lolly</Label>
                <Input
                  name="nomLolly"
                  placeholder="Élégance Nocturne"
                  className="border-[#D4C2A1]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Parfum inspiré</Label>
                <Input
                  name="parfumInspire"
                  placeholder="Black Opium"
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Marque inspirée</Label>
                <Input
                  name="marqueInspire"
                  placeholder="Yves Saint Laurent"
                  className="border-[#D4C2A1]"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Genre</Label>
                <Select name="genre">
                  <SelectTrigger className="border-[#D4C2A1]">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                    <SelectItem value="mixte">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Saison</Label>
                <Select name="saison">
                  <SelectTrigger className="border-[#D4C2A1]">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="été">Été</SelectItem>
                    <SelectItem value="hiver">Hiver</SelectItem>
                    <SelectItem value="toutes saisons">
                      Toutes saisons
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Famille Olfactive</Label>
                <Input
                  name="familleOlfactive"
                  placeholder="Oriental"
                  className="border-[#D4C2A1]"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                placeholder="Description du parfum..."
                className="border-[#D4C2A1]"
              />
            </div>
            <div>
              <Label>Image du produit</Label>
              <Input
                type="file"
                accept="image/*"
                className="border-[#D4C2A1]"
              />
            </div>
            <div>
              <Label>Contenances et prix (TND)</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="15"
                    className="border-[#D4C2A1]"
                    disabled
                  />
                  <Input
                    placeholder="ml"
                    className="border-[#D4C2A1]"
                    disabled
                  />
                  <Input
                    name="prix15ml"
                    placeholder="19.900"
                    className="border-[#D4C2A1]"
                  />
                  <Input
                    name="stock15ml"
                    placeholder="Stock"
                    className="border-[#D4C2A1]"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="30"
                    className="border-[#D4C2A1]"
                    disabled
                  />
                  <Input
                    placeholder="ml"
                    className="border-[#D4C2A1]"
                    disabled
                  />
                  <Input
                    name="prix30ml"
                    placeholder="29.900"
                    className="border-[#D4C2A1]"
                  />
                  <Input
                    name="stock30ml"
                    placeholder="Stock"
                    className="border-[#D4C2A1]"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="50"
                    className="border-[#D4C2A1]"
                    disabled
                  />
                  <Input
                    placeholder="ml"
                    className="border-[#D4C2A1]"
                    disabled
                  />
                  <Input
                    name="prix50ml"
                    placeholder="39.900"
                    className="border-[#D4C2A1]"
                  />
                  <Input
                    name="stock50ml"
                    placeholder="Stock"
                    className="border-[#D4C2A1]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewProduct(false)}
                  className="flex-1"
                >
                Annuler
              </Button>
              <Button
                type="button"
                className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                onClick={async () => {
                  try {
                    // Get form data
                    const formData = new FormData(
                      document.querySelector("#new-product-form"),
                    );

                    // Create product in Supabase
                    const { data: newProduct, error: productError } =
                      await supabase
                        .from("products")
                        .insert({
                          code_produit: String(
                            formData.get("codeArticle") || `L${Date.now()}`,
                          ),
                          nom_lolly: String(
                            formData.get("nomLolly") || "Nouveau Produit",
                          ),
                          nom_parfum_inspire: String(
                            formData.get("parfumInspire") || "Parfum Inspiré",
                          ),
                          marque_inspire: String(
                            formData.get("marqueInspire") || "Marque Inspirée",
                          ),
                          genre: String(formData.get("genre") || "mixte"),
                          saison: String(
                            formData.get("saison") || "toutes saisons",
                          ),
                          famille_olfactive: String(
                            formData.get("familleOlfactive") || "Oriental",
                          ),
                          note_tete: (
                            (formData.get("notesTete") as string) || ""
                          )
                            .split(",")
                            .map((n) => n.trim())
                            .filter((n) => n.length > 0),
                          note_coeur: (
                            (formData.get("notesCoeur") as string) || ""
                          )
                            .split(",")
                            .map((n) => n.trim())
                            .filter((n) => n.length > 0),
                          note_fond: (
                            (formData.get("notesFond") as string) || ""
                          )
                            .split(",")
                            .map((n) => n.trim())
                            .filter((n) => n.length > 0),
                          description:
                            (formData.get("description") as string) ||
                            "Description du produit",
                          image_url:
                            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
                          active: true,
                        })
                        .select()
                        .single();

                    if (productError) {
                      console.error("Error creating product:", productError);
                      alert("Erreur lors de la création du produit");
                      return;
                    }

                    // Create variants
                    const variants = [
                      {
                        size: "15ml",
                        price:
                          parseFloat(
                            (formData.get("prix15ml") as string) || "19.9",
                          ) || 19.9,
                        stock:
                          parseInt(
                            (formData.get("stock15ml") as string) || "0",
                          ) || 0,
                      },
                      {
                        size: "30ml",
                        price:
                          parseFloat(
                            (formData.get("prix30ml") as string) || "29.9",
                          ) || 29.9,
                        stock:
                          parseInt(
                            (formData.get("stock30ml") as string) || "0",
                          ) || 0,
                      },
                      {
                        size: "50ml",
                        price:
                          parseFloat(
                            (formData.get("prix50ml") as string) || "39.9",
                          ) || 39.9,
                        stock:
                          parseInt(
                            (formData.get("stock50ml") as string) || "0",
                          ) || 0,
                      },
                    ];

                    for (const variant of variants) {
                      await supabase.from("product_variants").insert({
                        product_id: newProduct.id,
                        ref_complete: `${newProduct.code_produit}-${variant.size}`,
                        contenance: parseInt(variant.size),
                        unite: "ml",
                        prix: variant.price,
                        stock_actuel: variant.stock,
                        actif: true,
                      });
                    }

                    // Reload data
                    await loadData();

                    alert("Produit créé avec succès dans Supabase!");
                    setShowNewProduct(false);
                  } catch (error) {
                    console.error("Error creating product:", error);
                    alert("Erreur lors de la création du produit");
                  }
                }}
              >
                Ajouter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Preview Dialog */}
      <Dialog open={showProductPreview} onOpenChange={setShowProductPreview}>
        <DialogContent className="sm:max-w-[900px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Aperçu Complet du Produit
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#805050] font-medium">
                      Image du Produit
                    </Label>
                    <div className="mt-2 border rounded-lg p-4 bg-white">
                      <img
                        src={
                          selectedProduct.imageURL ||
                          "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80"
                        }
                        alt={selectedProduct.name}
                        className="w-full h-48 object-cover rounded"
                        key={`preview-${selectedProduct.id}-${selectedProduct.lastModified || Date.now()}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Code Article
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        {selectedProduct.codeArticle}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Nom Lolly
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        {selectedProduct.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Parfum Inspiré
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        {selectedProduct.nomParfumInspire}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Marque Inspirée
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        {selectedProduct.marqueInspire}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Genre
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        Mixte
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Saison
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        Toutes saisons
                      </p>
                    </div>
                    <div>
                      <Label className="text-[#805050] font-medium">
                        Famille
                      </Label>
                      <p className="text-[#AD9C92] bg-white p-2 rounded border">
                        Oriental
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[#805050] font-medium">
                      Description
                    </Label>
                    <p className="text-[#AD9C92] bg-white p-3 rounded border">
                      Une fragrance élégante et raffinée qui capture l'essence
                      de la sophistication moderne.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-[#805050] font-medium">
                  Notes Olfactives
                </Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label className="text-sm text-gray-600">
                      Notes de Tête
                    </Label>
                    <p className="text-[#AD9C92] bg-white p-2 rounded border text-sm">
                      Bergamote, Citron
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Notes de Cœur
                    </Label>
                    <p className="text-[#AD9C92] bg-white p-2 rounded border text-sm">
                      Jasmin, Rose
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Notes de Fond
                    </Label>
                    <p className="text-[#AD9C92] bg-white p-2 rounded border text-sm">
                      Musc, Vanille
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-[#805050] font-medium">
                  Variantes et Prix (TND)
                </Label>
                <div className="space-y-2 mt-2">
                  {selectedProduct.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded border"
                    >
                      <span className="font-medium">{variant.size}</span>
                      <span className="text-[#805050]">
                        {variant.price.toFixed(3)} TND
                      </span>
                      <Badge
                        variant={
                          variant.stock > 5
                            ? "default"
                            : variant.stock > 0
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        Stock: {variant.stock}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
        <DialogContent className="sm:max-w-[900px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Modifier le Produit Complet
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Image du Produit</Label>
                    <div className="space-y-2">
                      <img
                        src={
                          imagePreview ||
                          editFormData.imageURL ||
                          "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80"
                        }
                        alt={selectedProduct.name}
                        className="w-full h-48 object-cover rounded border"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        className="border-[#D4C2A1]"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImageFile(file);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              setImagePreview(result);
                              setEditFormData((prev) => ({
                                ...prev,
                                imageURL: result,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Code Article</Label>
                      <Input
                        value={editFormData.codeArticle || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            codeArticle: e.target.value,
                          }))
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                    <div>
                      <Label>Nom Lolly</Label>
                      <Input
                        value={editFormData.name || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Parfum Inspiré</Label>
                      <Input
                        value={editFormData.nomParfumInspire || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            nomParfumInspire: e.target.value,
                          }))
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                    <div>
                      <Label>Marque Inspirée</Label>
                      <Input
                        value={editFormData.marqueInspire || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            marqueInspire: e.target.value,
                          }))
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Genre</Label>
                      <Select defaultValue="mixte">
                        <SelectTrigger className="border-[#D4C2A1]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homme">Homme</SelectItem>
                          <SelectItem value="femme">Femme</SelectItem>
                          <SelectItem value="mixte">Mixte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Saison</Label>
                      <Select defaultValue="toutes saisons">
                        <SelectTrigger className="border-[#D4C2A1]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="été">Été</SelectItem>
                          <SelectItem value="hiver">Hiver</SelectItem>
                          <SelectItem value="toutes saisons">
                            Toutes saisons
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Famille Olfactive</Label>
                      <Input
                        defaultValue="Oriental"
                        className="border-[#D4C2A1]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      defaultValue="Une fragrance élégante et raffinée qui capture l'essence de la sophistication moderne."
                      className="border-[#D4C2A1]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Notes Olfactives</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Notes de Tête</Label>
                    <Input
                      defaultValue="Bergamote, Citron"
                      className="border-[#D4C2A1]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Notes de Cœur</Label>
                    <Input
                      defaultValue="Jasmin, Rose"
                      className="border-[#D4C2A1]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Notes de Fond</Label>
                    <Input
                      defaultValue="Musc, Vanille"
                      className="border-[#D4C2A1]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Variantes et Prix (TND)</Label>
                <div className="space-y-2 mt-2">
                  {selectedProduct.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Input
                        defaultValue={variant.size.replace("ml", "")}
                        placeholder="Contenance"
                        className="border-[#D4C2A1]"
                      />
                      <Input
                        defaultValue="ml"
                        placeholder="Unité"
                        className="border-[#D4C2A1]"
                      />
                      <Input
                        defaultValue={variant.price.toFixed(3)}
                        placeholder="Prix TND"
                        className="border-[#D4C2A1]"
                      />
                      <Input
                        defaultValue={variant.stock}
                        placeholder="Stock"
                        className="border-[#D4C2A1]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditProduct(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                  onClick={async () => {
                    // Update product in Supabase
                    const { error } = await supabase
                      .from("products")
                      .update({
                        code_produit:
                          editFormData.codeArticle ||
                          selectedProduct.codeArticle,
                        nom_lolly: editFormData.name || selectedProduct.name,
                        nom_parfum_inspire:
                          editFormData.nomParfumInspire ||
                          selectedProduct.nomParfumInspire,
                        marque_inspire:
                          editFormData.marqueInspire ||
                          selectedProduct.marqueInspire,
                        image_url:
                          editFormData.imageURL || selectedProduct.imageURL,
                      })
                      .eq("id", selectedProduct.id);

                    if (error) {
                      console.error("Error updating product:", error);
                      alert("Erreur lors de la mise à jour du produit");
                      return;
                    }

                    // Reload data
                    await loadData();

                    // Dispatch event to update other components
                    const productUpdateEvent = new CustomEvent(
                      "productUpdated",
                      {
                        detail: {
                          productId: selectedProduct.id,
                          updatedData: editFormData,
                        },
                      },
                    );
                    window.dispatchEvent(productUpdateEvent);

                    alert(
                      "✅ Produit modifié avec succès!\n\nLes modifications sont maintenant visibles:\n- Dans le catalogue\n- Dans les fiches produit\n- Dans tous les espaces",
                    );
                    setShowEditProduct(false);
                    setEditFormData({});
                    setImagePreview("");
                    setSelectedImageFile(null);
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={showRestock} onOpenChange={setShowRestock}>
        <DialogContent className="sm:max-w-[500px] bg-[#FBF0E9]">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Réapprovisionnement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProductForRestock && (
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">
                  {selectedProductForRestock.product.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedProductForRestock.variant.size}
                </p>
                <p className="text-sm">
                  Stock actuel: {selectedProductForRestock.variant.stock}
                </p>
              </div>
            )}
            <div>
              <Label>Quantité à ajouter</Label>
              <Input
                id="restock-quantity"
                type="number"
                placeholder="10"
                className="border-[#D4C2A1]"
              />
            </div>
            <div>
              <Label>Date de réapprovisionnement</Label>
              <Input type="date" className="border-[#D4C2A1]" />
            </div>
            <div>
              <Label>Remarque sur le document d'achat</Label>
              <Textarea
                placeholder="Facture n°..."
                className="border-[#D4C2A1]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRestock(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                onClick={async () => {
                  const quantityInput = document.getElementById(
                    "restock-quantity",
                  ) as HTMLInputElement;
                  const quantityToAdd = parseInt(quantityInput?.value || "0");

                  if (quantityToAdd > 0 && selectedProductForRestock) {
                    // Update stock in Supabase
                    const variant = selectedProductForRestock.variant;
                    const { error } = await supabase
                      .from("product_variants")
                      .update({
                        stock_actuel: variant.stock + quantityToAdd,
                      })
                      .eq("id", variant.id);

                    if (error) {
                      console.error("Error updating stock:", error);
                      alert("Erreur lors de la mise à jour du stock");
                      return;
                    }

                    // Record stock movement
                    await supabase.from("stock_movements").insert({
                      product_variant_id: variant.id,
                      type: "entree",
                      quantity: quantityToAdd,
                      reason: "Réapprovisionnement manuel",
                      created_by: authUser?.id,
                    });

                    // Reload data
                    await loadData();

                    // Dispatch event to update other components
                    const stockUpdateEvent = new CustomEvent("stockUpdated", {
                      detail: {
                        productId: selectedProductForRestock.product.id,
                        variantIndex: selectedProductForRestock.variantIndex,
                        quantityAdded: quantityToAdd,
                      },
                    });
                    window.dispatchEvent(stockUpdateEvent);

                    alert(
                      `✅ Réapprovisionnement réussi!\n\n+${quantityToAdd} unités ajoutées\nProduit: ${selectedProductForRestock.product.name}\nVariante: ${selectedProductForRestock.variant.size}\n\nMis à jour dans:\n- Fiches produit\n- Indicateurs de stock\n- Catalogue\n- Gestion des produits`,
                    );
                  }
                  setShowRestock(false);
                  setSelectedProductForRestock(null);
                }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="sm:max-w-[500px] bg-[#FBF0E9]">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Modifier l'Utilisateur
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form id="edit-user-form" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input
                    name="prenom"
                    defaultValue={selectedUser.prenom}
                    className="border-[#D4C2A1]"
                  />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input
                    name="nom"
                    defaultValue={selectedUser.nom}
                    className="border-[#D4C2A1]"
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  defaultValue={selectedUser.email}
                  className="border-[#D4C2A1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    name="telephone"
                    defaultValue={selectedUser.telephone || ""}
                    className="border-[#D4C2A1]"
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    name="whatsapp"
                    defaultValue={selectedUser.whatsapp || ""}
                    className="border-[#D4C2A1]"
                  />
                </div>
              </div>
              <div>
                <Label>Date de naissance</Label>
                <Input
                  name="dateNaissance"
                  type="date"
                  defaultValue={selectedUser.dateNaissance || ""}
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Adresse</Label>
                <Textarea
                  name="adresse"
                  defaultValue={selectedUser.adresse || ""}
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Rôle</Label>
                <Select name="role" defaultValue={selectedUser.role}>
                  <SelectTrigger className="border-[#D4C2A1]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="conseillere">Conseillère</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nouveau mot de passe (optionnel)</Label>
                <Input
                  name="newPassword"
                  type="password"
                  placeholder="Laisser vide pour ne pas changer"
                  className="border-[#D4C2A1]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditUser(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                  onClick={async () => {
                    try {
                      const formData = new FormData(
                        document.querySelector("#edit-user-form"),
                      );

                      const updateData = {
                        prenom: (formData.get("prenom") as string) || "",
                        nom: (formData.get("nom") as string) || "",
                        email: (formData.get("email") as string) || "",
                        telephone: formData.get("telephone")
                          ? (formData.get("telephone") as string)
                          : null,
                        whatsapp: formData.get("whatsapp")
                          ? (formData.get("whatsapp") as string)
                          : null,
                        date_naissance: formData.get("dateNaissance")
                          ? (formData.get("dateNaissance") as string)
                          : null,
                        adresse: formData.get("adresse")
                          ? (formData.get("adresse") as string)
                          : null,
                        role: (formData.get("role") as string) || "client",
                      };

                      const { error } = await supabase
                        .from("users")
                        .update(updateData)
                        .eq("id", selectedUser.id);

                      if (error) {
                        console.error("Error updating user:", error);
                        alert("Erreur lors de la mise à jour de l'utilisateur");
                        return;
                      }

                      // Handle password update if provided
                      const newPassword =
                        (formData.get("newPassword") as string) || "";
                      if (newPassword && newPassword.trim()) {
                        // Note: In a real app, you'd need to handle password updates through Supabase Auth
                        console.log(
                          "Password update requested for user:",
                          selectedUser.email,
                        );
                        alert(
                          "Utilisateur mis à jour! Note: La mise à jour du mot de passe nécessite une implémentation spéciale.",
                        );
                      } else {
                        alert(
                          "Utilisateur mis à jour avec succès dans Supabase!",
                        );
                      }

                      await loadData();
                      setShowEditUser(false);
                    } catch (error) {
                      console.error("Error updating user:", error);
                      alert("Erreur lors de la mise à jour de l'utilisateur");
                    }
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* New Promotion Dialog */}
      <Dialog open={showNewPromotion} onOpenChange={setShowNewPromotion}>
        <DialogContent className="sm:max-w-[500px] bg-[#FBF0E9]">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Nouvelle Promotion
            </DialogTitle>
          </DialogHeader>
          <form id="new-promotion-form" className="space-y-4">
            <div>
              <Label>Nom de la promotion</Label>
              <Input
                name="nom"
                placeholder="Soldes d'été"
                className="border-[#D4C2A1]"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                name="description"
                placeholder="Description de la promotion"
                className="border-[#D4C2A1]"
              />
            </div>
            <div>
              <Label>Pourcentage de réduction</Label>
              <Input
                name="pourcentage"
                type="number"
                placeholder="20"
                className="border-[#D4C2A1]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début</Label>
                <Input
                  name="dateDebut"
                  type="date"
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Date de fin</Label>
                <Input
                  name="dateFin"
                  type="date"
                  className="border-[#D4C2A1]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewPromotion(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                onClick={async () => {
                  try {
                    const formData = new FormData(
                      document.querySelector("#new-promotion-form"),
                    );

                    const { error } = await supabase.from("promotions").insert({
                      nom:
                        (formData.get("nom") as string) || "Nouvelle Promotion",
                      description:
                        (formData.get("description") as string) ||
                        `Réduction de ${(formData.get("pourcentage") as string) || "0"}%`,
                      pourcentage_reduction: parseFloat(
                        (formData.get("pourcentage") as string) || "0",
                      ),
                      date_debut:
                        (formData.get("dateDebut") as string) ||
                        new Date().toISOString().split("T")[0],
                      date_fin:
                        (formData.get("dateFin") as string) ||
                        new Date().toISOString().split("T")[0],
                      active: true,
                    });

                    if (error) {
                      console.error("Error creating promotion:", error);
                      alert("Erreur lors de la création de la promotion");
                      return;
                    }

                    await loadData();
                    alert("Promotion créée avec succès dans Supabase!");
                    setShowNewPromotion(false);

                    // Reset form
                    const formElement = document.querySelector(
                      "#new-promotion-form",
                    ) as HTMLFormElement;
                    if (
                      formElement &&
                      typeof formElement.reset === "function"
                    ) {
                      formElement.reset();
                    }
                  } catch (error) {
                    console.error("Error creating promotion:", error);
                    alert("Erreur lors de la création de la promotion");
                  }
                }}
              >
                Créer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={showEditPromotion} onOpenChange={setShowEditPromotion}>
        <DialogContent className="sm:max-w-[500px] bg-[#FBF0E9]">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Modifier la Promotion
            </DialogTitle>
          </DialogHeader>
          {selectedPromotion && (
            <form id="edit-promotion-form" className="space-y-4">
              <div>
                <Label>Nom de la promotion</Label>
                <Input
                  name="nom"
                  defaultValue={selectedPromotion.nom}
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  name="description"
                  defaultValue={selectedPromotion.description}
                  className="border-[#D4C2A1]"
                />
              </div>
              <div>
                <Label>Pourcentage de réduction</Label>
                <Input
                  name="pourcentage"
                  type="number"
                  defaultValue={selectedPromotion.pourcentage_reduction}
                  className="border-[#D4C2A1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de début</Label>
                  <Input
                    name="dateDebut"
                    type="date"
                    defaultValue={selectedPromotion.date_debut}
                    className="border-[#D4C2A1]"
                  />
                </div>
                <div>
                  <Label>Date de fin</Label>
                  <Input
                    name="dateFin"
                    type="date"
                    defaultValue={selectedPromotion.date_fin}
                    className="border-[#D4C2A1]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditPromotion(false);
                    setSelectedPromotion(null);
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                  onClick={async () => {
                    try {
                      const formData = new FormData(
                        document.querySelector("#edit-promotion-form"),
                      );

                      if (!selectedPromotion) {
                        alert("Aucune promotion sélectionnée");
                        return;
                      }

                      const { error } = await supabase
                        .from("promotions")
                        .update({
                          nom:
                            (formData.get("nom") as string) ||
                            selectedPromotion.nom,
                          description:
                            (formData.get("description") as string) ||
                            selectedPromotion.description,
                          pourcentage_reduction:
                            parseFloat(
                              (formData.get("pourcentage") as string) || "0",
                            ) || selectedPromotion.pourcentage_reduction,
                          date_debut:
                            (formData.get("dateDebut") as string) ||
                            selectedPromotion.date_debut,
                          date_fin:
                            (formData.get("dateFin") as string) ||
                            selectedPromotion.date_fin,
                        })
                        .eq("id", selectedPromotion.id);

                      if (error) {
                        console.error("Error updating promotion:", error);
                        alert("Erreur lors de la modification de la promotion");
                        return;
                      }

                      await loadData();
                      alert("Promotion modifiée avec succès dans Supabase!");
                      setShowEditPromotion(false);
                      setSelectedPromotion(null);
                    } catch (error) {
                      console.error("Error updating promotion:", error);
                      alert("Erreur lors de la modification de la promotion");
                    }
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
        <DialogContent className="sm:max-w-[600px] bg-[#FBF0E9]">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Nouvel Utilisateur
            </DialogTitle>
            <DialogDescription className="text-[#AD9C92]">
              Ajouter un nouvel utilisateur au système
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom *</Label>
                <Input
                  placeholder="Marie"
                  className="border-[#D4C2A1]"
                  value={newUserFormData.prenom}
                  onChange={(e) =>
                    setNewUserFormData((prev) => ({
                      ...prev,
                      prenom: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Nom *</Label>
                <Input
                  placeholder="Dupont"
                  className="border-[#D4C2A1]"
                  value={newUserFormData.nom}
                  onChange={(e) =>
                    setNewUserFormData((prev) => ({
                      ...prev,
                      nom: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                placeholder="marie@email.com"
                className="border-[#D4C2A1]"
                value={newUserFormData.email}
                onChange={(e) =>
                  setNewUserFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Téléphone</Label>
                <Input
                  placeholder="0123456789"
                  className="border-[#D4C2A1]"
                  value={newUserFormData.telephone}
                  onChange={(e) =>
                    setNewUserFormData((prev) => ({
                      ...prev,
                      telephone: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input
                  placeholder="0123456789"
                  className="border-[#D4C2A1]"
                  value={newUserFormData.whatsapp}
                  onChange={(e) =>
                    setNewUserFormData((prev) => ({
                      ...prev,
                      whatsapp: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Date de naissance</Label>
              <Input
                type="date"
                className="border-[#D4C2A1]"
                value={newUserFormData.dateNaissance}
                onChange={(e) =>
                  setNewUserFormData((prev) => ({
                    ...prev,
                    dateNaissance: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select
                value={newUserFormData.role}
                onValueChange={(value) =>
                  setNewUserFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="border-[#D4C2A1]">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="conseillere">Conseillère</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mot de passe temporaire *</Label>
              <Input
                type="password"
                placeholder="Mot de passe"
                className="border-[#D4C2A1]"
                value={newUserFormData.password}
                onChange={(e) =>
                  setNewUserFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewUser(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-[#805050] hover:bg-[#704040] text-white"
                onClick={async () => {
                  try {
                    console.log(
                      "🔍 Form data before validation:",
                      newUserFormData,
                    );

                    // Enhanced validation with detailed logging
                    const requiredFields = {
                      prenom: newUserFormData.prenom?.trim(),
                      nom: newUserFormData.nom?.trim(),
                      email: newUserFormData.email?.trim(),
                      password: newUserFormData.password?.trim(),
                    };

                    console.log("🔍 Required fields check:", requiredFields);

                    const missingFields = [];
                    if (!requiredFields.prenom) missingFields.push("Prénom");
                    if (!requiredFields.nom) missingFields.push("Nom");
                    if (!requiredFields.email) missingFields.push("Email");
                    if (!requiredFields.password)
                      missingFields.push("Mot de passe");

                    if (missingFields.length > 0) {
                      console.log("❌ Missing fields:", missingFields);
                      alert(
                        `❌ Champs obligatoires manquants: ${missingFields.join(", ")}\n\nVeuillez remplir tous les champs marqués d'un astérisque (*).`,
                      );
                      return;
                    }

                    // Email validation
                    if (
                      !requiredFields.email.includes("@") ||
                      requiredFields.email.length < 5
                    ) {
                      alert("❌ Veuillez saisir une adresse email valide.");
                      return;
                    }

                    // Password validation
                    if (requiredFields.password.length < 6) {
                      alert(
                        "❌ Le mot de passe doit contenir au moins 6 caractères.",
                      );
                      return;
                    }

                    console.log(
                      "✅ Validation passed, creating user with role:",
                      newUserFormData.role,
                    );

                    // Create user directly in Supabase users table (bypassing auth for admin creation)
                    const userData = {
                      email: requiredFields.email.toLowerCase(),
                      nom: requiredFields.nom,
                      prenom: requiredFields.prenom,
                      role: newUserFormData.role || "client",
                      telephone: newUserFormData.telephone?.trim() || null,
                      whatsapp: newUserFormData.whatsapp?.trim() || null,
                      date_naissance: newUserFormData.dateNaissance || null,
                      code_client: `${newUserFormData.role === "admin" ? "ADM" : newUserFormData.role === "conseillere" ? "CNS" : "C"}${Date.now().toString().slice(-6)}`,
                    };

                    console.log(
                      "📝 Creating user in Supabase with data:",
                      userData,
                    );

                    // Check if user already exists
                    const { data: existingUser } = await supabase
                      .from("users")
                      .select("email")
                      .eq("email", userData.email)
                      .single();

                    if (existingUser) {
                      alert(
                        `❌ Un utilisateur avec l'email ${userData.email} existe déjà.`,
                      );
                      return;
                    }

                    // Insert user directly into users table
                    const { data: createdUser, error: createError } =
                      await supabase
                        .from("users")
                        .insert(userData)
                        .select()
                        .single();

                    if (createError) {
                      console.error("❌ Error creating user:", createError);
                      alert(
                        `❌ Erreur lors de la création: ${createError.message}`,
                      );
                      return;
                    }

                    console.log("✅ User created successfully:", createdUser);

                    // Reload users from Supabase
                    await loadData();

                    // Reset form
                    setNewUserFormData({
                      prenom: "",
                      nom: "",
                      email: "",
                      telephone: "",
                      whatsapp: "",
                      dateNaissance: "",
                      role: "client",
                      password: "",
                    });

                    alert(
                      `✅ Utilisateur créé avec succès!\n\nNom: ${userData.prenom} ${userData.nom}\nEmail: ${userData.email}\nRôle: ${userData.role}\nCode client: ${userData.code_client}\n\nL'utilisateur a été ajouté à la base de données Supabase.`,
                    );
                    setShowNewUser(false);
                  } catch (error) {
                    console.error("💥 Unexpected error creating user:", error);
                    alert(
                      `❌ Erreur technique: ${error.message || "Erreur inconnue"}\n\nVeuillez réessayer ou contacter le support.`,
                    );
                  }
                }}
              >
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSpace;
