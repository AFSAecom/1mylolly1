import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const DashboardTab = React.lazy(() => import("./admin/DashboardTab"));
const ProductsTab = React.lazy(() => import("./admin/ProductsTab"));
const UsersTab = React.lazy(() => import("./admin/UsersTab"));
const PromotionsTab = React.lazy(() => import("./admin/PromotionsTab"));
const OrdersTab = React.lazy(() => import("./admin/OrdersTab"));

const AdminSpace = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
        <TabsTrigger value="products">Produits</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="promotions">Promotions</TabsTrigger>
        <TabsTrigger value="orders">Commandes</TabsTrigger>
      </TabsList>
      <Suspense fallback={<div>Chargement...</div>}>
        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="promotions">
          <PromotionsTab />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Suspense>
    </Tabs>
  );
};

export default AdminSpace;
