import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  whatsapp?: string;
  dateNaissance?: string;
  adresse?: string;
  role: "client" | "conseillere" | "admin";
  codeClient?: string;
}

async function ensureAdminUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: crypto.randomUUID(),
        email: "admin@lecompasolfactif.com",
        nom: "Admin",
        prenom: "Système",
        role: "admin",
        code_client: "ADM001",
      })
      .select()
      .single();

    if (error || !data) {
      logger.error("Failed to create admin user", error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone || undefined,
      whatsapp: data.whatsapp || undefined,
      dateNaissance: data.date_naissance || undefined,
      adresse: data.adresse || undefined,
      role: "admin",
      codeClient: data.code_client || "ADM001",
    };
  } catch (err) {
    logger.error("Unexpected admin creation error", err);
    return null;
  }
}

export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (findError && findError.code !== "PGRST116") {
      logger.error("Error checking user existence", findError);
      return null;
    }

    let userRecord = existingUser;

    if (!userRecord && email === "admin@lecompasolfactif.com" && password === "admin123") {
      userRecord = await ensureAdminUser();
      if (!userRecord) return null;
    }

    if (!userRecord) {
      logger.error("User not found", email);
      return null;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      logger.error("Auth error", authError);
      return null;
    }

    if (userRecord.id !== authData.user.id) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ id: authData.user.id })
        .eq("email", email)
        .select()
        .single();
      if (!updateError && updatedUser) {
        userRecord = updatedUser;
      } else if (updateError) {
        logger.error("Failed to update user id", updateError);
      }
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      nom: userRecord.nom,
      prenom: userRecord.prenom,
      telephone: userRecord.telephone || undefined,
      whatsapp: userRecord.whatsapp || undefined,
      dateNaissance: userRecord.date_naissance || undefined,
      adresse: userRecord.adresse || undefined,
      role: userRecord.role as "client" | "conseillere" | "admin",
      codeClient: userRecord.code_client || undefined,
    };
  } catch (err) {
    logger.error("Unexpected login error", err);
    return null;
  }
}

export async function register(
  userData: Omit<User, "id" | "role"> & {
    password: string;
    confirmPassword?: string;
    role?: "client" | "conseillere" | "admin";
  },
): Promise<User | null> {
  try {
    const {
      password,
      role = "client",
      codeClient: providedCodeClient,
    } = userData;
    const rolePrefix =
      role === "conseillere" ? "CNS" : role === "admin" ? "ADM" : "C";
    const codeClient =
      providedCodeClient || `${rolePrefix}${Date.now().toString().slice(-3)}`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password,
      options: { emailRedirectTo: undefined },
    });

    if (authError || !authData.user) {
      logger.error("Auth registration error", authError);
      return null;
    }

    const { data: insertedUser, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: userData.email,
        nom: userData.nom,
        prenom: userData.prenom,
        telephone: userData.telephone || null,
        whatsapp: userData.whatsapp || null,
        date_naissance: userData.dateNaissance || null,
        adresse: userData.adresse || null,
        role,
        code_client: codeClient,
      })
      .select()
      .single();

    if (profileError || !insertedUser) {
      logger.error("Profile creation error", profileError);
      await supabase.auth.signOut();
      return null;
    }

    return {
      id: authData.user.id,
      email: userData.email,
      nom: userData.nom,
      prenom: userData.prenom,
      telephone: userData.telephone,
      whatsapp: userData.whatsapp,
      dateNaissance: userData.dateNaissance,
      adresse: userData.adresse,
      role,
      codeClient: insertedUser.code_client || codeClient,
    };
  } catch (err) {
    logger.error("Unexpected registration error", err);
    return null;
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
