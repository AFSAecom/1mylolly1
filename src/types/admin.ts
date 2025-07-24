export interface ProductVariant {
  id?: string | number;
  size: string;
  price: number;
  stock: number;
  refComplete?: string;
  actif?: boolean;
}

export interface AdminProduct {
  id: string | number;
  codeArticle: string;
  name: string;
  nomParfumInspire: string;
  marqueInspire: string;
  brand: string;
  price: number;
  stock: number;
  active: boolean;
  imageURL: string;
  genre: "homme" | "femme" | "mixte";
  saison: "été" | "hiver" | "toutes saisons";
  familleOlfactive: string;
  noteTete?: string[];
  noteCoeur?: string[];
  noteFond?: string[];
  description?: string;
  lastModified?: number;
  variants: ProductVariant[];
}

export interface EditFormData {
  imageURL?: string;
  codeArticle?: string;
  name?: string;
  nomParfumInspire?: string;
  marqueInspire?: string;
}

export interface RestockSelection {
  product: AdminProduct;
  variant: ProductVariant;
  variantIndex: number;
}
