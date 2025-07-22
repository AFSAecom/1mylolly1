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

interface ClientLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (clientData: any) => void;
  title?: string;
  description?: string;
}

const ClientLoginDialog: React.FC<ClientLoginDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  title = "Identification Client",
  description = "Identifiez le client pour associer le panier à son compte",
}) => {
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
      // Mock client login - in real app, this would call an API
      if (loginData.email && loginData.password) {
        const mockClient = {
          id: "C001",
          email: loginData.email,
          nom: "Dupont",
          prenom: "Marie",
          telephone: "+216 12345678",
          whatsapp: "+216 12345678",
          adresse: "123 Rue des Parfums, Tunis",
          codeClient: "C001",
        };
        onSuccess?.(mockClient);
        onOpenChange(false);
      } else {
        setError("Email ou mot de passe incorrect");
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
      // Mock client registration
      const newClient = {
        id: Date.now().toString(),
        email: registerData.email,
        nom: registerData.nom,
        prenom: registerData.prenom,
        telephone: registerData.telephone,
        whatsapp: registerData.whatsapp,
        dateNaissance: registerData.dateNaissance,
        adresse: registerData.adresse,
        codeClient: `C${Date.now().toString().slice(-3)}`,
      };
      onSuccess?.(newClient);
      onOpenChange(false);
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
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#AD9C92]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Client existant</TabsTrigger>
            <TabsTrigger value="register">Nouveau client</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Email du client</Label>
                <Input
                  id="client-email"
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
                <Label htmlFor="client-password">Mot de passe du client</Label>
                <Input
                  id="client-password"
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
                {loading ? "Connexion..." : "Identifier le client"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="client-prenom" className="text-sm">
                    Prénom *
                  </Label>
                  <Input
                    id="client-prenom"
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
                  <Label htmlFor="client-nom" className="text-sm">
                    Nom *
                  </Label>
                  <Input
                    id="client-nom"
                    value={registerData.nom}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, nom: e.target.value })
                    }
                    required
                    className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="client-register-email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="client-register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                  className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="client-telephone" className="text-sm">
                    Téléphone
                  </Label>
                  <Input
                    id="client-telephone"
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
                  <Label htmlFor="client-whatsapp" className="text-sm">
                    WhatsApp *
                  </Label>
                  <Input
                    id="client-whatsapp"
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
                <Label htmlFor="client-dateNaissance" className="text-sm">
                  Date de naissance *
                </Label>
                <Input
                  id="client-dateNaissance"
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
                <Label htmlFor="client-adresse" className="text-sm">
                  Adresse
                </Label>
                <Input
                  id="client-adresse"
                  value={registerData.adresse || ""}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      adresse: e.target.value,
                    })
                  }
                  className="border-[#D4C2A1] focus:border-[#CE8F8A] h-9"
                  placeholder="Adresse complète du client"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="client-register-password" className="text-sm">
                  Mot de passe
                </Label>
                <Input
                  id="client-register-password"
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
                <Label htmlFor="client-confirm-password" className="text-sm">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="client-confirm-password"
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
                {loading ? "Création..." : "Créer le compte client"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientLoginDialog;
