import { createClient } from '@supabase/supabase-js';

const {
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY
} = process.env;

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    if (!token) {
      res.status(401).json({ error: 'Missing bearer token' });
      return;
    }

    const caller = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const {
      data: { user },
      error: userError
    } = await caller.auth.getUser();
    if (userError || !user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const { data: roleData, error: roleError } = await caller
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (roleError) {
      res.status(500).json({ error: roleError.message });
      return;
    }
    if (!roleData || roleData.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.status(400).json({ error: 'Invalid JSON body' });
        return;
      }
    }
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }

    const {
      email,
      password,
      prenom,
      nom,
      role,
      telephone,
      whatsapp,
      date_naissance
    } = body;

    if (
      [email, password, prenom, nom, role].some((v) => typeof v !== 'string') ||
      (telephone && typeof telephone !== 'string') ||
      (whatsapp && typeof whatsapp !== 'string') ||
      (date_naissance && typeof date_naissance !== 'string')
    ) {
      res.status(400).json({ error: 'Invalid body fields' });
      return;
    }

    const service = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: created, error: createError } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role }
    });
    if (createError || !created?.user) {
      res
        .status(500)
        .json({ error: createError?.message || 'Failed to create user' });
      return;
    }

    const id = created.user.id;

    const { error: updateError } = await service
      .from('users')
      .update({ prenom, nom, role, telephone, whatsapp, date_naissance })
      .eq('id', id);
    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    res.status(200).json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

