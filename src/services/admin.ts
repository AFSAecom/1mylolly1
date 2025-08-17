import { supabase } from "../lib/supabaseClient";

const PAGE_SIZE = 50;

export const fetchUsers = (from = 0, to = from + PAGE_SIZE - 1) =>
  supabase
    .from("users")
    .select("id, prenom, nom, email")
    .order("created_at", { ascending: false })
    .range(from, to);

export const fetchProducts = (from = 0, to = from + PAGE_SIZE - 1) =>
  supabase
    .from("products")
    .select("id, code_produit, nom_lolly")
    .range(from, to);

export const fetchPromotions = (from = 0, to = from + PAGE_SIZE - 1) =>
  supabase
    .from("promotions")
    .select("id, nom, pourcentage_reduction")
    .order("date_debut", { ascending: false })
    .range(from, to);

export const fetchOrders = (from = 0, to = from + PAGE_SIZE - 1) =>
  supabase
    .from("orders")
    .select(`
      id,
      created_at,
      code_client,
      user_id,
      conseillere_id,
      client:users!orders_user_id_fkey(prenom, nom),
      conseillere:users!orders_conseillere_id_fkey(prenom, nom),
      order_items(
        id,
        total_price,
        product_variant_id,
        product_variants(
          ref_complete,
          products(nom_lolly)
        )
      )
    `)
    .order("created_at", { ascending: false })
    .range(from, to);
