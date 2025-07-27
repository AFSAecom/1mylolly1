import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface ReportsProps {
  dateFilter: { start: string; end: string };
  setDateFilter: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
  handleExportExcel: (type: string) => void;
  orders: any[];
  users: any[];
}

const Reports: React.FC<ReportsProps> = ({
  dateFilter,
  setDateFilter,
  handleExportExcel,
  orders,
  users,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-[#805050] font-playfair">Rapports de Ventes</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date de début</Label>
              <Input
                type="date"
                value={dateFilter.start}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, start: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, end: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            onClick={() => handleExportExcel("sales")}
            className="w-full bg-[#805050] hover:bg-[#704040] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter en Excel
          </Button>
        </form>
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Code Client</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Code Article</TableHead>
              <TableHead>Marque Inspirée</TableHead>
              <TableHead>Montant (TND)</TableHead>
              <TableHead>Conseillère</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.client}</TableCell>
                <TableCell>{sale.codeClient}</TableCell>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.codeArticle}</TableCell>
                <TableCell>Yves Saint Laurent</TableCell>
                <TableCell>{sale.amount.toFixed(3)} TND</TableCell>
                <TableCell>{sale.conseillere}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-[#805050] font-playfair">Rapports Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Button
            onClick={() => handleExportExcel("clients")}
            className="w-full bg-[#805050] hover:bg-[#704040] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter Clients
          </Button>
        </form>
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Code Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Articles Achetés</TableHead>
              <TableHead>Parfum Inspiré</TableHead>
              <TableHead>Marque Inspirée</TableHead>
              <TableHead>Prix (TND)</TableHead>
              <TableHead>Date d'Achat</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((user) => user.role === "client")
              .map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    {client.name}
                    {client.isNew && (
                      <Badge variant="secondary" className="ml-2 bg-[#CE8F8A] text-white">
                        Nouveau Client
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{client.codeClient}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>L001-30</TableCell>
                  <TableCell>Black Opium</TableCell>
                  <TableCell>Yves Saint Laurent</TableCell>
                  <TableCell>29.900</TableCell>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>
                    <Badge variant="default">Actif</Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default Reports;
