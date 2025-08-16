import { supabase } from '../lib/supabaseClient';

export const fetchUsers = () =>
  supabase
    .from('users')
    .select(
      'id, prenom, nom, email, role, telephone, whatsapp, date_naissance, adresse, code_client, created_at',
    )
    .order('created_at', { ascending: false })
    .range(0, 99);

export const fetchProducts = () =>
  supabase
    .from('products')
    .select(`
      id,
      code_produit,
      nom_lolly,
      nom_parfum_inspire,
      marque_inspire,
      active,
      image_url,
      genre,
      saison,
      famille_olfactive,
      note_tete,
      note_coeur,
      note_fond,
      description,
      product_variants(
        id,
        contenance,
        unite,
        prix,
        stock_actuel,
        ref_complete,
        actif
      )
    `)
    .range(0, 99);

export const fetchPromotions = () =>
  supabase
    .from('promotions')
    .select('id, nom, pourcentage_reduction, description, date_debut, date_fin, active')
    .order('date_debut', { ascending: false })
    .range(0, 99);

export const fetchOrders = () =>
  supabase
    .from('orders')
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
    .order('created_at', { ascending: false })
    .range(0, 99);
