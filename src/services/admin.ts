import { supabase } from '../lib/supabaseClient';

export const fetchUsers = () =>
  supabase.from('users').select('*').order('created_at', { ascending: false });

export const fetchProducts = () =>
  supabase
    .from('products')
    .select(`
      *,
      product_variants(*)
    `);

export const fetchPromotions = () => supabase.from('promotions').select('*');

export const fetchOrders = () =>
  supabase.from('orders').select(`
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
