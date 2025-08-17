import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  fetchProducts,
  fetchUsers,
  fetchPromotions,
  fetchOrders,
} from "../../services/admin";

const DashboardTab: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    promotions: 0,
    orders: 0,
  });

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchUsers(),
      fetchPromotions(),
      fetchOrders(),
    ]).then(([p, u, promo, o]) => {
      setStats({
        products: (p.data || []).length,
        users: (u.data || []).length,
        promotions: (promo.data || []).length,
        orders: (o.data || []).length,
      });
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 gap-4">
          <li>Produits: {stats.products}</li>
          <li>Utilisateurs: {stats.users}</li>
          <li>Promotions: {stats.promotions}</li>
          <li>Commandes: {stats.orders}</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default DashboardTab;

