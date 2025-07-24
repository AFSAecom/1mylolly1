import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface UserManagementProps {
  users: any[];
  loading: boolean;
  handleRoleChange: (id: string, role: string) => void;
  loadData: () => Promise<void>;
  setShowNewUser: (v: boolean) => void;
  setShowEditUser: (v: boolean) => void;
  setSelectedUser: (u: any) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  loading,
  handleRoleChange,
  loadData,
  setShowNewUser,
  setShowEditUser,
  setSelectedUser,
}) => (
  <Card className="bg-white">
    <CardHeader>
      <CardTitle className="text-[#805050] font-playfair flex items-center justify-between">
        Gestion des Utilisateurs
        <Button className="bg-[#805050] hover:bg-[#704040] text-white" onClick={() => setShowNewUser(true)}>
          Nouvel Utilisateur
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-[#AD9C92]">
          {loading ? "Chargement des données depuis Supabase..." : `${users.length} utilisateur(s) trouvé(s) dans Supabase`}
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="border-[#805050] text-[#805050]">
          Actualiser
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8 bg-white rounded border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#805050] mx-auto mb-4"></div>
          <p className="text-[#AD9C92] font-medium">Chargement des utilisateurs depuis Supabase...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 bg-white rounded border">
          <Users className="w-12 h-12 text-[#AD9C92] mx-auto mb-4" />
          <p className="text-[#AD9C92] font-medium mb-2">Aucun utilisateur trouvé dans Supabase</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Code Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière Commande</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                  {user.isNew && (
                    <Badge variant="secondary" className="ml-2 bg-[#CE8F8A] text-white">
                      Nouveau
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-[#AD9C92]">{user.codeClient || "N/A"}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default">Actif</Badge>
                </TableCell>
                <TableCell>{user.lastOrder}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setShowEditUser(true); }}>
                      Modifier
                    </Button>
                    <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="conseillere">Conseillère</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
);

export default UserManagement;
