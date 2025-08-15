import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Trash2, Plus, Minus, Edit, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/auth/LoginDialog";
import { supabase } from "@/lib/supabaseClient";

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ open, onOpenChange }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const { isAuthenticated, user, updateUser } = useAuth() as any;
  const [showLogin, setShowLogin] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else if (!user?.adresse) {
      alert("Veuillez ajouter une adresse avant de finaliser votre commande.");
      setShowCheckout(true);
      setIsEditingProfile(true);
      setEditedUser({ ...user });
    } else {
      setShowCheckout(true);
    }
  };

  const handleFinalizeOrder = async () => {
    setIsSubmitting(true);

    // Send notifications to admin and conseillère
    console.log(
      "Notification envoyée à l'admin et à la conseillère: Nouvelle commande reçue",
    );

    const date = new Date().toISOString().split("T")[0];
    const totalAmount = getTotalPrice() * 0.85; // With discounts

    try {
      // 1. Create order
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          code_client: user?.codeClient || "C999",
          total_amount: totalAmount,
          status: "confirmee",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;
      const orderId = newOrder.id;

      // 2. Fetch product variant ids for items in cart
      const refs = items.map((item) => item.refComplete.replace(/ml$/, ""));
      const { data: variants, error: variantError } = await supabase
        .from("product_variants")
        .select("id, ref_complete")
        .in("ref_complete", refs);
      if (variantError) throw variantError;
      const variantMap = new Map(
        variants.map((v: any) => [v.ref_complete.replace(/ml$/, ""), v.id]),
      );

      // 3. Insert order items
      const orderItems = [] as any[];
      for (const item of items) {
        const variantId = variantMap.get(
          item.refComplete.replace(/ml$/, ""),
        );
        if (!variantId) {
          alert("Référence produit introuvable");
          setIsSubmitting(false);
          return;
        }
        orderItems.push({
          order_id: orderId,
          product_variant_id: variantId,
          quantity: item.quantity,
          unit_price: item.prix,
          total_price: item.prix * item.quantity,
        });
      }
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. Store order locally
      const orderData = {
        id: orderId,
        date,
        client: user ? `${user.prenom} ${user.nom}` : "Client Test",
        codeClient: user?.codeClient || "C999",
        items: items.map((item) => ({
          product: item.nomLolly,
          nomParfumInspire: item.nomParfumInspire || "Parfum Inspiré",
          codeArticle: item.refComplete,
          amount: item.prix * item.quantity,
          quantity: item.quantity,
        })),
        totalAmount,
        status: "Confirmée",
      };
      const existingOrders = JSON.parse(
        localStorage.getItem("client-orders") || "[]",
      );
      existingOrders.unshift(orderData);
      localStorage.setItem("client-orders", JSON.stringify(existingOrders));

      // 5. Notify admin space for each item with expected keys
      orderData.items.forEach((item: any) => {
        const adminEvent = new CustomEvent("newSaleRecorded", {
          detail: {
            id: `${orderId}-${item.codeArticle}`,
            date: orderData.date,
            client: orderData.client,
            codeClient: orderData.codeClient,
            product: item.product,
            codeArticle: item.codeArticle,
            amount: item.amount,
            conseillere: "N/A",
          },
        });
        window.dispatchEvent(adminEvent);
      });

      // Process order
      setOrderComplete(true);
      clearCart();
      setShowCheckout(false);

      // Dispatch event to update order history immediately
      window.dispatchEvent(new CustomEvent("orderCompleted"));

      setTimeout(() => {
        setOrderComplete(false);
        onOpenChange(false);
        // Redirect to account page after order completion
        const event = new CustomEvent("redirectToAccount");
        window.dispatchEvent(event);
      }, 2000);
    } catch (err) {
      console.error("Error finalizing order:", err);
      alert("Erreur lors de la validation de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = () => {
    if (!editedUser?.adresse) {
      alert("L'adresse est obligatoire pour finaliser la commande.");
      return;
    }
    updateUser(editedUser);
    setIsEditingProfile(false);
    setEditedUser(null);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    handleCheckout();
  };

  if (orderComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[50vw] sm:max-w-[300px] bg-[#FBF0E9] rounded-lg">
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-playfair text-[#805050] mb-2">
              Commande confirmée !
            </h3>
            <p className="text-sm text-[#AD9C92]">
              Votre commande a été enregistrée avec succès.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[80vw] sm:w-[95vw] max-w-[600px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Mon Panier ({items.length} articles)
            </DialogTitle>
            <DialogDescription className="text-[#AD9C92]">
              Vérifiez vos articles avant de finaliser votre commande
            </DialogDescription>
          </DialogHeader>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-[#AD9C92] mx-auto mb-4 opacity-50" />
              <p className="text-[#AD9C92]">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.refComplete}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg"
                >
                  <img
                    src={item.imageURL}
                    alt={item.nomLolly}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#805050] truncate">
                      {item.nomLolly}
                    </h4>
                    <p className="text-sm text-[#AD9C92]">
                      {item.contenance} {item.unite} - {item.prix.toFixed(3)}{" "}
                      TND
                    </p>
                    <p className="text-xs text-[#AD9C92]">Réf. : {item.refComplete}</p>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.refComplete, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.refComplete, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#805050] text-sm">
                        {(item.prix * item.quantity).toFixed(3)} TND
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.refComplete)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-4">
                {/* Promo and delivery section */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#805050]">Sous-total:</span>
                    <span className="text-sm text-[#805050]">
                      {getTotalPrice().toFixed(3)} TND
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">
                      Promotion Nouvelle Année (-10%):
                    </span>
                    <span className="text-sm">
                      -{(getTotalPrice() * 0.1).toFixed(3)} TND
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#805050]">Livraison:</span>
                    <span className="text-sm text-green-600">
                      Gratuite (Promo Janvier)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-blue-600">
                    <span className="text-sm">Remise fidélité:</span>
                    <span className="text-sm">
                      -{(getTotalPrice() * 0.05).toFixed(3)} TND
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-[#805050]">Total final:</span>
                      <span className="text-[#805050]">
                        {(getTotalPrice() * 0.85).toFixed(3)} TND
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Vous économisez {(getTotalPrice() * 0.15).toFixed(3)} TND
                      !
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      // Use the existing event system to navigate back to catalog
                      window.dispatchEvent(
                        new CustomEvent("navigateToCatalog"),
                      );
                    }}
                    className="flex-1 border-[#D4C2A1] text-[#805050] hover:bg-[#FBF0E9]/50 text-sm"
                  >
                    Continuer mes achats
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm("Êtes-vous sûr de vouloir vider le panier ?")
                      ) {
                        clearCart();
                        alert("🛒 Panier vidé avec succès!");
                        onOpenChange(false);
                      }
                    }}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 text-sm"
                  >
                    Vider le panier
                  </Button>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-[#805050] hover:bg-[#805050]/90 text-white text-sm"
                >
                  {isAuthenticated
                    ? "Finaliser la commande"
                    : "Se connecter et commander"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onSuccess={handleLoginSuccess}
      />

      {/* Checkout Preview Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="w-[90vw] sm:w-[95vw] max-w-[600px] bg-[#FBF0E9] max-h-[85vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-[#805050] font-playfair">
              Aperçu de la commande
            </DialogTitle>
            <DialogDescription className="text-[#AD9C92]">
              Vérifiez vos informations avant de finaliser
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-[#805050] mb-3">
                Résumé de la commande
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.refComplete}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.nomLolly} - {item.contenance}
                      {item.unite}
                    </span>
                    <span>{(item.prix * item.quantity).toFixed(3)} TND</span>
                  </div>
                ))}
                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Remises appliquées:</span>
                    <span>-{(getTotalPrice() * 0.15).toFixed(3)} TND</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total final:</span>
                    <span>{(getTotalPrice() * 0.85).toFixed(3)} TND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-[#805050]">
                  Informations personnelles
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingProfile(true);
                    setEditedUser({ ...user });
                  }}
                  className="border-[#CE8F8A] text-[#805050]"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Prénom</Label>
                      <Input
                        value={editedUser?.prenom || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            prenom: e.target.value,
                          })
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                    <div>
                      <Label>Nom</Label>
                      <Input
                        value={editedUser?.nom || ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, nom: e.target.value })
                        }
                        className="border-[#D4C2A1]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      value={editedUser?.telephone || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          telephone: e.target.value,
                        })
                      }
                      placeholder="+216 12345678"
                      className="border-[#D4C2A1]"
                    />
                  </div>
                  <div>
                    <Label>Adresse *</Label>
                    <Input
                      value={editedUser?.adresse || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          adresse: e.target.value,
                        })
                      }
                      placeholder="Votre adresse complète"
                      className="border-[#D4C2A1]"
                      required
                    />
                  </div>
                  <div>
                    <Label>Code Client (non modifiable)</Label>
                    <Input
                      value={user?.codeClient || ""}
                      disabled
                      className="bg-gray-100 border-[#D4C2A1]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-[#CE8F8A] hover:bg-[#CE8F8A]/90 text-white"
                    >
                      Sauvegarder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditedUser(null);
                      }}
                      className="border-[#CE8F8A] text-[#805050]"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Nom:</strong> {user?.prenom} {user?.nom}
                  </div>
                  <div>
                    <strong>Téléphone:</strong>{" "}
                    {user?.telephone || "Non renseigné"}
                  </div>
                  <div>
                    <strong>Adresse:</strong>{" "}
                    {user?.adresse || "Non renseignée"}
                  </div>
                  <div>
                    <strong>Code Client:</strong> {user?.codeClient}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="flex-1 border-[#CE8F8A] text-[#805050]"
              >
                Retour au panier
              </Button>
              <Button
                onClick={handleFinalizeOrder}
                disabled={!user?.adresse || isSubmitting}
                className="flex-1 bg-[#805050] hover:bg-[#805050]/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Conclure la vente"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDialog;
