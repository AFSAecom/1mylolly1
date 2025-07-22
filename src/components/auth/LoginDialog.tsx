import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  hideRegistration?: boolean;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  hideRegistration = false,
}) => {
  const { login, register } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nom: "",
    prenom: "",
    telephone: "",
    whatsapp: "",
    dateNaissance: "",
    adresse: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        onOpenChange(false);
        onSuccess?.();
      } else {
        setError("Email ou mot de passe incorrect. Vérifiez vos identifiants.");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation des champs obligatoires
    if (
      !registerData.nom ||
      !registerData.prenom ||
      !registerData.whatsapp ||
      !registerData.dateNaissance
    ) {
      setError(
        "Les champs nom, prénom, WhatsApp et date de naissance sont obligatoires.",
      );
      setLoading(false);
      return;
    }

    // Validation du mot de passe
    if (registerData.password !== registerData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    // Validation du format WhatsApp (8 chiffres)
    const whatsappRegex = /^\d{8}$/;
    if (!whatsappRegex.test(registerData.whatsapp.replace("+216", "").trim())) {
      setError("Le numéro WhatsApp doit contenir exactement 8 chiffres.");
      setLoading(false);
      return;
    }

    try {
      const success = await register(registerData);
      if (success) {
        onOpenChange(false);
        onSuccess?.();
      } else {
        setError("Erreur lors de la création du compte");
      }
    } catch (err) {
      setError("Erreur de création de compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[425px] max-h-[85vh] overflow-y-auto bg-[#FBF0E9] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-[#805050] font-playfair">
            Connexion / Inscription
          </DialogTitle>
          <DialogDescription className="text-[#AD9C92]">
            Connectez-vous ou créez un compte pour finaliser votre commande
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          {!hideRegistration && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                  className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="border-[#D4C2A1] focus:border-[#CE8F8A]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#CE8F8A] hover:bg-[#CE8F8A]/90"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          {!hideRegistration && (
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="prenom" className="text-sm">
                      Prénom *
                    </Label>
                    <Input
                      id="prenom"
                      value={registerData.prenom}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          prenom: e.target.value,
                        })
                      }
                      required
                      className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="nom" className="text-sm">
                      Nom *
                    </Label>
                    <Input
                      id="nom"
                      value={registerData.nom}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          nom: e.target.value,
                        })
                      }
                      required
                      className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="telephone" className="text-sm">
                      Téléphone
                    </Label>
                    <Input
                      id="telephone"
                      value={registerData.telephone}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("+216")) {
                          value = "+216" + value.replace("+216", "");
                        }
                        setRegisterData({
                          ...registerData,
                          telephone: value,
                        });
                      }}
                      placeholder="+216 12345678"
                      className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="whatsapp" className="text-sm">
                      WhatsApp *
                    </Label>
                    <Input
                      id="whatsapp"
                      value={registerData.whatsapp}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("+216")) {
                          value = "+216" + value.replace("+216", "");
                        }
                        setRegisterData({
                          ...registerData,
                          whatsapp: value,
                        });
                      }}
                      placeholder="+216 12345678"
                      required
                      className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dateNaissance" className="text-sm">
                    Date de naissance *
                  </Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={registerData.dateNaissance}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        dateNaissance: e.target.value,
                      })
                    }
                    required
                    className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="adresse" className="text-sm">
                    Adresse
                  </Label>
                  <Input
                    id="adresse"
                    value={registerData.adresse || ""}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        adresse: e.target.value,
                      })
                    }
                    className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                    placeholder="Votre adresse complète"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="register-password" className="text-sm">
                    Mot de passe
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password" className="text-sm">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#CE8F8A] hover:bg-[#CE8F8A]/90"
                >
                  {loading ? "Création..." : "Créer un compte"}
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
