export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_variant_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_variant_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_variant_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          code_client: string
          conseillere_id: string | null
          created_at: string | null
          id: string
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          code_client: string
          conseillere_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          code_client?: string
          conseillere_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          actif: boolean | null
          contenance: number
          created_at: string | null
          id: string
          prix: number
          product_id: string | null
          ref_complete: string
          stock_actuel: number | null
          unite: string
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          contenance: number
          created_at?: string | null
          id?: string
          prix: number
          product_id?: string | null
          ref_complete: string
          stock_actuel?: number | null
          unite?: string
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          contenance?: number
          created_at?: string | null
          id?: string
          prix?: number
          product_id?: string | null
          ref_complete?: string
          stock_actuel?: number | null
          unite?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          code_produit: string
          created_at: string | null
          description: string | null
          famille_olfactive: string
          genre: string
          id: string
          image_url: string | null
          marque_inspire: string
          nom_lolly: string
          nom_parfum_inspire: string
          note_coeur: string[] | null
          note_fond: string[] | null
          note_tete: string[] | null
          prix_15ml: number | null
          prix_30ml: number | null
          prix_50ml: number | null
          promo_flag: boolean | null
          saison: string
          stock_15ml: number | null
          stock_30ml: number | null
          stock_50ml: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code_produit: string
          created_at?: string | null
          description?: string | null
          famille_olfactive: string
          genre: string
          id?: string
          image_url?: string | null
          marque_inspire: string
          nom_lolly: string
          nom_parfum_inspire: string
          note_coeur?: string[] | null
          note_fond?: string[] | null
          note_tete?: string[] | null
          prix_15ml?: number | null
          prix_30ml?: number | null
          prix_50ml?: number | null
          promo_flag?: boolean | null
          saison: string
          stock_15ml?: number | null
          stock_30ml?: number | null
          stock_50ml?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code_produit?: string
          created_at?: string | null
          description?: string | null
          famille_olfactive?: string
          genre?: string
          id?: string
          image_url?: string | null
          marque_inspire?: string
          nom_lolly?: string
          nom_parfum_inspire?: string
          note_coeur?: string[] | null
          note_fond?: string[] | null
          note_tete?: string[] | null
          prix_15ml?: number | null
          prix_30ml?: number | null
          prix_50ml?: number | null
          promo_flag?: boolean | null
          saison?: string
          stock_15ml?: number | null
          stock_30ml?: number | null
          stock_50ml?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean | null
          created_at: string | null
          date_debut: string
          date_fin: string
          description: string | null
          id: string
          nom: string
          pourcentage_reduction: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          date_debut: string
          date_fin: string
          description?: string | null
          id?: string
          nom: string
          pourcentage_reduction: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          date_debut?: string
          date_fin?: string
          description?: string | null
          id?: string
          nom?: string
          pourcentage_reduction?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          product_variant_id: string | null
          quantity: number
          reason: string | null
          reference_document: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          product_variant_id?: string | null
          quantity: number
          reason?: string | null
          reference_document?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          product_variant_id?: string | null
          quantity?: number
          reason?: string | null
          reference_document?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          adresse: string | null
          code_client: string | null
          created_at: string | null
          date_naissance: string | null
          email: string
          id: string
          nom: string
          prenom: string
          role: string
          telephone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          adresse?: string | null
          code_client?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email: string
          id?: string
          nom: string
          prenom: string
          role?: string
          telephone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          adresse?: string | null
          code_client?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string
          id?: string
          nom?: string
          prenom?: string
          role?: string
          telephone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
