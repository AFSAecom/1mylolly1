import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { fetchOrders } from "../../services/admin";
import { exportCSV } from "../../utils/exportUtils";

interface Order {
  id: string;
  created_at: string;
  client: { prenom: string; nom: string } | null;
  order_items: { id: string; total_price: number; product_variants: { products: { nom_lolly: string } } }[];
}

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders().then(({ data }) => {
      const formatted = (data || []).flatMap((order: Order) =>
        (order.order_items || []).map((item) => ({
          date: order.created_at.split("T")[0],
          client: order.client ? `${order.client.prenom} ${order.client.nom}` : "",
          product: item.product_variants?.products?.nom_lolly || "",
          amount: item.total_price,
          codeClient: order.code_client,
          codeArticle: item.product_variants?.ref_complete,
          conseillere: order.conseillere?.prenom
            ? `${order.conseillere.prenom} ${order.conseillere.nom}`
            : "",
        }))
      );
      setOrders(formatted);
    });
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Commandes</CardTitle>
        <Button onClick={() => exportCSV("sales", orders, [], {})}>Exporter</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o, idx) => (
              <TableRow key={idx}>
                <TableCell>{o.date}</TableCell>
                <TableCell>{o.client}</TableCell>
                <TableCell>{o.product}</TableCell>
                <TableCell>{o.amount?.toFixed(3)} TND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
