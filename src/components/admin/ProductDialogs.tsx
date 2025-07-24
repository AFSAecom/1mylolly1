import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductDialogsProps {
  showNewProduct: boolean;
  setShowNewProduct: (v: boolean) => void;
  showProductPreview: boolean;
  setShowProductPreview: (v: boolean) => void;
  showEditProduct: boolean;
  setShowEditProduct: (v: boolean) => void;
  // Additional states omitted for brevity
}

const ProductDialogs: React.FC<ProductDialogsProps> = ({
  showNewProduct,
  setShowNewProduct,
  showProductPreview,
  setShowProductPreview,
  showEditProduct,
  setShowEditProduct,
}) => (
  <>
    <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
      <DialogContent className="sm:max-w-[800px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#805050] font-playfair">Nouveau Produit</DialogTitle>
          <DialogDescription className="text-[#AD9C92]">Ajouter un nouveau produit au catalogue</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Code Article</Label>
              <Input name="codeArticle" placeholder="L001" className="border-[#D4C2A1]" />
            </div>
            <div>
              <Label>Nom Lolly</Label>
              <Input name="nomLolly" placeholder="Élégance Nocturne" className="border-[#D4C2A1]" />
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowNewProduct(false)} className="flex-1">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showProductPreview} onOpenChange={setShowProductPreview}>
      <DialogContent className="sm:max-w-[900px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#805050] font-playfair">Aperçu Complet du Produit</DialogTitle>
        </DialogHeader>
        {/* Content omitted */}
      </DialogContent>
    </Dialog>

    <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
      <DialogContent className="sm:max-w-[900px] bg-[#FBF0E9] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#805050] font-playfair">Modifier le Produit Complet</DialogTitle>
        </DialogHeader>
        {/* Content omitted */}
      </DialogContent>
    </Dialog>
  </>
);

export default ProductDialogs;
