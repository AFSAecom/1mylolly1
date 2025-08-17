import React from "react";

import ProductsTab from "./admin/ProductsTab";
import OrdersTab from "./admin/OrdersTab";
import PromotionsTab from "./admin/PromotionsTab";
import UsersTab from "./admin/UsersTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const AdminSpace = () => {
  return (
    <Tabs defaultValue="products">
      <TabsList>
        <TabsTrigger value="products">Produits</TabsTrigger>
        <TabsTrigger value="orders">Commandes</TabsTrigger>
        <TabsTrigger value="promotions">Promotions</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
      </TabsList>
      <TabsContent value="products">
        <ProductsTab />
      </TabsContent>
      <TabsContent value="orders">
        <OrdersTab />
      </TabsContent>
      <TabsContent value="promotions">
        <PromotionsTab />
      </TabsContent>
      <TabsContent value="users">
        <UsersTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminSpace;
