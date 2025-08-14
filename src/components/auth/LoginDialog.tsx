import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { handleSignIn } from "@/features/auth/signIn";
import { handleSignUp } from "@/features/auth/signUp";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  hideRegistration?: boolean;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  open, onOpenChange, onSuccess, hideRegistration = false,
}) => {
  // ---- Connexion ----
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);

  async function onSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginMsg(null);
    setLoginBusy(true);
    const res = await handleSignIn(loginEmail.trim(), loginPassword);
    setLoginBusy(false);
    if (!res.ok) {
      setLoginMsg(`Connexion refusée (${res.step}) : ${res.error}`);
      return;
    }
    setLoginMsg("Connecté ✅");
    onSuccess?.();
    onOpenChange(false);
  }

  // ---- Inscription ----
  const [reg, setReg] = useState({
    email: "", password: "", confirm: "",
    prenom: "", nom: "", telephone: "", whatsapp: "",
    dateNaissance: "", adresse: "",
  });
  const [regMsg, setRegMsg] = useState<string | null>(null);
  const [regBusy, setRegBusy] = useState(false);

  async function onSubmitRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegMsg(null);
    if (reg.password !== reg.confirm) {
      setRegMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    setRegBusy(true);
    const res = await handleSignUp({
      email: reg.email.trim(),
      password: reg.password,
      prenom: reg.prenom,
      nom: reg.nom,
      telephone: reg.telephone,
      whatsapp: reg.whatsapp,
      dateNaissance: reg.dateNaissance || undefined,
      adresse: reg.adresse,
    });
    setRegBusy(false);
    if (!res.ok) {
      setRegMsg(`Inscription refusée (${res.step}) : ${res.error}`);
      return;
    }
    if ((res as any).needEmailConfirmation) {
      setRegMsg("Inscription créée. Vérifie ta boîte mail pour confirmer l'adresse.");
      return;
    }
    setRegMsg("Compte créé ✅ — vous pouvez vous connecter.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Connexion / Inscription</DialogTitle>
          <DialogDescription>
            Connectez-vous ou créez un compte pour finaliser votre commande
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            {!hideRegistration && <TabsTrigger value="register">Inscription</TabsTrigger>}
          </TabsList>

          {/* —— Connexion —— */}
          <TabsContent value="login" className="mt-4">
            <form onSubmit={onSubmitLogin} className="space-y-3">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginMsg && <p className="text-sm text-red-600">{loginMsg}</p>}
              <Button type="submit" disabled={loginBusy} className="w-full">
                {loginBusy ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          {/* —— Inscription —— */}
          {!hideRegistration && (
            <TabsContent value="register" className="mt-4">
              <form onSubmit={onSubmitRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Prénom</Label>
                    <Input value={reg.prenom} onChange={(e) => setReg({ ...reg, prenom: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Nom</Label>
                    <Input value={reg.nom} onChange={(e) => setReg({ ...reg, nom: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Mot de passe</Label>
                    <Input type="password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Confirmer</Label>
                    <Input type="password" value={reg.confirm} onChange={(e) => setReg({ ...reg, confirm: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Téléphone</Label>
                    <Input value={reg.telephone} onChange={(e) => setReg({ ...reg, telephone: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>WhatsApp</Label>
                    <Input value={reg.whatsapp} onChange={(e) => setReg({ ...reg, whatsapp: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Date de naissance</Label>
                  <Input type="date" value={reg.dateNaissance} onChange={(e) => setReg({ ...reg, dateNaissance: e.target.value })} />
                </div>

                <div className="space-y-1">
                  <Label>Adresse</Label>
                  <Input value={reg.adresse} onChange={(e) => setReg({ ...reg, adresse: e.target.value })} />
                </div>

                {regMsg && <p className="text-sm">{regMsg}</p>}
                <Button type="submit" disabled={regBusy} className="w-full">
                  {regBusy ? "Création..." : "Créer un compte"}
                </Button>
              </form>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
